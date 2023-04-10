import express from "express";
import { addTaskController, getMyProfileController, loginController, logoutController, registerController, removeTaskController, updatePasswordController, updateProfileController, updateTaskController } from "../controller/UserController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router()

//User Routes
router.route("/register").post(registerController)
router.route("/login").post(loginController)
router.route("/logout").get(logoutController)
router.route("/addtask").post(isAuthenticated,addTaskController)
router.route("/me").get(isAuthenticated,getMyProfileController)
router.route("/updatepassword").put(isAuthenticated,updatePasswordController)
router.route("/updateprofile").put(isAuthenticated,updateProfileController)

router.route("/task/:taskId").delete(isAuthenticated,removeTaskController).get(isAuthenticated,updateTaskController)



export default router