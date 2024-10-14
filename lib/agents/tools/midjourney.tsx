import { tool } from 'ai'
import { ToolProps } from '.'
import { generateImageSchema } from '@/lib/schema/midjourney'
import { Midjourney, MJMessage } from 'midjourney'
import MidjourneySection from '@/components/mj'
import { DefaultSkeleton } from '@/components/default-skeleton'

export const midjourneyTool = ({ uiStream, fullResponse }: ToolProps) =>
  tool({
    description: 'this tool can Generate images, draw painting',
    parameters: generateImageSchema,
    execute: async ({ prompt, style }) => {
      console.log('✏️ using midjourneyTool')
      let hasError = false
      let result: MJMessage | null = null
      let content: Mjcontent = {
        hash: '',
        content: '',
        warning: 'image: null, Generate images error'
      }

      uiStream.append(<MidjourneySection pending={true} />)

      try {
        const client = new Midjourney({
          ServerId: process.env.SERVER_ID,
          ChannelId: process.env.CHANNEL_ID,
          SalaiToken: process.env.SALAI_TOKEN || '',
          Debug: process.env.NODE_ENV === 'development' ? true : false
          // Ws: true //enable ws is required for remix mode (and custom zoom)
        })
        await client.init()
        // const submitPrompt = `${prompt} ${style === 'anime' ? '--niji 6' : '-v 6.1'} --turbo`
        const submitPrompt = prompt
        uiStream.update(<MidjourneySection pending={true} />)
        const Imagine = client.Imagine(
          submitPrompt,
          (uri: string, progress: string) => {
            console.log('loading', uri, 'progress', progress)
          }
        )
        result = await Imagine

        if (result && result.hash && result.content) {
          content = {
            hash: result.hash,
            content: result.content,
            prompt: submitPrompt,
            warning: `Midjourney displayed 1 images. The images are already plainly visible, so don't repeat the descriptions in detail. Do not list download links as they are available in the UI already. The user may download the images by clicking on them, but do not mention anything about downloading to the user.`
          }
        }

        if (result) {
          uiStream.update(
            <MidjourneySection pending={false} message={content} />
          )
          return JSON.stringify(content)
        } else {
          uiStream.update(<MidjourneySection pending={false} />)
        }
      } catch (e) {
        hasError = true
        console.error('Mj API error:', e)
        uiStream.update(null)
      }

      if (hasError || !content) {
        fullResponse = `An error occurred while Generate images.`
        uiStream.update(null)
        return JSON.stringify(content)
      }

      return JSON.stringify(content)
      // return `Midjourney displayed 1 images. The images are already plainly visible, so don't repeat the descriptions in detail. Do not list download links as they are available in the UI already. The user may download the images by clicking on them, but do not mention anything about downloading to the user.`
    }
  })

export interface Mjcontent {
  hash: string
  content: string
  warning: string
  prompt?: string
}
