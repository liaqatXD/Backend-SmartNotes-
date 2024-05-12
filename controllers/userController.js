const userModel=require("../models/user");
const bcrypt=require("bcrypt");
const {sign}=require("jsonwebtoken");

module.exports={
    // Register Function

    userRegisteration:async (req,res)=>{
        const {name,email,password}=req.body;
        const user=await userModel.findOne({email});
        if(user) res.json({status:"failed",message:"user with this email already exists."});
        else{
            if(name && email && password){
         try {
            const salt=await bcrypt.genSalt(10);
            const hashedPassword= await bcrypt.hash(password, salt);
               const userDocument=new userModel({name,email,password:hashedPassword});
               await userDocument.save();

               //getting user saved to database
               const savedUser=await userModel.findOne({email});

               //generating jwt token
            const accessToken= sign({userId:savedUser._id},process.env.ACCESS_TOKEN_SECRET,{expiresIn:"5m"});


               res.json({status:"success",message:"User registered successfully","token":accessToken}); 

         } catch (error) {
            res.json({status:"failed",message:"unable to register."}); 
         }

            }
            else{
                res.json({status:"failed",message:"all fields are required."});  
            }
        }
    },

    // login Function
    userLogin:async (req,res)=>{
        const {email,password}=req.body;
       try {
        if(email && password){
            const user=await userModel.findOne({email});
            if(user){
                const pass=await bcrypt.compare(password,user.password);
                if(pass){

                     //generating jwt token
            const accessToken= sign({userId:user._id},process.env.ACCESS_TOKEN_SECRET,{expiresIn:"5m"});
                    res.json({status:"success",message:"User logged in successfully","token":accessToken});

                }
                else  res.json({status:"success",message:"Wrong Email or Password"});
            }
            else{
                res.json({status:"failed",message:"unregistered user"});      
            }
        }
        else{
            res.json({status:"failed",message:"all fields are required."});  
               
        }
       } catch (error) {
        res.json({status:"failed",message:"unregisterd user..."}); 
       }
    },

    //Change Password Function (After login)
    changePassword:async (req,res)=>{
      try {
        const {password}=req.body;
        if( password){
            const user=await userModel.findOne({_id:req.userId});
                const salt=await bcrypt.genSalt(10);
                const hashedPassword= await bcrypt.hash(password, salt);
                user.password=hashedPassword;
                await user.save();
                res.json({"status":"success",message:"Password changed successfully"});
            
        }
        else{
            res.json({status:"failed",message:"all fields are required."});   
        }
        
      
        
      } catch (error) {
        res.json({"status":"failed",message:"Error occured while changing Password"});
      }
    },
    //Getting Logged In User Details
    loggedUser: async (req,res)=>{
        try {
            const user=await userModel.findById(req.userId);
            res.json({status:"success",user:user});
        } catch (error) {
            res.json({status:"failed",message:"Error occured while getting user data."});
        }
    },
    //Reset/forget password
    sendUserPasswordResetEmail: async (req,res)=>{
        const {email}=req.body;
        if(email){
            try {
                const user=await userModel.findOne({email});
            if(user){

            }
            else res.json({status:"failed",message:"user not registered"}); 
            } catch (error) {
                res.json({status:"failed",message:"some error occured during resetting password."}); 
            }
        }
      else  res.json({status:"failed",message:"all fields are required."}); 
    }
}