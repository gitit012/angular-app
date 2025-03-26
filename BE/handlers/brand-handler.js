const Brand = require('./../db/brand');
const mongoose = require('mongoose');

async function getBrands(){
    let brands = await Brand.find();
    return brands.map(x=>x.toObject())
}
async function getBrand(id){
    if (!mongoose.isValidObjectId(id)) {
        throw new Error("Invalid brand ID");
    }
    let brand = await Brand.findById(id);
    if (!brand) throw new Error("Brand not found");
    return brand.toObject();
}
async function addBrand(model) {
    try {
      const brand = new Brand({ name: model.name });
      await brand.save();
      return brand.toObject();
    } catch (error) {
      throw new Error('Database error: ' + error.message);
    }
  }
async function updateBrand(id,model){
    if (!mongoose.isValidObjectId(id)) {
        throw new Error("Invalid brand ID");
    }
    await Brand.findByIdAndUpdate(id, model);
}
async function deleteBrand(id){
    if (!mongoose.isValidObjectId(id)) {
        throw new Error("Invalid brand ID");
    }
    await Brand.findByIdAndDelete(id);
}

module.exports = {getBrand, getBrands,addBrand,updateBrand,deleteBrand}