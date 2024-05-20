const userModel=require("../models/user");


module.exports={
    // Register Function on sign-up
    createUser:async (req,res)=>{
        const {username,email,password}=req.body;
        try {
     const user=  await userModel.create({
            username,
            email,
            password
        });
        res.status(200).json(user)
            
        } catch (error) {
    res.status(500).json({"error":error.message})
        }
    },
    //getting user details
    getUser:async (req,res)=>{
        const email=req.params.email;
        try {
        const user=await userModel.findOne({email});
        if(user)   res.json(user);
        else throw new Error('No user found.');
        } catch (error) {
    res.status(500).json({"error":error.message})
        }
    },
    //updating user details
    updateUser:async(req,res)=>{
        const email=req.params.email;
        try {
            await userModel.updateOne({email},
                { $set:
                    req.body
                 }
            );
           res.json({"success":'user details updated successfully.'});
            } 
            catch (error) {
        res.status(500).json({"error":error.message})
            }

    }

}