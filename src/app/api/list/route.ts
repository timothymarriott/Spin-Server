import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/mysql2';
import { NextRequest, NextResponse } from 'next/server';
import { db, dbConnection, EnsureDBConnection, ReconnectToDB } from '~/server/db';
import { levels } from '~/server/db/schema';

export interface LevelList{
    levels: {name: string, author: string, guid: string, url: string}[]
}

export async function GET(req: NextRequest){

    return EnsureDBConnection(async () => {
        const {searchParams} = new URL(req.url);

        if (!searchParams.has("author")){
            const selectedLevels = await db.select().from(levels);
            const res: any[] = [];
            selectedLevels.forEach(level => {
                res.push({name: level.name, author: level.author, guid: level.guid, url: level.file});
            });
            return NextResponse.json({levels: res}, {status: 200})
        } else {
            const levelAuthor = searchParams.get("author")!;
            const selectedLevels = await db.select().from(levels).where(eq(levels.author, levelAuthor));
            const res: any[] = [];
            selectedLevels.forEach(level => {
                res.push({name: level.name, author: level.author, guid: level.guid, url: level.file});
            });
            return NextResponse.json({levels: res}, {status: 200})
        }


    });

}
