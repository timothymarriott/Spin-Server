import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise"

import { env } from "~/env";
import * as schema from "./schema";

/**
 * Cache the database connection in development. This avoids creating a new connection on every HMR
 * update.
 */

const conn = await mysql.createConnection(env.DATABASE_URL);

export const dbConnection = conn;
export const db = drizzle(conn);
