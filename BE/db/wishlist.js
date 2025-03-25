const mongoose = require("mongoose");
const wishListSchema = new mongoose.Schema({
    userId:{type:Schema.Types.ObjectId, ref: 'users'},
    productsId:Array(String)
});
const Order = mongoose.model('orders', wishListSchema);
module.exports = Order