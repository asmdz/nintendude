const DB_URL = 'localhost:27017/nintendude';

var monk = require('monk');
var db = monk(DB_URL);
