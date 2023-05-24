const mongoose=require('mongoose');

const { Schema } = mongoose;

const NotesSchema = new Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    title: {
        type:String,
        require:true
    }, // String is shorthand for {type: String}
    description:{
        type: String,
        require:true,
    },
    tag:{
        type: String,
        default:"general"
    },
    date:{
        type: Date,
        default: Date.now
    }


  });

  const Notes=mongoose.model('note',NotesSchema);
  module.exports=Notes;