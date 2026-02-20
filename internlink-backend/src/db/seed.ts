import { db } from "./index";
import { companies } from "./schema";

const seedCompanies = [
  {
    name: "Hamouz",
    email: "hamuzy07@gmail.com",
    address: "Sabiyan, Dire Dawa",
    telephone: "+251938391771",
    website: "https://hamouz.vercel.app",
    acceptsInterns: true,
  },
  {
    name: "iceaddis",
    email: "contact@iceaddis.com",
    address: "Zewedu Building, Qelebet Menged, Bole",
    telephone: "+251 11 667 4804",
    website: "https://www.iceaddis.com",
    acceptsInterns: true,
  },
  {
    name: "Uptrine Technologies",
    email: "hello@uptrine.com",
    address: "Zewditu Street",
    telephone: "+251 933 206659",
    website: "https://www.uptrine.com",
    acceptsInterns: true,
  },
  {
    name: "360 Ground",
    email: "info@360ground.com",
    address: "#404 Rewina Building",
    telephone: "+251 911 257 276",
    website: "https://www.360ground.com",
    acceptsInterns: true,
  },
  {
    name: "iCog Labs",
    email: "info@icog-labs.com",
    address: "1st/F, ILI, Angola St",
    telephone: "+251 118 275 384",
    website: "https://icog-labs.com",
    acceptsInterns: true,
  },
  {
    name: "ETM Software PLC",
    email: "info@etmsoftwareplc.com",
    address: "Sao Thome & Principe St",
    telephone: "+251 923 780 688",
    website: "https://etmsoftwareplc.com",
    acceptsInterns: true,
  },
  {
    name: "Big Link Technology PLC",
    email: "info@biglinktechnology.com",
    address: "Mexico K/KARE Building, R-No 812",
    telephone: "+251 921 417 479",
    website: "http://biglinktechnology.com",
    acceptsInterns: true,
  },
  {
    name: "Aquila ICT Solution",
    email: "info@aquilaict.com",
    address: "Olompia, Retina Building",
    telephone: "+251 913 609 212",
    website: "https://aquilaict.com",
    acceptsInterns: true,
  },
  {
    name: "Gasha Consulting",
    email: "info@gashaconsulting.com",
    address: "Kirkos Subcity, Wereda 3, Near Wengelat Hintsa Wello Sefer",
    telephone: "+251 94 413 6472",
    website: "https://gashaconsulting.com",
    acceptsInterns: true,
  },
  {
    name: "UT Solutions PLC",
    email: "contact@utsolutionsplc.com",
    address: "Sheger Building 4th Floor Office No. 402",
    telephone: "+251 91 131 0694",
    website: "https://utsolutionsplc.com",
    acceptsInterns: true,
  },
  {
    name: "Prime Software Plc",
    email: "info@primetechplc.com",
    address: "Mexico (Mozambique St.), KKare Building 4th Floor Suite 48/2",
    telephone: "+251 91 379 8523",
    website: "https://primetechplc.com",
    acceptsInterns: true,
  },
  {
    name: "Vintage Technologies PLC",
    email: "marketing@vintechplc.com",
    address: "Meskel Flower (Sherifa Building) 4th Floor Office No. 401",
    telephone: "+251 91 677 2303",
    website: "https://www.vintechplc.com",
    acceptsInterns: true,
  },
  {
    name: "Minab IT Solutions PLC",
    email: "info@minabtech.com",
    address: "Bole (Behind DH Geda Tower, Afomi Building 3rd Floor)",
    telephone: "+251 91 399 8334",
    website: "https://www.minabtech.com",
    acceptsInterns: true,
  },
  {
    name: "Simbo Software Development PLC",
    email: "simbosoftware@gmail.com",
    address: "Meti (in front of Saphire Addis Hotel, Bole Subcity)",
    telephone: "+251 92 414 5848",
    website: "https://simbotechnology.com",
    acceptsInterns: true,
  },
];

async function seed() {
  console.log("🗑️  Clearing existing companies...");
  await db.delete(companies);
  console.log("🌱 Seeding companies...");
  await db.insert(companies).values(seedCompanies);
  console.log(`✅ Seeded ${seedCompanies.length} companies`);
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
