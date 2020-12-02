const session = require("./session");

const games = new Map();
const players = new Map();

const createGame = (con) => {
  const connection = con;
  const gameId = session.newGame();
  connection.gameId = gameId;
  games.set(gameId, [connection]);
  players.set(gameId, new Map());
  return gameId;
};

const joinToCreateGame = (gameId, con) => {
  const connection = con;
  games.get(gameId).push(connection);
  connection.gameId = gameId;
};

const sendGameEvent = (gameId, dataEvent) => {
  games.get(gameId).forEach((con) => {
    if (con.connected) {
      con.send(dataEvent);
    }
  });
};

const getPlayersInGame = (gameId) => {
  const result = [];
  players.get(gameId).forEach(({ model, connection }) => {
    if (connection.connected) {
      const { playerId, username, isReady } = model;
      result.push({
        playerId,
        username,
        isReady,
      });
    }
  });
  return result;
};

const createPlayer = (gameId, username, con) => {
  const connection = con;
  const playerId = session.newPlayer();
  connection.playerId = playerId;
  connection.gameId = gameId;
  players.get(gameId).set(playerId, {
    connection,
    model: {
      username,
      playerId,
      isReady: false,
    },
  });
  return playerId;
};

const rejoinPlayer = (gameId, playerId, con) => {
  const connection = con;
  const player = players.get(gameId).get(playerId);
  if (player.connection.connected) {
    throw new Error("player connected yet");
  } else {
    player.connection = connection;
    connection.playerId = playerId;
    connection.gameId = gameId;
  }
  return player.model;
};

const getPlayerModel = (gameId, playerId) => {
  return players.get(gameId).get(playerId).model;
};

const sendGameAndPlayerEvent = (gameId, dataEvent) => {
  games.get(gameId).forEach((con) => {
    if (con.connected) {
      con.send(dataEvent);
    }
  });
  players.get(gameId).forEach(({ connection }) => {
    if (connection.connected) {
      connection.send(dataEvent);
    }
  });
};

const destroyGame = (gameId) => {
  setTimeout(() => {
    games.delete(gameId);
    players.delete(gameId);
  }, 5000);
};

module.exports = {
  createGame,
  joinToCreateGame,
  sendGameEvent,
  sendGameAndPlayerEvent,
  getPlayersInGame,
  createPlayer,
  rejoinPlayer,
  getPlayerModel,
  destroyGame,
};
