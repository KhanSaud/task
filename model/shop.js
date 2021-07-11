const mongoose = require("mongoose");



//shopdetails
const shopSchema = new mongoose.Schema({
    shopName: { type: String, unique: true },
    shopCategory: { type: String, default: null },
    shopLocation: { type: String, default: null }
  });
  



module.exports = mongoose.model("shopDetail", shopSchema);