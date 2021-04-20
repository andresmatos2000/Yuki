const express = require("express");
const mongoose = require('mongoose');
const users = require("./users.js");
const moment = require('moment')

const router = express.Router();

// This is the schema. Users have usernames and passwords. We solemnly promise to
// salt and hash the password!
const timeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User"
    },
    clockIn: Object,
    clockOut: Object,
    total: String
});

const validUser = users.valid;

const Time = mongoose.model('Time', timeSchema);

router.get('/', validUser, async (req, res) => {
    let time = [];
    try {
        if (req.user.role === "admin") {
            time = await Time.find().sort({
                created: -1
            });
        } else {
            time = await Time.find({
                user: req.user
            }).sort({
                created: -1
            });
        }
        return res.send({
            time: time
        });
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});
// create a time
router.post('/', validUser, async (req, res) => {
    if (req.body.activeUser == null)
        return;
    //console.log(req)
    const time = new Time({
        user: req.body.activeUser._id,
        clockIn: req.body.clockIn,
        clockOut: null
    }).populate('user');
    try {
        let test = await Time.find({
            user: req.body.activeUser._id,
            clockOut: null
        });
        console.log(test);
        if (test.length > 0)
            return res.sendStatus(304);
        await time.save();
        return res.send({
            time: time
        });
    } catch (error) {
        return res.sendStatus(500);
    }
});
//get clocked in Users
router.get('/clocked-in', validUser, async (req, res) => {
    try {
        time = await Time.find({
            clockOut: null
        }).populate('user');
        res.send({
            time: time
        })
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

//get all times

router.get('/all-finished', validUser, async (req, res) => {
    try {
        time = await Time.find({
            clockOut: { "$ne": null },
        }).populate('user');
        res.send({
            time: time
        })
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});



// edit a time -- only edits status and response
router.put('/:id', validUser, async (req, res) => {
    //console.log(req);

    time = await Time.findOne({
        user: req.params.id,
        clockOut: null
    });
    if(time){
        // can only do this if an administrator
        try {
            time = await Time.findOne({
                user: req.params.id,
                clockOut: null
            });
            //console.log(time);
            time.clockOut = req.body.clockOut;
            let now = moment(time.clockIn);
            let then = moment(time.clockOut);
            time.total = moment.duration(then.diff(now)).humanize();
            await time.save();
            return res.send({
                time: time
            });
        } catch (error) {
            console.log(error);
            return res.sendStatus(500);
        }
    };
    try {
        time = await Time.findOne({
            _id: req.params.id
        });
        time.clockIn = req.body.timeIn;
        time.clockOut = req.body.timeOut;
        total = moment.duration(moment(time.clockOut).diff(moment(time.clockIn)));
        if(total._milliseconds < 0){
            return res.status(500).send(
              "Can't give negative time!"
            );
        }
        time.total = total.humanize();
        //console.log(time);
        time.save();
        res.sendStatus(200);
        } catch (error) {
        console.log(error);
        res.sendStatus(500);
        }

});

// router.put('/:id', validUser, async (req, res) => {
//     //console.log(req);
//     // can only do this if an administrator
//     try {
//         time = await Time.findOne({
//           _id: req.params.id
//         });
//         time.clockIn = req.body.timeIn;
//         time.clockOut = req.body.timeOut;
//         console.log(time);
//         time.save();
//         res.sendStatus(200);
//       } catch (error) {
//         console.log(error);
//         res.sendStatus(500);
//       }
// });

//Delete single time
router.delete('/:id', async (req, res) => {
    console.log(req);
    try {
      await Time.deleteOne({
        _id: req.params.id
      });
      res.sendStatus(200);
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
});

//Delete all times from user for account deletion
router.delete('/all/:id', async (req, res) => {
    try {
        await Time.deleteMany({
            user: {_id: req.params.id}
          });
          res.sendStatus(200);
    } catch(error){
        res.sendStatus(500);
    }

})


module.exports = {
    routes: router,
    model: Time,
    valid: validUser
}