import { createStreamableUI, createStreamableValue } from 'ai/rsc'
import { CoreMessage, generateText, LanguageModelV1, streamText } from 'ai'
import { getTools } from './tools'
import { getModel } from '../utils'
import { AnswerSection } from '@/components/answer-section'

const SYSTEM_PROMPT = `As a professional search expert, you possess the ability to search for any information on the web.
For each user query, utilize the search results to their fullest potential to provide additional information and assistance in your response.
If there are any images relevant to your answer, be sure to include them as well.
Aim to directly address the user's question, augmenting your response with insights gleaned from the search results.
for every query, use the tools 
Must be based on facts and search results, no fictional content such as examples.jpg etc.
you can use the tools for every query
and you can draw images if needed
`

// const SYSTEM_PROMPT = `
// 你是 Morphic 一名专业搜索专家，你拥有在网络上搜索任何信息的能力。
// <response_guidelines>
// 每次回答前都要利用搜索工具，为您的回答提供更多信息和帮助。
// 可以多次搜索不同的关键词或者语言。
// 如果有任何与您的回答相关的图片，也一定要附上。
// 确保所有回应都是基于事实。
// 专注于解决用户的请求或任务，不要偏离到不相关的话题。
// 目标是直接回答用户的问题，并通过从搜索结果中获得的见解来增强您的回复。
// 回答应该完整
// </response_guidelines>
// <constraints>
// 必须输出完整的回答
// 必须基于事实和搜索结果，不得使用 examples.jpg 等虚构内容
// </constraints>
// `

// <system_constraints>
// 你有以下工具：

// Search: Use this tool to search for information on the web.对于每个问题，请使用
// Retrieved : Use this tool to retrieve information from the web.对于每个问题，请使用

// midjourneyTool: Use this tool to generate images.只有需要时候才调用
// videoSearch: Use this tool to search for videos.只有需要时候才调用
// </system_constraints>
// `

export async function researcher(
  uiStream: ReturnType<typeof createStreamableUI>,
  messages: CoreMessage[],
  researcherModel?: LanguageModelV1,
  language: string = 'english'
) {
  // throw new Error(language)
  try {
    let fullResponse = ''
    const streamableText = createStreamableValue<string>()
    let toolResults: any[] = []

    const currentDate = new Date().toLocaleString()
    const result = await streamText({
      model: researcherModel || getModel(),
      system: `${SYSTEM_PROMPT} Current date and time: ${currentDate} , when search use *language: ${language}* to seacrh`,
      messages: messages,
      tools: getTools({
        uiStream,
        fullResponse
      }),
      maxSteps: 6,
      onStepFinish: async event => {
        if (event.stepType === 'initial') {
          if (event.toolCalls && event.toolCalls.length > 0) {
            uiStream.append(<AnswerSection result={streamableText.value} />)
            toolResults = event.toolResults
          } else {
            uiStream.update(<AnswerSection result={streamableText.value} />)
          }
        }
      }
    })

    for await (const delta of result.fullStream) {
      if (delta.type === 'text-delta' && delta.textDelta) {
        fullResponse += delta.textDelta
        streamableText.update(fullResponse)
      }
    }

    streamableText.done(fullResponse)

    return { text: fullResponse, toolResults }
  } catch (error) {
    console.error('Error in researcher:', error)
    return {
      text: 'An error has occurred. Please try again.',
      toolResults: []
    }
  }
}

export async function researcherWithOllama(
  uiStream: ReturnType<typeof createStreamableUI>,
  messages: CoreMessage[]
) {
  try {
    const fullResponse = ''
    const streamableText = createStreamableValue<string>()
    let toolResults: any[] = []

    const currentDate = new Date().toLocaleString()
    const result = await generateText({
      model: getModel(),
      system: `${SYSTEM_PROMPT} Current date and time: ${currentDate}`,
      messages: messages,
      tools: getTools({
        uiStream,
        fullResponse
      }),
      maxSteps: 5,
      onStepFinish: async event => {
        if (event.stepType === 'initial') {
          if (event.toolCalls) {
            uiStream.append(<AnswerSection result={streamableText.value} />)
            toolResults = event.toolResults
          } else {
            uiStream.update(<AnswerSection result={streamableText.value} />)
          }
        }
      }
    })

    streamableText.done(result.text)

    return { text: result.text, toolResults }
  } catch (error) {
    console.error('Error in researcherWithOllama:', error)
    return {
      text: 'An error has occurred. Please try again.',
      toolResults: []
    }
  }
}
