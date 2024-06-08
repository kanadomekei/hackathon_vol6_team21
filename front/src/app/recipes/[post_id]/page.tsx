"use client";
import { useEffect, useState, FC} from 'react';

// interface Recipe {
//   ingredients: string;
//   instructions: string;
// }

export default function Page({
  params,
}: {
  params: { post_id : number };
}) {
  
  const [recipe_id, setRecipeid] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");

  
  useEffect(() => {
    fetch(`http://localhost:8080/recipes_by_post/${params.post_id}`)
      .then(response => {
        response.json();
        console.log(response);
      }
        )

      // .then(data => {
      //   // setIngredients(data.ingredients);
      //   // setInstructions(data.instructions);
      //   console.log(data);
      //   console.log("data");
      //   console.log(data.ingredients);
      //   console.log(ingredients);
      //   console.log(response.id);
      //   console.log(data.post_id);
      //   console.log(params.post_id);
      // })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

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
