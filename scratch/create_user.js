const mongoose = require('mongoose');
const User = require('../models/user');

mongoose.connect('mongodb://127.0.0.1:27017/Campground-data')
    .then(() => console.log("Connected to Database for user creation"))
    .catch(err => console.log(err));

const createUser = async () => {
    try {
        const user = new User({ email: 'test@example.com', username: 'testuser' });
        const registeredUser = await User.register(user, 'password');
        console.log("User created successfully:");
        console.log("ID:", registeredUser._id);
        console.log("Username: testuser");
        console.log("Password: password");
    } catch (e) {
        console.log("Error creating user (maybe it already exists?):", e.message);
    } finally {
        mongoose.connection.close();
    }
}

createUser();
