import { PrismaClient, Role, Status } from '@prisma/client';

const prisma = new PrismaClient();

const positions = ['Developer', 'Senior Developer', 'Tester', 'DevOps', 'BA', 'Tech Lead', 'Project Manager'];

const sampleUsers = [
  {
    employeeId: 'IT001',
    fullName: 'Nguyễn Văn An',
    email: 'an.nguyen@company.com',
    phone: '0901234567',
    position: 'Tech Lead',
    role: Role.MANAGER,
    status: Status.ACTIVE,
  },
  {
    employeeId: 'IT002',
    fullName: 'Trần Thị Bình',
    email: 'binh.tran@company.com',
    phone: '0902345678',
    position: 'Senior Developer',
    role: Role.MEMBER,
    status: Status.ACTIVE,
  },
  {
    employeeId: 'IT003',
    fullName: 'Lê Văn Cường',
    email: 'cuong.le@company.com',
    phone: '0903456789',
    position: 'Developer',
    role: Role.MEMBER,
    status: Status.ACTIVE,
  },
  {
    employeeId: 'IT004',
    fullName: 'Phạm Thị Dung',
    email: 'dung.pham@company.com',
    phone: '0904567890',
    position: 'Tester',
    role: Role.MEMBER,
    status: Status.ON_LEAVE,
  },
  {
    employeeId: 'IT005',
    fullName: 'Hoàng Văn Em',
    email: 'em.hoang@company.com',
    phone: '0905678901',
    position: 'DevOps',
    role: Role.MEMBER,
    status: Status.ACTIVE,
  },
  {
    employeeId: 'IT006',
    fullName: 'Vũ Thị Phương',
    email: 'phuong.vu@company.com',
    phone: '0906789012',
    position: 'BA',
    role: Role.MEMBER,
    status: Status.ACTIVE,
  },
  {
    employeeId: 'IT007',
    fullName: 'Đặng Văn Giang',
    email: 'giang.dang@company.com',
    phone: '0907890123',
    position: 'Developer',
    role: Role.MEMBER,
    status: Status.INACTIVE,
  },
  {
    employeeId: 'IT008',
    fullName: 'Bùi Thị Hương',
    email: 'huong.bui@company.com',
    phone: '0908901234',
    position: 'Project Manager',
    role: Role.ADMIN,
    status: Status.ACTIVE,
  },
];

async function main() {
  console.log('Start seeding...');

  for (const user of sampleUsers) {
    const result = await prisma.user.upsert({
      where: { employeeId: user.employeeId },
      update: {},
      create: user,
    });
    console.log(`Created user: ${result.fullName}`);
  }

  console.log('Seeding completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
