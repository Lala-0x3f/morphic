import { BotMessageSquareIcon, FishIcon } from 'lucide-react'
import { SiAnthropic, SiGoogle, SiMeta, SiOpenai } from 'react-icons/si'

const ModelIcon = ({ name }: { name: string }) => {
  switch (name.split(/[-.]/, 1)[0].toLocaleLowerCase()) {
    case 'openai':
      return <SiOpenai />
    case 'gpt':
      return <SiOpenai />
    case 'gemini':
      return <SiGoogle />
    case 'claude':
      return <SiAnthropic />
    case 'anthropic':
      return <SiAnthropic />
    case 'llama3':
      return <SiMeta />
    case 'meta':
      return <SiMeta />
    case 'llama':
      return <SiMeta />
    case 'deepseek':
      return <FishIcon size={16} />
    default:
      return <BotMessageSquareIcon size={16} />
  }
}

export default ModelIcon
