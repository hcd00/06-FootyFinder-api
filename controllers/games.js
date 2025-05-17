const Game = require('../models/Game');
const {StatusCodes} = require('http-status-codes')
const { NotFoundError, BadRequestError} = require('../errors')
const getAllGames = async (req, res) => {
    res.send('Here are all games available in your area.');
}

const getGame = async (req, res) => {
    res.send('Here is a game.');
}

const createGame = async (req, res) => {
    req.body.createdBy = req.user.userId;
    const game = await Game.create(req.body);
    res.status(StatusCodes.CREATED).json({game})
}

const updateGame = async (req, res) => {
    res.send('Updated game !');
}

const deleteGame = async (req, res) => {
    res.send('Game terminated.')
}

module.exports = {
    getAllGames,
    getGame,
    createGame,
    updateGame,
    deleteGame
}