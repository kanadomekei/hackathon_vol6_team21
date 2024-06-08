'use client';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import type { AxiosResponse } from 'axios';
import { useEffect } from 'react';
import Image from 'next/image';
import Login from '@/components/Login';
import Logout from '@/components/Logout';
import Sidebar from '@/components/Sidebar';

export default function Home() {
	const { data: session, status } = useSession();

	useEffect(() => {
		if (status === 'authenticated' && session?.user) {
			const { name, email } = session.user;
			axios.post(`http://localhost:8080/users/google-auth`, null, {
				params: { username: name, email: email }
			})
			.then((response: AxiosResponse) => {
				console.log('User authenticated:', response.data);
			})
			.catch((error: unknown) => {
				console.error('Error during authentication:', error);
			});
		}
	}, [status, session]);

	return (
		<div style={{ display: 'flex' }}>
			<Sidebar />
			<div style={{ marginLeft: 'auto' }}>
				{status === 'authenticated' ? (
					<div>
						<p>セッションの期限：{session.expires}</p>
						<p>ようこそ、{session.user?.name}さん</p>
						<p>メールアドレス：{session.user?.email}</p>
						{session.user?.image && (
							<p>
								プロフィール画像：
								<Image src={session.user.image} alt="プロフィール画像" width={50} height={50} />
							</p>
						)}
						<div>
							<Logout />
						</div>
					</div>
				) : (
					<Login />
				)}
			</div>
		</div>
	);
}