const {
  sendGameEvent,
  createPlayer,
  rejoinPlayer,
  getPlayerModel,
  getPlayersInGame,
} = require("./connections");

const playerMessage = {
  playerIdReady: (data, con) => {
    const { gameId, playerId } = con;
    const player = getPlayerModel(gameId, playerId);
    player.isReady = true;
    sendGameEvent(gameId, {
      message: "playerIsReady",
      playerId,
    });
  },
  playerReadyPercentage: ({ percentage }, con) => {
    const { gameId, playerId } = con;
    sendGameEvent(gameId, {
      message: "playerReadyPercentage",
      playerId,
      percentage,
    });
  },
  createPlayerToNewGame: ({ gameId, username }, con) => {
    const playerId = createPlayer(gameId, username, con);
    con.send({
      message: "playerJoined",
      gameId,
      username,
      playerId,
    });
  },
  joinPlayerToNewGame: ({ gameId, playerId }, con) => {
    const { username, isReady } = rejoinPlayer(gameId, playerId, con);

    const players = getPlayersInGame(gameId);
    sendGameEvent(gameId, {
      message: "playersInLobby",
      players,
    });

    con.send({
      message: "playerJoined",
      isReady,
      gameId,
      username,
    });
  },
  disconnected: (con) => {
    const { gameId, playerId } = con;
    if (gameId && playerId) {
      const players = getPlayersInGame(gameId);
      sendGameEvent(gameId, {
        message: "playersInLobby",
        players,
      });
    }
  },
};

module.exports = playerMessage;
