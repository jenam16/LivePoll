import dotenv from 'dotenv';
import expres from 'express';
import cors from 'cors';
import connectDB from "./db/db.js";
import http from 'http';
import { Server }from 'socket.io';
import express from 'express';
import pollsRoutes from './routes/poll.js';
import poll from './models/poll.js';


dotenv.config()
// Connect to MongoDB
connectDB()

const app = express();
const httpServer = http.createServer(app);


// Socket CORS
const io = new Server(httpServer,{
    cors:{
        origin: 'http://Localhost:3000',
        methods:['GET','POST']
    },
}); 


// MiddleWares
app.use(express.json());
app.use('/api/polls',pollsRoutes)
app.get('/',(req,res)=>{
    res.send(`server is running on port ${PORT}`) 
}
)

io.on('connection',(socket)=>{
    console.log(`client connected: ${socket.id}`)

    // join a poll room
    socket.on('joinPoll',(pollId)=>{
        socket.join(pollId);
        console.log(`Socket ${socket.id} joined poll ${pollId}`)
    })
    // Handle Poll Submission 
    socket.on('submitVote',async({pollId,optionIndex})=>{
        try{
         const poll = await poll.findById(pollId);
            if(!poll) return;
            if(optionIndex<0 || optionIndex>=poll.options.length) return ;
            poll.options[optionsIndex].votes += 1;
            poll.totalVotes += 1;
            await poll.save();

            // Broadcast
            io.to(pollId).emit('voteUpdate',poll);
        }
        catch(error){
            console.log("Vote error by socket")
        }
    })


    // Exit POll Room
    socket.on('discoonect',()=>{
        console.log(`client disconnected: ${socket.id}`)
    })
})

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})
