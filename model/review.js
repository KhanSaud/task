const mongoose = require("mongoose");



//shopdetails
const reviewSchema = new mongoose.Schema({
    shopName: { type: String, unique: true },
    shopReview: { type: String, default: null },
  });
  



module.exports = mongoose.model("shopReview", reviewSchema);