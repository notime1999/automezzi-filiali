import { z } from 'zod'

export const filialeSchema = z.object({
  codice: z.string().min(1, 'codice obbligatorio').max(20, 'Il codice deve avere massimo 20 caratteri'),
  indirizzo: z.string().min(1, 'indirizzo obbligatorio').max(255, 'Il indirizzo deve avere massimo 255 caratteri'),
  citta: z.string().min(1, 'città obbligatoria').max(100, 'La città deve avere massimo 100 caratteri'),
  cap: z.string().min(1, 'cap obbligatorio').max(10, 'Il cap deve avere massimo 10 caratteri'),
})

export type FilialeInput = z.infer<typeof filialeSchema>