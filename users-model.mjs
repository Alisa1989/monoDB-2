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
//  by ID
const findById = async (_id) => {
    const query = User.findById(_id);
    return query.exec();
}
//  by Filter
const findUsers = async (filter) => {
    const query = User.find(filter)
        .select('name age email phoneNumber _id')   
    return query.exec()
}

//  UPDATE models------------------------
const updateUser = async (filter, update) => {
    const result = await User.updateOne(filter, update);
    return result.modifiedCount
}

//  DELETE models------------------------
//  by ID
const deleteById = async (_id) => {
    const result = await User.deleteOne({_id: _id});
    return result.deletedCount;
}

//  by Filter
const deleteByProperty = async (filter) => {
    const result = await User.deleteMany(filter);
    return result.deletedCount;
}

export {createUser, findUsers, findById, updateUser, deleteById, deleteByProperty}