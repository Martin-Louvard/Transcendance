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
      password: commonpassword,
    },
  });

  const user2 = await prisma.user.upsert({
    where: { username: 'User2' },
    update: { password: commonpassword },
    create: {
      username: 'User2',
      email: 'fakeEmail2@gmail.com',
      password: commonpassword,
    },
  });

  const user3 = await prisma.user.upsert({
    where: { username: 'User3' },
    update: { password: commonpassword },
    create: {
      username: 'User3',
      email: 'fakeEmail3@gmail.com',
      password: commonpassword,
    },
  });

  const user4 = await prisma.user.upsert({
    where: { username: 'User4' },
    update: { password: commonpassword },
    create: {
      username: 'User4',
      email: 'fakeEmail4@gmail.com',
      password: commonpassword,
    },
  });

  const user5 = await prisma.user.upsert({
    where: { username: 'User5' },
    update: { password: commonpassword },
    create: {
      username: 'User5',
      email: 'fakeEmail5@gmail.com',
      password: commonpassword,
    },
  });

  const user6 = await prisma.user.upsert({
    where: { username: 'User6' },
    update: { password: commonpassword },
    create: {
      username: 'User6',
      email: 'fakeEmail6@gmail.com',
      password: commonpassword,
    },
  });

  const user7 = await prisma.user.upsert({
    where: { username: 'User7' },
    update: { password: commonpassword },
    create: {
      username: 'User7',
      email: 'fakeEmail7@gmail.com',
      password: commonpassword,
    },
  });

  const user8 = await prisma.user.upsert({
    where: { username: 'User8' },
    update: { password: commonpassword },
    create: {
      username: 'User8',
      email: 'fakeEmail8@gmail.com',
      password: commonpassword,
    },
  });

  const user9 = await prisma.user.upsert({
    where: { username: 'User9' },
    update: { password: commonpassword },
    create: {
      username: 'User9',
      email: 'fakeEmail9@gmail.com',
      password: commonpassword,
    },
  });

  const user10 = await prisma.user.upsert({
    where: { username: 'User10' },
    update: { password: commonpassword },
    create: {
      username: 'User10',
      email: 'fakeEmail10@gmail.com',
      password: commonpassword,
    },
  });

  const user11 = await prisma.user.upsert({
    where: { username: 'User11' },
    update: { password: commonpassword },
    create: {
      username: 'User11',
      email: 'fakeEmail11@gmail.com',
      password: commonpassword,
    },
  });

  const user12 = await prisma.user.upsert({
    where: { username: 'User12' },
    update: { password: commonpassword },
    create: {
      username: 'User12',
      email: 'fakeEmail12@gmail.com',
      password: commonpassword,
    },
  });

  const user13 = await prisma.user.upsert({
    where: { username: 'User13' },
    update: { password: commonpassword },
    create: {
      username: 'User13',
      email: 'fakeEmail13@gmail.com',
      password: commonpassword,
    },
  });

  const user14 = await prisma.user.upsert({
    where: { username: 'User14' },
    update: { password: commonpassword },
    create: {
      username: 'User14',
      email: 'fakeEmail14@gmail.com',
      password: commonpassword,
    },
  });

  const user15 = await prisma.user.upsert({
    where: { username: 'User15' },
    update: { password: commonpassword },
    create: {
      username: 'User15',
      email: 'fakeEmail15@gmail.com',
      password: commonpassword,
    },
  });

  const user42 = await prisma.user.upsert({
    where: { username: 'User42' },
    update: { password: commonpassword },
    create: {
      username: 'User42',
      email: 'fakeEmail42@gmail.com',
      email42: '42email@stud42.fr',
      password: commonpassword,
    },
  });

  const chatGeneral = await prisma.chatChannel.create({
    data: {
      owner: { connect: { id: admin.id } },
      admins: { connect: { id: admin.id } },
      channelType: 'general',
      name: 'WorldChannel',
      participants: {
        connect: [{ id: admin.id }, { id: user1.id }, { id: user2.id }, { id: user3.id },{ id: user4.id },{ id: user5.id }, { id: user6.id },{ id: user7.id },{ id: user8.id },{ id: user9.id },{ id: user10.id },{ id: user11.id },{ id: user12.id },{ id: user13.id },{ id: user14.id },{ id: user15.id }, { id: user42.id }],
      },
    },
  });

  console.log({ user1, user2, user42, admin, chatGeneral });
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
