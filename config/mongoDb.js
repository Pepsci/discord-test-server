require("dotenv").config();
const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGO_URI)
  .then((x) =>
    console.log(`Connected to Discord! Database name: "${x.connection.name}"`)
  )
  .catch((err) => console.error("Error connecting to mongo", err));
