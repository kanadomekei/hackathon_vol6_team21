import os
import base64
from openai import OpenAI

def encode_image(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode("utf-8")

def explain_dish(image_path):
    # 環境変数からOpenAI APIキーを取得
    openai_api_key = os.getenv('OPENAI_API_KEY')

    # 画像をbase64にエンコード
    base64_image = encode_image(image_path)

    # OpenAI APIのクライアントを作成
    client = OpenAI(api_key=openai_api_key)

    prompt_path = "./prompt.txt"
    with open(prompt_path, "r", encoding='utf-8') as prompt_file:
        prompt_text = prompt_file.read()

    print(type(prompt_text))
    print(prompt_text)
    
    # チャットの応答を生成
    response = client.chat.completions.create(
        model="gpt-4o-2024-05-13",
        messages=[
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": prompt_text},
                    {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{base64_image}"}}
                ],
            }
        ],
        max_tokens=1000,
    )

    return response.choices[0].message.content


if __name__ == "__main__":
# 関数を呼び出して結果を表示
    image_path = "../../data/image1.jpg"
    print(explain_dish(image_path))