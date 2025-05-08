import validator from "validator";
import bcrypt from "bcrypt";
import userModel from "../models/userModel.js";
import appointmentModel from "../models/appointmentModel.js"
import doctorModel from "../models/doctorModel.js";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !password || !email) {
      return res.json({
        success: false,
        message: "Missing Details",
      });
    }
    //validating email

    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "enter a valid email",
      });
    }
    //validating strong password
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "enter a strong password",
      });
    }

    //hashing user password
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    const userData = {
      name,
      email,
      password: hashedPassword,
    };

    const newUser = new userModel(userData);

    const user = newUser.save();

    const token = jwt.sign(
      {
        id: user._id,
      },

      process.env.JWT_SECRET_KEY
    );

    res.json({
      success: true,
      token,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.json({
        success: false,
        message: "Missing Details",
      });
    }
    //validating email
    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "enter a valid email",
      });
    }
    //checking user in db
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({
        success: false,
        message: "User does not exist",
      });
    }
    //checking password
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const token = jwt.sign(
        {
          id: user._id,
        },

        process.env.JWT_SECRET_KEY
      );

      res.json({
        success: true,
        token,
      });
    } else {
      return res.json({
        success: false,
        message: "Invalid credentials",
      });
    }
    //generating token
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const { userId } = req.user;

    const userData = await userModel.findById(userId).select("-password");

    res.json({
      success: true,
      userData,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const updateProfile = async (req, res) => {
    try {
      const {userId} = req.user; 
      const { name, phone, address, dob, gender } = req.body;
  
      const imageFile = req.file;
  
    
  
      if (!name || !phone || !gender || !dob) {
        return res.json({
          success: false,
          message: "Data is missing",
        });
      }
  
      await userModel.findByIdAndUpdate(userId, {
        name,
        phone,
        address: JSON.parse(address),
        dob,
        gender,
      });
  
      
      if (imageFile) {
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
          resource_type: "image",
        });
  
        const imageUrl = imageUpload.secure_url;
  
        await userModel.findByIdAndUpdate(userId, {
          image: imageUrl,
        });
      }
  
      res.json({
        success: true,
        message: "Profile updated",
      });
    } catch (error) {
      console.log(error);
      res.json({
        success: false,
        message: error.message,
      });
    }
  };
  //API to book appointment 

  export const bookAppointment = async (req, res) => { 
    try{
      const {userId} = req.user;
const { docId, slotDate, slotTime} = req.body

const docData = await doctorModel.findById(docId).select('-password')

if(!docData.available){
     return res.json({
        success: false,
        message: "Doctor not available"
     }) 
}

let slots_booked = docData.slots_booked

if(slots_booked[slotDate]){
  if(slots_booked[slotDate].includes(slotTime)){
    return res.json({
      success: false,
      message: "Slot not available"
   }) 
  } else{
    slots_booked[slotDate].push(slotTime)
  }
}else {
  slots_booked[slotDate] = []
  slots_booked[slotDate].push(slotTime)
}

const userData = await userModel.findById(userId).select('-password')


delete docData.slots_booked

const appointmentData = {
  userId,
  docId,
  userData,
  docData,
  amount: docData.fees,
  slotTime,
  slotDate,
  date: Date.now()

}

const newAppointment = new appointmentModel(appointmentData)
   await newAppointment.save()

   //save new slot Data in docData

   await doctorModel.findByIdAndUpdate(docId,{slots_booked})

   res.json({
    success:true,
    message:"Appointment Booked"
   })

  } catch(error){
        console.log(error)
        res.json({
            success: false,
            message: error.message
        })
    }
   }

   export const listAppointment = async (req,res)=>{
    try{
const {userId} = req.user;

const appointments = await appointmentModel.find({userId})


res.json({
  success:true,
  appointments
})
    }catch(error){
      
      console.log(error)
      res.json({
          success: false,
          message: error.message
      })
    }
   } 

export const cancelAppointment = async (req,res)=>{

  try {
//retrieve from authuser
    const {userId}= req.user;
    const {appointmentId} = req.body

    const appointmentData = await appointmentModel.findById(appointmentId)

    //verify appointment user 
    if(appointmentData.userId !== userId){
return res.json({
  success: false,
  message: "Unauthorized action"
})
    }

    await appointmentModel.findByIdAndUpdate(appointmentId, {cancelled: true})


    //releasing doctor slot

    const {docId, slotDate,slotTime} = appointmentData

    const doctorData = await  doctorModel.findById(docId)

    let slots_booked = doctorData.slots_booked

    slots_booked[slotDate] = slots_booked[slotDate].filter( e => e !== slotTime)

    await doctorModel.findByIdAndUpdate(docId, {slots_booked})

    res.json({
      success: true,
      message: "Appointment Cancelled"
    })

  }catch(error){
    console.log(error)
    res.json({
      success: false,
      message: error.message
    })
  }
}