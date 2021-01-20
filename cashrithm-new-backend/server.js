const express = require("express");
const dotenv = require("dotenv");
const colors = require("colors");
const mongoose = require("mongoose");
const morgan = require("morgan");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const cors = require("cors");
const cookieParser = require("cookie-parser");


const uploadcsvRouter = require("./routes/uploadCSVRoute");
const csvRouter = require("./routes/CSVRoute");
const userRouter = require("./routes/userRoute");
const entitiesRouter = require("./routes/entitiesRoute");
const documentation = require("./utils/documentation.json");

const expressErrorHandlingMiddleware = require("./controllers/expressErrorHandlingMiddleware");
const ThrowError = require("./utils/ThrowError");

dotenv.config();

const app = express();

app.enable('trust proxy');

// Cross origin o
app.use(cors());

// Setting http headers
app.use(helmet());

// Parsing Incoming data
app.use(express.json({limit: "10kb"}));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Rate limiter functionality
let loginSignupLimiterObject = {
  max: 100,
  windowMs: 5 * 60 * 1000,
  message: "Too many login or signup request from this IP, try back in 5 minutes"
};

if(process.env.NODE_ENV === "production") {
  loginSignupLimiterObject.max = 10;
}

const loginSignupLimiter = rateLimit(loginSignupLimiterObject);

const generalLimiter = rateLimit({
  max: 1000,
  windowMs: 60 * 60 * 1000,
  message: "Too many login or signup request from this IP, try back in an hour"
});

app.use("/api", generalLimiter);
app.use("/api/v1/user/signup", loginSignupLimiter);
app.use("/api/v1/user/login", loginSignupLimiter);

// Mongoose sanitize
app.use(mongoSanitize());

// Xss attack
app.use(xss());

// Morgan for Development
if(process.env.NODE_ENV === "development") app.use(morgan('dev'));

// Test middleware
app.use((req, res, next) => {
  //console.log(req.ip);
  //console.log(req.headers);
  /*console.log("req");
  console.log(req);
  console.log("req.header");
  console.log(req.headers);
  console.log(req.app);*/
  /*console.log("res");
  console.log(res);
  console.log(res.cookies);
  console.log("req");
  console.log(req.cookies);
  console.log(req.cookies.token);*/
  next();
});

// DATABASE CONNECTION
const main = async () => {
  if (process.env.DB_STRING && process.env.DB_USER && process.env.DB_PASS && process.env.DB_NAME) {

    CONNECTION_STRING = (process.env.DB_STRING)
      .replace('<username>', process.env.DB_USER)
      .replace('<password>', process.env.DB_PASS)
      .replace('<dbname>', process.env.DB_NAME);
  } else {
    //console.log(colors.red('Are you sure the .env file exists and have the correct information?'));
    //throw new Error('Invalid or inexistent environment file');
  }

  await mongoose.connect(CONNECTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
  }, (error) => {
      console.log(colors.yellow(`Database connected`));
      if (error) throw error;
  });
};
main();

// 
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Cashrithm v1.0 API",
    routes: documentation
  });
});

// MOUNTING ROUTES
app.use("/api/v1/upload-csv", uploadcsvRouter);
app.use("/api/v1/csv", csvRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/entities", entitiesRouter);

// 404 Error request
app.all("*", (req,  res, next) => {
  next(new ThrowError(400, `Can't find ${req.originalUrl} on this server`));
});

// Express error handling middleware
app.use(expressErrorHandlingMiddleware);

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Now listening to port ${port}`));