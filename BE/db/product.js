const mongoose = require("mongoose");
const productSchema = new mongoose.Schema({
    name: String,
    shortDescription: String,
    Description: String,
    purchasePrice: Number,
    sellingProce: Number,
    images: Array(String),
    categoryId: {type:Schema.Types.ObjectId, ref:'categories'}
});
const Product = mongoose.model('products', productSchema);
module.exports = Product