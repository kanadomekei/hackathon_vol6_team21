"use client";
import { useEffect, useState, FC } from 'react';

interface PageProps {
  params: { post_id: number };
}

interface Recipe {
  post_id: number;
  created_at: string;
  id: number;
  details: {
    ingredients: Record<string, string>;
    recipe_name: string;
    cooking_process: string[];
  };
}

interface Post {
  caption: string;
  id: number;
  user_id: number;
  image_url: string;
  created_at: string;
}

const Page: FC<PageProps> = ({ params }) => {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await fetch(`http://localhost:8080/recipes/by_post/${params.post_id}`, {
          headers: {
            'accept': 'application/json',
          },
        });
        const data = await response.json();
        setRecipe(data);
      } catch (error) {
        console.error('Error fetching recipe:', error);
      }
    };
    
    const fetchPost = async () => {
      try {
        const response = await fetch(`http://localhost:8080/posts/${params.post_id}`, {
          headers: {
            'accept': 'application/json',
          },
        });
        const data = await response.json();
        console.log(response);
        console.log(data);
        setPost(data);
      } catch (error) {
        console.error('Error fetching recipe:', error);
      }
    };

    fetchRecipe();
    fetchPost();
  }, [params.post_id]);

  return (
    <div className="flex flex-wrap justify-center p-6 bg-white min-h-screen ml-64">
      <title>recipe</title>
      {recipe && recipe.details && (
        <div>
          
          <h1 className="font-bold text-xl mb-2">
            レシピNo.{params.post_id} {recipe.details.recipe_name}
          </h1>
          <p className="font-bold">材料</p>
          <ul className="mt-2 divide-y divide-gray-200">
            {Object.entries(recipe.details.ingredients).map(([ingredient, amount]) => (
              <li className="flex justify-between py-2" key={ingredient}>
                <span> {ingredient} </span>
                <span> {amount} </span>
              </li>
              ))}
          </ul>
          <br />
          <p className="font-bold">調理方法</p>
          <ol className="mt-2 divide-y divide-gray-200">
            {recipe.details.cooking_process.map((step, index) => (
              <li className="flex justify-between py-2" key={index}>{index + 1}.{step}</li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
};

export default Page;