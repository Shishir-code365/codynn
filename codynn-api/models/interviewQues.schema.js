const mongoose = require('mongoose');
const mongoosePaginate  = require('mongoose-paginate-v2');
const level = ['Internship', 'Junior Level', 'Mid Level', 'Senior Level'];
const interviewQuesSchema = new mongoose.Schema({
    question:{
        type: String,
        required: true
    },
    answer: {
        type: String,
        required: true
    },
    jobRole:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'JobRole',
        required: true
    },

    level:{
        type: String,
        enum: level,
        required: true
    }
},{
    timestamps: true
});
interviewQuesSchema.plugin(mongoosePaginate);

const interviewQuesModel = mongoose.model('InterviewQuestion', interviewQuesSchema);
module.exports = interviewQuesModel