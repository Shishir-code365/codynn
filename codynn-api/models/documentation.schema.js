const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2')
const documentationSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    content:{
        type: [String],
        required: true  
    },
    popularity:{
        type: Number,
        default: 0,
        required: true
    }
},{
    timestamps: true
});

documentationSchema.plugin(mongoosePaginate)
const documentationModel = mongoose.model('documentation',documentationSchema)
module.exports = documentationModel;