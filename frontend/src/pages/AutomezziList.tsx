import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'


type Automezzo = {
    id: number
    codice: string
    targa: string
    marca: string
    modello: string
    filiale_id: number
    filiale_codice: string
    filiale_citta: string
}

export default function AutomezziList() {
    const [automezzi, setAutomezzi] = useState<Automezzo[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/api/automezzi`)
            .then(res => {
                if (!res.ok) throw new Error('Errore durante il caricamento degli automezzi')
                return res.json()
            })
            .then(data => setAutomezzi(data))
            .catch(err => setError(err.message))
            .finally(() => setLoading(false))
    }, [])

    async function deleteAutomezzo(id: number) {
        if (!confirm('Sei sicuro di voler eliminare questo automezzo?')) {
            return
        }

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/automezzi/${id}`, {
                method: 'DELETE',
            })

            if (!res.ok) {
                const error = await res.json()
                console.log("Errore ---> ", error.error)
                alert(`Errore: ${error.error}`)
                return
            }

            setAutomezzi(automezzi.filter(x => x.id !== id))
        } catch (err: any) {
            console.log("Errore ---> ", err)
            alert(`Errore`)
        }
    }

    if (loading) return <p>Caricamento...</p>
    if (error) return <p style={{ color: 'red' }}>Errore: {error}</p>

    return (
        <div>
            <h2>Lista Automezzi</h2>
            <div style={{ marginBottom: '10px' }}>
                <Link to="/automezzi/new">Nuovo automezzo</Link>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Codice</th>
                        <th>Targa</th>
                        <th>Marca</th>
                        <th>Modello</th>
                        <th>Filiale</th>
                        <th>Azioni</th>
                    </tr>
                </thead>
                <tbody>
                    {automezzi.map(x => (
                        <tr key={x.id}>
                            <td>{x.codice}</td>
                            <td>{x.targa}</td>
                            <td>{x.marca}</td>
                            <td>{x.modello}</td>
                            <td>{x.filiale_codice} ({x.filiale_citta})</td>
                            <td>
                                <Link to={`/automezzi/${x.id}`}>Dettaglio</Link>
                                {' | '}
                                <button onClick={() => deleteAutomezzo(x.id)}>Elimina</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}