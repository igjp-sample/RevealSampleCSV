import express from 'express';
import reveal, { RevealOptions } from 'reveal-sdk-node';
import http from "http";
import cors from "cors";
import WebSocket from "ws";
import "dotenv/config";

// The demo data in memory.
// This data can be updated by the REST API in this server.
const data = [
  { id: 1, name: 'Alice', score: 95 },
  { id: 2, name: 'Bob', score: 80 },
  { id: 3, name: 'John', score: 70 },
];

// Create a server based on Express with a WebSocket feature.
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// A collection of WebSocket clients currently connected.
const clients = new Set<WebSocket>();

// Maintain the collection of WebSocket clients.
wss.on('connection', (ws) => {
  clients.add(ws);
}).on('close', (ws: WebSocket) => {
  clients.delete(ws);
});

app.use(cors()); // NOTE: Please be careful about CORS settings in production.

// Expose static contents for the Reveal Web client.
app.use(express.static('public'));

// A REST API implementation for the purpose of demonstration.

// "HTTP GET /api/data" will simply return the demo data as a JSON string.
app.get('/api/data', (_, res) => res.json(data));

// "HTTP PATCH /api/data/:id" with a JSON body will update the demo data, and send a message to all clients via a WebSocket connection.
// You can test this API with the following command:
// curl -X PATCH -H "Content-Type: application/json" -d '{"score": 100}' http://localhost:5112/api/data/1
app.patch('/api/data/:id', express.json(), (req, res) => {

  // Update the demo data.
  const id = Number(req.params.id);
  const score = Number(req.body.score);
  const item = data.find(item => item.id === id);
  if (item) {
    item.score = score;
    res.json(item);
  } else {
    res.status(404).end();
  }

  // Notify all clients that the demo data has been updated via WebSocket connections.
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send("updated-demo-data");
    }
  });
});

// Enable the Reveal Server.
const revealOptions: RevealOptions = {
  license: process.env.LICENSE_KEY,
};
app.use("/", reveal(revealOptions));

// Start the server.
server.listen(5112, () => {
  console.log(`Reveal server accepting http requests: http://localhost:5112/`);
  console.log(`Open http://localhost:5112/ on our web browser, then you will see the Reveal dashboard.`);
});
