// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
// initialize Prisma Client
const prisma = new PrismaClient();

const roundsOfHashing = 10;


async function main() {

  const commonpassword = await bcrypt.hash('123', roundsOfHashing);
  const adminpassword = await bcrypt.hash('admin', roundsOfHashing);
  
  // create one admin user
  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: { password: adminpassword },
    create: {
        username: 'admin',
        email: 'admin@gmail.com',
        password: adminpassword,

      },
  });


  // create two common users
  const user1 = await prisma.user.upsert({
    where: { username: 'User1' },
    update: { password: commonpassword },
    create: {
        username: 'User1',
        email: 'fakeEmail@gmail.com',
        password: commonpassword ,
        //friends: {
         // create:[{friend_id: admin.id}]
        //}
    },
  });

  const user2 = await prisma.user.upsert({
    where: { username: 'User2' },
    update: { password: commonpassword },
    create: {
        username: 'User2',
        email: 'fakeEmail2@gmail.com',
        password: commonpassword,
        //friends: {
         // create:[{friend_id: admin.id}]
        //}
      },
  });

  const user42 = await prisma.user.upsert({
    where: { username: 'User42' },
    update: { password: commonpassword },
    create: {
        username: 'User42',
        email: 'fakeEmail42@gmail.com',
        email42: '42email@stud42.fr',
        password: commonpassword ,
        //friends: {
        //  create:[{friend_id: admin.id}]
        //}
    },
  });


  console.log({ user1, user2, user42, admin });
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
