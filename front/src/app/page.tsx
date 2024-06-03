import { Button } from "@/components/ui/button"
import Sidebar from "@/components/Sidebar"

export default function Component() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-6">
      <h1 className="text-5xl font-bold mb-8">アプリ名</h1>
      <div className="space-y-2 mb-8">
        <p className="text-lg">アプリの説明</p>
        <p className="text-lg">アプリの説明</p>
        <p className="text-lg">アプリの説明</p>
        <p className="text-lg">アプリの説明</p>
      </div>
      <Button className="bg-[#00BFFF] text-white">login</Button>
	  <Sidebar />
    </div>
  )
}