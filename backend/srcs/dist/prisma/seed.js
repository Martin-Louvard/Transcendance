"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new client_1.PrismaClient();
const roundsOfHashing = 10;
async function main() {
    const commonpassword = await bcrypt.hash('123', roundsOfHashing);
    const adminpassword = await bcrypt.hash('admin', roundsOfHashing);
    const admin = await prisma.user.upsert({
        where: { username: 'admin' },
        update: { password: adminpassword },
        create: {
            username: 'admin',
            email: 'admin@gmail.com',
            password: adminpassword,
        },
    });
    const user1 = await prisma.user.upsert({
        where: { username: 'User1' },
        update: { password: commonpassword },
        create: {
            username: 'User1',
            email: 'fakeEmail@gmail.com',
            password: commonpassword,
            friends: {
                create: [{ friend_id: admin.id }]
            }
        },
    });
    const user2 = await prisma.user.upsert({
        where: { username: 'User2' },
        update: { password: commonpassword },
        create: {
            username: 'User2',
            email: 'fakeEmail2@gmail.com',
            password: commonpassword,
            friends: {
                create: [{ friend_id: admin.id }]
            }
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
            friends: {
                create: [{ friend_id: admin.id }]
            }
        },
    });
    await prisma.user.upsert({
        where: { username: 'admin' },
        update: { password: adminpassword,
            friends: {
                create: [{ friend_id: user1.id }, { friend_id: user2.id }, { friend_id: user42.id }]
            } },
        create: {
            username: 'admin',
            email: 'admin@gmail.com',
            password: adminpassword,
        },
    });
    console.log({ user1, user2, user42, admin });
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map