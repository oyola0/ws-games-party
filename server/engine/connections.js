const session = require("./session");

const games = new Map();
const players = new Map();

const createGame = (connection) => {
    const gameId = session.newGame();
    connection.gameId = gameId;
    games.set(gameId, {
        connection,
    });
    players.set(gameId, new Map());
    return gameId;
};

const getGame = (gameId) => {    
    return games.get(gameId);  
};

const createPlayer = (gameId, username, connection) => {
    const playerId = session.newPlayer();
    connection.playerId = playerId;
    connection.gameId = gameId;
    players.get(gameId).set(playerId, {
        connection,
        username,
    });
    return playerId;
};

const getPlayer = (gameId, playerId) => {    
    return players.get(gameId).get(playerId);
};


module.exports = {
    createGame,
    getGame,
    createPlayer,
    getPlayer
};
