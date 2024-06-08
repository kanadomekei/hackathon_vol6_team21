"use client";
import { useEffect, useState, FC} from 'react';

export default function Page({
  params,
}: {
  params: { post_id : number };
}) {
  
  const [recipe_id, setRecipeid] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");

  useEffect(() => {
    fetch(`http://localhost:8080/recipes/by_post/${params.post_id}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => {
      console.log(data); // コンソールログでデータを出力
      setRecipeid(data.id);
      setIngredients(data.ingredients);
      setInstructions(data.instructions);
    })
    .catch(error => console.error('Error fetching recipe:', error));
  }, [params.post_id]);

  return (
    <>
      <div className="flex flex-wrap justify-center p-6 bg-white min-h-screen ml-64">
        this is {params.post_id}th receptだよ～<br></br>
        材料は{ingredients}<br></br>
        調理方法は{instructions}
      </div>
    </>
  )
}