const Cart = require('./../db/cart');

async function addToCart(userId, productId, quantity) {
    try {
        let cartItem = await Cart.findOne({ userId: userId, productId: productId });

        if (cartItem) {
            await Cart.findByIdAndUpdate(cartItem._id, {
                 quantity: quantity
            });
        } else {
             if (quantity <= 0) {
                 throw new Error("Quantity must be positive when adding a new item.");
             }
            cartItem = new Cart({
                userId: userId,
                productId: productId,
                quantity: quantity
            });
            await cartItem.save();
        }
         return null;
    } catch (error) {
        console.error("Error in addToCart/updateQuantity:", error);
        throw error;
    }
}

async function removeFromCart(userId, productId) {
    try {
        const result = await Cart.findOneAndDelete({ userId: userId, productId: productId });
        if (!result) {
            console.warn(`Item not found for removal: user ${userId}, product ${productId}`);
        }
        return result;
    } catch (error) {
        console.error("Error in removeFromCart:", error);
        throw error;
    }
}

async function getCartItems(userId) {
    try {
        const cartItems = await Cart.find({ userId: userId }).populate("productId");
        return cartItems
            .filter(item => item.productId != null)
            .map(item => ({
                product: item.productId,
                quantity: item.quantity
            }));
    } catch (error) {
        console.error("Error in getCartItems:", error);
        throw error;
    }
}

module.exports = { addToCart, removeFromCart, getCartItems };