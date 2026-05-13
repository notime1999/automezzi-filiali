import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { automezzoSchema } from '../schemas/automezzo'

type Filiale = {
    id: number
    codice: string
    citta: string
}

export default function AutomezzoForm() {
    const navigate = useNavigate()

    const [filiali, setFiliali] = useState<Filiale[]>([])
    const [loadingFiliali, setLoadingFiliali] = useState(true)

    const [codice, setCodice] = useState('')
    const [targa, setTarga] = useState('')
    const [marca, setMarca] = useState('')
    const [modello, setModello] = useState('')
    const [filialeId, setFilialeId] = useState('')

    const [errors, setErrors] = useState<Record<string, string>>({})
    const [submitError, setSubmitError] = useState<string | null>(null)
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/api/filiali`)
            .then(res => res.json())
            .then(data => setFiliali(data))
            .catch(err => setSubmitError(err.message))
            .finally(() => setLoadingFiliali(false))
    }, [])

    async function submit(e: React.FormEvent) {
        e.preventDefault()
        setErrors({})
        setSubmitError(null)

        const body = automezzoSchema.safeParse({
            codice,
            targa,
            marca,
            modello,
            filiale_id: Number(filialeId),
        })

        if (!body.success) {
            const fieldErrors: Record<string, string> = {}
            for (const issue of body.error.issues) {
                const fieldName = issue.path[0] as string
                fieldErrors[fieldName] = issue.message
            }
            setErrors(fieldErrors)
            return
        }

        setSubmitting(true)
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/automezzi`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body.data),
            })

            if (!res.ok) {
                const errorBody = await res.json()
                if (res.status === 409) {
                    setSubmitError(errorBody.error)
                } else if (res.status === 400 && errorBody.details) {
                    const fieldErrors: Record<string, string> = {}
                    for (const issue of errorBody.details) {
                        const fieldName = issue.path[0] as string
                        fieldErrors[fieldName] = issue.message
                    }
                    setErrors(fieldErrors)
                } else if (res.status === 400) {
                    setSubmitError(errorBody.error)
                } else {
                    setSubmitError(errorBody.error || 'Errore sconosciuto')
                }
                return
            }

            navigate('/automezzi')
        } catch (err: any) {
            console.log("Errore ---> ", err)
            setSubmitError('Errore')
        } finally {
            setSubmitting(false)
        }
    }

    if (loadingFiliali) return <p className="text-gray-600">Caricamento filiali...</p>

    return (
        <div className="max-w-2xl">
            <Link to="/automezzi" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">Torna alla lista</Link>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Nuovo automezzo</h2>

            <form onSubmit={submit} className="bg-white shadow-sm rounded-lg border border-gray-200 p-6 space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Codice
                        <input
                            type="text"
                            value={codice}
                            onChange={e => setCodice(e.target.value)}
                            disabled={submitting}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                        />
                    </label>
                    {errors.codice && <p className="text-sm text-red-600 mt-1">{errors.codice}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Targa
                        <input
                            type="text"
                            value={targa}
                            onChange={e => setTarga(e.target.value)}
                            disabled={submitting}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                        />
                    </label>
                    {errors.targa && <p className="text-sm text-red-600 mt-1">{errors.targa}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Marca
                        <input
                            type="text"
                            value={marca}
                            onChange={e => setMarca(e.target.value)}
                            disabled={submitting}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100" />
                    </label>
                    {errors.marca && <p className="text-sm text-red-600 mt-1">{errors.marca}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Modello
                        <input
                            type="text"
                            value={modello}
                            onChange={e => setModello(e.target.value)}
                            disabled={submitting}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                        />
                    </label>
                    {errors.modello && <p className="text-sm text-red-600 mt-1">{errors.modello}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Filiale
                        <select
                            value={filialeId}
                            onChange={e => setFilialeId(e.target.value)}
                            disabled={submitting}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                        >
                            <option value="">-- Seleziona una filiale --</option>
                            {filiali.map(f => (
                                <option key={f.id} value={f.id}>
                                    {f.codice} ({f.citta})
                                </option>
                            ))}
                        </select>
                    </label>
                    {errors.filiale_id && <p className="text-sm text-red-600 mt-1">{errors.filiale_id}</p>}
                </div>

                <div className="flex items-center gap-3 pt-2">
                    <button
                        type="submit"
                        disabled={submitting}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-md transition disabled:bg-blue-300 disabled:cursor-not-allowed"
                    >
                        {submitting ? 'Salvataggio...' : 'Crea automezzo'}
                    </button>
                    <Link
                        to="/automezzi"
                        className="text-gray-600 hover:text-gray-800 font-medium"
                    >
                        Annulla
                    </Link>
                </div>

                {submitError && <p className="text-sm text-red-600 bg-red-50 border border-red-200 p-3 rounded">Errore: {submitError}</p>}
            </form>
        </div>
    )
}