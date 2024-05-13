const express=require("express");
const router=express.Router();
const noteController=require("../controllers/noteController");

//creating a note
router.post("/",noteController.createNote);

//getting all notes
router.get("/:id",noteController.getNotes);

//updating a note
router.put("/:id",noteController.updateNote);

//deleting a note
router.delete("/:id",noteController.deleteNote);

module.exports=router;