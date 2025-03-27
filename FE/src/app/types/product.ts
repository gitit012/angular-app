export interface Product{
    _id?: string,
    name: String,
    shortDescription: String,
    description: String,
    price: Number,
    discount: Number,
    images: string[]
    categoryId: string,
    isFeatured: boolean,
    isNewProduct: boolean
}