import passport from "passport";
import express from "express";

const router = express.Router();

router.get(
  "/login/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    failureMessage: true,
  })
);

router.get(
  "/login/google/callback",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    successMessage: "success",
    successRedirect: "http://localhost:5173/redirect",
  })
);

export default router;
