
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const mongoose = require('mongoose');


const app = require('./app');

const MONGO_DATA_BASE = process.env.DATABASE.replace('<password>', process.env.DATABASE_PASSWORD);

//Connext to database
mongoose.connect(MONGO_DATA_BASE,
  //connection recipie
  {
    useNewUrlParser: true,
    useCreateIndex: true
  }).then(con=>{
    console.log(`The Database connection was successful with ${process.env.DATABASE}`);// log connection properties
  });

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});


