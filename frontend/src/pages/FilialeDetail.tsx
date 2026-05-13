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

    if (loading) return <p className="text-gray-600">Caricamento...</p>
    if (error) return <p className="text-red-600 bg-red-50 border border-red-200 p-4 rounded">Errore: {error}</p>
    if (!filiale) return <p className="text-gray-600">La filiale non è stata trovata</p>

    return (
        <div>
            <Link to="/filiali" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">Torna alla lista delle filiali</Link>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">Filiale - {filiale.codice}</h2>

            <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6 mb-8">
                <dl className="grid grid-cols-[150px_1fr] gap-y-3 gap-x-4">
                    <dt className="font-semibold text-gray-700"><strong>Codice:</strong></dt>
                    <dd className="text-gray-900">{filiale.codice}</dd>

                    <dt className="font-semibold text-gray-700"><strong>Indirizzo:</strong></dt>
                    <dd className="text-gray-900">{filiale.indirizzo}</dd>

                    <dt className="font-semibold text-gray-700"><strong>Città:</strong></dt>
                    <dd className="text-gray-900">{filiale.citta}</dd>

                    <dt className="font-semibold text-gray-700"><strong>CAP:</strong></dt>
                    <dd className="text-gray-900">{filiale.cap}</dd>
                </dl>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mb-4">Automezzi della filiale ({filiale.automezzi.length})</h3>

            {filiale.automezzi.length === 0 ? (
                <p className="text-gray-600 italic">Nessun automezzo associato a questa filiale.</p>
            ) : (
                <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-4 py-3 text-sm font-semibold text-gray-700">Codice</th>
                                <th className="px-4 py-3 text-sm font-semibold text-gray-700">Targa</th>
                                <th className="px-4 py-3 text-sm font-semibold text-gray-700">Marca</th>
                                <th className="px-4 py-3 text-sm font-semibold text-gray-700">Modello</th>
                                <th className="px-4 py-3 text-sm font-semibold text-gray-700 text-right">Azioni</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filiale.automezzi.map(x => (
                                <tr key={x.id} className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="px-4 py-3 font-medium text-gray-900">{x.codice}</td>
                                    <td className="px-4 py-3 text-gray-700">{x.targa}</td>
                                    <td className="px-4 py-3 text-gray-700">{x.marca}</td>
                                    <td className="px-4 py-3 text-gray-700">{x.modello}</td>
                                    <td className="px-4 py-3 text-right">
                                        <Link to={`/automezzi/${x.id}`} className="text-blue-600 hover:text-blue-800">Dettaglio</Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}