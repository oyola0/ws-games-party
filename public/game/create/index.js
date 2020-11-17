import Connection from '../../libs/connection.js';

const con = new Connection();

con.listen('startingGame', ({ gameId }) => {
    document.querySelector('#game-id').innerHTML = gameId;
});

const timerEl = document.querySelector('#timer');
con.listen('startCountdown', ({ counter }) => {    
    timerEl.innerHTML = counter;

    let interval = setInterval(() => {
        counter--;
        timerEl.innerHTML = counter;

        if(counter === 0) {
            clearInterval(interval);
        }
    }, 1000);
});

con.listen('finishedCountdown', () => {    
    timerEl.innerHTML = 'finished';
});

const playersEl = document.querySelector('#players');
con.listen('joinedPlayer', ({ username }) => {
    playersEl.innerHTML = playersEl.innerHTML + `<li>${username}</li>`;
});

con.send('createGame');
