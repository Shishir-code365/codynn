const { default: mongoose } = require("mongoose");

const jobSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
},{timestamps: true});
module.exports = mongoose.model('JobRole', jobSchema)
