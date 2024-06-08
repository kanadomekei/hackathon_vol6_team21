'use client';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import type { AxiosResponse } from 'axios';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation'; // 修正箇所
import Image from 'next/image';
import Login from '@/components/Login';
import Logout from '@/components/Logout';

export default function Home() {
	const { data: session, status } = useSession();
	const router = useRouter();

	useEffect(() => {
		if (status === 'authenticated' && session?.user) {
			const { name, email } = session.user;
			axios.post(`http://localhost:8080/users/google-auth`, null, {
				params: { username: name, email: email }
			})
			.then((response: AxiosResponse) => {
				console.log('User authenticated:', response.data);
				router.push('/with_login/about'); // ログイン後に遷移
			})
			.catch((error: unknown) => {
				console.error('Error during authentication:', error);
			});
		}
	}, [status, session, router]);

	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center bg-fixed" style={{backgroundImage:'url(/images/title.png)'}}>
			<div className="flex flex-col items-center mb-8">
				<Image
					src="/images/logo.png"
					alt="Chef's hat and utensils icon"
					width={400}
					height={400}
					className="mb-4"
				/>
			</div>
			<div className="text-center">
				<p className="text-4xl font-roboto text-[#000000] mb-4">
					写真からレシピが生まれる！
				</p>
				<p className="text-3xl font-roboto text-[#000000] mb-4">
					簡単クッキングで、毎日の食卓をもっと豊かに！
				</p>
				{status === 'authenticated' ? <Logout /> : <Login />}
			</div>
		</div>
	);
}