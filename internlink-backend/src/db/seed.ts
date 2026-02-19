import { db } from "./index";
import { companies } from "./schema";

const seedCompanies = [
  { name: "Ethio Telecom", email: "internships@ethiotelecom.et", address: "Addis Ababa, Ethiopia", acceptsInterns: true },
  { name: "Safaricom Ethiopia", email: "talent@safaricom.et", address: "Addis Ababa, Ethiopia", acceptsInterns: true },
  { name: "iCog Labs", email: "info@icog-labs.com", address: "Addis Ababa, Ethiopia", acceptsInterns: true },
  { name: "Kaizen Software", email: "hr@kaizensoftware.com", address: "Addis Ababa, Ethiopia", acceptsInterns: true },
  { name: "Flutterwave", email: "internships@flutterwave.com", address: "Lagos, Nigeria (Remote)", acceptsInterns: true },
  { name: "Andela", email: "talent@andela.com", address: "Remote", acceptsInterns: true },
  { name: "GeezSoft", email: "hr@geezsoft.com", address: "Addis Ababa, Ethiopia", acceptsInterns: false },
  { name: "Africa's Talking", email: "internships@africastalking.com", address: "Nairobi, Kenya (Remote)", acceptsInterns: true },
  { name: "Appslab Technologies", email: "careers@appslab.co.ke", address: "Nairobi, Kenya", acceptsInterns: true },
  { name: "Huawei Ethiopia", email: "et.hr@huawei.com", address: "Addis Ababa, Ethiopia", acceptsInterns: true },
  { name: "BelCash Technology", email: "hr@belcash.com", address: "Addis Ababa, Ethiopia", acceptsInterns: true },
  { name: "Zemen Bank IT", email: "it.internship@zemenbank.com", address: "Addis Ababa, Ethiopia", acceptsInterns: false },
  { name: "TechTalent Africa", email: "info@techtalentafrica.com", address: "Cape Town, South Africa (Remote)", acceptsInterns: true },
  { name: "NovaStar Ventures", email: "internships@novastarventures.com", address: "Nairobi, Kenya", acceptsInterns: true },
  { name: "Algorand Foundation", email: "internships@algorand.foundation", address: "Remote", acceptsInterns: true },
];

async function seed() {
  console.log("🌱 Seeding companies...");
  await db.insert(companies).values(seedCompanies).onConflictDoNothing();
  console.log(`✅ Seeded ${seedCompanies.length} companies`);
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
