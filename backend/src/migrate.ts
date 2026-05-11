import 'dotenv/config'
import { readFileSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import pool from './db.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const migrationsDir = join(__dirname, '..', 'migrations')

async function runMigrations() {
    const files = readdirSync(migrationsDir)
        .filter(file => file.endsWith('.sql'))
        .sort()

    console.log(`Trovati ${files.length} file da migrare`)

    for (const file of files) {
        console.log(`${file} avviato`)
        const sql = readFileSync(join(migrationsDir, file), 'utf-8')

        await pool.query(sql)
        console.log(`ok: ${file}`)
    }

    await pool.end()
    console.log('tutte le migrazioni sono andate a buon fine')
}

runMigrations().catch(err => {
    console.error('Migrazione file fallita:', err)
    process.exit(1)
})