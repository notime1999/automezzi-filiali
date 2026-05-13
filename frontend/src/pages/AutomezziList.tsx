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
    const [uploading, setUploading] = useState(false)
    const [uploadResult, setUploadResult] = useState<string | null>(null)


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

    async function edooUpload() {
        setUploading(true)
        setUploadResult(null)

        try {
            await fetch(`${import.meta.env.VITE_API_URL}/api/automezzi/upload`, {
                method: 'POST',
            }).then(res => {
                if (!res.ok) throw new Error(`Errore durante l'upload degli automezzi`)
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
                <h2 className="text-2xl font-bold text-gray-900">Lista Automezzi</h2>
                <button
                    onClick={edooUpload}
                    disabled={uploading}
                    className="bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-md transition disabled:bg-green-300 disabled:cursor-not-allowed"
                >
                    {uploading ? 'Caricamento...' : 'Carica su edoo'}
                </button>
                <Link to="/automezzi/new" className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md transition">Nuovo automezzo</Link>
            </div>
            <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
                {uploadResult && (
                    <div className={`mb-4 p-3 rounded-md border bg-blue-50 border-green-200 text-green-800`}>
                        {uploadResult}
                    </div>
                )}
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-4 py-3 text-sm font-semibold text-gray-700">Codice</th>
                            <th className="px-4 py-3 text-sm font-semibold text-gray-700">Targa</th>
                            <th className="px-4 py-3 text-sm font-semibold text-gray-700">Marca</th>
                            <th className="px-4 py-3 text-sm font-semibold text-gray-700">Modello</th>
                            <th className="px-4 py-3 text-sm font-semibold text-gray-700">Filiale</th>
                            <th className="px-4 py-3 text-sm font-semibold text-gray-700 text-right">Azioni</th>
                        </tr>
                    </thead>
                    <tbody>
                        {automezzi.map(x => (
                            <tr key={x.id} className="border-b border-gray-100 hover:bg-gray-50">
                                <td className="px-4 py-3 font-medium text-gray-900">{x.codice}</td>
                                <td className="px-4 py-3 text-gray-700">{x.targa}</td>
                                <td className="px-4 py-3 text-gray-700">{x.marca}</td>
                                <td className="px-4 py-3 text-gray-700">{x.modello}</td>
                                <td className="px-4 py-3 text-gray-700">{x.filiale_codice} ({x.filiale_citta})</td>
                                <td className="px-4 py-3 text-right">
                                    <Link to={`/automezzi/${x.id}`} className="text-blue-600 hover:text-blue-800 mr-4">Dettaglio</Link>
                                    <button onClick={() => deleteAutomezzo(x.id)} className="text-red-600 hover:text-red-800">Elimina</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}