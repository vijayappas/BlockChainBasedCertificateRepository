const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Student = require('../models/student');


router.get('/', (req, res, next) => {
    Student.find()
    .select('student_registration_no institution_code student_name  academic_year degree_type_id degree_id discipline_id semester_id marksheet_pdf marksheet_hash')
    .exec()
    .then(docs => {
        const response = {
            count: docs.length,
            students: docs.map(doc => {
                return {
                student_registration_no: doc.student_registration_no,
                institution_code: doc.institution_code,
                student_name: doc.student_name,
                academic_year: doc.academic_year,
                degree_type_id: doc.degree_type_id,
                degree_id: doc.degree_id,
                discipline_id: doc.discipline_id,
                semester_id: doc.semester_id,
                marksheet_pdf: doc.marksheet_pdf,
                marksheet_hash: doc.marksheet_hash,
                _id: doc._id,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/students/' + doc._id

                    }
                }
            })
        };
        
     //   if (docs.length >= 0) {
            res.status(200).json(response);
     //   } else {
     //       res.status(404).json({
     //           message: 'No entries found'
     //       })
     //   }
        
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

router.post('/', (req, res, next) => {
    const student = new Student({
        _id: new mongoose.Types.ObjectId(),
        student_registration_no: req.body.student_registration_no,
        institution_code: req.body.institution_code,
        student_name: req.body.student_name,
        academic_year: req.body.academic_year,
        degree_type_id: req.body.degree_type_id,
        degree_id: req.body.degree_id,
        discipline_id: req.body.discipline_id,
        semester_id: req.body.semester_id,
        marksheet_pdf: req.body.marksheet_pdf,
        marksheet_hash: req.body.marksheet_hash

    });
    student
    .save()
    .then(result => {
        console.log(result);
        res.status(201).json({
            message: 'Created student details successfully',
            createdStudent: {
                student_registration_no: result.student_registration_no,
                institution_code: result.institution_code,
                student_name: result.student_name,
                academic_year: result.academic_year,
                degree_type_id: result.degree_type_id,
                degree_id: result.degree_id,
                discipline_id: result.discipline_id,
                semester_id: result.semester_id,
                marksheet_pdf: result.marksheet_pdf,
                marksheet_hash: result.marksheet_hash,
                _id: result._id,
                request: {
                    type: "GET",
                    url: 'http://localhost:3000/students/' + result._id
                }
            } 
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
        
    });

router.get("/:studentId", (req, res, next) => {
    const id = req.params.studentId;
   Student.findById(id)
   .select('student_registration_no institution_code student_name academic_year degree_type_id degree_id discipline_id semester_id marksheet_pdf marksheet_hash')
   .exec()
   .then(doc => {
       console.log("From database", doc);
       if (doc) {
        res.status(200).json({
            student: doc,
            request: {
                type: 'GET',
                url: 'http://localhost:3000/students'
            }
        });
       } else {
           res.status(404).json({message: 'No valid entry found for provoided ID'});

    }
      })

   .catch(err => {
       console.log(err);
       res.status(500).json({error: err});
   
   });
});



router.patch('/:studentId', (req, res, next) => {
    const id = req.params.studentId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Student.update({_id: id }, { $set: updateOps })
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'Student details Updated',
            request: {
                type: 'GET',
                url: 'http://localhost:3000/students/' + id
            }
        });
        })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

router.delete('/:studentId', (req, res, next) => {
   const id = req.params.studentId;
   Student.remove({_id: id })
   .exec()
   .then(result => {
       res.status(200).json({
       message: 'Student details Deleted',
       request: {
           type: 'POST',
           url: 'http://localhost:3000/students',
           body: { student_registration_no: 'String', institution_code: 'String', student_name: 'String', academic_year: 'String', degree_type_id: 'String', degree_id: 'String', discipline_id: 'String', semester_id: 'String', marksheet_pdf: 'String', marksheet_hash: 'String' }
          }
       });
   })
   .catch(err => {
       console.log(err);
       res.status(500).json({
           error: err
       });
   });

});

module.exports = router;