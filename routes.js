const express = require('express');
const router = express.Router();

const { body, header, validationResult } = require('express-validator');
// const ipInt = require('ip-to-int');
const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

const { Option, Poll } = require('./Models/Poll');
const { verifyToken } = require('./config');

const Voter = require('./Models/Voter');


//
// UPDATE VOTE ROUTE TO CHECK IP'S
//

router.post('/newpoll',
    body('subject').isString().notEmpty().escape().trim(),
    body('author').isString().notEmpty().escape().trim().toUpperCase(),
    body('password').isString().notEmpty(),
    body('format').isString().optional().isIn(['default','bar','pie','radar']),
    body('options').isArray({ min:2 }),
    body('options.*.description').isString().notEmpty().trim(),
    async (req,res) => {
      const errors = validationResult(req);
      if(!errors.isEmpty()){
        return res.status(400).json({error: errors.array()});
      }

      const pollBody = req.body;
      pollBody.password = await bcrypt.hash(req.body.password, 10);

      const dbPoll = new Poll(pollBody);
      dbPoll.save()
        .then((poll)=>{
          return res.status(200).json({ poll: poll })
        })
        .catch((err)=>{
          return res.status(400).json({ err: err })
        });
  }
)
router.get('/:id',
  async (req,res) => {
      const poll = await Poll.findById(req.params.id, {password:0}).populate('options');
      return res.status(200).json({poll:poll})
  }
)
router.put('/:id',
  header('x-access-token').isJWT().withMessage('Unauthorized Access'),
  verifyToken,
  body('format').isString().notEmpty().isIn(['default','bar','pie','radar']),
  (req,res) => {
    Poll.findByIdAndUpdate(req.params.id,{
      '$set' : { 'format' : req.body.format }
    }, {new: true}).then((poll) => {
      return res.status(200).json({poll: poll})
    }).catch((err) => {
      return res.status(400).json({err: err})
    })
  }
)
router.post('/:id/login',
  (req,res) => {
    Poll.findById(req.params.id, (err,poll) => {
      if(err) return res.status(400).json({error: err,location:'findBy'})
      bcrypt.compare(req.body.password, poll.password)
        .then(() => {
          const payload = { isLoggedIn: true }
          jwt.sign(
            payload,
            process.env.JWT_SECRET,
            {expiresIn:86400},
            (err,token) => {
              if(err) return res.status(400).json({error: err,location:'jwt'})
              return res.status(200).json({
                token: token,
                exp: 86400
              })
            }
          )
        })
        .catch((err) => {
          return res.status(400).json({error: err,location:'bcrypt'})
        })
    })
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

module.exports = router;
