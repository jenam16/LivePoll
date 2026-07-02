import mongoose from 'mongoose';


const optionsSchema = mongoose.Schema({
    text:{
        type:String,
        required:true
    },
    votes:{
        type:Number,
        default:0
    }
})

const pollSchema = mongoose.Schema({
    question:{
        type:String,
        required:true
    },
    options:{
        type:[optionsSchema],
        validate:{
            validator: (v) => v.length>=2 && v.length<=6,
            message: "Options must be between 2 and 6"
        }
    },
    totalVotes:{
        type:Number,
        default:0
    },
    createdAt:{
        type:Date,
        default:Date.now
    }

})

export default mongoose.model('Poll',pollSchema);