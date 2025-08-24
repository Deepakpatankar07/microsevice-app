import express from 'express';
import validateToken from '../middlewares/auth.middleware.js';
import { register, login, me, getData, getDatas } from '../controllers/user.controllers.js';

const userRouter = express.Router();


userRouter.route('/register').post(register);
userRouter.route('/login').post(login);
userRouter.route('/me').get(validateToken, me)
userRouter.route('/data').get(validateToken, getDatas);
userRouter.route('/data/:id').get(validateToken, getData);


export default userRouter;