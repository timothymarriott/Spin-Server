// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import { int, mysqlSchema, mysqlTable, mysqlTableCreator, text } from "drizzle-orm/mysql-core";
import {
  index,
  pgTableCreator,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = mysqlTableCreator((name) => `spin-server_${name}`);


export const levels = createTable(
  "level",
  {
    id: int("id").primaryKey().autoincrement(),
    name: text("name"),
    author: text("author"),
    guid: text("guid"),
    file: text("file").notNull()
  }
);

export const users = createTable(
  "user",
  {
    id: int("id").primaryKey().autoincrement(),
    name: text("name"),
    password: text("password"),
    guid: text("guid")
  }
);
