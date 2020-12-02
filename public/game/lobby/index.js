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

con.listen("replaceTo", ( { type }) => {
  //window.location.replace(`${window.location.origin}/${type}/viewer.html`);
  import(`${window.location.origin}/games/${type}/viewer.js`).then((module) => {
    const tag = module.default;
    document.body.innerHTML = `<${tag}></${tag}>`;
  });
});

con.listen("playerIsReady", ({ playerId }) => {
  getEl(`${playerId}_detail`).innerHTML = "Ready!";
});

con.listen("playerReadyPercentage", ({ playerId, percentage }) => {
  if (getEl(`${playerId}`)) {
    getEl(`${playerId}_detail`).innerHTML =
      percentage > 0 ? `${percentage} %` : "";
  }
});

con.listen("playersInLobby", ({ players }) => {
  let content = "";
  players.forEach(({ playerId, username, isReady }) => {
    content = `${content}
      <li id="${playerId}">
          ${username} 
          <span id="${playerId}_detail">${isReady ? "Ready!" : ""}</span>
      </li>`;
  });

  getEl("players").innerHTML = content;
});

con.listen("errorRequiredMoreUsers", () => {
  alert("Numero de usuarios insuficientes. Minimo 2");
  window.location.replace(window.location.origin);
});

con.listen("error", () => {
  alert("El ID de partida no existe");
});

con.send("joinCreateGame", {
  gameId: paramGameId,
});
