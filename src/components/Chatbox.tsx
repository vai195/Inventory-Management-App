"use client";
import { cn } from "@/lib/utils";
import { useChat } from "ai/react";
import { Button } from "./ui/button";
import { createRecipe } from "@/app/actions";
import { InventoryItem } from "@/app/page";
import { Input } from "postcss";
import { useState } from "react";

function Chatbox({ items }: { items: InventoryItem[] }) {
  const [recipe, setRecipe] = useState<string>("");
  return (
    <>
      <Button
        onClick={async () => {
          const r: string | undefined | null = await createRecipe(items);
          if (r) setRecipe(r);
        }}>
        Generate Recipe
      </Button>
      <div className='border bg-black text-white w-[500px] h-[600px] p-4'>
        <h1>Recipe Generator</h1>
        <div className='h-full mt-3 px-3 overflow-y-auto'>
          <p className='whitespace-pre-line'>{recipe}</p>
        </div>
      </div>
    </>
  );
}

export default Chatbox;
