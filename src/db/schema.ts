import { relations } from "drizzle-orm"
import {
  boolean,
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
} from "drizzle-orm/pg-core"

// shared stuffs
export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  email: text("email").unique().notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
})

export const userRelations = relations(users, ({ many }) => ({
  usersToProfiles: many(usersToProfiles),
}))

// next auth stuffs
export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [
    {
      compoundKey: primaryKey({
        columns: [account.provider, account.providerAccountId],
      }),
    },
  ],
)

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
})

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verificationToken) => [
    {
      compositePk: primaryKey({
        columns: [verificationToken.identifier, verificationToken.token],
      }),
    },
  ],
)

export const authenticators = pgTable(
  "authenticator",
  {
    credentialID: text("credentialID").notNull().unique(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    providerAccountId: text("providerAccountId").notNull(),
    credentialPublicKey: text("credentialPublicKey").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: text("credentialDeviceType").notNull(),
    credentialBackedUp: boolean("credentialBackedUp").notNull(),
    transports: text("transports"),
  },
  (authenticator) => [
    {
      compositePK: primaryKey({
        columns: [authenticator.userId, authenticator.credentialID],
      }),
    },
  ],
)

// guppy stuffs
export const profiles = pgTable("profile", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull().unique(),
  title: text("title"),
  bio: text("bio"),
  image: text("image"),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).notNull().defaultNow(),
})

export const profileRelations = relations(profiles, ({ many }) => ({
  usersToProfiles: many(usersToProfiles),
  links: many(links),
}))

export type ProfileRole = "owner" | "collaborator"
export const usersToProfiles = pgTable(
  "users_to_profiles",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id),
    profileId: text("profileId")
      .notNull()
      .references(() => profiles.id),
    role: text("role").$type<ProfileRole>().notNull(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.profileId] })],
)
export const usersToProfilesRelations = relations(
  usersToProfiles,
  ({ one }) => ({
    profile: one(profiles, {
      fields: [usersToProfiles.profileId],
      references: [profiles.id],
    }),
    user: one(users, {
      fields: [usersToProfiles.userId],
      references: [users.id],
    }),
  }),
)

export type LinkType = "generic" | "youtube"
export const links = pgTable("link", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  profileId: text("profileId")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }),
  enabled: boolean("enabled").notNull().default(false),
  type: text("type").$type<LinkType>().notNull(),
  title: text("title").notNull(),
  url: text("url").notNull(),
  order: integer("order").notNull(),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).notNull().defaultNow(),
})

export const linkRelations = relations(links, ({ one }) => ({
  profile: one(profiles, {
    fields: [links.profileId],
    references: [profiles.id],
  }),
}))
