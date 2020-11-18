const {
  createGame,
  sendGameEvent,
  joinToCreateGame,
  getPlayersInGame,
} = require("./connections");

const gameMessage = {
  createGame: (data, con) => {
    const gameId = createGame(con);
    con.send({
      message: "gameCreated",
      gameId,
    });

    let counter = 61;
    const interval = setInterval(() => {
      counter -= 1;
      sendGameEvent(gameId, {
        message: "countdown",
        counter,
      });

      if (counter === 0) {
        clearInterval(interval);
        sendGameEvent(gameId, {
          message: "finishedCountdown",
        });
      }
    }, 1000);
  },
  joinCreateGame: ({ gameId }, con) => {
    const players = getPlayersInGame(gameId);
    con.send({
      message: "players",
      players,
    });
    joinToCreateGame(gameId, con);
  },
};

module.exports = gameMessage;
