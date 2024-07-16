const mongoose = require("mongoose");

if (!process.env.MONGO_URI) {

    console.error('MongoDB URI is missing');
    process.exit(1);
}

const connectDb =async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("connected to mongodb")
    } catch (error) {
        console.log({error})
        console.log("error connecting to mongodb")
    }
}

module.exports = {connectDb};