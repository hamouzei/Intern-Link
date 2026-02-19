import { pgTable, uuid, text, boolean, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  fullName: text('full_name').notNull(),
  email: text('email').unique().notNull(),
  provider: text('provider').notNull(), // 'google' | 'github'
  providerId: text('provider_id').notNull(),
  profileImage: text('profile_image'),
  university: text('university'),
  roleApplied: text('role_applied'),
  githubLink: text('github_link'),
  portfolioLink: text('portfolio_link'),
  bio: text('bio'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const documents = pgTable('documents', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  cvUrl: text('cv_url'),
  supportLetterUrl: text('support_letter_url'),
  uploadedAt: timestamp('uploaded_at').defaultNow(),
});

export const companies = pgTable('companies', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  address: text('address'),
  acceptsInterns: boolean('accepts_interns').default(true),
  createdAt: timestamp('created_at').defaultNow(),
});

export const applications = pgTable('applications', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  companyId: uuid('company_id').references(() => companies.id, { onDelete: 'cascade' }),
  status: text('status').default('sent'),
  emailSubject: text('email_subject'),
  emailBody: text('email_body'),
  sentAt: timestamp('sent_at').defaultNow(),
});
