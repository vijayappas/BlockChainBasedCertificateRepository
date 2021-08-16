const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Detail = require('../models/detail');
const Student = require('../models/student');


// Handle incoming GET requests to /details
router.get('/', (req, res, next) => {
    Detail.find()
    .select('student medium_of_instruction batch _id')
    .populate('student',)
    .exec()
    .then(docs => {
        res.status(200).json({
            count: docs.length,
            detail: docs.map(doc => {
                return {
                    _id: doc._id,
                    student: doc.student,
                    medium_of_instruction: doc.medium_of_instruction,
                    batch: doc.batch,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/details/' + doc._id
                    }
                }
            })
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
     
    });
});

router.post('/', (req, res, next) => {
    Student.findById(req.body.studentId)
         .then(student => {
             if (!student) {
                 return res.status(404).json({
                     message: "Student not found"
                 });
             }
            const detail = new Detail({
                _id: mongoose.Types.ObjectId(),
                medium_of_instruction: req.body.medium_of_instruction,
                student: req.body.studentId  
            });
            return detail
            .save(); 
         })
         .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Deatil stored',
                createdDetail: {
                    _id: result._id,
                    student: result.student,
                    medium_of_instruction: result.medium_of_instruction,
                    batch: result.batch
            },
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/details/' + result._id
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

router.get('/:detailId', (req, res, next) => {
   Detail.findById(req.params.detailId)
   .exec()
   .then(detail => {
       if (!detail) {
           return res.status(404).json({
              message: 'Detail not found'
            }); 
        }
        res.status(200).json({
           detail: detail,
           request: {
               type: 'GET',
               url: 'http://localhost:3000/details'

           }

       });
   })
   .catch(err => {
       res.status(500).json({
           error: err
       });
   });
});

router.delete('/:detailId', (req, res, next) => {
    Detail.remove({ _id: req.params.detailId })
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'Detail was deleted',
            request: {
                type: 'POST',
                url: 'http://localhost:3000/details',
                body: {  studentId: 'ID', medium_of_instruction: 'String',batch: 'String' }
    }
});
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
});

module.exports = router;