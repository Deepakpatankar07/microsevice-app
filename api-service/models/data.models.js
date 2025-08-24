import mongoose from "mongoose";
// Dummy model for data (simulate)
const DataSchema = new mongoose.Schema({
  numId: { type: Number, unique: true },
  title: String,
  content: String,
});
export default mongoose.model("Data", DataSchema);
