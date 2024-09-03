import express from "express";
import connectDB from "./config/db";
import dotenv from "dotenv";
import passport from "passport";
import session from "express-session";
import cors from "cors";

dotenv.config();
import "colors";
import "./config/passport";

const PORT = 5000;

connectDB();
const app = express();

app.use(express.json({ limit: "25mb" }));
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);

app.set("trust proxy", 1);

app.use(
  session({
    secret: "thisiscookiesecret",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: process.env.NODE_ENV !== "development",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res, next) => {
  if (req.user) {
    res.json(req.user);
  } else {
    res.json({ msg: "success" });
  }
});

//------ROUTES------//
import oauthRouter from "./routes/oauth";
import usersRouter from "./routes/users";

app.use("/api/oauth", oauthRouter);
app.use("/api/users", usersRouter);

app.listen(PORT, () => console.log(`Server is up and running on port ${PORT}`));
