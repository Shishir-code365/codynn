const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const repositorySchema = new mongoose.Schema({
   title:{
    type: String,
    required: true
   },
   language:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Language',
    required: true
   },
   noOfLessons:{
    type: Number,
    required: true
   }
},
{
    timestamps: true
});
repositorySchema.plugin(mongoosePaginate);
const repoModel = mongoose.model('Repository', repositorySchema);

module.exports = repoModel;