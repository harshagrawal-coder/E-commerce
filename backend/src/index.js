import app from "./app.js"
import connectToDb from "./config/db.js"
import { config } from "./config/config.js"
const startServer = async () => {
    try {
        await connectToDb()
        app.listen(config.PORT, () => {
            console.log(`Server is running on port ${config.PORT}`)
        })
    } catch (error) {
        console.log("Db not connected", error.message)
        process.exit(1)
    }
}
startServer()