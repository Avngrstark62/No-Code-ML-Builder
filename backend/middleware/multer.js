import multer from 'multer';

// Set up storage engine for Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Destination folder
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // File name
  },
});

// Create the multer instance and configure it for single file uploads
const upload = multer({ storage: storage });

export default upload;