import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise"

import { env } from "~/env";
import * as schema from "./schema";
import { levels } from "./schema";
import { NextResponse } from "next/server";

/**
 * Cache the database connection in development. This avoids creating a new connection on every HMR
 * update.
 */

let conn = await mysql.createConnection({
  uri: env.DATABASE_URL
});

export const dbConnection = conn;
export let db = drizzle(conn);

export async function ReconnectToDB(){
  conn = await mysql.createConnection({
    uri: env.DATABASE_URL
  });
  db = drizzle(conn);
}

export async function EnsureDBConnection(onsuccess: () => Promise<NextResponse>): Promise<NextResponse>{
    try {
        const selectedLevels = await db.select().from(levels);

        return onsuccess();

    } catch (error) {
        console.log("Connected to DB canceled " + JSON.stringify(error))
        try {
            await ReconnectToDB();
            return EnsureDBConnection(onsuccess);


        } catch (_error) {
            console.log("Failed to connect to DB " + JSON.stringify(_error) + ".");
            return NextResponse.json({}, {status: 500});

        }


    }
}
