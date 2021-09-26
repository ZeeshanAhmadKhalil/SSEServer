import { CategoryModel } from "../../Model/CategoryModel.js"

export const SeedCategory = async () => {
    await CategoryModel.deleteMany({})
    await CategoryModel.create([
        {
            categoryName: "Electronics"
        },
        {
            categoryName: "Animals"
        },
        {
            categoryName: "Vehicle"
        },
        {
            categoryName: "Clothes"
        },
        {
            categoryName: "Stationary"
        },
        {
            categoryName: "Hobby"
        },
        {
            categoryName: "Entertainment"
        },
    ])
    console.info("Categories are successfully seeded")
}