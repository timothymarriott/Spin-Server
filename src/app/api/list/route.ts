import { drizzle } from 'drizzle-orm/mysql2';
import { NextRequest, NextResponse } from 'next/server';
import { db, dbConnection, ReconnectToDB } from '~/server/db';
import { levels } from '~/server/db/schema';

export interface LevelList{
    levels: {name: string, author: string, guid: string, url: string}[]
}

export async function GET(req: NextRequest){
    const {searchParams} = new URL(req.url);


    try {
        const selectedLevels = await db.select().from(levels);
        const res: any[] = [];
        selectedLevels.forEach(level => {
            res.push({name: level.name, author: level.author, guid: level.guid, url: level.file});
        });
        return NextResponse.json({levels: res}, {status: 200})
    } catch (error) {
        console.log("Connected to DB canceled " + JSON.stringify(error))
        try {
            await ReconnectToDB();
            return GET(req);
        } catch (_error) {
            console.log("Failed to connect to DB " + JSON.stringify(_error) + ".");
            return NextResponse.json({}, {status: 500})
        }
        
        
    }
    

    
}