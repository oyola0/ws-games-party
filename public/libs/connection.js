function Connection() {
    const host = location.host;
    const connection = new WebSocket('ws://' + host, "echo-protocol");
    const listeners = new Map();    
    
    let listenerCounter = 0;
    let ready = false;    
    let pendings = [];

    connection.onopen = () => {
        ready = true;
        pendings.forEach(data => {
            this.send(data.message, data);
        });
        pendings = [];
    };
        
    connection.onerror = (error) => {
        console.log('onerror', error);
    };

    connection.onmessage = (message) => {
        const data = JSON.parse(message.data);        

        listeners.forEach(({ msg, cb }) => {
            if (data.message === msg) {
                cb(data);
            }
        });
    };

    this.listen = (msg, cb) => {
        listenerCounter++;
        const listenerId = `listener_${listenerCounter}`;
        listeners.set(listenerId, {
            cb,
            msg,
        });
        return listenerId;
    };  

    this.unlisten = (listenerId) => {
        listeners.delete(listenerId);
    };

    this.send = (message, msgData = {}) => {
        const data = {
            ...msgData,  
            message,            
        };

        if(ready) {
            connection.send(JSON.stringify(data));
        } else {
            pendings.push(data);
        }
    }

    this.close = () => {
        connection.close();
    };
};

export default Connection;