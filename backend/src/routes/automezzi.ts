import { Router } from 'express'
import pool from '../db.js'
import { automezzoSchema } from '../schemas/automezzo.js'

const router = Router()

router.get('/', async (req, res) => {
    try {
        const result = await pool.execute(`SELECT
        a.id,
        a.codice,
        a.targa,
        a.marca,
        a.modello,
        a.filiale_id,
        f.codice AS filiale_codice,
        f.citta AS filiale_citta
      FROM automezzo a
      INNER JOIN filiale f ON f.id = a.filiale_id
      ORDER BY a.codice`)

        return res.json(result[0])
    } catch (err) {
        console.error(err)
        return res.status(500).json({ error: 'error' })
    }
})

router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        if (!id || +id <= 0) {
            return res.status(400).json({ error: 'id non valido' })
        }

        const automezzoRow = await pool.execute(`SELECT
        a.id,
        a.codice,
        a.targa,
        a.marca,
        a.modello,
        a.filiale_id,
        f.codice AS filiale_codice,
        f.indirizzo AS filiale_indirizzo,
        f.citta AS filiale_citta,
        f.cap AS filiale_cap
      FROM automezzo a
      INNER JOIN filiale f ON f.id = a.filiale_id
      WHERE a.id = ?`, [id])

        const automezziRes = automezzoRow as any[]

        if (automezziRes.length === 0) {
            return res.status(404).json({ error: 'automezzo non trovato' })
        }

        const result = automezziRes[0]

        return res.json(result[0])
    } catch (err) {
        console.error(err)
        return res.status(500).json({ error: 'error' })
    }
})

router.post('/', async (req, res) => {
    const body = automezzoSchema.safeParse(req.body)

    if (body.error) {
        return res.status(400).json({
            error: 'dati non validi',
            details: body.error
        })
    }

    const { codice, targa, marca, modello, filiale_id } = body.data

    try {
        const automezzoRes = await pool.execute(
            'INSERT INTO automezzo (codice, targa, marca, modello, filiale_id) VALUES (?, ?, ?, ?, ?)',
            [codice, targa, marca, modello, filiale_id]
        )

        const automezzo = automezzoRes[0] as any

        return res.status(201).json({ id: automezzo.insertId, codice, targa, marca, modello, filiale_id })

    } catch (err: any) {
        console.error(err)
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: `codice ${codice} o targa ${targa} già esistenti, impossibile procedere con il salvataggio di questo automezzo` })
        }
        if (err.code === 'ER_NO_REFERENCED_ROW_2') {
            return res.status(400).json({ error: `id filiale ${filiale_id} non valido: non esiste una filiale con questo id` })
        }
        return res.status(500).json({ error: 'error' })
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        if (!id || +id <= 0) {
            return res.status(400).json({ error: 'id non valido' })
        }

        const automezzoRes = await pool.execute(
            'DELETE FROM automezzo WHERE id = ?',
            [id]
        )

        const automezzo = automezzoRes[0] as any

        if (automezzo.affectedRows === 0) {
            return res.status(404).json({ error: 'non è stato trovato un automezzo con questo id' })
        }

        return res.status(204).send()
    } catch (err) {
        console.error(err)
        return res.status(500).json({ error: 'error' })
    }
})

router.post('/upload', async (req, res) => {
    const email = process.env.EDOO_EMAIL
    if (!email) {
        throw new Error('EDOO_EMAIL non è definita nelle variabili env')
    }

    try {
        const data = await pool.execute(`SELECT
        a.codice,
        a.targa,
        a.marca,
        a.modello
      FROM automezzo a
      INNER JOIN filiale f ON f.id = a.filiale_id
      ORDER BY a.codice`)

        const url = `https://edoo.poweringsrl.it/exercises/Automezzo/upload.json`

        console.log(data[0])

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, data: data[0] }),
        })

        const edooRes = await response.json();
        const edooMessageRes = edooRes['message'];

        return res.status(200).json({ edooMessageRes })

    } catch (err: any) {
        console.error(err)
        return res.status(500).json({ error: 'error' })
    }
})

export default router