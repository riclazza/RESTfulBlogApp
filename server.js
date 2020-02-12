const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION! Shutting down..');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });

//This will connect to the mongo service created by docker-compose
//If mongo service is running on the local machine , use localhost:27017 instead of mongo:27017
const DB = process.env.DATABASE_LOCAL;
const dbOptions = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
};

const app = require('./app');

mongoose
  .connect(DB, dbOptions)
  .then(() => console.log('DB connection successful!'))
  .catch(err => {
    console.log(err.message);
    process.exit(1);
  });

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`app is running on port ${port}`);
});

process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION! Shutting down..');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
