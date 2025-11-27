import express from 'express';
import passport from 'passport';
import {
  googleAuthCallback,
  refreshAccessToken,
  logoutUser,
  checkAuth,
} from '../controllers/auth.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';


const router = express.Router();

router.route('/google').get(
  passport.authenticate('google', { scope: ['profile', 'email'] })
);


router.route('/google/callback').get(
  passport.authenticate('google', { session: false }),
  googleAuthCallback
);

router.route('/refresh-token').post(refreshAccessToken);


router.route('/logout').post(verifyJWT,logoutUser);

router.route("/checkAuth").get(verifyJWT,checkAuth);

export default router;
