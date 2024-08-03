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
import { addItem, submitItem } from "@/app/actions";
import SubmitButton from "./SubmitButton";

interface addItemDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

function AddItemDialog({ open, setOpen }: addItemDialogProps) {
  const [item, setItem] = useState("");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogTitle>Add Item</DialogTitle>
        <form
          action={async (formdata: FormData) => {
            await submitItem(formdata);
            toast({
              title: "Item added",
              description: "The item has been added to your inventory.",
            });
            setItem("");
            setOpen(false);
          }}
          className='flex gap-2'>
          <Input
            value={item}
            onChange={(e) => setItem(e.target.value)}
            placeholder='Item'
            name='name'
          />
          <SubmitButton />
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AddItemDialog;
