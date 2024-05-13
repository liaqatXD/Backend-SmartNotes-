const express=require("express");
const router=express.Router();
const notebookController=require('../controllers/notebookController');

// creating notebook
router.post('/',notebookController.createNotebook);

//getting all notebooks
router.get('/:id',notebookController.getNotebooks);

//updating a notebook
router.put('/:id',notebookController.updateNotebook);

//deleting a notebook
router.delete('/:id',notebookController.deleteNotebook);

module.exports=router;