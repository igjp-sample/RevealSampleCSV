import express from 'express';
import expressStaticGzip from 'express-static-gzip';
import reveal, { RevealOptions, IRVUserContext } from 'reveal-sdk-node';
import http from "http";
import cors from "cors";
import "dotenv/config";
import fs from "fs";
import { pipeline } from 'stream';
import { promisify } from 'util';

// Create a server based on Express with a WebSocket feature.
const app = express();

const dashboardDirectory: string = "dashboards";
const pipelineAsync = promisify(pipeline);

app.get("/isduplicatename/:name", (req, resp) => {
	if (fs.existsSync(`${dashboardDirectory}/${req.params.name}.rdash`)) {
		resp.send(true);
	}
	else {
		resp.send(false);
	}
});

const dashboardProvider = async (userContext:IRVUserContext | null, dashboardId: string) => {
	return fs.createReadStream(`${dashboardDirectory}/${dashboardId}.rdash`);
}

const dashboardStorageProvider = async (userContext: IRVUserContext | null, dashboardId: string, stream: fs.ReadStream) => {
	await pipelineAsync(stream, fs.createWriteStream(`${dashboardDirectory}/${dashboardId}.rdash`));
}

app.use(cors()); // NOTE: Please be careful about CORS settings in production.

// Expose static contents for the Reveal Web client.
app.use('/', expressStaticGzip('public', {
  enableBrotli: true,
  orderPreference: ['br']
}));

// Enable the Reveal Server.
const revealOptions: RevealOptions = {
  localFileStoragePath: "data",
  dashboardProvider: dashboardProvider,
	dashboardStorageProvider: dashboardStorageProvider,
  license: process.env.LICENSE_KEY,
};
app.use("/", reveal(revealOptions));

// Start the server.
app.listen(5112, () => {
  console.log(`Reveal server accepting http requests: http://localhost:5112/`);
  console.log(`Open http://localhost:5112/ on our web browser, then you will see the Reveal dashboard.`);
});
