// connect with database
const mongoose = require('mongoose');
async function connect() {
    try {
        await mongoose.connect('mongodb://localhost:27017/wpr-quiz', {
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
            // useCreateIndex: true,
        });
        console.log("Access Database Success!");
    } catch (error) {
        console.log("Access FAIL!");
    }
}
module.exports = { connect };   