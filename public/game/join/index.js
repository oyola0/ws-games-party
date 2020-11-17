import Connection from '../../libs/connection.js';

const con = new Connection();
const params = new URLSearchParams(window.location.search);
const gameId = params.get('game-id');
const username = params.get('username');

const listenButton = () => {
    const buttonEl = document.querySelector('#start-btn');
    buttonEl.setAttribute('style', '');

    const timer = 200;
    const fiveSeconds = (5 * 1000);
    const increment = (timer * 100) / fiveSeconds;

    let interval = null;
    let percentage = 0;
    
    const buttonUpCB = () => () => {
        console.log('mouseup')
        clearInterval(interval);
        percentage = 0;
    };

    const buttonDownCb = () => {
        interval = setInterval(() => {
            percentage += increment;
            con.send('playerReadyPercentage', {
                percentage,
            });

            if(percentage >= 100) {
                clearInterval(interval);
                buttonEl.removeEventListener('mousedown', buttonDownCb);
                window.removeEventListener('mouseup', buttonUpCB);
            }
        }, timer);
    };

    buttonEl.addEventListener('mousedown', buttonDownCb);
    window.addEventListener('mouseup', buttonUpCB);
};

con.listen('joinedGame', (data) => {
    document.querySelector('#game-id').innerHTML = data.gameId;
    listenButton();
});

con.send('joinGame', {
    gameId,
    username,
});