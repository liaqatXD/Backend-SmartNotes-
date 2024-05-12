const express=require("express");
const router=express.Router();
const userController=require("../controllers/userController");
//importing middleware
const authMiddleware=require("../middlewares/authMiddleware");
//public routes
router.post("/register",userController.userRegisteration);
router.post("/login",userController.userLogin);
router.post("/resetpassword",userController.sendUserPasswordResetEmail);
//protected routes
router.use("/changepassword",authMiddleware);
router.use("/userdata",authMiddleware);

router.post("/changepassword",userController.changePassword);
router.get("/userdata",userController.loggedUser);

module.exports=router;