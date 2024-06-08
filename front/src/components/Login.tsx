import React from 'react';
import { useSession, signIn } from 'next-auth/react';

export default function Login() {
    const { data: session, status } = useSession();

    if (status === 'loading') {
        return <div>Loading...</div>;
    }

    if (status !== 'authenticated') {
        return (
            <div>
                <p>あなたはログインしていません</p>
                <button onClick={() => signIn('google', {}, { prompt: 'login' })}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300 ease-in-out">
                    Googleでログイン
                </button>
            </div>
        );
    }
    return null;
}