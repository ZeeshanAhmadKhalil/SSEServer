import { RoleModel } from "../../Model/RoleModel.js"

export const SeedRoles = async () => {
    await RoleModel.deleteMany({})
    await RoleModel.create([
        {
            roleName: "User"
        },
        {
            roleName: "Admin"
        },
    ])
    console.info("Roles are successfully seeded")
}