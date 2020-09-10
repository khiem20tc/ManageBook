var multer = require('multer');
const path = require('path')
var storage_ = multer.diskStorage({
    destination: (req, file, cb) => {

        cb(null, './src/public/uploads/book');

    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
})

var uploadBook = multer({
    storage: storage_,
    limits: { fileSize: 1000000 },
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
});

// Check File Type
function checkFileType(file, cb) {
    // Allowed ext
    const filetypes = /pdf|doc|docx|ppt|pptx|txt/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Document Only!');
    }
}

module.exports = {
    uploadBook
}