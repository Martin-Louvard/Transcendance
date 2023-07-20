// prisma/seed.ts

import { PrismaClient } from '@prisma/client';

// initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
  // create two dummy articles
  const user1 = await prisma.user.upsert({
    where: { username: 'User1' },
    update: {},
    create: {
        username: 'User1',
        email: 'fakeEmail@gmail.com',
        password: '123',
    },
  });

  const user2 = await prisma.user.upsert({
    where: { username: 'User2' },
    update: {},
    create: {
        username: 'User2',
        email: 'fakeEmail2@gmail.com',
        password: '123',
      },
  });

  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
        username: 'admin',
        email: 'admin@gmail.com',
        password: 'admin',
      },
  });

  console.log({ user1, user2, admin });
}

// execute the main function
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // close Prisma Client at the end
    await prisma.$disconnect();
  });
