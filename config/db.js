// Connect to the database
const config = require("config");
const mongoose = require("mongoose");

const db = config.get("mongoURI");

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false
    });

    console.log("MongoDB Connection established...");
  } catch (err) {
    console.log(err.message);

    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
