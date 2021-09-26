// ! WARNING :: Seeding will remove current data from the seeded table
import { SeedCategory } from './Seeds/SeedCategory.js'
import { SeedChatMessageStatus } from './Seeds/SeedChatMessageStatus.js'
import { SeedCity } from './Seeds/SeedCity.js'
import { SeedCondition } from './Seeds/SeedCondition.js'
import { SeedDepositRequestStatus } from './Seeds/SeedDepositRequestStatus.js'
import { SeedOrderStatus } from './Seeds/SeedOrderStatus.js'
import { SeedRoles } from './Seeds/SeedRole.js'
import { SeedTransactionType } from './Seeds/SeedTransactionType.js'
import { ConnectDB } from './SSEContext.js'

ConnectDB()

const seedData = async () => {

    await SeedCategory()
    await SeedChatMessageStatus()
    await SeedCity()
    await SeedCondition()
    await SeedDepositRequestStatus()
    await SeedOrderStatus()
    await SeedRoles()
    await SeedTransactionType()

    process.exit()
}

seedData()