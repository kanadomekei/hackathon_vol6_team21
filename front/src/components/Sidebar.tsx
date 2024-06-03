import { Button } from "@/components/ui/button"

export default function Sidebar() {
  return (
    <div className="fixed left-0 top-0 flex">
      <div className="w-64 h-screen bg-gray-100 p-4 flex flex-col">
        <h1 className="text-2xl font-bold mb-4">app name</h1>
        <SidebarItem icon="home" label="Home" />
        <SidebarItem icon="search" label="Search" />
        <SidebarItem icon="about" label="About" />
        <UserProfile name="User Name" avatarUrl="/path/to/avatar.jpg" />
      </div>
    </div>
  )
}

function SidebarItem({ icon, label }: { icon: string, label: string }) {
  return (
    <div className="flex items-center space-x-2 p-2 hover:bg-gray-200 rounded">
      <i className={`icon-${icon}`} />
      <span>{label}</span>
    </div>
  )
}

function UserProfile({ name, avatarUrl }: { name: string, avatarUrl: string }) {
  return (
    <div className="flex items-center space-x-2 p-2 mt-auto">
      <img src={avatarUrl} alt={name} className="w-10 h-10 rounded-full" />
      <span>{name}</span>
    </div>
  )
}