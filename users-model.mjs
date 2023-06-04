import mongoose from 'mongoose';
import 'dotenv/config';

mongoose.connect(
    process.env.MONGODB_CONNECT_STRING,
    { useNewUrlParser: true }
);

const db = mongoose.connection;

db.once("open", () => {
    console.log("Successfully connected to MongoDB using Mongoose!");
});

//  Collection Schema
const userSchema = mongoose.Schema({
    name: { type: String, required: true},
    age: { type: Number, required: true},
    email: { type: String, required: true},
    phoneNumber: { type: String, required: false}
});

const User = mongoose.model("User", userSchema)

// CREATE models---------------------------
const createUser = async (name, age, email, phoneNumber) => {
    const user = new User({
        name: name,
        age: age,
        email: email,
        phoneNumber: phoneNumber
    });
    return user.save()
}

//  RETRIEVE models-----------------------
//  by Filter
const findUsers = async (filter) => {
    const query = User.find(filter)
    return query.exec()
}
//  by ID
const findById = async (_id) => {
    const query = User.findById(_id);
    return query.exec();
}

//  UPDATE models------------------------
//  DELETE models------------------------

export {createUser, findUsers, findById}