"use server";
import { initializeApp } from "firebase/app";
import { firestore } from "@/firebase";

import openai from "@/lib/openai";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  getFirestore,
} from "firebase/firestore";

import { InventoryItem } from "./page";

export async function submitItem(formData: FormData) {
  // let app: any = await getApp();
  // if (!app) {
  //   return;
  // }
  // const firestore = getFirestore(app);
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
  // let app: any = await getApp();
  // if (!app) {
  //   return;
  // }
  // const firestore = getFirestore(app);
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

// function getApp() {
//   const firebaseConfig = {
//     apiKey: process.env.FIREBASE_API,
//     authDomain: "pantry-app-f80a6.firebaseapp.com",
//     projectId: "pantry-app-f80a6",
//     storageBucket: "pantry-app-f80a6.appspot.com",
//     messagingSenderId: "237862940122",
//     appId: "1:237862940122:web:fa11fd3c9841e9920424e3",
//     measurementId: "G-6FWCPDR8S0",
//   };

//   return new Promise((resolve, reject) => {
//     try {
//       const app = initializeApp(firebaseConfig);
//       resolve(app);
//     } catch (error) {
//       reject(error);
//     }
//   });
// }
