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
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const userRelations = relations(user, ({ many }) => ({
  usersToProfiles: many(usersToProfiles),
}))

// next auth stuffs

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});


export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

// guppy stuffs
export const profiles = pgTable("profile", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  trackingId: text("trackingId").unique(),
  name: text("name").notNull().unique(),
  title: text("title"),
  bio: text("bio"),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
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
      .references(() => user.id),
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
    user: one(user, {
      fields: [usersToProfiles.userId],
      references: [user.id],
    }),
  }),
)

export type LinkType = "generic" | "youtube" | "image" | "steam"
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
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
})

export const linkRelations = relations(links, ({ one }) => ({
  profile: one(profiles, {
    fields: [links.profileId],
    references: [profiles.id],
  }),
}))
