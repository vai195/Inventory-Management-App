"use server";

import { firestore } from "@/firebase";
import openai from "@/lib/openai";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

import { InventoryItem } from "./page";

export async function submitItem(formData: FormData) {
  const docRef = doc(firestore, "inventory", formData.get("name") as string);

  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const { quantity } = docSnap.data();
    await updateDoc(docRef, { quantity: quantity + 1 });
  } else {
    await setDoc(docRef, { quantity: 1 });
  }
}

export const addItem = async (item: string) => {
  const docRef = doc(firestore, "inventory", item);

  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const { quantity } = docSnap.data();
    await updateDoc(docRef, { quantity: quantity + 1 });
  } else {
    await setDoc(docRef, { quantity: 1 });
  }
};

export const createRecipe = async (items: InventoryItem[]) => {
  try {
    const completion = await openai.chat.completions.create({
      model: "meta-llama/llama-3.1-8b-instruct:free",

      messages: [
        {
          role: "user",
          content:
            "Create a recipe for me based on what I have in my pantry:\n" +
            items
              .map(
                (item: { name: string; quantity?: number }) =>
                  `Item Name: ${item.name} Quantity: ${item.quantity}`
              )
              .join("\n\n"),
        },
      ],
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.log(error);
  }
};
