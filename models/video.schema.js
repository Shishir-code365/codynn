const { default: mongoose } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const levels = ["beginner", "advance", "intermediate"];

const VideoSchema = new mongoose.Schema({
    image:{
        type: String,
    },
    duration:{
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    level: {
        type: String,
        enum: levels,
        required: true,
    },
    language: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Language',
        required: true,
    },
    url: {
        type: String,
        required: true//url for video
    }
},{
    timestamps: true
});

VideoSchema.plugin(mongoosePaginate);

const VideoModel = mongoose.model('video', VideoSchema);
module.exports = VideoModel;
