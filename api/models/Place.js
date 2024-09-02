const mongoose = require("mongoose");

const placeSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  title: { type: String, required: true },
  address: { type: String, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
  perks: { type: [String], required: true },
  extraInfo: { type: String },
  checkIn: { type: String, required: true },
  checkOut: { type: String, required: true },
  maxGuests: { type: Number, required: true },
});

module.exports = mongoose.model("places", placeSchema);
