const mongoose = require('mongoose');

const studentSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    student_registration_no: { type: String, required: true},
    institution_code: { type: String, required: true},
    student_name: { type: String, required: true},
    academic_year: { type: String, required: true},
    degree_type_id: { type: String, required: true},
    degree_id: { type: String, required: true},
    discipline_id: { type: String, required: true},
    semester_id: { type: String, required: true},
    marksheet_pdf: { type: String, required: true},
    marksheet_hash: { type: String, required: true}
  

});

module.exports = mongoose.model('Student', studentSchema);