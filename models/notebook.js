const mongoose=require("mongoose");

const notebookSchema=new mongoose.Schema(
    {
       title:{
        type:String,
        required:true,
        trim:true
       },
       description:{
        type:String,
        trim:true
       },
       author: { type: mongoose.Schema.Types.ObjectId,
         required: true },

       createdAt: { type: Date, default: Date.now },
    }
)

module.exports=new mongoose.model("notebook",notebookSchema);