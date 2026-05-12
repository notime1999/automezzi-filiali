import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'

type AutomezzoDetail = {
    id: number
    codice: string
    targa: string
    marca: string
    modello: string
    filiale_id: number
    filiale_codice: string
    filiale_indirizzo: string
    filiale_citta: string
    filiale_cap: string
}

export default function AutomezzoDetail() {
    const { id } = useParams()
    const [automezzo, setAutomezzo] = useState<AutomezzoDetail | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/api/automezzi/${id}`)
            .then(res => {
                if (!res.ok) throw new Error('Automezzo non trovato')
                return res.json()
            })
            .then(data => setAutomezzo(data))
            .catch(err => setError(err.message))
            .finally(() => setLoading(false))
    }, [id])

    if (loading) return <p>Caricamento...</p>
    if (error) return <p style={{ color: 'red' }}>Errore: {error}</p>
    if (!automezzo) return <p>Automezzo non trovato</p>

    return (
        <div>
            <Link to="/automezzi">Torna alla lista</Link>

            <h2>Automezzo {automezzo.codice}</h2>

            <p><strong>Codice:</strong> {automezzo.codice}</p>
            <p><strong>Targa:</strong> {automezzo.targa}</p>
            <p><strong>Marca:</strong> {automezzo.marca}</p>
            <p><strong>Modello:</strong> {automezzo.modello}</p>

            <h3>Proprietà della Filiale:</h3>
            <p><strong>Codice:</strong> <Link to={`/filiali/${automezzo.filiale_id}`}>{automezzo.filiale_codice}</Link></p>
            <p><strong>Indirizzo:</strong> {automezzo.filiale_indirizzo}</p>
            <p><strong>Città:</strong> {automezzo.filiale_citta}</p>
            <p><strong>CAP:</strong> {automezzo.filiale_cap}</p>
        </div>
    )
}