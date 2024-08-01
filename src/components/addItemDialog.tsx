"use client";
import { collection, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { firestore } from "@/firebase";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "./ui/use-toast";

interface addItemDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

function AddItemDialog({ open, setOpen }: addItemDialogProps) {
  const [item, setItem] = useState("");
  const router = useRouter();
  const addItem = async (item: string) => {
    const docRef = doc(firestore, "inventory", item);
    // const docRef = doc(firestore, "inventory", item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await updateDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }
    toast({
      title: "Item added",
      description: "The item has been added to your inventory.",
    });
    setItem("");
    setOpen(false);
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogTitle>Add Item</DialogTitle>
        <form
          className='flex gap-2'
          onSubmit={(e) => {
            e.preventDefault();
            addItem(item);
          }}>
          <Input value={item} onChange={(e) => setItem(e.target.value)} />
          <Button type='submit'>Add</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AddItemDialog;
