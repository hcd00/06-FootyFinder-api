const Game = require('../models/Game');
const { StatusCodes } = require('http-status-codes')
const { NotFoundError, BadRequestError } = require('../errors')

const getAllGames = async (req, res) => {

    const games = await Game.find({ createdBy: req.user.userId }).sort('createdAt')
    res.status(StatusCodes.OK).json({ games, count: games.length })
}

const getGame = async (req, res) => {
    const { user: { userId }, params: { id: gameId } } = req;
    const game = await Game.findOne({
        _id: gameId,
        createdBy: userId
    })
    if (!game) {
        throw new NotFoundError(`No game with id ${gameId}`);
    }
    res.status(StatusCodes.OK).json({ game })
}

const createGame = async (req, res) => {
    req.body.createdBy = req.user.userId;
    const game = await Game.create(req.body);
    res.status(StatusCodes.CREATED).json({ game })
}

const updateGame = async (req, res) => {
    //destructure
    const {
        user: { userId },
        params: { id: gameId }
    } = req;
    //Check for atleast 1 field present.
    if (!req.body || Object.keys(req.body).length === 0) {
        throw new BadRequestError("Atleast one field must be entered to update.")
    }
    const game = await Game.findByIdAndUpdate({ _id: gameId, createdBy: userId }, req.body, { new: true, runValidators: true })
    if (!game) {
        throw new NotFoundError(`No game with id ${gameId}`);
    }
    res.status(StatusCodes.OK).json({ game })

}


const deleteGame = async (req, res) => {
    const {
        user: { userId },
        params: { id: gameId }
    } = req;

    const game = await Game.findByIdAndRemove({
        _id: gameId,
        createdBy: userId
    })
    if (!game) {
        throw new NotFoundError(`No game with id ${gameId}`);
    }
    res.status(StatusCodes.OK).send();
}

module.exports = {
    getAllGames,
    getGame,
    createGame,
    updateGame,
    deleteGame
}