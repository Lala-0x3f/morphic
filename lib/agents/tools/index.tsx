import { createStreamableUI } from 'ai/rsc'
import { retrieveTool } from './retrieve'
import { searchTool } from './search'
import { YoutubeSearchTool } from './youtube-search'
import { midjourneyTool } from './midjourney'
import { BilibiliSearchTool } from './bilibili-search'

export interface ToolProps {
  uiStream: ReturnType<typeof createStreamableUI>
  fullResponse: string
}

export const getTools = ({ uiStream, fullResponse }: ToolProps) => {
  const tools: any = {
    search: searchTool({
      uiStream,
      fullResponse
    }),
    retrieve: retrieveTool({
      uiStream,
      fullResponse
    })
  }

  if (
    process.env.SERVER_ID &&
    process.env.CHANNEL_ID &&
    process.env.SALAI_TOKEN
  ) {
    tools.imageGenerate = midjourneyTool({
      uiStream,
      fullResponse
    })
  }

  if (process.env.SERPER_API_KEY) {
    tools.videoSearch = YoutubeSearchTool({
      uiStream,
      fullResponse
    })
  } else {
    tools.videoSearch = BilibiliSearchTool({
      uiStream,
      fullResponse
    })
  }

  // console.log('tools', tools)

  return tools
}
