import { DeepPartial } from 'ai'
import { z } from 'zod'

export const generateImageSchema = z.object({
  prompt: z
    .string()
    .describe(
      'description of the image or screen to generate, such as Biopunk, a castle in center ,white background'
    ),
  style: z
    .string()
    .describe(
      'style of the image or screen to generate. Allowed values are "normal" or "anime"'
    )
})

export type PartialInquiry = DeepPartial<typeof generateImageSchema>
