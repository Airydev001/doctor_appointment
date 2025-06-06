
import express from "express"


import {addDoctor,allDoctors,loginAdmin} from "../controllers/adminController.js"
import authAdmin from "../middlewares/auth_admin.js"
import upload from "../middlewares/multer.js"
import {changeAvailability}  from "../controllers/doctorController.js"
const adminRouter = express.Router()

adminRouter.post('/add-doctor',authAdmin,upload.single('image'),addDoctor)
adminRouter.post('/login',loginAdmin)
adminRouter.post('/all-doctors',authAdmin,allDoctors )
adminRouter.post('/change',authAdmin,changeAvailability)

export default adminRouter

