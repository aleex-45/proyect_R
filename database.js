const mongoose = require('mongoose');
let password = 'xpcx5dvz97CtfPaf';
let databaseName = 'db';
if (process.env.NODE_ENV === 'test') {
    databaseName = 'testdb';
}

mongoose.connect(`mongodb+srv://admin:${password}@cluster0.4qout.mongodb.net/${databaseName}?retryWrites=true&w=majority`, 
    {useNewUrlParser: true, useUnifiedTopology: true});