import Image from 'next/image'
import RecordingView from './components/RecordingView'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-gray-50">
      <RecordingView/>
    </main>
  )
}
