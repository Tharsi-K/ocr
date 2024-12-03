import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        default: 'https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg'
    },
    role: {
        type: String,
        enum: ["Admin", "User"],  // Only "Admin" or "User" can be set
        default: "User"  // Default role will be "User"
    }
}, { timestamps: true});

const User = mongoose.model('User', userSchema);

export default User;