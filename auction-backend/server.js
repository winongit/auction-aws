const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Graceful = require("@ladjs/graceful");
const Cabin = require("cabin");
const Bree = require("bree");

const { checkToken } = require("./middlewares/checkToken");
const { verifyCognitoToken, setup } = require("./middlewares/AuthMiddleware");
const { ApplicationCostProfiler } = require("aws-sdk");
setup();

const app = express();
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

require("dotenv").config();
// mongodb connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
  })
  .then(() => console.log("Connected Successfully"))
  .catch((err) => console.log(err));

// middlewares
app.use("/pictures", express.static(__dirname + "/assets/pics"));

// user
app.use("/users", require("./routers/UserRouter"));

// auction
// app.use("/auctions", checkToken, require("./routers/AuctionRouter"));
app.use("/auctions", verifyCognitoToken, require("./routers/AuctionRouter"));

// bidding
// app.use("/bid", checkToken, require("./routers/BidRouter"));
app.use("/bid", verifyCognitoToken, require("./routers/BidRouter"));

// Url not match
app.use((req, res) => {
  res.status(404).send({ url: req.originalUrl + " not found" });
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).json({ error: err });
});

const bree = new Bree({
  logger: new Cabin(),
  jobs: [
    {
      name: "AuctionEngine",
      interval: "1m",
    },
  ],
});

const graceful = new Graceful({ brees: [bree] });

(async () => {
  await bree.start();
})();
app.listen(3000, () => console.log("Listening on port 3000"));

graceful.listen();
