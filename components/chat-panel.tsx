'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import type { AI, UIState } from '@/app/actions'
import { useUIState, useActions, useAIState } from 'ai/rsc'
import { cn } from '@/lib/utils'
import { UserMessage } from './user-message'
import { Button } from './ui/button'
import { ArrowRight, CopyIcon, Plus } from 'lucide-react'
import { EmptyScreen } from './empty-screen'
import Textarea from 'react-textarea-autosize'
import { generateId, LanguageModelV1 } from 'ai'
import { useAppState } from '@/lib/utils/app-state'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Spinner } from './ui/spinner'
import { set } from 'zod'
import ModelIcon from './model-icon'
import Mascots from './mascots'
import { Protect, useUser } from '@clerk/nextjs'
import { toast } from 'sonner'

interface ChatPanelProps {
  messages: UIState
  query?: string
}

export function ChatPanel({ messages, query }: ChatPanelProps) {
  const [input, setInput] = useState('')
  const [showEmptyScreen, setShowEmptyScreen] = useState(false)
  const [, setMessages] = useUIState<typeof AI>()
  const [aiMessage, setAIMessage] = useAIState<typeof AI>()
  const { isGenerating, setIsGenerating } = useAppState()
  const { submit } = useActions()
  const router = useRouter()
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const isFirstRender = useRef(true) // For development environment
  const { isSignedIn, user, isLoaded } = useUser()

  // models select 添加模型列表，模型选择器等
  const [modelName, setModelName] = useState('')
  const [modelList, setModelList] = useState<LanguageModelV1[]>([])
  // 设置语言
  const [language, setLanguage] = useState('🇨🇳 中文')
  const [languageList, setLanguageList] = useState<string[]>([
    '🇬🇧 英语',
    '🇨🇳 中文',
    '🇫🇷 法语',
    '🇩🇪 德语',
    '✨ 当地语言'
  ])

  // const { isLoaded, organization, membership } = useOrganization()

  async function handleQuerySubmit(query: string, formData?: FormData) {
    setInput(query)
    setIsGenerating(true)

    // Add user message to UI state
    setMessages(currentMessages => [
      ...currentMessages,
      {
        id: generateId(),
        component: <UserMessage message={query} />
      }
    ])

    // Submit and get response message
    const data = formData || new FormData()
    if (!formData) {
      data.append('input', query)
    }
    const responseMessage = await submit(
      data,
      false,
      undefined,
      modelName,
      language
    )
    setMessages(currentMessages => [...currentMessages, responseMessage])
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    await handleQuerySubmit(input, formData)
  }

  // if query is not empty, submit the query
  useEffect(() => {
    if (isFirstRender.current && query && query.trim().length > 0) {
      handleQuerySubmit(query)
      isFirstRender.current = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

  useEffect(() => {
    const lastMessage = aiMessage.messages.slice(-1)[0]
    if (lastMessage?.type === 'followup' || lastMessage?.type === 'inquiry') {
      setIsGenerating(false)
    }
  }, [aiMessage, setIsGenerating])

  // Clear messages
  const handleClear = () => {
    setIsGenerating(false)
    setMessages([])
    setAIMessage({ messages: [], chatId: '' })
    setInput('')
    router.push('/')
  }

  useEffect(() => {
    // focus on input when the page loads
    inputRef.current?.focus()
    // setModelList()
    fetch('/api/models')
      .then(res => res.json())
      .then(data => {
        const ms: LanguageModelV1[] = data
        setModelList(ms)
        const m = localStorage.getItem('model')
        if (m && ms.length > 0) {
          setModelName(m)
        } else {
          setModelName(ms[0].modelId)
        }
      })
  }, [])

  const handleModelSwitch = (modelId: string) => {
    if (
      modelId &&
      modelId !== modelName &&
      modelList.find(model => model.modelId === modelId)
    ) {
      setModelName(modelId)
      localStorage.setItem('model', modelId)
    }
  }

  if (modelList.length === 0)
    return (
      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
        <Spinner />
      </div>
    )

  // If there are messages and the new button has not been pressed, display the new Button
  if (messages.length > 0) {
    return (
      <div className="fixed bottom-2 md:bottom-8 left-0 right-0 flex flex-col gap-2 justify-center items-center mx-auto pointer-events-none">
        <Button
          type="button"
          variant={'secondary'}
          className="rounded-full bg-secondary/80 group transition-all hover:scale-105 pointer-events-auto backdrop-blur-sm shadow-sm"
          onClick={() => handleClear()}
          disabled={isGenerating}
        >
          <span className="text-sm mr-0 group-hover:mr-2 relative group-hover:left-0 left-4 opacity-0 blur overflow-clip w-0 group-hover:w-8 group-hover:opacity-100 transition-all group-hover:blur-none duration-200">
            New
          </span>
          <Plus size={18} className="group-hover:rotate-180 transition-all" />
        </Button>
        <span className="font-mono text-accent-foreground/50 text-xs">
          Power by {modelName}
        </span>
      </div>
    )
  }

  if (query && query.trim().length > 0) {
    return null
  }

  return (
    <div
      className={
        'fixed bottom-8 left-0 right-0 top-10 mx-auto h-screen flex flex-col items-center justify-center'
      }
    >
      <div className="flex pb-8 space-y-2 items-center flex-col">
        <Mascots className="mb-2" />
        <h1 className="text-4xl font-semibold">Your Morphic</h1>
        <span className="font-mono text-accent-foreground/50 text-xs">
          Power by {modelName}
        </span>
      </div>
      <Protect
        permission="org:chat:create"
        // role="org:user"
        fallback={
          <div className="text-center">
            <p>🤗请联系管理员为你添加权限</p>
            <Button
              variant="link"
              onClick={() => {
                // 复制 userid 到剪贴板
                navigator.clipboard.writeText(user?.id || '')
                toast('userId 已复制')
              }}
              className="gap-2"
            >
              你的 id 是 {user?.id}
              <CopyIcon size={12} />
            </Button>
          </div>
        }
      >
        <form onSubmit={handleSubmit} className="max-w-2xl w-full px-6">
          <div className="relative flex items-center w-full">
            <Textarea
              ref={inputRef}
              name="input"
              rows={1}
              maxRows={5}
              tabIndex={0}
              placeholder="Ask a question..."
              spellCheck={false}
              value={input}
              className="resize-none w-full min-h-12 rounded-fill bg-muted border border-input pl-4 pr-10 pt-3 pb-1 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'"
              onChange={e => {
                setInput(e.target.value)
                setShowEmptyScreen(e.target.value.length === 0)
              }}
              onKeyDown={e => {
                // Enter should submit the form
                if (
                  e.key === 'Enter' &&
                  !e.shiftKey &&
                  !e.nativeEvent.isComposing
                ) {
                  // Prevent the default action to avoid adding a new line
                  if (input.trim().length === 0) {
                    e.preventDefault()
                    return
                  }
                  e.preventDefault()
                  const textarea = e.target as HTMLTextAreaElement
                  textarea.form?.requestSubmit()
                }
              }}
              onHeightChange={height => {
                // Ensure inputRef.current is defined
                if (!inputRef.current) return

                // The initial height and left padding is 70px and 2rem
                const initialHeight = 70
                // The initial border radius is 32px
                const initialBorder = 32
                // The height is incremented by multiples of 20px
                const multiple = (height - initialHeight) / 20

                // Decrease the border radius by 4px for each 20px height increase
                const newBorder = initialBorder - 4 * multiple
                // The lowest border radius will be 8px
                inputRef.current.style.borderRadius =
                  Math.max(8, newBorder) + 'px'
              }}
              onFocus={() => setShowEmptyScreen(true)}
              onBlur={() => setShowEmptyScreen(false)}
            />
            <Button
              type="submit"
              size={'icon'}
              variant={'ghost'}
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
              disabled={input.length === 0}
            >
              <ArrowRight size={20} />
            </Button>
          </div>
          <div className="w-full flex item-center gap-1">
            <Select
              onValueChange={v => {
                handleModelSwitch(v)
              }}
              value={modelName}
            >
              <SelectTrigger className="w-fit rounded-2xl my-2 h-8">
                <SelectValue
                  placeholder={modelList[0].modelId.replaceAll('-', ' ')}
                />
              </SelectTrigger>
              <SelectContent className="rounded-2xl">
                {modelList.map(model => {
                  return (
                    <SelectItem
                      key={model.modelId}
                      value={model.modelId}
                      className="rounded-xl "
                    >
                      <p className="flex gap-2 items-center">
                        <ModelIcon name={model.modelId} />
                        {model.modelId.replaceAll('-', ' ')}
                      </p>
                    </SelectItem>
                  )
                })}
                {/* <SelectItem value="light" className="rounded-xl">
              Light
            </SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
            <SelectItem value="system">System</SelectItem> */}
              </SelectContent>
            </Select>
            <Select
              onValueChange={v => {
                setLanguage(v)
              }}
              value={language}
            >
              <SelectTrigger className="w-fit rounded-2xl my-2 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-2xl">
                {languageList.map(language => {
                  return (
                    <SelectItem
                      key={language}
                      value={language}
                      className="rounded-xl"
                    >
                      {language}
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>
          <EmptyScreen
            submitMessage={message => {
              setInput(message)
            }}
            className={cn(showEmptyScreen ? 'visible' : 'invisible')}
          />
        </form>
      </Protect>
    </div>
  )
}
