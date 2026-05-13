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

    if (loading) return <p className="text-gray-600">Caricamento...</p>
    if (error) return <p className="text-red-600 bg-red-50 border border-red-200 p-4 rounded">Errore: {error}</p>
    if (!automezzo) return <p className="text-gray-600">Automezzo non trovato</p>

    return (
        <div>
            <Link to="/automezzi" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">Torna alla lista</Link>

            <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Automezzo {automezzo.codice}</h3>
                <dl className="grid grid-cols-[150px_1fr] gap-y-3 gap-x-4">
                    <dt className="font-semibold text-gray-700">Codice:</dt>
                    <dd className="text-gray-900">{automezzo.codice}</dd>

                    <dt className="font-semibold text-gray-700">Targa:</dt>
                    <dd className="text-gray-900">{automezzo.targa}</dd>

                    <dt className="font-semibold text-gray-700">Marca:</dt>
                    <dd className="text-gray-900">{automezzo.marca}</dd>

                    <dt className="font-semibold text-gray-700">Modello:</dt>
                    <dd className="text-gray-900">{automezzo.modello}</dd>
                </dl>
            </div>

            <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Proprietà della Filiale:</h3>
                <dl className="grid grid-cols-[150px_1fr] gap-y-3 gap-x-4">
                    <dt className="font-semibold text-gray-700">Codice:</dt>
                    <dd>
                        <Link
                            to={`/filiali/${automezzo.filiale_id}`}
                            className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                            {automezzo.filiale_codice}
                        </Link>
                    </dd>

                    <dt className="font-semibold text-gray-700">Indirizzo:</dt>
                    <dd className="text-gray-900">{automezzo.filiale_indirizzo}</dd>

                    <dt className="font-semibold text-gray-700">Città:</dt>
                    <dd className="text-gray-900">{automezzo.filiale_citta}</dd>

                    <dt className="font-semibold text-gray-700">CAP:</dt>
                    <dd className="text-gray-900">{automezzo.filiale_cap}</dd>
                </dl>
            </div>
        </div>
    )
}