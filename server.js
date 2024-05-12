require("dotenv/config");
const express=require("express");
const app=express();
const port=process.env.PORT || 3000;

//importing connectDB
const connectDB=require("./config/connectdb");
connectDB(process.env.DB_URL);

//importing user Router
const userRouter=require("./routes/userRoutes");

//JSON handling
app.use(express.json());

//Registering router
app.use("/api/user",userRouter);


app.listen(port,()=>console.log(`listening on port ${port}`));