const notebookModal=require("../models/notebook");
const noteModal=require("../models/note");
const {encryptNotebook,decryptNotebook}=require("../encrypt");
module.exports={
    createNotebook:async (req,res)=>{
     {
        const {title,description,author}=req.body;
       try {
        //trying encryption
        const {encryptedTitle,encryptedDescription}=encryptNotebook(title,description);
       
        const notebook=await notebookModal.create({
            title:encryptedTitle,
            description:encryptedDescription,
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
            if(notebooks.length===0)  res.json(notebooks);
            else {
                const decryptedNotebooks=notebooks?.map(notebook=>{
                    const {title,description}=decryptNotebook(notebook.title,notebook.description);
                    notebook.title=title;
                    notebook.description=description;
                    return notebook;
                  })
              res.json(decryptedNotebooks);
            }
          
        
        } catch (error) {
            res.status(500).json({"error while fetching notebooks":error.message})
           
        }
    },
    updateNotebook:async (req,res)=>{
        const {title,description}=req.body;
        const {encryptedTitle,encryptedDescription}=encryptNotebook(title,description);
        const id=req.params.id;
        try {
            const updatedNotebook=await notebookModal.updateOne({
                _id:id
            }, 
              { $set:
                {
                    title:encryptedTitle,
                    description:encryptedDescription
                }
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
          const response=  await noteModal.deleteMany({notebook:id});
            res.json(response);

        } catch (error) {
            res.status(500).json({"error while deleting the notebook":error.message});
            
        }
    }
}