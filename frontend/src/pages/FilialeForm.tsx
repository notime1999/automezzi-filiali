import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { filialeSchema } from '../schemas/filiale'

export default function FilialeForm() {
    const navigate = useNavigate()

    const [codice, setCodice] = useState('')
    const [indirizzo, setIndirizzo] = useState('')
    const [citta, setCitta] = useState('')
    const [cap, setCap] = useState('')

    const [errors, setErrors] = useState<Record<string, string>>({})
    const [submitError, setSubmitError] = useState<string | null>(null)
    const [submitting, setSubmitting] = useState(false)

    async function submit(e: React.FormEvent) {
        e.preventDefault()
        setErrors({})
        setSubmitError(null)

        const body = filialeSchema.safeParse({ codice, indirizzo, citta, cap })

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
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/filiali`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body.data),
            })

            if (!res.ok) {
                const errorBody = await res.json()
                if (res.status === 409) {
                    setErrors({ codice: errorBody.error })
                } else if (res.status === 400 && errorBody.details) {
                    const fieldErrors: Record<string, string> = {}
                    for (const issue of errorBody.details) {
                        const fieldName = issue.path[0] as string
                        fieldErrors[fieldName] = issue.message
                    }
                    setErrors(fieldErrors)
                } else {
                    setSubmitError(errorBody.error || 'Errore sconosciuto')
                }
                return
            }

            navigate('/filiali')
        } catch (err: any) {
            console.log("Errore ---> ", err)
            setSubmitError('Errore')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="max-w-2xl">
            <Link to="/filiali" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">Torna alla lista</Link>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">Nuova filiale</h2>

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
                        Indirizzo
                        <input
                            type="text"
                            value={indirizzo}
                            onChange={e => setIndirizzo(e.target.value)}
                            disabled={submitting}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                        />
                    </label>
                    {errors.indirizzo && <p className="text-sm text-red-600 mt-1">{errors.indirizzo}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Città
                        <input
                            type="text"
                            value={citta}
                            onChange={e => setCitta(e.target.value)}
                            disabled={submitting}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                        />
                    </label>
                    {errors.citta && <p className="text-sm text-red-600 mt-1">{errors.citta}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        CAP
                        <input
                            type="text"
                            value={cap}
                            onChange={e => setCap(e.target.value)}
                            disabled={submitting}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                        />
                    </label>
                    {errors.cap && <p className="text-sm text-red-600 mt-1">{errors.cap}</p>}
                </div>

                <div className="flex items-center gap-3 pt-2">
                    <button
                        type="submit"
                        disabled={submitting}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-md transition disabled:bg-blue-300 disabled:cursor-not-allowed"
                    >
                        {submitting ? 'Salvataggio...' : 'Crea filiale'}
                    </button>
                    <Link
                        to="/filiali"
                        className="text-gray-600 hover:text-gray-800 font-medium"
                    >
                        Annulla
                    </Link>
                </div>

                {submitError && (
                    <p className="text-sm text-red-600 bg-red-50 border border-red-200 p-3 rounded">
                        {submitError}
                    </p>
                )}

            </form>
        </div>
    )
}