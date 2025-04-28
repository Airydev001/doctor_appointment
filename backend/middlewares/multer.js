// import multer from 'multer'


// const storage = multer.diskStorage({
//     filename: function(req,file,callback){
//         callback(null,file,callback)
//     }
// })

// const upload = multer({
//     storage
// })

// export default upload;


import multer from 'multer'
import path from 'path'

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/') // You can change this to your desired upload directory
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        const ext = path.extname(file.originalname)
        cb(null, file.fieldname + '-' + uniqueSuffix + ext)
    }
})

const upload = multer({ storage })

export default upload
