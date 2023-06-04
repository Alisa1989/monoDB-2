import 'dotenv/config';
import express from 'express';
import asyncHandler from 'express-async-handler';
import * as users from './users-model.mjs'; 

const app = express();

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});

// CREATE controller--------------------
app.get('/create', asyncHandler(async (req,res) => {
    const user = await users.createUser(
        req.query.name,
        req.query.age,
        req.query.email,
        req.query.phoneNumber
    )
    res.send(user)
}));

// RETRIEVE controller--------------------
function userFilter(req) {
    let filter = {};
    if (req.query._id !== undefined) {
        filter._id = req.query._id;
    } if (req.query.name !== undefined) {
         filter.name = req.query.name;
    } if (req.query.age !== undefined) {
         filter.age = req.query.age;
    } if (req.query.email !== undefined) {
        filter.email = req.query.email; 
    } if (req.query.phoneNumber !== undefined) {
        filter.phoneNumber = req.query.phoneNumber; 
    }
    return filter;
}

app.get('/retrieve', asyncHandler(async (req, res) => {
    const filter = userFilter(req);
    const result = await users.findUsers(filter)
    res.send(result);
}))


// UPDATE controller--------------------
// DELETE controller--------------------