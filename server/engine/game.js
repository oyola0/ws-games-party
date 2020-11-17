const { createGame, createPlayer, getGame } = require("./connections");

const gameMessage = {
    createGame: (data, con) => {
        const countdown = 60;       
        con.send({
            message: 'startCountdown',
            counter: countdown
        });

        setTimeout(() => {
            con.send({
                message: 'finishedCountdown',
            });
        }, countdown * 1000);

        const gameId = createGame(con);        
        con.send({
            message: 'startingGame',
            gameId,
        });
    },
    joinGame: ({ gameId, username }, con) => {
        try {
            const playerId = createPlayer(gameId, username, con);
            const { connection } = getGame(gameId);
            connection.send({
                message: 'joinedPlayer',
                username: username,
            });
            con.send({
                message: 'joinedGame',
                gameId,
                playerId,
            });
        } catch (error) {
            console.log('ERROR:', error)
            con.send({
                message: 'error',
            });
        }        
    }
}

module.exports = gameMessage;