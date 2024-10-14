import { Midjourney } from 'midjourney'
import { NextResponse } from 'next/server'

const style = 'normal'
const prompt = 'bot in sea'

export const GET = async () => {
  try {
    const client = new Midjourney({
      ServerId: process.env.SERVER_ID,
      ChannelId: process.env.CHANNEL_ID,
      SalaiToken: process.env.SALAI_TOKEN || '',
      Debug: true
      // Ws: true //enable ws is required for remix mode (and custom zoom)
    })
    await client.init()
    const submitPrompt = `${prompt} --turbo`
    // uiStream.update(<MidjourneySection pending={true} />)
    const Imagine = client.Imagine(
      submitPrompt,
      (uri: string, progress: string) => {
        console.log('loading', uri, 'progress', progress)
      }
    )
    const result = await Imagine
    // if (result) {
    //   uiStream.update(<MidjourneySection pending={false} message={result} />)
    // } else {
    //   uiStream.update(<MidjourneySection pending={false} />)
    // }
    return NextResponse.json({ result })
  } catch (e) {
    // hasError = true
    console.error('Mj API error:', e)
    // uiStream.update(null)
    return NextResponse.json({ error: e })
  }
}
