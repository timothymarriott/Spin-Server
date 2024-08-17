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

        if (!searchParams.has("id") || !searchParams.has("name") || !searchParams.has("password")){
            return NextResponse.json({ error: "Invalid Params" }, { status: 500 });
        }



        const levelId = searchParams.get("id")!
        const levelAuthor = searchParams.get("name")!
        const levelAuthorPassword = searchParams.get("password")!

        if ((await db.select().from(users).where(and(eq(users.name, levelAuthor), eq(users.password, levelAuthorPassword)))).length == 0){
            return NextResponse.json({error: "Access Denied"}, {status: 403})
        }

        if ((await db.select().from(levels).where(and(eq(levels.guid, levelId), eq(levels.author, levelAuthor)))).length == 0){
            return NextResponse.json({error: "Level not found."}, {status: 404})
        }

        await db.delete(levels).where(and(eq(levels.guid, levelId), eq(levels.author, levelAuthor)));

        return NextResponse.json({msg: "Level Deleted"}, {status: 200})
    });
}
