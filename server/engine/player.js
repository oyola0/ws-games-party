const {
  sendGameEvent,
  createPlayer,
  rejoinPlayer,
  getPlayerModel,
} = require("./connections");

const gameMessage = {
  playerIdReady: (data, { gameId, playerId }) => {
    const player = getPlayerModel(gameId, playerId);
    player.isReady = true;
    sendGameEvent(gameId, {
      message: "playerIsReady",
      playerId,
    });
  },
  playerReadyPercentage: ({ percentage }, { gameId, playerId }) => {
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
    const msg = {
      message: "playerJoined",
      isReady,
      gameId,
      username,
      playerId,
    };
    sendGameEvent(gameId, msg);
    con.send(msg);
  },
  disconnected: (con) => {
    const { gameId, playerId } = con;
    if (gameId && playerId) {
      sendGameEvent(gameId, {
        message: "playerDisconnected",
        playerId,
      });
    }
  },
};

module.exports = gameMessage;
