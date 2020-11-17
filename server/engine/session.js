const ids = {};

const _getId = (key) => {
    ids[key] = 0;

    return () => {
        ids[key] ++;
        return ids[key].toString();
    }
};

const _getByKey = (key) => {
    ids[key] = 0;

    return () => {
        ids[key] ++;
        return `${key}_${ids[key]}`;
    }
};

module.exports = {
    newPlayer: _getByKey('player'),
    newGame: _getId('game')
};
