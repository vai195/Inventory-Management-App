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

type InventoryItem = {
  name: string;
  quantity?: number;
};

export default function Home() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  // const [item, setItem] = useState("");

  const updateInventory = async () => {
    const q = query(collection(firestore, "inventory"));
    const querySnapshot = await getDocs(q);
    const inventoryL: InventoryItem[] = [];
    querySnapshot.forEach((doc) => {
      inventoryL.push({ name: doc.id, ...doc.data() });
    });
    setInventory(inventoryL);
    //console.log(inventory);
  };

  const removeItem = async (item: InventoryItem) => {
    const docRef = doc(collection(firestore, "inventory"), item.name);
    // const docRef = doc(firestore, "inventory", item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await updateDoc(docRef, { quantity: quantity - 1 });
      }
    }
    toast({
      title: "Item removed",
      description: "The item has been removed from your inventory.",
    });
    await updateInventory();
  };

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
    await updateInventory();
  };

  const searchItem = async (item: string) => {
    const docRef = doc(firestore, "inventory", item);
    // const docRef = doc(firestore, "inventory", item);
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
      await updateInventory();
      setSearch("");
    }
  };

  useEffect(() => {
    updateInventory();
  }, [open]);

  // const handleOpen = () => {
  //   setOpen(true);
  // };
  // const handleClose = () => {
  //   setOpen(false);
  // };

  return (
    <main className='flex flex-col h-screen justify-center items-center gap-8 p-4  m-auto'>
      <h1 className='text-3xl font-semibold'>Inventory Management</h1>
      <Button onClick={() => setOpen(true)}>Add Item</Button>
      <div className='flex gap-2'>
        <Input value={search} onChange={(e) => setSearch(e.target.value)} />
        <Button onClick={() => searchItem(search)}>Search</Button>
      </div>
      <div className='max-h-[500px] overflow-y-auto'>
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
    </main>
  );
}
