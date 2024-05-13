const notebookModal=require("../models/notebook");

module.exports={
    createNotebook:async (req,res)=>{
     {
        const {title,description,author}=req.body;
       try {
        const notebook=await notebookModal.create({
            title,
            description,
            author
        });
        res.json({"success":"notebook created successfully."})
       } catch (error) {
        res.status(500).json({"error while creating notebook":error.message})
        
       }
     }
    },
    getNotebooks:async(req,res)=>{
        const id=req.params.id;

        try {
            const notebooks=await notebookModal.find({author:id});
        res.json({notebooks});
        } catch (error) {
            res.status(500).json({"error while fetching notebooks":error.message})
           
        }
    },
    updateNotebook:async (req,res)=>{
        const id=req.params.id;
        try {
            const updatedNotebook=await notebookModal.updateOne({
                _id:id
            }, 
              { $set:
                req.body
             })
             res.json({"success":"notebook updated successfully."})

        } catch (error) {
            res.status(500).json({"error while updating the notebook":error.message});
            
        }
    },
    deleteNotebook: async (req,res)=>{
        const id=req.params.id;
        try {
            await notebookModal.deleteOne({_id:id});
            res.json({"success":"notebook deleted successfully."})

        } catch (error) {
            res.status(500).json({"error while deleting the notebook":error.message});
            
        }
    }
}