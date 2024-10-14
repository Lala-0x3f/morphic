// import { StreamableValue, useStreamableValue } from 'ai/rsc'
import { Skeleton } from './ui/skeleton'
import { Alert, AlertDescription, AlertTitle } from './ui/alert'
import { AlertCircle } from 'lucide-react'
import { Mjcontent } from '@/lib/agents/tools/midjourney'
import { Spinner } from './ui/spinner'
import { SearchResultsImageSection } from './search-results-image'
import { generateId } from 'ai'

const MidjourneySection = ({
  message,
  pending
}: {
  message?: any
  pending: boolean
}) => {
  // console.clear()
  // console.log(typeof message)
  // console.log(message)
  //   if (error) {
  //     return (
  //       <Alert variant="destructive">
  //         <AlertCircle className="h-4 w-4" />
  //         <AlertTitle>Error</AlertTitle>
  //         <AlertDescription>
  //           <p>Midjourney Error</p>
  //         </AlertDescription>
  //       </Alert>
  //     )
  //   }
  let data: Mjcontent
  let generating = pending
  try {
    data = JSON.parse(message)
  } catch (e) {
    data = { hash: '', prompt: '', warning: '', content: '正在生成中...' }
    generating = true
  }

  const imageUrlBase = `https://cdn.midjourney.com/${data.hash}`
  const imageUrls = [
    `${imageUrlBase}/0_0.png`,
    `${imageUrlBase}/0_1.png`,
    `${imageUrlBase}/0_2.png`,
    `${imageUrlBase}/0_3.png`
  ]

  return (
    <div>
      <div className="w-full flex justify-center">
        <div className="md:max-w-[80%] w-full max-h-[60rem] flex flex-col justify-center gap-2">
          {!generating ? (
            message ? (
              <div className="*:min-h-48">
                <SearchResultsImageSection
                  images={imageUrls}
                  query={data.prompt}
                  mjresult
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {/* <a
                  href={imageUrls[0]}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={imageUrls[0]}
                    alt={message.content}
                    className="w-full object-contain rounded-2xl"
                  />
                </a>
                <p>{message.prompt}</p> */}
              </div>
            ) : (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  <p>Midjourney Error</p>
                </AlertDescription>
              </Alert>
            )
          ) : (
            <Skeleton className="h-[20rem] rounded-xl flex justify-center items-center w-[20rem] mx-auto">
              <Spinner />
            </Skeleton>
          )}
        </div>
      </div>
    </div>
  )
}

export default MidjourneySection
