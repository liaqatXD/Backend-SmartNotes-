const mongoose=require("mongoose");

const userSchema=new mongoose.Schema(
    {
        username:{
            type:String,
            required:true,
            trim:true
        },
        email:{
            type:String,
            required:true,
            trim:true,
            unique:true
        },

        password:{
            type:String,
            required:true,
            trim:true
        },
        noOfTasks: { type: Number, default: 0 },
        pomodoroTimers: { type: Number, default: 0 },
        noOfNotes: { type: Number, default: 0 }
    }
)

module.exports=new mongoose.model("user",userSchema);