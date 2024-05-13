const noteModal=require("../models/note");

module.exports={
    //creating a note
    createNote:async (req,res)=>{
        const {title,content,notebook}=req.body;
       try {
       await noteModal.create({
            title,
            content,
            notebook
        });
        res.json({"success":"note created successfully."})
       } catch (error) {
        res.status(500).json({"error while creating note":error.message})
        
       }
    }
,
    //getting all notes
    getNotes: async (req,res)=>{
        const id=req.params.id;
        try {
            const notes=await noteModal.find({notebook:id});
            res.json(notes);
        } catch (error) {
            res.status(500).json({"error while fetching notes.":error.message})    
        }

    },
    updateNote: async(req,res)=>{
        const id=req.params.id;
        try {
            await noteModal.updateOne(
                {
                    _id:id,
                },
                { 
                    $set:
                    req.body
                }
            );
            res.json({"success":"note updated successfully!"});
            
        } catch (error) {
            res.status(500).json({"error while updating note.":error.message})    
            
        }
    },
    deleteNote: async (req,res)=>{
        const id=req.params.id;
        try {
            await noteModal.deleteOne({_id:id});
            res.json({"success":"note deleted successfully."})

        } catch (error) {
            res.status(500).json({"error while deleting note.":error.message})    
            
        }
    }
}