import { CoreMessage, generateObject, LanguageModelV1 } from 'ai'
import { nextActionSchema } from '../schema/next-action'
import { getModel } from '../utils'

// Decide whether inquiry is required for the user input
export async function taskManager(
  messages: CoreMessage[],
  model: LanguageModelV1
) {
  try {
    const result = await generateObject({
      model: model,
      system: `As a professional web researcher, your primary objective is to fully comprehend the user's query, conduct thorough web searches to gather the necessary information, and provide an appropriate response.
    To achieve this, you must first analyze the user's input and determine the optimal course of action. You have two options at your disposal:
    1. "proceed": If the provided information is sufficient to address the query effectively, choose this option to proceed with the research and formulate a response.
    2. "inquire": If you believe that additional information from the user would enhance your ability to provide a comprehensive response, select this option. You may present a form to the user, offering default selections or free-form input fields, to gather the required details.
    Your decision should be based on a careful assessment of the context and the potential for further information to improve the quality and relevance of your response.
    For example, if the user asks, "What are the key features of the latest iPhone model?", you may choose to "proceed" as the query is clear and can be answered effectively with web research alone.
    However, if the user asks, "What's the best smartphone for my needs?", you may opt to "inquire" and present a form asking about their specific requirements, budget, and preferred features to provide a more tailored recommendation.
    Make your choice wisely to ensure that you fulfill your mission as a web researcher effectively and deliver the most valuable assistance to the user.
    `,

      //   system: `作为一名专业的网络研究员，您的首要目标是充分理解用户的询问，进行彻底的网络搜索以收集必要的信息，并提供适当的回复。
      //   As a professional web researcher, your primary objective is to fully comprehend the user's query, conduct thorough web searches to gather the necessary information, and provide an appropriate response.
      // 为此，您必须首先分析用户输入的信息，并确定最佳行动方案。您有两种选择可供选择：
      // 1. "proceed"： 如果所提供的信息足以有效解决查询问题，则选择该选项继续进行研究并制定回复。
      // 2. "inquire"： 如果您认为从用户那里获得更多信息会增强您提供全面答复的能力，请选择此选项。您可以向用户提供一份表格，提供默认选项或自由输入字段，以收集所需的详细信息。
      // 您的决定应基于对上下文的仔细评估，以及进一步获取信息以提高回复质量和相关性的可能性。
      // 例如，如果用户问 “最新款 iPhone 的主要功能是什么？”，你可能会选择 “proceed”，因为这个问题很明确，仅通过网络研究就能有效回答。
      // 但是，如果用户问 "什么是最符合我需求的智能手机？"，你可以选择 "inquire"，并提交一份表单，询问用户的具体要求、预算和偏好功能，从而提供更有针对性的建议。
      // 做出明智的选择，确保您有效地完成网络研究员的使命，为用户提供最有价值的帮助。
      // `,
      messages,
      schema: nextActionSchema
    })

    return result
  } catch (error) {
    console.error(error)
    return null
  }
}
