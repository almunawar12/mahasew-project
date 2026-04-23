import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash("admin123", 12);
  const userPassword = await bcrypt.hash("user123", 12);

  // Seed Admin
  const admin = await prisma.user.upsert({
    where: { email: "admin@mahasewa.com" },
    update: {},
    create: {
      email: "admin@mahasewa.com",
      name: "Admin MahaSewa",
      hashedPassword: adminPassword,
      role: UserRole.ADMIN,
      isVerified: true,
      emailVerified: new Date(),
    },
  });

  // Seed User
  const user = await prisma.user.upsert({
    where: { email: "user@mahasewa.com" },
    update: {},
    create: {
      email: "user@mahasewa.com",
      name: "Regular User",
      hashedPassword: userPassword,
      role: UserRole.USER,
      isVerified: true,
      emailVerified: new Date(),
    },
  });

  // Seed Owner
  const owner = await prisma.user.upsert({
    where: { email: "owner@mahasewa.com" },
    update: {},
    create: {
      email: "owner@mahasewa.com",
      name: "Business Owner",
      hashedPassword: userPassword,
      role: UserRole.OWNER,
      isVerified: true,
      emailVerified: new Date(),
    },
  });

  console.log("Seeding finished.");
  console.log({ admin: admin.email, user: user.email, owner: owner.email });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
