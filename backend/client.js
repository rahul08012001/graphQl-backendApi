const WebSocket = require('ws');

const websocketUrl = 'ws:/localhost:4000/graphql'; 

const ws = new WebSocket(websocketUrl);

ws.on('open', () => {
  console.log('WebSocket connected!');
  
 
  ws.send('Hello from client!');
});

ws.on('close', () => {
  console.log('WebSocket disconnected!');
});

ws.on('error', (error) => {
  console.error('WebSocket error:', error);
});

ws.on('message', (message) => {
  console.log('Received message from server:', message);
});

