import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";
export const notes = sqliteTable("notes", {
 id:text("id").primaryKey(), owner:text("owner").notNull(), category:text("category").notNull(), content:text("content").notNull(), starred:integer("starred").notNull().default(0), createdAt:text("created_at").notNull(), updatedAt:text("updated_at").notNull(),
},t=>[index("idx_notes_owner_created").on(t.owner,t.createdAt)]);
export const images = sqliteTable("images", {
 id:text("id").primaryKey(), noteId:text("note_id").notNull().references(()=>notes.id), owner:text("owner").notNull(), mime:text("mime").notNull(), name:text("name").notNull(),
},t=>[index("idx_images_owner_note").on(t.owner,t.noteId)]);
export const drafts = sqliteTable("drafts", {
 id:text("id").primaryKey(), owner:text("owner").notNull(), title:text("title").notNull(), content:text("content").notNull(), sourceIds:text("source_ids").notNull(), createdAt:text("created_at").notNull(), updatedAt:text("updated_at").notNull(),
},t=>[index("idx_drafts_owner_updated").on(t.owner,t.updatedAt)]);
