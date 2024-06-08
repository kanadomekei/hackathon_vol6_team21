import '.././globals.css';
import { Inter } from 'next/font/google';
import NextAuthProvider from '@/providers/NextAuth';
import { Metadata } from 'next';
import Sidebar from "@/components/Sidebar"

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'xxxxxxx',
	description: 'xxxxxxx',
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<Sidebar />
				<NextAuthProvider>{children}</NextAuthProvider>
			</body>
		</html>
	);
}
