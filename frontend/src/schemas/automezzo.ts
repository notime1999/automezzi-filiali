import { z } from 'zod'

export const automezzoSchema = z.object({
  codice: z.string().min(1, 'codice obbligatorio').max(20, 'Il codice deve avere massimo 20 caratteri'),
  targa: z.string().min(1, 'targa obbligatoria').max(15, 'La targa deve avere massimo 15 caratteri'),
  marca: z.string().min(1, 'marca obbligatoria').max(50, 'La marca deve avere massimo 50 caratteri'),
  modello: z.string().min(1, 'modello obbligatorio').max(50, 'Il modello deve avere massimo 50 caratteri'),
  filiale_id: z.number().positive('La Filiale è obbligatoria'),
})

export type AutomezzoInput = z.infer<typeof automezzoSchema>