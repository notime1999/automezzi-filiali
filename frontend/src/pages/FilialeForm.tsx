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

    async function submit() {
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
        <div>
            <Link to="/filiali">Torna alla lista</Link>

            <h2>Nuova filiale</h2>

            <form onSubmit={submit}>
                <div style={{ marginBottom: '5px' }}>
                    <label>
                        Codice:{' '}
                        <input
                            type="text"
                            value={codice}
                            onChange={e => setCodice(e.target.value)}
                            disabled={submitting}
                        />
                    </label>
                    {errors.codice && <span style={{ color: 'red', marginLeft: '5px' }}>{errors.codice}</span>}
                </div>

                <div style={{ marginBottom: '5px' }}>
                    <label>
                        Indirizzo:{' '}
                        <input
                            type="text"
                            value={indirizzo}
                            onChange={e => setIndirizzo(e.target.value)}
                            disabled={submitting}
                        />
                    </label>
                    {errors.indirizzo && <span style={{ color: 'red', marginLeft: '5px' }}>{errors.indirizzo}</span>}
                </div>

                <div style={{ marginBottom: '5px' }}>
                    <label>
                        Città:{' '}
                        <input
                            type="text"
                            value={citta}
                            onChange={e => setCitta(e.target.value)}
                            disabled={submitting}
                        />
                    </label>
                    {errors.citta && <span style={{ color: 'red', marginLeft: '5px' }}>{errors.citta}</span>}
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label>
                        CAP:{' '}
                        <input
                            type="text"
                            value={cap}
                            onChange={e => setCap(e.target.value)}
                            disabled={submitting}
                        />
                    </label>
                    {errors.cap && <span style={{ color: 'red', marginLeft: '5px' }}>{errors.cap}</span>}
                </div>

                <button type="submit" disabled={submitting}>
                    {submitting ? 'Salvataggio...' : 'Crea filiale'}
                </button>

                {submitError && <p style={{ color: 'red' }}>Errore: {submitError}</p>}
            </form>
        </div>
    )
}