const express = require("express");

const automationRoutes = require("./routes/automation.routes");
const callbackRoutes = require("./routes/callback.routes");
const loginRoutes = require("./routes/login.routes");
const registerRoutes = require("./routes/register.routes");
const walletRoutes = require("./routes/wallet.routes");
const validateRoutes = require("./routes/validate.routes");
const rateLimit = require("express-rate-limit");
const logger = require("./logger");

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // Limit each IP to 100 requests per window
});

const cors = require("cors");

const app = express();

app.use(express.json());
// app.use(audit())
app.use(function (req, res, next) {
  if (req.url == '/register' | 'login'){
    let body = {...req.body};
    delete body.password;
    console.log(`Incoming Request...\n ${JSON.stringify(body)} \n url:${JSON.stringify(req.url)}`);
  } 
  else{
    logger.info(`Incoming Request...\n ${JSON.stringify(req.body)} \n url:${JSON.stringify(req.url)}`);
  }
  res.header("Access-Control-Allow-Origin", "localhost"); // update to match the domain you will make the request from
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  const originalJson = res.json;

  // Override res.json to log before sending the response
  res.json = function (data) {
    logger.info(`Response sent...: \n${JSON.stringify(data)}`);
    originalJson.call(this, data); // Call the original res.json function
  };

  next();
});
app.use(cors());
app.use(limiter);

app.get("/", (req, res) => {
  res.send("Welcome to the autocedi backend");
});

// Use the automation routes
app.use("/automations", automationRoutes);
app.use("/wallets", walletRoutes);
app.use("/callback", callbackRoutes);
app.use("/login", loginRoutes);
app.use("/register", registerRoutes);
app.use("/validate", validateRoutes);

module.exports = app;
