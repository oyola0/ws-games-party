const {
  createGame,
  sendGameEvent,
  sendGameAndPlayerEvent,
  joinToCreateGame,
  getPlayersInGame,
  destroyGame,
} = require("./connections");

const { startRandomGame } = require('./games/index');

const gameMessage = {
  createGame: (data, con) => {
    const gameId = createGame(con);
    con.send({
      message: "gameCreated",
      gameId,
    });

    let counter = 31;
    const interval = setInterval(() => {
      counter -= 1;
      sendGameEvent(gameId, {
        message: "countdown",
        counter,
      });

      if (counter === 0) {
        clearInterval(interval);
        const players = getPlayersInGame(gameId);
        const activeUsers = players.reduce(
          (sum, { isReady }) => (isReady ? sum + 1 : sum),
          0
        );
        if (activeUsers >= 2) {
          sendGameAndPlayerEvent(gameId, {
            message: "replaceTo",
            type: startRandomGame(gameId)
          });
        } else {
          sendGameAndPlayerEvent(gameId, {
            message: "errorRequiredMoreUsers",
          });
          destroyGame(gameId);
        }
      }
    }, 1000);
  },
  joinCreateGame: ({ gameId }, con) => {
    const players = getPlayersInGame(gameId);
    con.send({
      message: "playersInLobby",
      players,
    });
    joinToCreateGame(gameId, con);
  },
};

module.exports = gameMessage;
