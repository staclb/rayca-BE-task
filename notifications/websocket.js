const WebSocket = require('ws');
const wss = new WebSocket.Server({ noServer: true });

const sendWebSocketNotification = (userId, title, message) => {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN && client.userId === userId) {
      client.send(JSON.stringify({ title, message }));
    }
  });
};

module.exports = { sendWebSocketNotification, wss };
