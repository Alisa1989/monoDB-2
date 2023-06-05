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
// helper function
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
app.get('/update', (req, res) => {
    users.findById(req.query._id)
        .then(user => {
            if (user !== null) {
                const update = {}
                if (req.query.name !== undefined) {
                    update.name = req.query.name;
                }
                if (req.query.age !== undefined) {
                    update.age = req.query.age;
                }
                if (req.query.email !== undefined) {
                    update.email = req.query.email;
                }
                if (req.query.phoneNumber !== undefined) {
                    update.phoneNumber = req.query.phoneNumber;
                }
                users.updateUser({ _id: req.query._id}, update)
                    .then(updateCount => {
                        res.send({ updateCount: updateCount});
                    })
                    .catch(error => {
                        console.error(error);
                        res.send({ Error: 'There was a document while updating the document'});
                    });
            } else {
                res.send({ Error: 'The document was not found, check your request.'})
            }
        })
        .catch(error => {
            console.error(error);
            res.json({ Error: error });
        });
});

// DELETE controller--------------------
// helper functions
function deleteByProperty(req, res) {
    const filters = userFilter(req);
    users.deleteByProperty(filters)
    .then(deletedCount => {
        res.send({ deletedCount: deletedCount });
    })
    .catch(error => {
        console.error(error);
        res.send({ error: 'Request failed' });
    });
}

function deleteById(req, res) {
    users.deleteById(req.query._id)
    .then(deletedCount => {
        res.send({ deletedCount: deletedCount });
    })
    .catch(error => {
        console.error(error);
        res.send({ error: 'Request failed' });
    });
}
//  by ID or property
app.get('/delete', (req, res) => {
    if (req.query._id !== undefined) {
        deleteById(req, res);
    } else {
        deleteByProperty(req, res);
    }
});
