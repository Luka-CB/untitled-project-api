import express from "express";
import connectDB from "./config/db";
import dotenv from "dotenv";
import passport from "passport";
import session from "express-session";
import cookieParser from "cookie-parser";
import cors from "cors";
import { errorHandler, notFound } from "./middlewares/errorMiddlewares";

dotenv.config();
import "colors";
import "./config/passport";

const PORT = 5000;

connectDB();
const app = express();

app.use(express.json({ limit: "25mb" }));
app.use(cookieParser());
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

// import Village from "./models/Village";

app.post("/create", (req, res, next) => {
  // Village.insertMany([
  //   {
  //     name: {
  //       en: "Akhalbediseuli",
  //       ka: "ახალბედისეული",
  //     },
  //     municipality: "66d9bba10cf1974d01a0c840",
  //   },
  //   {
  //     name: {
  //       en: "Akhalsheni",
  //       ka: "ახალშენი",
  //     },
  //     municipality: "66d9bba10cf1974d01a0c840",
  //   },
  //   {
  //     name: {
  //       en: "Bangveti",
  //       ka: "ბანგვეთი",
  //     },
  //     municipality: "66d9bba10cf1974d01a0c840",
  //   },
  //   {
  //     name: {
  //       en: "Besiauri",
  //       ka: "ბესიაური",
  //     },
  //     municipality: "66d9bba10cf1974d01a0c840",
  //   },
  //   {
  //     name: {
  //       en: "Gamogma Noga",
  //       ka: "გამოღმა ნოღა",
  //     },
  //     municipality: "66d9bba10cf1974d01a0c840",
  //   },
  //   {
  //     name: {
  //       en: "gagma Noga",
  //       ka: "გაღმა ნოღა",
  //     },
  //     municipality: "66d9bba10cf1974d01a0c840",
  //   },
  //   {
  //     name: {
  //       en: "Gelaveri",
  //       ka: "გელავერი",
  //     },
  //     municipality: "66d9bba10cf1974d01a0c840",
  //   },
  //   {
  //     name: {
  //       en: "Gvazauri",
  //       ka: "გვაზაური",
  //     },
  //     municipality: "66d9bba10cf1974d01a0c840",
  //   },
  //   {
  //     name: {
  //       en: "Gvashtibi",
  //       ka: "გვაშტიბი",
  //     },
  //     municipality: "66d9bba10cf1974d01a0c840",
  //   },
  //   {
  //     name: {
  //       en: "Gochajikhaishi",
  //       ka: "გოჩაჯიხაიში",
  //     },
  //     municipality: "66d9bba10cf1974d01a0c840",
  //   },
  //   {
  //     name: {
  //       en: "Dedalauri",
  //       ka: "დედალაური",
  //     },
  //     municipality: "66d9bba10cf1974d01a0c840",
  //   },
  //   {
  //     name: {
  //       en: "Didi gubi",
  //       ka: "დიდი გუბი",
  //     },
  //     municipality: "66d9bba10cf1974d01a0c840",
  //   },
  //   {
  //     name: {
  //       en: "Didi Kukhi",
  //       ka: "დიდი კუხი",
  //     },
  //     municipality: "66d9bba10cf1974d01a0c840",
  //   },
  //   {
  //     name: {
  //       en: "Zeda Gordi",
  //       ka: "ზედა გორდი",
  //     },
  //     municipality: "66d9bba10cf1974d01a0c840",
  //   },
  //   {
  //     name: {
  //       en: "Zeda Kinchkha",
  //       ka: "ზედა კინჩხა",
  //     },
  //     municipality: "66d9bba10cf1974d01a0c840",
  //   },
  //   {
  //     name: {
  //       en: "Ivandidi",
  //       ka: "ივანდიდი",
  //     },
  //     municipality: "66d9bba10cf1974d01a0c840",
  //   },
  //   {
  //     name: {
  //       en: "Kinchkhaperdi",
  //       ka: "კინჩხაფერდი",
  //     },
  //     municipality: "66d9bba10cf1974d01a0c840",
  //   },
  //   {
  //     name: {
  //       en: "Kontuati",
  //       ka: "კონტუათი",
  //     },
  //     municipality: "66d9bba10cf1974d01a0c840",
  //   },
  //   {
  //     name: {
  //       en: "Lepilie",
  //       ka: "ლეფილიე",
  //     },
  //     municipality: "66d9bba10cf1974d01a0c840",
  //   },
  //   {
  //     name: {
  //       en: "Matkhoji",
  //       ka: "მათხოჯი",
  //     },
  //     municipality: "66d9bba10cf1974d01a0c840",
  //   },
  //   {
  //     name: {
  //       en: "Nakhakhulevi",
  //       ka: "ნახახულევი",
  //     },
  //     municipality: "66d9bba10cf1974d01a0c840",
  //   },
  //   {
  //     name: {
  //       en: "Oragveti",
  //       ka: "ორაგვეთი",
  //     },
  //     municipality: "66d9bba10cf1974d01a0c840",
  //   },
  //   {
  //     name: {
  //       en: "Patara Gubi",
  //       ka: "პატარა გუბი",
  //     },
  //     municipality: "66d9bba10cf1974d01a0c840",
  //   },
  //   {
  //     name: {
  //       en: "patara Kukhi",
  //       ka: "პატარა კუხი",
  //     },
  //     municipality: "66d9bba10cf1974d01a0c840",
  //   },
  //   {
  //     name: {
  //       en: "Patara Jikhaishi",
  //       ka: "პატარა ჯიხაიში",
  //     },
  //     municipality: "66d9bba10cf1974d01a0c840",
  //   },
  //   {
  //     name: {
  //       en: "Rondishi",
  //       ka: "რონდიში",
  //     },
  //     municipality: "66d9bba10cf1974d01a0c840",
  //   },
  //   {
  //     name: {
  //       en: "Satsiskvilo",
  //       ka: "საწისქვილო",
  //     },
  //     municipality: "66d9bba10cf1974d01a0c840",
  //   },
  //   {
  //     name: {
  //       en: "Satsulukidzeo",
  //       ka: "საწულუკიძეო",
  //     },
  //     municipality: "66d9bba10cf1974d01a0c840",
  //   },
  //   {
  //     name: {
  //       en: "Sukhcha",
  //       ka: "სუხჩა",
  //     },
  //     municipality: "66d9bba10cf1974d01a0c840",
  //   },
  //   {
  //     name: {
  //       en: "Udzlouri",
  //       ka: "უძლოური",
  //     },
  //     municipality: "66d9bba10cf1974d01a0c840",
  //   },
  //   {
  //     name: {
  //       en: "Kveda Gordi",
  //       ka: "ქვედა გორდი",
  //     },
  //     municipality: "66d9bba10cf1974d01a0c840",
  //   },
  //   {
  //     name: {
  //       en: "Kveda Kinchkha",
  //       ka: "ქვედა კინჩხა",
  //     },
  //     municipality: "66d9bba10cf1974d01a0c840",
  //   },
  //   {
  //     name: {
  //       en: "Kutiri",
  //       ka: "ქუტირი",
  //     },
  //     municipality: "66d9bba10cf1974d01a0c840",
  //   },
  //   {
  //     name: {
  //       en: "Gvedi",
  //       ka: "ღვედი",
  //     },
  //     municipality: "66d9bba10cf1974d01a0c840",
  //   },
  //   {
  //     name: {
  //       en: "Shua Gubi",
  //       ka: "შუა გუბი",
  //     },
  //     municipality: "66d9bba10cf1974d01a0c840",
  //   },
  //   {
  //     name: {
  //       en: "Chuneshi",
  //       ka: "ჩუნეში",
  //     },
  //     municipality: "66d9bba10cf1974d01a0c840",
  //   },
  //   {
  //     name: {
  //       en: "Dzedzileti",
  //       ka: "ძეძილეთი",
  //     },
  //     municipality: "66d9bba10cf1974d01a0c840",
  //   },
  //   {
  //     name: {
  //       en: "Kharabauli",
  //       ka: "ხარაბაული",
  //     },
  //     municipality: "66d9bba10cf1974d01a0c840",
  //   },
  //   {
  //     name: {
  //       en: "Khidi",
  //       ka: "ხიდი",
  //     },
  //     municipality: "66d9bba10cf1974d01a0c840",
  //   },
  // ]);

  res.send("success");
});

//------ROUTES------//
import oauthRouter from "./routes/oauth";
import usersRouter from "./routes/users";
import busnessRouter from "./routes/business";
import miscRouter from "./routes/misc";
import verificationRouter from "./routes/verification";
import planRouter from "./routes/plan";

app.use("/api/oauth", oauthRouter);
app.use("/api/users", usersRouter);
app.use("/api/business", busnessRouter);
app.use("/api/misc", miscRouter);
app.use("/api/verification", verificationRouter);
app.use("/api/plan", planRouter);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server is up and running on port ${PORT}`));
