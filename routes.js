const express = require('express');
const router = express.Router();
const ipInt = require('ip-to-int');

const { Option, Poll } = require('./Models/Poll')
const Voter = require('./Models/Voter');

const { body, check, validationResult } = require('express-validator');

//
// UPDATE VOTE ROUTE TO CHECK IP'S
//
// VALIDATION TO DO - ALL

router.post('/newpoll',
  (req,res) => {
    const dbPoll = new Poll(req.body);
    dbPoll.save()
      .then((poll)=>{
        res.status(200).json({ poll: poll })
      })
      .catch((err)=>{
        res.status(400).json({ err: err })
      });
  }
)
router.get('/:id',
  async (req,res) => {
      const poll = await Poll.findById(req.params.id, {password:0}).populate('options');
      res.json({poll:poll})
  }
)
router.patch('/:id/:option',
  async (req,res) => {
    // const ipAddress = ipInt(req.ip).toInt();
    // const alreadyVoted = await Voter.find({poll: req.params.id,ipAddress: ipAddress}).exec();
    // if(alreadyVoted.length) {
    //   return res.status(400).json({message: 'Already Voted'})
    // }
    Poll.findOneAndUpdate(
        {
          '_id': req.params.id,
          'options': { '$elemMatch': { 'description': req.params.option } }
        },{
          '$inc': {
            'options.$.votes': 1
          }
        },
        { new: true }
      ).then((poll) => {
        // const voter = new Voter({ poll: req.params.id, ipAddress: ipAddress })
        // voter.save()
        //   .catch((err)=>{
        //     res.status(400).json({ err: err })
        //   });
        return res.status(200).json({poll:poll});
      })
  }
)
router.put('/:id', (req,res) => {
  Poll.findByIdAndUpdate(req.params.id,{
    '$set' : { 'format' : req.body.format }
  }, {new: true}).then((poll) => {
    res.status(200).json({poll: poll})
  }).catch((err) => {
    res.status(400).json({err: err})
  })
})

module.exports = router;
