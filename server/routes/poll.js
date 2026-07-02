import express from 'express';
const router = express.Router();
import Poll from '../models/poll.js';


// GET/api/polls - get all polls (new first)


router.get('/', async (req, res) => {
try{
const polls = await Poll.find().sort({createdAt:-1});
res.json(polls)
}
catch(error){
res.status(500).json({message:error.message})
}
}
)

// POST/api/polls - create a new poll

router.post('/', async (req, res) => {
try{
const {question, options} = req.body;
if(!question || !options || options.length<2 || options.length>6){
    return res.status(400).json({message:"Invalid poll data"})
}
const formattedOptions = options.map(option => ({text:option.text, votes:0}));
const poll = new Poll({question, options:formattedOptions});

await poll.save();
res.status(201).json(poll);
}
catch(error){
res.status(500).json({message:error.message})
}
}
)

// GET/api/polls/:id - get a single poll

router.get('/:Id', async (req, res) => {
try{
const poll = await Poll.findById(req.params.Id);
if(!poll) return res.status(404).json({message:"Poll not found"});
res.json(poll)
}
catch(error){
res.status(500).json({message:"server error while getting single poll",error:error.message})
}
}
)

// POST/api/polls/:id/vote - vote for an option in a poll

router.post('/:Id/vote', async (req, res) => {
try{
const {optionsIndex} = req.body;
const poll = await Poll.findById(req.params.Id);
if(!poll) return res.status(404).json({message:"Poll not found"});

if(optionsIndex<0 || optionsIndex>=poll.options.length){
    return res.status(400).json({message:"Invalid option index"});
}
poll.options[optionsIndex].votes += 1;
poll.totalVotes += 1;
await poll.save();
res.status(200).json({message:"Vote recorded successfully",poll})
}

catch(error){
res.status(500).json({message:"server error while voting",error:error.message})
}
}
)

export default router;