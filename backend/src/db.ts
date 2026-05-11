import mysql from 'mysql2/promise'

const databaseUrl = process.env.DATABASE_URL
if (!databaseUrl) {
    throw new Error('DATABASE_URL non è definito nelle variabili env')
}

const pool = mysql.createPool({
    uri: databaseUrl,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    multipleStatements: true, //per eseguire più statement SQL
})

export default pool