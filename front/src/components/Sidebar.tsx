"use client";
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { signOut } from 'next-auth/react';


export default function Sidebar() {
  const { data: session } = useSession();

  return (
    <div className="fixed left-0 top-0 flex">
      <div className="w-64 h-screen bg-gray-100 p-4 flex flex-col">
        <h1 className="text-2xl font-bold mb-4">app name</h1>
        <SidebarItem icon="home" label="Home" href="/" />
        <SidebarItem icon="search" label="Search" href="/with_login/search" />
        <SidebarItem icon="about" label="About" href="/with_login/about" />
        <SidebarItem icon="画像一覧" label="images" href="/with_login/images" />
        {session && session.user ? (
          <>
            <UserProfile name={session.user.name || ''} avatarUrl={session.user.image || ''} />
            <button onClick={() => signOut()} className="mt-4 p-2 bg-red-500 text-white rounded">
              ログアウト
            </button>
          </>
        ) : (
          <Link href="/api/auth/signin">
            ログイン
          </Link>
        )}
      </div>
    </div>
  )
}

function SidebarItem({ icon, label, href }: { icon: string, label: string, href: string }) {
  return (
    <Link href={href}>
        <i className={`icon-${icon}`} />
        <span>{label}</span>
    </Link>
  )
}

function UserProfile({ name, avatarUrl }: { name: string, avatarUrl: string }) {
  return (
    <div className="flex items-center space-x-2 p-2 mt-auto">
      <Image src={avatarUrl} alt={name} width={40} height={40} className="rounded-full" />
      <span>{name}</span>
    </div>
  )
}