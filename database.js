const mongoose = require('mongoose');
let password = 'dLT9ZzbsxXLpihFI';
let databaseName = 'db';
if (process.env.NODE_ENV === 'test') {
    databaseName = 'testdb';
}

mongoose.connect(`mongodb+srv://admin:${password}@cluster0.4qout.mongodb.net/${databaseName}?retryWrites=true&w=majority`, 
    {useNewUrlParser: true, useUnifiedTopology: true});