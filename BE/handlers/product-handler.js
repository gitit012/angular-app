const Product = require('../db/product');

async function addProduct(model) {
    let product = new Product({ ...model });
    await product.save();
    return product.toObject();
}
async function updateProduct(id, model) {
    await Product.findByIdAndUpdate(id, model);
}
async function deleteProduct(id) {
    await Product.findByIdAndDelete(id);
}
async function getAllProducts() {
    let products = await Product.find();
    return products.map(x => x.toObject());
}
async function getProduct(id) {
    let product = await Product.findById(id);
    if (!product) {
        return null; 
    }
    return product.toObject();
}
async function getNewProducts() {
    let newProducts = await Product.find({ isNewProduct: true });
    return newProducts.map((x) => x.toObject());
}
async function getFeaturedProducts() {
    let featuredProducts = await Product.find({ isFeatured: true });
    return featuredProducts.map((x) => x.toObject());
}

async function getProductForListing(searchTerm, categoryId, page, pageSize, sortBy, sortOrder, brandId) {
    console.log('[Handler] getProductForListing received params:', { searchTerm, categoryId, page, pageSize, sortBy, sortOrder, brandId });

    const validPage = Math.max(1, parseInt(page, 10) || 1);
    const validPageSize = Math.max(1, parseInt(pageSize, 10) || 6);
    const validSortBy = sortBy || 'price';
    const validSortOrder = [1, -1, '1', '-1'].includes(sortOrder) ? parseInt(sortOrder, 10) : -1;

    let queryFilter = {}; 

    if (searchTerm && typeof searchTerm === 'string' && searchTerm.trim() !== '') {
        const escapedSearchTerm = searchTerm.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
        const searchRegex = new RegExp(escapedSearchTerm, 'i');
        console.log('[Handler] Applying search regex:', searchRegex);
        queryFilter.$or = [
            { name: { $regex: searchRegex } },
            { shortDescription: { $regex: searchRegex } },
            { description: { $regex: searchRegex } },
            { brandName: { $regex: searchRegex } }
        ];
    }

    if (categoryId) {
        queryFilter.categoryId = categoryId;
        console.log('[Handler] Applying categoryId filter:', categoryId);
    }

    if (brandId) {
        queryFilter.brandId = brandId;
        console.log('[Handler] Applying brandId filter:', brandId);
    }

    console.log('[Handler] Final queryFilter:', JSON.stringify(queryFilter));
    console.log(`[Handler] Sorting by: ${validSortBy}, Order: ${validSortOrder}`);
    console.log(`[Handler] Paging: Page ${validPage}, PageSize ${validPageSize}`);

    try {
        const products = await Product.find(queryFilter)
            .sort({ [validSortBy]: validSortOrder })
            .skip((validPage - 1) * validPageSize) 
            .limit(validPageSize);                

        console.log(`[Handler] Found ${products.length} products matching criteria.`);
        return products.map(x => x.toObject());
    } catch (error) {
        console.error("[Handler] Error executing Product.find:", error);
        throw error;
    }
}

module.exports = {
    addProduct,
    updateProduct,
    deleteProduct,
    getAllProducts,
    getProduct,
    getNewProducts,
    getFeaturedProducts,
    getProductForListing, 
};