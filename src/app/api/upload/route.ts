import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { db, EnsureDBConnection } from '~/server/db';
import { levels, users } from '~/server/db/schema';
import { randomUUID } from 'crypto';
import { and, eq } from 'drizzle-orm';
import { error } from 'console';

export async function POST(req: NextRequest){
    return EnsureDBConnection(async () => {
        const {searchParams} = new URL(req.url);

        if (!searchParams.has("name") || !searchParams.has("author") || !searchParams.has("password")){
            return NextResponse.json({ error: "Invalid Params" }, { status: 500 });
        }

        const levelName = searchParams.get("name")!
        const levelAuthor = searchParams.get("author")!
        const levelAuthorPassword = searchParams.get("password")!

        if ((await db.select().from(users).where(and(eq(users.name, levelAuthor), eq(users.password, levelAuthorPassword)))).length == 0){
            return NextResponse.json({error: "Access Denied"}, {status: 403})
        }

        if ((await db.select().from(levels).where(and(eq(levels.name, levelName), eq(levels.author, levelAuthor)))).length > 0){
            return NextResponse.json({error: "Level already exists."}, {status: 200})
        }

        console.log("Uploaded " + levelName + " by " + levelAuthor);

        const fileContents = await req.arrayBuffer();

        const fileGuid = randomUUID();


        // Create a unique filename and save the file
        const fileName = `${fileGuid}.lvl`;
        const filePath = path.join(process.cwd(), "public", 'uploads', fileName);

        try {
            await fs.mkdir(path.dirname(filePath), { recursive: true });
            await fs.writeFile(filePath, Buffer.from(fileContents));
        } catch (error) {
            console.error("File operation error:", error);
            return NextResponse.json({ error: "Failed to save file" }, { status: 500 });
        }



        // Create the file URL
        const fileUrl = `/api/download?id=` + fileGuid;

        try {
            await db.insert(levels).values({name: levelName, author: levelAuthor, file: fileUrl, guid: fileGuid});
        } catch (error) {
            console.error("Database operation error: ", error);
            await fs.rm(filePath);
            return NextResponse.json({ error: "Failed to save to database" }, { status: 500 });
        }


        return NextResponse.json({name: levelName, author: levelAuthor, guid: fileGuid, url: fileUrl}, {status: 200})
    })
}
