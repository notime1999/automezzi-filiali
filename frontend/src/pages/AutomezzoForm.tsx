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

    if (loadingFiliali) return <p>Caricamento filiali...</p>

    return (
        <div>
            <Link to="/automezzi">Torna alla lista</Link>
            <h2>Nuovo automezzo</h2>

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
                        Targa:{' '}
                        <input
                            type="text"
                            value={targa}
                            onChange={e => setTarga(e.target.value)}
                            disabled={submitting}
                        />
                    </label>
                    {errors.targa && <span style={{ color: 'red', marginLeft: '5px' }}>{errors.targa}</span>}
                </div>

                <div style={{ marginBottom: '5px' }}>
                    <label>
                        Marca:{' '}
                        <input
                            type="text"
                            value={marca}
                            onChange={e => setMarca(e.target.value)}
                            disabled={submitting}
                        />
                    </label>
                    {errors.marca && <span style={{ color: 'red', marginLeft: '5px' }}>{errors.marca}</span>}
                </div>

                <div style={{ marginBottom: '5px' }}>
                    <label>
                        Modello:{' '}
                        <input
                            type="text"
                            value={modello}
                            onChange={e => setModello(e.target.value)}
                            disabled={submitting}
                        />
                    </label>
                    {errors.modello && <span style={{ color: 'red', marginLeft: '5px' }}>{errors.modello}</span>}
                </div>

                <div style={{ marginBottom: '5px' }}>
                    <label>
                        Filiale:{' '}
                        <select
                            value={filialeId}
                            onChange={e => setFilialeId(e.target.value)}
                            disabled={submitting}
                        >
                            <option value="">-- Seleziona una filiale --</option>
                            {filiali.map(f => (
                                <option key={f.id} value={f.id}>
                                    {f.codice} ({f.citta})
                                </option>
                            ))}
                        </select>
                    </label>
                    {errors.filiale_id && <span style={{ color: 'red', marginLeft: '5px' }}>{errors.filiale_id}</span>}
                </div>

                <button type="submit" disabled={submitting}>
                    {submitting ? 'Salvataggio...' : 'Crea automezzo'}
                </button>

                {submitError && <p style={{ color: 'red' }}>Errore: {submitError}</p>}
            </form>
        </div>
    )
}