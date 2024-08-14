import Link from "next/link";
import { LevelList } from "./api/list/route";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "~/components/ui/dropdown-menu";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "~/components/ui/alert-dialog";
import { AlertDialogTrigger } from "@radix-ui/react-alert-dialog";
import { useState } from "react";
import { LevelListView } from "./components/LevelList";

export default async function HomePage() {

  const res = await fetch("http://127.0.0.1:3000/api/list", {cache: "no-store"});

  const levelList: LevelList = await res.json();

  return (
    <main className="min-h-screen ">
      <div className="container flex flex-col space-y-8" style={{width: "50vw"}}>
        <LevelListView list={levelList}></LevelListView>
      </div>
    </main>
  );
}
