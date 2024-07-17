const mongoose = require('mongoose');
const foreign_key = mongoose.Schema.Types.ObjectId;
const requiredString = { type: String, required: true };

const languagesSchema = new mongoose.Schema({
    languageType: { type: String, required: true },
    languageExtension: String,
    appIcon: requiredString,
    applicationName: requiredString,
    appStoreLink: String,
    bannerImage: String,
    description: [requiredString],
    playstoreLink: String,
    images: [requiredString],
    qrImage: String,
    features: [
        {
            featureTitle: requiredString,
            featureDescription: requiredString,
        },
    ],
});

module.exports = mongoose.model('Language', languagesSchema);