const ids = {};

const getId = (key) => {
  ids[key] = 0;

  return () => {
    ids[key] += 1;
    return ids[key].toString();
  };
};

const getByKey = (key) => {
  ids[key] = 0;

  return () => {
    ids[key] += 1;
    return `${key}_${ids[key]}`;
  };
};

module.exports = {
  newPlayer: getByKey("player"),
  newGame: getId("game"),
};
