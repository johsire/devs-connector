const mongoose = require('mongoose');

// Create Profile Schema- obj w/ all fields we need
const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    // we make reference to the user model since each profile is related to a user
    ref: 'user'
  },
});

module.exports = Profile = mongoose.model('profile', ProfileSchema);
