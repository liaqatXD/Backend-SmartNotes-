const express=require("express");
const router=express.Router();
const userController=require("../controllers/userController");

// adding user on sign-up
router.post('/',userController.createUser);

// getting user details
router.get('/:email',userController.getUser);

// updating user details
router.put('/:email',userController.updateUser);

module.exports=router;