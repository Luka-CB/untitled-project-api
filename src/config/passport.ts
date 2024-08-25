import passport from "passport";
import Customer from "../models/Customer";

import googleOauth from "passport-google-oauth20";

const GoogleStrategy = googleOauth.Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      callbackURL: "/api/oauth/login/google/callback",
    },
    async (accessToken: any, refreshToken: any, profile: any, done: any) => {
      try {
        let user = await Customer.findOne({ providerId: profile.id });

        if (user) {
          done(null, user);
        } else {
          user = await Customer.create({
            username: profile.displayName,
            email: profile.emails[0].value,
            image: profile.photos[0].value,
            provider: profile.provider,
            providerId: profile.id,
          });
          done(null, user);
        }
      } catch (error) {
        console.error(error);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user: any, done) => done(null, user));
