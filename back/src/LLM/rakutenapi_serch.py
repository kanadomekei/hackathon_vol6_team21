import requests
import json
import time
import pandas as pd
from pprint import pprint

def get_recipe(keyword):

    df = pd.read_csv('/home/yamagami0413/file/hackathon_vol6_team21/back/src/LLM/rakutenapi.csv')

    #2. キーワードからカテゴリを抽出する
    df_keyword = df.query('categoryName.str.contains(@keyword)', engine='python')

    #3. 人気レシピを取得する
    columns=['recipeId', 'recipeTitle', 'foodImageUrl', 'recipeMaterial', 'recipeCost', 'recipeIndication', 'categoryId', 'categoryName']
    df_recipe = pd.DataFrame(columns=columns)

    for index, row in df_keyword.iterrows():
        time.sleep(3) # 連続でアクセスすると先方のサーバに負荷がかかるので少し待つのがマナー

        url = 'https://app.rakuten.co.jp/services/api/Recipe/CategoryRanking/20170426?applicationId=1032990542185021240&categoryId='+row['categoryId']
        res = requests.get(url)

        json_data = json.loads(res.text)
        recipes = json_data['result']

        count = 0

        for recipe in recipes:
            if count != 2:
                df_append = pd.DataFrame({'recipeId':[recipe['recipeId']],'recipeTitle':[recipe['recipeTitle']],'foodImageUrl':[recipe['foodImageUrl']],'recipeMaterial':[recipe['recipeMaterial']],'recipeCost':[recipe['recipeCost']],'recipeIndication':[recipe['recipeIndication']],'categoryId':[row['categoryId']],'categoryName':[row['categoryName']]}, columns = columns)
                df_recipe = pd.concat([df_recipe,df_append],ignore_index=True,axis = 0)
                count += 1
            else: break
    
    return df_recipe


if __name__ == "__main__":
# 関数を呼び出して結果を表示
    keyword = "カルパッチョ"
    print(get_recipe(keyword))