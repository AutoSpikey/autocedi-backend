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
const axiosMiddleware = require("./middleware/axios");

const app = express();

app.use(express.json());
// app.use(audit())
app.use(function (req, res, next) {
  logger.info(req.body);
  res.header("Access-Control-Allow-Origin", "localhost"); // update to match the domain you will make the request from
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
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
