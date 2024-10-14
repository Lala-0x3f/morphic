import { notFound, redirect } from 'next/navigation'
import { Chat } from '@/components/chat'
import { getChat } from '@/lib/actions/chat'
import { AI } from '@/app/actions'
import { Card, CardContent } from '@/components/ui/card'
import { useUser } from '@clerk/nextjs'
import { auth, currentUser } from '@clerk/nextjs/server'

export const maxDuration = 60

export interface SearchPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: SearchPageProps) {
  const chat = await getChat(params.id, 'anonymous')
  return {
    title: chat?.title.toString().slice(0, 50) || 'Search'
  }
}

export default async function SearchPage({ params }: SearchPageProps) {
  const { userId } = auth()

  const chat = await getChat(params.id)

  if (!chat) {
    redirect('/')
  }

  if (![userId, 'anonymous'].includes(chat?.userId)) {
    notFound()
  }

  return (
    <AI
      initialAIState={{
        chatId: chat.id,
        messages: chat.messages
      }}
    >
      {/* {userId}
      &&
      {chat.userId} */}
      <Chat id={params.id} />
    </AI>
  )
}
