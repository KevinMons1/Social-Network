const multer = require("multer")
const path = require("path")

// Upload video in folder Videos
let storageVideo = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, "../Videos"))
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-video-${file.originalname}`)
    }
  })
  
let uploadVideo = multer({storage: storageVideo})

module.exports = uploadVideo