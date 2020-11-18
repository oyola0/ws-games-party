import Connection from "../../libs/connection.js";

const con = new Connection();

const getEl = (id) => document.querySelector(`#${id}`);

const params = new URLSearchParams(window.location.search);
const paramGameId = params.get("game-id");

getEl("game-id").innerHTML = paramGameId;

const timerEl = getEl("timer");
con.listen("countdown", ({ counter }) => {
  timerEl.innerHTML = counter;
});

con.listen("finishedCountdown", () => {
  timerEl.innerHTML = "finished";
});

con.listen("playerIsReady", ({ playerId }) => {
  getEl(`${playerId}_detail`).innerHTML = "Ready!";
});

con.listen("playerDisconnected", ({ playerId }) => {
  const el = getEl(`${playerId}`);
  if (el) {
    el.className = `to-delete ${el.className}`;
    getEl(`${playerId}_detail`).innerHTML = "Desconectado";
    setTimeout(() => {
      const itemEl = getEl(`${playerId}`);
      if (itemEl && itemEl.className.includes("to-delete")) {
        itemEl.remove();
      }
    }, 1000);
  }
});

con.listen("playerReadyPercentage", ({ playerId, percentage }) => {
  if (getEl(`${playerId}`)) {
    getEl(`${playerId}_detail`).innerHTML = `${percentage} %`;
  }
});

const playersEl = getEl("players");
con.listen("playerJoined", ({ username, playerId }) => {
  const el = getEl(`${playerId}`);
  if (el) {
    el.className = el.className.replace(/to-delete /g, "");
    getEl(`${playerId}_detail`).innerHTML = "";
  } else {
    playersEl.innerHTML = `
    ${playersEl.innerHTML}
    <li id="${playerId}">
        ${username} <span id="${playerId}_detail"></span>
    </li>`;
  }
});

con.listen("players", ({ players }) => {
  players.forEach(({ playerId, username, isReady }) => {
    const playerEl = getEl(`${playerId}`);
    if (!playerEl) {
      playersEl.innerHTML = `
        ${playersEl.innerHTML}
        <li id="${playerId}">
            ${username} <span id="${playerId}_detail">${
        isReady ? "Ready!" : ""
      }</span>
        </li>`;
    }
  });
});

con.listen("error", () => {
  alert("El ID de partida no existe");
});

con.send("joinCreateGame", {
  gameId: paramGameId,
});
