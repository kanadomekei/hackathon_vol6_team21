import React from 'react';
import { useSession, signOut } from 'next-auth/react';

export default function Logout() {
    const { data: session, status } = useSession();

    if (status === 'authenticated') {
        return (
            <div>
                <button onClick={() => signOut()}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-300 ease-in-out">
                    ログアウト
                </button>
            </div>
        );
    }
    return null;
}