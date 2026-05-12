import { z } from 'zod'

export const filialeSchema = z.object({
  codice: z.string().min(1, 'codice obbligatorio').max(20, 'codice max 20 caratteri'),
  indirizzo: z.string().min(1, 'indirizzo obbligatorio').max(255, 'indirizzo max 255 caratteri'),
  citta: z.string().min(1, 'città obbligatoria').max(100, 'città max 100 caratteri'),
  cap: z.string().min(1, 'cap obbligatorio').max(10, 'cap max 10 caratteri'),
})

export type FilialeInput = z.infer<typeof filialeSchema>