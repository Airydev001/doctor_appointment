
import express from "express"


import {addDoctor,allDoctors,loginAdmin} from "../controllers/adminController.js"
import authAdmin from "../middlewares/auth_admin.js"
import upload from "../middlewares/multer.js"

const adminRouter = express.Router()

adminRouter.post('/add-doctor',authAdmin,upload.single('image'),addDoctor)
adminRouter.post('/login',loginAdmin)
adminRouter.post('/all-doctors',authAdmin,allDoctors )

export default adminRouter

