const mongoose = require('mongoose');
const Schema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: true,
    },
    description: {
        type: String,
        trim: true,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        trim: true,
        required: true,
    },
    imgUrl: {
        type: String,
        trim: true,
    },
    price: {
        type: Number,
        required: true,
    },
    end_time: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    created_by: {
        _id: String,
        name: String,
        email: String
    },
    modified_at: {
        type: Date,
        default: Date.now
    },
    modified_by: {
        _id: String,
        name: String,
        email: String
    },
    bids:[{
        bid_amount: Number,
        status: String,
        created_at: {
            type: Date,
            default: Date.now
        },
        created_by: {
            _id: String,
            name: String,
            email: String
        },
        modified_at: {
            type: Date,
            default: Date.now
        },
        modified_by: {
            _id: String,
            name: String,
            email: String
        }
    }]

});
module.exports = mongoose.model('Auction', Schema);