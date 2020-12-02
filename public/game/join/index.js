import Connection from "../../libs/connection.js";

const con = new Connection();
const params = new URLSearchParams(window.location.search);
const gameId = params.get("game-id");
const playerId = params.get("player-id");

const statusEl = document.querySelector("#status");
const updatePercentage = (percentage) => {
  statusEl.innerHTML = `${percentage} %`;
  if (percentage === 0) {
    statusEl.innerHTML = "";
  }
  con.send("playerReadyPercentage", {
    percentage,
  });
};

const listenButton = () => {
  const buttonEl = document.querySelector("#start-btn");
  buttonEl.setAttribute("style", "");

  const timer = 200;
  const fiveSeconds = 5 * 1000;
  const increment = (timer * 100) / fiveSeconds;

  let interval = null;
  let percentage = 0;

  const buttonUpCB = () => {
    clearInterval(interval);
    percentage = 0;
    updatePercentage(percentage);
  };

  const buttonDownCb = () => {
    interval = setInterval(() => {
      percentage += increment;
      updatePercentage(percentage);

      if (percentage >= 100) {
        clearInterval(interval);
        buttonEl.removeEventListener("mousedown", buttonDownCb);
        window.removeEventListener("mouseup", buttonUpCB);
        buttonEl.remove();
        con.send("playerIdReady");
      }
    }, timer);
  };

  buttonEl.addEventListener("mousedown", buttonDownCb);
  window.addEventListener("mouseup", buttonUpCB);
};

con.listen("playerJoined", (data) => {
  document.querySelector("#game-id").innerHTML = data.gameId;
  if (!data.isReady) {
    listenButton();
  }
});

con.listen("errorRequiredMoreUsers", () => {
  alert("Numero de usuarios insuficientes. Minimo 2");
  window.location.replace(window.location.origin);
});

con.listen("error", () => {
  alert("El ID de partida no existe");
});

con.listen("replaceTo", ( { type }) => {
  // window.location.replace(`${window.location.origin}/${type}/player.html`);
  import(`${window.location.origin}/games/${type}/player.js`).then((module) => {
    const tag = module.default;
    document.body.innerHTML = `<${tag}></${tag}>`;
  });
});

con.send("joinPlayerToNewGame", {
  gameId,
  playerId,
});
