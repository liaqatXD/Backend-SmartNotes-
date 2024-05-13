require("dotenv/config");
const express=require("express");
const app=express();
const port=process.env.PORT || 3000;

//importing connectDB
const connectDB=require("./config/connectdb");
connectDB(process.env.DB_URL);

//json middleware
app.use(express.json());

//importing & registering user Router
const userRouter=require("./routes/userRoutes");
app.use("/api/users",userRouter);

//importing & registering notebook Router
const notebookRouter=require("./routes/notebookRoutes");
app.use("/api/notebooks",notebookRouter);

//importing & registering note Router
const noteRouter=require("./routes/noteRoutes");
app.use("/api/notes",noteRouter);

 
app.listen(port,()=>console.log(`listening on port ${port}`));