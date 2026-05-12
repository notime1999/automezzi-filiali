import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'


type Filiale = {
    id: number
    codice: string
    indirizzo: string
    citta: string
    cap: string
}


export default function FilialiList() {
    const [filiali, setFiliali] = useState<Filiale[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/api/filiali`)
            .then(res => {
                if (!res.ok) throw new Error('Errore durante il caricamento delle filiali')
                return res.json()
            })
            .then(data => setFiliali(data))
            .catch(err => setError(err.message))
            .finally(() => setLoading(false))
    }, [])

    if (loading) return <p>Caricamento...</p>
    if (error) return <p style={{ color: 'red' }}>Errore: {error}</p>

    async function deleteFiliale(id: number) {
        if (!confirm('Sei sicuro di voler eliminare questa filiale?')) {
            return
        }

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/filiali/${id}`, {
                method: 'DELETE',
            })

            if (!res.ok) {
                const error = await res.json()
                if (error && error.error) {
                    console.log("Errore ---> ", error.error)
                    if (error.error === 'impossibile eliminare perché la filiale ha degli automezzi') {
                        alert(`Errore - impossibile eliminare perché la filiale ha degli automezzi`)
                    } else {
                        alert(`Errore - impossibile eliminare questa filiale`)
                    }
                    return
                }
            }

            setFiliali(filiali.filter(x => x.id !== id))
        } catch (err: any) {
            console.log("Errore ---> ", err)
            alert(`Errore`)
        }
    }

    return (
        <div>
            <h2>Lista Filiali</h2>
            <div style={{ marginBottom: '10px' }}>
                <Link to="/filiali/new">Nuova filiale</Link>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Codice</th>
                        <th>Indirizzo</th>
                        <th>Città</th>
                        <th>CAP</th>
                        <th>Azioni</th>
                    </tr>
                </thead>
                <tbody>
                    {filiali.map(x => (
                        <tr key={x.id}>
                            <td>{x.codice}</td>
                            <td>{x.indirizzo}</td>
                            <td>{x.citta}</td>
                            <td>{x.cap}</td>
                            <td>
                                <Link to={`/filiali/${x.id}`}>Dettaglio</Link>
                                {' | '}
                                <button onClick={() => deleteFiliale(x.id)}>Elimina</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}