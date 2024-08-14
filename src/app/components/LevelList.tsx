"use client"

import Link from "next/link";
import { LevelList } from "~/app/api/list/route";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "~/components/ui/dropdown-menu";
import { DotsVerticalIcon, DownloadIcon } from "@radix-ui/react-icons";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "~/components/ui/alert-dialog";
import { AlertDialogTrigger } from "@radix-ui/react-alert-dialog";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { METHODS } from "http";
import { redirect, RedirectType } from "next/navigation";
import { doc } from "prettier";

export function LevelListView(props: {list: LevelList}) {
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [currentDeletion, setCurrentDeletion] = useState<{levelid:string, levelauthor:string}>();

    const [isValid, setIsValid] = useState(false);

    const [currPassword, setCurrPassword] = useState("")

    return (<>
    <AlertDialog open={showDeleteConfirmation}>

        <AlertDialogTrigger >
        
        </AlertDialogTrigger>
        <AlertDialogContent>
        <AlertDialogHeader>
            <AlertDialogTitle>Are You Sure?</AlertDialogTitle>
            <AlertDialogDescription>
            This action cannot be undone. The level will be perminently deleted and cannot be recovered.
            </AlertDialogDescription>
            <Input type="password" onChange={(e) => {
                fetch("http://127.0.0.1:3000/api/user/check?name=" + currentDeletion?.levelauthor + "&password=" + e.target.value).then((e) => {
                    setIsValid(e.status == 200)
                })
                setCurrPassword(e.target.value);
            }}  placeholder={"Enter Password for " + currentDeletion?.levelauthor}></Input>
        </AlertDialogHeader>
        <AlertDialogFooter>
            <AlertDialogCancel onClick={(e) => {
                setShowDeleteConfirmation(false);
            }}>Cancel</AlertDialogCancel>
            
            <Button onClick={(e) => {
                setShowDeleteConfirmation(false);
                if (isValid){
                    fetch(`http://127.0.0.1:3000/api/delete?id=${currentDeletion?.levelid}&name=${currentDeletion?.levelauthor}&password=${currPassword}`, {method: "POST"})
                }
            }} disabled={!isValid} variant={"destructive"}>
                Delete
            </Button>
        </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
    {props.list.levels.map((level, index) => {
        return (
            <Card key={index}>
            <CardHeader>
                <div className=" flex flex-row" style={{justifyContent: "space-between"}}>
                    <CardTitle>{level.name}</CardTitle>
                    <DropdownMenu>
                        <DropdownMenuTrigger><DotsVerticalIcon /></DropdownMenuTrigger>
                        <DropdownMenuContent>
                        
                            <DropdownMenuItem className=" *:text-red-600" onClick={(e) => {
                                setCurrentDeletion({levelauthor: level.author, levelid: level.guid})
                                setIsValid(false);
                                setShowDeleteConfirmation(true)
                            }}> <b>Delete</b> </DropdownMenuItem>

                            <DropdownMenuItem onClick={(e) => {
                                const url = "http://127.0.0.1:3000/api/download?id=" + level.guid;
                                
                                const obj = document.createElement("a");
                                obj.href = url;
                                obj.setAttribute("download", level.name + ".lvl");
                                document.body.appendChild(obj);
                                obj.click();
                                document.body.removeChild(obj);
                            }}> Download </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                
                <CardDescription>{level.guid} by {level.author}</CardDescription>
            </CardHeader>
            </Card>
        )
    })}
  
  </>)

}