import Connection from "../../libs/connection.js";

const con = new Connection();

const selEl = (id) => {
  return document.querySelector(`#${id}`);
};

const locationHref = (url) => {
  window.location.href = `${window.location.origin}/${url}`;
};

con.listen("error", () => {
  alert("El ID de partida o el ID del usuario no existe");
});

con.listen("gameCreated", ({ gameId }) => {
  locationHref(`game/lobby/index.html?game-id=${gameId}`);
});
const createNewGameEl = selEl("create-btn");
const createGameCb = () => {
  createNewGameEl.removeEventListener("click", createGameCb);
  con.send("createGame");
};
createNewGameEl.addEventListener("click", createGameCb);

const joinPlayerCb = () => {
  con.send("createPlayerToNewGame", {
    gameId: selEl("join-game-id").value,
    username: selEl("join-username").value,
  });
};
con.listen("playerJoined", ({ gameId, playerId }) => {
  locationHref(`game/join/index.html?game-id=${gameId}&player-id=${playerId}`);
});
const joinPlayerEl = selEl("join-btn");
joinPlayerEl.addEventListener("click", joinPlayerCb);
