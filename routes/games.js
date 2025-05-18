const express = require('express');
const router = express.Router();

const { getAllGames, getGame, createGame, updateGame, deleteGame } = require('../controllers/games');

router.route('/').post(createGame).get(getAllGames);
router.route('/:id').get(getGame).patch(updateGame).delete(deleteGame);

module.exports = router