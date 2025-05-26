const { required } = require('joi');
const mongoose = require('mongoose');

const GameSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Name for your game is required."],
        maxlength: 50
    },
    location: {
        type: String,
        required: [true, "Location of your game is required."],
        maxlength: 100
    },
    status: {
        type: String,
        enum: ['Waiting for players', 'Game is about to begin',
            'Game started', "Game is about to end", "Game has finished."],
        default: 'Waiting for players'
    },
    isFull: {
        type: Boolean,
        default: false
    },
    maxAmountPlayers: {
        type: Number,
        default: 20
    },
    playerList: {
        type: [mongoose.Types.ObjectId],
        ref: "User",
        default: [],
    },
    waitList: {
        type: [mongoose.Types.ObjectId],
        ref: "User",
        default: [],
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, "User is required to create game."]
    }

}, { timestamps: true })


module.exports = mongoose.model('Game', GameSchema);