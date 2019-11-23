const config = require("../config.json");
const mongoose = require("mongoose");

// mongoose.set('useNewUrlParser', true);
// mongoose.set('useFindAndModify', false);
// mongoose.set('useCreateIndex', true);
// mongoose.set('useUnifiedTopology', true);
mongoose.connect(process.env.MONGODB_URI || config.connectionString, { useCreateIndex: true, 
                                            useNewUrlParser: true, 
                                            useFindAndModify: false, 
                                            useUnifiedTopology: true});
mongoose.Promise = global.Promise;



module.exports = {
    user: require("../users/user.model"),
    course: require("../course/course.model")
};
