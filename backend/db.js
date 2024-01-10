const mongoose = require("mongoose");
const { Schema, model } = mongoose;

mongoose
  .connect("mongodb://127.0.0.1:27017/google-docs-clone")
  .then(() => console.log("MongoDB connected successfully"));

const DocumentSchema = new Schema({
  _id: String,
  data: Object,
});

const Document = model("Document", DocumentSchema);
module.exports = {Document};