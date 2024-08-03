"use client";

import { useState, useEffect } from "react";
import { firestore } from "../firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import AddItemDialog from "@/components/addItemDialog";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { addItem, createRecipe } from "./actions";
import Chatbox from "@/components/Chatbox";

export interface InventoryItem {
  name: string;
  quantity?: number;
}

export default function Home() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [recipe, setRecipe] = useState<string>("");

  const updateInventory = (cb: any) => {
    const q = query(collection(firestore, "inventory"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const results = querySnapshot.docs.map((doc) => {
        return { name: doc.id, ...doc.data() };
      });
      cb(results);
    });
    return unsubscribe;
  };

  const removeItem = async (item: InventoryItem) => {
    const docRef = doc(collection(firestore, "inventory"), item.name);

    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
        toast({
          title: "Item removed",
          description: "The item has been removed from your inventory.",
        });
      } else {
        await updateDoc(docRef, { quantity: quantity - 1 });
      }
    }
  };

  const searchItem = async (item: string) => {
    if (item === "") {
      toast({
        title: "Item not found",
        description: "The item you are looking for does not exist.",
        variant: "destructive",
      });
      return;
    }
    const docRef = doc(firestore, "inventory", item);

    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setInventory([{ name: item, ...docSnap.data() }]);
      setSearch("");
    } else {
      toast({
        title: "Item not found",
        description: "The item you are looking for does not exist.",
        variant: "destructive",
      });

      setSearch("");
    }
  };

  useEffect(() => {
    const unsubscribe = updateInventory((data: any) => {
      setInventory(data);
    });
    return () => unsubscribe();
  }, []);

  return (
    <main className='flex flex-col justify-center items-center gap-8 p-4  m-auto'>
      <h1 className='text-3xl font-semibold'>Inventory Management</h1>
      <Button onClick={() => setOpen(true)}>Add Item</Button>
      <div className='flex gap-2'>
        <Input value={search} onChange={(e) => setSearch(e.target.value)} />
        <Button onClick={() => searchItem(search)}>Search</Button>
      </div>
      <div className='h-[250px] mt-3 px-3 overflow-y-auto'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead className='text-right'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inventory.map(({ name, quantity }) => {
              return (
                <TableRow key={name}>
                  <TableCell>{name}</TableCell>
                  <TableCell>{quantity}</TableCell>
                  <TableCell className='flex gap-2 justify-end'>
                    <Button onClick={() => addItem(name)}>Add</Button>
                    <Button onClick={() => removeItem({ name, quantity })}>
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <AddItemDialog open={open} setOpen={setOpen} />

      <Chatbox items={inventory} />
    </main>
  );
}
