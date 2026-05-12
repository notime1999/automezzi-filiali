import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'

type Automezzo = {
    id: number
    codice: string
    targa: string
    marca: string
    modello: string
}

type FilialeDetail = {
    id: number
    codice: string
    indirizzo: string
    citta: string
    cap: string
    automezzi: Automezzo[]
}

export default function FilialeDetail() {
    const { id } = useParams()
    const [filiale, setFiliale] = useState<FilialeDetail | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/api/filiali/${id}`)
            .then(res => {
                if (!res.ok) throw new Error('La filiale non è stata trovata')
                return res.json()
            })
            .then(data => setFiliale(data))
            .catch(err => setError(err.message))
            .finally(() => setLoading(false))
    }, [id])

    if (loading) return <p>Caricamento...</p>
    if (error) return <p style={{ color: 'red' }}>Errore: {error}</p>
    if (!filiale) return <p>La filiale non è stata trovata</p>

    return (
        <div>
            <Link to="/filiali">Torna alla lista delle filiali</Link>

            <h2>Filiale - {filiale.codice}</h2>

            <dl>
                <dt><strong>Codice:</strong></dt>
                <dd>{filiale.codice}</dd>

                <dt><strong>Indirizzo:</strong></dt>
                <dd>{filiale.indirizzo}</dd>

                <dt><strong>Città:</strong></dt>
                <dd>{filiale.citta}</dd>

                <dt><strong>CAP:</strong></dt>
                <dd>{filiale.cap}</dd>
            </dl>

            <h3>Automezzi della filiale ({filiale.automezzi.length})</h3>

            {filiale.automezzi.length === 0 ? (
                <p>Nessun automezzo associato a questa filiale.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Codice</th>
                            <th>Targa</th>
                            <th>Marca</th>
                            <th>Modello</th>
                            <th>Azioni</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filiale.automezzi.map(x => (
                            <tr key={x.id}>
                                <td>{x.codice}</td>
                                <td>{x.targa}</td>
                                <td>{x.marca}</td>
                                <td>{x.modello}</td>
                                <td>
                                    <Link to={`/automezzi/${x.id}`}>Dettaglio</Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    )
}