export interface Product{
    _id?: string,
    name: String,
    shortDescription: String,
    description: String,
    price: number,
    discount: number,
    images: string[]
    categoryId: string,
    isFeatured: boolean,
    isNewProduct: boolean
}