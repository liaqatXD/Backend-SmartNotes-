const mongoose=require("mongoose");

const connectDB = async (DATABASE_URL) =>{
   try {
    await mongoose.connect(DATABASE_URL);
    console.log("DATABASE CONNECTED SUCCESSFULLY!");
   } catch (error) {
    console.log(error.message);
   }
}

module.exports=connectDB;