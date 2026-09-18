import { pgTable, uuid, text, boolean, timestamp, index } from 'drizzle-orm/pg-core';
import { user } from './auth-schema';

export const documents = pgTable('documents', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').references(() => user.id, { onDelete: 'cascade' }).unique(),
  cvUrl: text('cv_url'),
  supportLetterUrl: text('support_letter_url'),
  uploadedAt: timestamp('uploaded_at').defaultNow(),
});

export const companies = pgTable('companies', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  address: text('address'),
  telephone: text('telephone'),
  website: text('website'),
  acceptsInterns: boolean('accepts_interns').default(true),
  createdAt: timestamp('created_at').defaultNow(),
});

export const applications = pgTable('applications', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').references(() => user.id, { onDelete: 'cascade' }),
  companyId: uuid('company_id').references(() => companies.id, { onDelete: 'cascade' }),
  status: text('status').default('sent'),
  emailSubject: text('email_subject'),
  emailBody: text('email_body'),
  sentAt: timestamp('sent_at').defaultNow(),
}, (table) => [
  index('applications_user_id_idx').on(table.userId),
  index('applications_company_id_idx').on(table.companyId),
  index('applications_sent_at_idx').on(table.sentAt),
]);
