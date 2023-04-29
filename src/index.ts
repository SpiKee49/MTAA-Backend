import * as dotenv from 'dotenv';

import swaggerUi from 'swagger-ui-express';
import { Expo, ExpoPushToken } from 'expo-server-sdk';

import { WebSocketServer } from 'ws';
import { albumRouter } from './albums/album.router';
import { authRouter } from './auth/auth.router';
import cors from 'cors';
import express from 'express';
import { locationRouter } from './locations/location.router';
import { postRouter } from './posts/post.router';
import { requestRouter } from './requests/request.router';
import { tokenRouter } from './tokens/token.router';
import { userRouter } from './users/user.router';
const swaggerFile = require('./swagger_output.json');

dotenv.config();

if (!process.env.PORT) {
  process.exit(1);
}
const PORT: number = parseInt(
  process.env.PORT as string,
  10
);

export const expo = new Expo();

export const sendPushNotifications = (
  album: string,
  tokens: ExpoPushToken[]
) => {
  let messages = [];
  for (let pushToken of tokens) {
    if (!Expo.isExpoPushToken(pushToken)) {
      console.error(
        `Push token ${pushToken} is not a valid Expo push token`
      );
      continue;
    }

    messages.push({
      to: pushToken,
      title: 'NEW POST!',
      body: `New Post was added to ${album}`,
    });
  }

  let chunks = expo.chunkPushNotifications(messages);
  let tickets = [];
  (async () => {
    for (let chunk of chunks) {
      try {
        let ticketChunk =
          await expo.sendPushNotificationsAsync(chunk);
        console.log(ticketChunk);
        tickets.push(...ticketChunk);
      } catch (error) {
        console.error(error);
      }
    }
  })();
};

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use((_req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');

  next();
});
app.use(express.json({ limit: '50mb' }));
app.use('/api/users', userRouter);
app.use('/api/locations', locationRouter);
app.use('/api/albums', albumRouter);
app.use('/api/posts', postRouter);
app.use('/api/auth', authRouter);
app.use('/api/requests', requestRouter);
app.use('/api/tokens', tokenRouter);

// app.listen(PORT, () =>
//   console.log(`App listening on port ${PORT}!`)
// );
let server = require('http').createServer();
const wss = new WebSocketServer({
  server: server,
  perMessageDeflate: false,
});

wss.on('connection', function connection(ws) {
  console.log('[i]Connection to WS server established...');
  ws.on('error', console.error);
  ws.on('message', function message(data) {
    wss.clients.forEach(function each(client) {
      if (
        client !== ws &&
        client.readyState === WebSocket.OPEN
      ) {
        client.send('update');
      }
    });
  });
});

server.on('request', app);

//swagger middleware for documentation
app.use(
  '/api/documentation',
  swaggerUi.serve,
  swaggerUi.setup(swaggerFile)
);

// app.listen(PORT, () =>
//   console.log(`App listening on port ${PORT}!`)
// );
let server = require('http').createServer();
const wss = new WebSocketServer({
  server: server,
  perMessageDeflate: false,
});

wss.on('connection', function connection(ws) {
  console.log('[i]Connection to WS server established...');
  ws.on('error', console.error);
  ws.on('message', function message(data) {
    wss.clients.forEach(function each(client) {
      if (
        client !== ws &&
        client.readyState === WebSocket.OPEN
      ) {
        client.send('update');
      }
    });
  });
});

server.on('request', app);

server.listen(PORT, () => {
  console.log(
    'Express and WS servers listening on port ' + PORT
  );
});
