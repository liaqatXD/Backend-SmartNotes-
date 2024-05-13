const mongoose=require("mongoose");

const noteSchema=new mongoose.Schema(
    {
       title:{
        type:String,
        required:true,
       },
       content:{
        type:String,
       },
       notebook: { type: mongoose.Schema.Types.ObjectId,
        required: true },

       createdAt: { type: Date, default: Date.now },
    }
)

module.exports=new mongoose.model("note",noteSchema);