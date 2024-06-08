
# Chef's AI
 料理に特化したSNSサイトです。<br >
 普段の料理や自慢の料理を画像で共有できます。 <br >
 画像から料理の原材料やレシピを提案することもできます。<br >
 <img width="300" alt="スクリーンショット 2024-06-09" src="https://github.com/kanadomekei/hackathon_vol6_team21/blob/yamagami/image/e1d7e100-9536-4821-b1e1-4fa152681144-x16.png?raw=true"><br >
 

# URL
http://the-view.work/ <br >
画面中部のログインボタンから、google認証を使ってログインできます。

# 使用技術
- Back
  - Python
  - fastapi
- DataBase
  - MySQL
  - RDS
- Strage
  - minio
  - s3
- Front
  - react
  - next.js
  - tailwindcss
  - shadcn/ui
  - figma
- Infra
  - aws
  - terrafrom
  - nginx
  - docker
  - github
  - github actions
- chatGPT
- google認証

# インフラ構成図
<img width="995" alt="スクリーンショット 2024-06-09" src="https://user-images.githubusercontent.com/60876388/81247155-3ccde300-9054-11ea-91eb-d06eb38a63b3.png">

## CircleCi CI/CD
- Githubへのpush時に、RspecとRubocopが自動で実行されます。
- masterブランチへのpushでは、RspecとRubocopが成功した場合、EC2への自動デプロイが実行されます

# 機能一覧
- ユーザー登録、ログイン機能
- SNS投稿機能
  - 画像投稿
  - いいね機能
- レシピ検索機能

# 今後の課題
- 今後の課題として以下のことを取り組んでいきます。
  - プロフィールなどの個人の設定
  - 検索履歴
  - 提案するレシピの精度と利便性の向上