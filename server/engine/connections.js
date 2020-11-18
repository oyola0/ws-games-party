const session = require("./session");

const games = new Map();
const players = new Map();

const createGame = (con) => {
  const connection = con;
  const gameId = session.newGame();
  connection.gameId = gameId;
  games.set(gameId, {
    connections: [connection],
  });
  players.set(gameId, new Map());
  return gameId;
};

const joinToCreateGame = (gameId, con) => {
  const connection = con;
  games.get(gameId).connections.push(connection);
  connection.gameId = gameId;
};

const sendGameEvent = (gameId, dataEvent) => {
  games.get(gameId).connections.forEach((con) => {
    if (con.connected) {
      con.send(dataEvent);
    }
  });
};

const getPlayersInGame = (gameId) => {
  const result = [];
  players.get(gameId).forEach(({ playerId, username, isReady }) => {
    result.push({
      playerId,
      username,
      isReady,
    });
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
    username,
    playerId,
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
  return player;
};

const getPlayer = (gameId, playerId) => {
  return players.get(gameId).get(playerId);
};

module.exports = {
  createGame,
  joinToCreateGame,
  sendGameEvent,
  getPlayersInGame,
  createPlayer,
  rejoinPlayer,
  getPlayer,
};
