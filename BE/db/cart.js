const mongoose = require("mongoose");
const cartSchema = new mongoose.Schema({
    userId:{type:Schema.Types.ObjectId, ref: 'users'},
    productsId:Array(String)
});
const Order = mongoose.model('carts', cartSchema);
module.exports = Order