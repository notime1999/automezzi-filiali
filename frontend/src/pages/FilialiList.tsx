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
    const [uploading, setUploading] = useState(false)
    const [uploadResult, setUploadResult] = useState<string | null>(null)

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

    async function edooUpload() {
        setUploading(true)
        setUploadResult(null)

        try {
            await fetch(`${import.meta.env.VITE_API_URL}/api/filiali/upload`, {
                method: 'POST',
            }).then(res => {
                if (!res.ok) throw new Error(`Errore durante l'upload delle filiali`)
                return res.json()
            }).then(data => setUploadResult(data.edooMessageRes))
                .catch(err => setError(err.message))
                .finally(() => setUploading(false))

        } catch (err: any) {
            console.log("Errore ---> ", err)
            alert(`Errore durante l'upload`)
        }
    }

    if (loading) return <p className="text-gray-600">Caricamento...</p>
    if (error) return <p className="text-red-600 bg-red-50 border border-red-200 p-4 rounded">Errore: {error}</p>

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Lista Filiali</h2>
                <button
                    onClick={edooUpload}
                    disabled={uploading}
                    className="bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-md transition disabled:bg-green-300 disabled:cursor-not-allowed"
                >
                    {uploading ? 'Caricamento...' : 'Carica su edoo'}
                </button>
                <Link to="/filiali/new" className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md transition">Nuova filiale</Link>
            </div>
            <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200 px-4 py-2">
                {uploadResult && (
                    <div className={`mb-4 p-3 rounded-md border bg-blue-50 border-green-200 text-green-800`}>
                        {uploadResult}
                    </div>
                )}
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-4 py-3 text-sm font-semibold text-gray-700">Codice</th>
                            <th className="px-4 py-3 text-sm font-semibold text-gray-700">Indirizzo</th>
                            <th className="px-4 py-3 text-sm font-semibold text-gray-700">Città</th>
                            <th className="px-4 py-3 text-sm font-semibold text-gray-700">CAP</th>
                            <th className="px-4 py-3 text-sm font-semibold text-gray-700 text-right">Azioni</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filiali.map(x => (
                            <tr key={x.id} className="border-b border-gray-100 hover:bg-gray-50">
                                <td className="px-4 py-3 font-medium text-gray-900">{x.codice}</td>
                                <td className="px-4 py-3 text-gray-700">{x.indirizzo}</td>
                                <td className="px-4 py-3 text-gray-700">{x.citta}</td>
                                <td className="px-4 py-3 text-gray-700">{x.cap}</td>
                                <td className="px-4 py-3 text-right">
                                    <Link to={`/filiali/${x.id}`} className="text-blue-600 hover:text-blue-800 mr-4">Dettaglio</Link>
                                    <button onClick={() => deleteFiliale(x.id)} className="text-red-600 hover:text-red-800">Elimina</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}