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
        <img
            src="/images/chefsAI_black.png"
            alt="chefsAI_black"
            className="w-[400px] h-[120px] mb-4"
            />

        <SidebarItem icon="/images/home.png" label="Home" href="/" />
        <SidebarItem icon="/images/search.png" label="Search" href="/with_login/search" />
        <SidebarItem icon="/images/book.png" label="About" href="/with_login/about" />
        <SidebarItem icon="/images/camera.png" label="images" href="/with_login/images" />
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
    <Link href={href}className="flex items-center p-2 text-lg hover:bg-gray-200 rounded mb-2">
      <img
            src={icon}
            alt="icon"
            className="w-[40px] h-[40px] mr-4"
            />
      <p className="text-3xl font-roboto text-[#000000]">
              {label}
            </p>
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