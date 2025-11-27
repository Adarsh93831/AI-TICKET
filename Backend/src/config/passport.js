import dotenv from "dotenv";
dotenv.config();
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import  User  from '../models/user.models.js';
import { inngest } from "../inngest/client.js";


passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {

          user = await User.create({
            googleId: profile.id,
            email: profile.emails[0].value,
          });

          console.log("inngest fired from here--->");
          
          await inngest.send(
            {
              name:"user/signup",
              data:{
                email: user.email,
              },
            }
          )

          console.log("Inngest work done-->");
          

        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);
