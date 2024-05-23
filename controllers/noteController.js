const noteModal=require("../models/note");
const {encryptNote,decryptNote}=require("../encrypt");

module.exports={
    //creating a note
    createNote:async (req,res)=>{
        const {title,content,notebook}=req.body;
       try {
         //trying encryption
         const {encryptedTitle,encryptedContent}=encryptNote(title,content);
    const note=   await noteModal.create({
            title:encryptedTitle,
            content:encryptedContent,
            notebook
        });
        res.json(note);
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
           if(notes.length===0)  res.json(notes);
           else {
            const decryptedNotes=notes?.map(note=>{
                const {title,content}=decryptNote(note.title,note.content);
                note.title=title;
                note.content=content;
                return note;
              })
          res.json(decryptedNotes);
        }
        } catch (error) {
            res.status(500).json({"error while fetching notes.":error.message})    
        }

    },
    updateNote: async(req,res)=>{
        const {title,content}=req.body;
        const {encryptedTitle,encryptedContent}=encryptNote(title,content);
        const id=req.params.id;
        try {
            await noteModal.updateOne(
                {
                    _id:id,
                },
                { 
                    $set:
                  {
                    title:encryptedTitle,
                    content:encryptedContent
                  }
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