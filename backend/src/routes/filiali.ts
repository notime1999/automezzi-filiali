import { Router } from 'express'
import pool from '../db.js'
import { filialeSchema } from '../schemas/filiale.js'

const router = Router()

router.get('/', async (req, res) => {
    try {
        const result = await pool.execute(
            'SELECT id, codice, indirizzo, citta, cap FROM filiale ORDER BY codice'
        )
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

        const filialeRows = await pool.execute(
            'SELECT id, codice, indirizzo, citta, cap FROM filiale WHERE id = ?',
            [id]
        )

        const filialeRes = filialeRows[0] as any[]

        if (!filialeRes[0]) {
            return res.status(404).json({ error: 'filiale non trovata' })
        }

        const filiale = filialeRes[0];

        const automezziRes = await pool.execute(
            'SELECT id, codice, targa, marca, modello FROM automezzo WHERE filiale_id = ? ORDER BY codice',
            [id]
        )

        const automezzi = automezziRes[0]

        const result = { ...filiale, automezzi: automezzi }
        return res.json(result)
    } catch (err) {
        console.error(err)
        return res.status(500).json({ error: 'error' })
    }
})

router.post('/', async (req, res) => {

    const body = filialeSchema.safeParse(req.body)

    if (body.error) {
        return res.status(400).json({
            error: 'dati non validi',
            details: body.error
        })
    }

    const { codice, indirizzo, citta, cap } = body.data

    try {
        const filialeRes = await pool.execute(
            'INSERT INTO filiale (codice, indirizzo, citta, cap) VALUES (?, ?, ?, ?)',
            [codice, indirizzo, citta, cap]
        )

        const filiale = filialeRes[0] as any

        return res.status(201).json({ id: filiale.insertId, codice, indirizzo, citta, cap })

    } catch (err: any) {
        console.error(err)
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: `il codice: ${codice} esiste già, impossibile procedere con il salvataggio di questa filiale` })
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

        const filialeRes = await pool.execute(
            'DELETE FROM filiale WHERE id = ?',
            [id]
        )

        console.log(filialeRes)

        const filiale = filialeRes[0] as any

        if (filiale.affectedRows === 0) {
            return res.status(404).json({ error: 'non è stata trovata la filiale da eliminare' })
        }

        return res.status(204).send()
    } catch (err: any) {
        console.error(err)
        if (err.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(400).json({ error: 'impossibile eliminare perché la filiale ha degli automezzi' })
        }
        return res.status(500).json({ error: 'error' })
    }
})

export default router