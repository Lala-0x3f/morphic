'use client'

import { useEffect, useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { useActions, useUIState } from 'ai/rsc'
import type { AI } from '@/app/actions'
import { UserMessage } from './user-message'
import { ArrowRight } from 'lucide-react'
import { useAppState } from '@/lib/utils/app-state'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from './ui/select'
import { LanguageModelV1 } from 'ai'
import ModelIcon from './model-icon'

export function FollowupPanel() {
  const [input, setInput] = useState('')
  const { submit } = useActions()
  const [, setMessages] = useUIState<typeof AI>()
  const { isGenerating, setIsGenerating } = useAppState()
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

  useEffect(() => {
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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (isGenerating) return

    setIsGenerating(true)
    setInput('')

    const formData = new FormData(event.currentTarget as HTMLFormElement)

    const userMessage = {
      id: Date.now(),
      isGenerating: false,
      component: <UserMessage message={input} />
    }

    const responseMessage = await submit(
      formData,
      false,
      undefined,
      modelName,
      language
    )
    setMessages(currentMessages => [
      ...currentMessages,
      userMessage,
      responseMessage
    ])
  }

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="relative flex items-center space-x-1"
      >
        <Input
          type="text"
          name="input"
          placeholder="Ask a follow-up question..."
          value={input}
          className="pr-14 h-12 rounded-3xl"
          onChange={e => setInput(e.target.value)}
        />
        <Button
          type="submit"
          size={'icon'}
          disabled={input.length === 0 || isGenerating}
          variant={'ghost'}
          className="absolute right-1"
        >
          <ArrowRight size={20} />
        </Button>
      </form>
      {modelList.length > 0 ? (
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
      ) : null}
    </div>
  )
}
