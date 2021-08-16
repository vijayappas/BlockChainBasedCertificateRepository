const mongoose = require('mongoose');

const detailSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true }, 

    medium_of_instruction: { type: String, default: 1 },
    batch: { type: String, default: 1 }


});

module.exports = mongoose.model('Detail', detailSchema);