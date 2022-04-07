const mongoose = require("mongoose");
require("dotenv").config();

const pw = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME;
const url = `mongodb+srv://fullstack:${pw}@moocfullstack.zrpnl.mongodb.net/${dbName}?retryWrites=true&w=majority`;

console.log("Connecting to database...");
mongoose
  .connect(url)
  .then(_result => console.log("Connected to database"))
  .catch(error => console.log("Failed to connect\n", error));

const personSchema = new mongoose.Schema({
  id: Number,
  name: String,
  number: String,
  date: Date,
});

personSchema.set("toJSON", {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const disconnect = () => {
    console.log("Disconnecting...");
    mongoose.connection.disconnect();
}

module.exports = { 
    Person: mongoose.model("Person", personSchema),
    disconnect: disconnect
};