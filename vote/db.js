const sqlite = require('sqlite')
const dbPromise = sqlite.open(__dirname + '/db/vote-site.sqlite3')

module.exports = dbPromise