import { ConditionModel } from "../../Model/ConditionModel.js"

export const SeedCondition = async () => {
    await ConditionModel.deleteMany({})
    await ConditionModel.create([
        {
            conditionName: "New"
        },
        {
            conditionName: "Used"
        },
    ])
    console.info("Conditions are successfully seeded")
}