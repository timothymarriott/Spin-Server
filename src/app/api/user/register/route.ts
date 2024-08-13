import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { db } from '~/server/db';
import { levels, users } from '~/server/db/schema';
import { randomUUID } from 'crypto';
import { eq } from 'drizzle-orm';

export async function POST(req: NextRequest){
    const {searchParams} = new URL(req.url);

    if (!searchParams.has("name") || !searchParams.has("password")){
        return NextResponse.json({ error: "Invalid Params" }, { status: 500 });
    }

    const username = searchParams.get("name")!
    const password = searchParams.get("password")!


    if ((await db.select().from(users).where(eq(users.name, username))).length > 0){
        return NextResponse.json({msg: "User already exists with username " + username}, { status: 200 })
    }


    try {
        await db.insert(users).values({name: username, password: password, guid: randomUUID()});
    } catch (error) {
        console.error("Database operation error: ", error);
        return NextResponse.json({ error: "Failed to create user." }, { status: 500 });
    }
    
    
    return NextResponse.json({msg: "User Registered"}, {status: 200})
}