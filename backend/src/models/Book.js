const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    bookName: {
        type: String
    },
    bookType: {
        type: String
    },
    author: {
        type: String
    },
    book: {
        type: Object
    }
})

module.exports = {BookEntity: mongoose.model('Book', UserSchema)};