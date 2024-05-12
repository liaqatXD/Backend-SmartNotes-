const {verify}=require("jsonwebtoken");
// const userModel=require("../models/user");

const checkUserAuntentication=async (req,res,next)=>{
  try {
    const token=req.headers["authorization"].split(" ")[1];
  
  
    const {userId}=verify(token,process.env.ACCESS_TOKEN_SECRET);
    if(userId){
        req.userId=userId;
        next();
    }
    else res.json({status:"failed",message:"Invalid authorization."});
  
  } catch (error) {
     res.json({status:"failed",message:"Error occured during authorization."});
  }

}

module.exports=checkUserAuntentication;