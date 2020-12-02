function Connection() {
  let connection;
  const listeners = new Map();

  let listenerCounter = 0;
  let ready = false;
  let pendings = [];

  const createNewConnection = () => {
    const checkConnection = () => {
      const interval = setInterval(() => {
        if (connection.readyState !== 1) {
          ready = false;
          clearInterval(interval);
          createNewConnection();
        }
      }, 5000);
    };

    connection = new WebSocket(`ws://${window.location.host}`, "echo-protocol");

    connection.onopen = () => {
      ready = true;
      pendings.forEach((data) => {
        this.send(data.message, data);
      });
      pendings = [];
      checkConnection();
    };

    connection.onerror = (error) => {
      console.log("onerror", error);
      checkConnection();
    };

    connection.onmessage = (message) => {
      const data = JSON.parse(message.data);

      listeners.forEach(({ msg, cb }) => {
        if (data.message === msg) {
          cb(data);
        }
      });
    };
  };

  createNewConnection();

  this.listen = (msg, cb) => {
    listenerCounter += 1;
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

    if (ready) {
      connection.send(JSON.stringify(data));
    } else {
      pendings.push(data);
    }
  };

  this.close = () => {
    connection.close();
  };
}

export default Connection;
