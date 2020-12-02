const matchNames = ['math'];

const games = matchNames.map((name) => {
    // eslint-disable-next-line global-require,import/no-dynamic-require
    const value = require(`./${name}`);

    if(typeof value.start !== 'function') {
        throw new Error("start method doesn't exists");
    }

    return {        
        value,
        name,
    }
});

const startRandomGame = (gameId) => {   
    const random = Math.floor(Math.random() * games.length);
    const game = games[random];
    return game.name;
};

module.exports = {
    startRandomGame,
};
  