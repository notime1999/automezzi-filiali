import { z } from 'zod'

export const automezzoSchema = z.object({
  codice: z.string().min(1, 'codice obbligatorio').max(20, 'codice max 20 caratteri'),
  targa: z.string().min(1, 'targa obbligatoria').max(15, 'targa max 15 caratteri'),
  marca: z.string().min(1, 'marca obbligatoria').max(50, 'marca max 50 caratteri'),
  modello: z.string().min(1, 'modello obbligatorio').max(50, 'modello max 50 caratteri'),
  filiale_id: z.number().positive('filiale_id deve essere positivo'),
})

export type AutomezzoInput = z.infer<typeof automezzoSchema>