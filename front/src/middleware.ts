import { withAuth } from 'next-auth/middleware'

export default withAuth({
  pages: {
    signIn: '/', // 未認証の場合にリダイレクトするページ
  },
})

export const config = {
  matcher: ['/((?!api|signin|_next|$).*)'],
}