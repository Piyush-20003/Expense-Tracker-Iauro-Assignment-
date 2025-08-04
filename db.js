const mysql = require('mysql2')

const db = mysql.createConnection({

    host : 'localhost',
    database:'myapp',
    user: 'root',
    password: 'Win11-mysql'
})
db.connect(err=>{
    if(err) {
        console.log(err)
    }
    console.log('MySQL connected')
})

module.exports = db