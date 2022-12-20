const { parentPort } = require("worker_threads");
const Cabin = require("cabin");
const { Signale } = require("signale");
const mongoose = require("mongoose");
require("dotenv").config();
// mongodb connection

const Auction = require("../models/Auction");
const {
  getAuctionFor,
  updateWinningBid,
  updateAuctionStatus,
} = require("../services/AuctionService");

const cabin = new Cabin({
  axe: {
    logger: new Signale(),
  },
});

let isCancelled = false;

const param = {
  end_time: { $lte: Date.now() },
  status: "A",
};

if (parentPort) {
  parentPort.once("message", (message) => {
    if (message === "cancel") isCancelled = true;
  });
}

// Reference Implementation of bree JS
//https://blog.logrocket.com/getting-started-with-bree-js/

(async () => {
  await mongoose
    .connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
    })
    .then(() => cabin.log("Connected Successfully"))
    .catch((err) => cabin.log(err));

  const auctions = await getAuctionFor(param);

  await Promise.all(  
    auctions.map(async (auction) => {
      return new Promise(async (resolve, reject) => {
        try {
          if (isCancelled) return;

          if (auction.bids.length > 0) {
            auction.bids.sort((a, b) => {
              if (a.bid_amount > b.bid_amount) return -1;
              if (a.bid_amount < b.bid_amount) return 1;
              return 0;
            });

            let winningBid = auction.bids[0];

            let param = {
              _id: auction._id,
              "bids._id": winningBid._id,
            };

            let bidUpdate = await updateWinningBid(param, winningBid);

            // resolve();
          } else {
            let param = {
              _id: auction._id,
            };
            let bidUpdate = await updateAuctionStatus(param, 'E');
          }
          resolve();
        } catch (error) {
          cabin.error(error);
          reject(error);
        }
      });
    })
  );

  if (parentPort) parentPort.postMessage("done");
  else process.exit(0);
})();
