import express from 'express'
import dotenv from 'dotenv'
import connetDB from './database/db.js'
import userRoutes from './routes/user.route.js'
dotenv.config()
const app = express()
app.use(express.json())
const PORT =  process.env.PORT || 3000

connetDB()

app.use("/api/v1/user", userRoutes)
app.listen(PORT, ()=>{
    console.log(`Server listen at port ${PORT}`)
})