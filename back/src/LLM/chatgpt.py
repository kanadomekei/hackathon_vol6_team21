import os
from langchain import OpenAI, ConversationChain

def explain_dish(image_path):
    # 環境変数からOpenAI APIキーを取得
    openai_api_key = os.getenv('OPENAI_API_KEY')

    # OpenAIのインスタンスを作成
    llm = OpenAI(api_key=openai_api_key)

    # 会話チェーンを作成
    conversation = ConversationChain(llm=llm)

    # 画像のパスを使って料理の説明を求める
    input_text = f"この画像の料理について説明してください: {image_path}"
    response = conversation.predict(input=input_text)

    return response

# 関数を呼び出して結果を表示
image_path = "data/image1.jpg"  
print(explain_dish(image_path))