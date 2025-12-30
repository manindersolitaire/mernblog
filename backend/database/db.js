import mongoose from "mongoose";

const connetDB = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log('MongoDb connected!!')
    } catch (error) {
        console.log("MongoDB connection Failed", error)
    }
}

export default connetDB