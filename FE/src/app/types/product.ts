export interface Product{
    _id?: string,
    name: String,
    shortDescription: String,
    Description: String,
    Price: Number,
    discount: Number,
    images: string[]
    categoryId: string,
    isFeatured: boolean,
    newItem: boolean
}