import * as dotenv from 'dotenv';

import { albumRouter } from './albums/album.router';
import { authRouter } from './auth/auth.router';
import cors from 'cors';
import express from 'express';
import { locationRouter } from './locations/location.router';
import { postRouter } from './posts/post.router';
import { requestRouter } from './requests/request.router';
import { userRouter } from './users/user.router';

dotenv.config();

if (!process.env.PORT) {
  process.exit(1);
}
const PORT: number = parseInt(
  process.env.PORT as string,
  10
);

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/users', userRouter);
app.use('/api/locations', locationRouter);
app.use('/api/albums', albumRouter);
app.use('/api/posts', postRouter);
app.use('/api/auth', authRouter);
app.use('/api/requests', requestRouter);

app.listen(PORT, () =>
  console.log(`App listening on port ${PORT}!`)
);
