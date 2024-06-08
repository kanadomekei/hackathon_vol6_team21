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
      post_id: {params.post_id}<br />
      {recipe && (
        <div>
          <pre>{JSON.stringify(recipe, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default Page;