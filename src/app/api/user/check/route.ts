import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { db } from '~/server/db';
import { levels, users } from '~/server/db/schema';
import { randomUUID } from 'crypto';
import { and, eq } from 'drizzle-orm';
import { error } from 'console';

export async function GET(req: NextRequest){
    const {searchParams} = new URL(req.url);

    if (!searchParams.has("name") || !searchParams.has("password")){
        return NextResponse.json({ error: "Invalid Params" }, { status: 500 });
    }

    const name = searchParams.get("name")!
    const password = searchParams.get("password")!

    if ((await db.select().from(users).where(and(eq(users.name, name), eq(users.password, password)))).length == 0){
        return NextResponse.json({error: "Access Denied"}, {status: 403})
    }

    return NextResponse.json({msg: "Access Granted"}, {status: 200})
}