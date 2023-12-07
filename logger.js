const winston = require('winston');
const path = require('path');
require("winston-mongodb");

const logFilePath = path.join(__dirname, 'logs', 'app.log');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: logFilePath, level: 'info' }),
    new winston.transports.MongoDB({
        level: 'info',
        db: `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.p5etw.mongodb.net/autocedi?retryWrites=true&w=majority`,                 // Update with your MongoDB connection string
        options: { useUnifiedTopology: true },                                                                                                                   // MongoDB connection options
        collection: 'logs',                                                                                                                                      // Collection name in MongoDB
      }),
  ],
});

if (process.env.APP_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

module.exports = logger;
