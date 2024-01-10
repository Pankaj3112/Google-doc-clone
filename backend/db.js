const mongoose = require("mongoose");
const { Schema, model } = mongoose;
require("dotenv").config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected successfully"));

const DocumentSchema = new Schema({
  _id: String,
  data: Object,
});

const Document = model("Document", DocumentSchema);
module.exports = {Document};