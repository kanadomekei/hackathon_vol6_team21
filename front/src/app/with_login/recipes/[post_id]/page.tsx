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

const Page: FC<PageProps> = ({ params }) => {
  const [recipe, setRecipe] = useState<Recipe | null>(null);

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

    fetchRecipe();
  }, [params.post_id]);

  return (
    <div className="flex flex-wrap justify-center p-6 bg-white min-h-screen ml-64">
      <title>chef's AI | Recipe</title>
      post_id: {params.post_id}<br />
      {recipe && recipe.details && (
        <div>
          <h2>{recipe.details.recipe_name}</h2>
          <h3>材料:</h3>
          <ul>
            {Object.entries(recipe.details.ingredients).map(([ingredient, amount]) => (
              <li key={ingredient}>{ingredient}: {amount}</li>
            ))}
          </ul>
          <h3>調理法:</h3>
          <ol>
            {recipe.details.cooking_process.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
};

export default Page;