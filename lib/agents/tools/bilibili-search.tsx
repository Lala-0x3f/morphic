import { tool } from 'ai'
import { createStreamableValue } from 'ai/rsc'
import { searchSchema } from '@/lib/schema/search'
import { ToolProps } from '.'
import { VideoSearchSection } from '@/components/video-search-section'
import { SerperSearchResults } from '@/lib/types'
import { title } from 'process'

const baseUrl = 'https://api.bilibili.com/x/web-interface/wbi/search/all/v2'

// Start Generation Here
export const BilibiliSearchTool = ({ uiStream, fullResponse }: ToolProps) =>
  tool({
    description: 'Search for videos ',
    parameters: searchSchema,
    execute: async ({ query }) => {
      let hasError = false
      // Append the search section
      const streamResults = createStreamableValue<string>()
      uiStream.append(<VideoSearchSection result={streamResults.value} />)

      let searchResult: SerperSearchResults | undefined
      let search = new URL(baseUrl)
      search.searchParams.append('keyword', query)
      search.searchParams.append('search_type', 'video')
      try {
        const response = await fetch(search, {
          method: 'GET'
        })
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        const Result = await response.json()
        const s: any[] = Result.data.result[11].data

        searchResult = {
          searchParameters: {
            q: query,
            type: 'video',
            engine: ''
          },
          videos: s.map((video: any, index) => {
            return {
              title: video.title,
              link: video.arcurl,
              snippet: video.description,
              imageUrl: video.pic,
              duration: '',
              source: 'bilibili',
              channel: video.author,
              date: video.pubdate,
              position: index
            }
          })
        }
      } catch (error) {
        console.error('Video Search API error:', error)
        hasError = true
      }

      if (hasError) {
        fullResponse = `An error occurred while searching for videos with "${query}.`
        uiStream.update(null)
        streamResults.done()
        return searchResult
      }

      streamResults.done(JSON.stringify(searchResult))

      return searchResult
    }
  })
