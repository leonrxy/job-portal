import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    //Hash Passwords
    const passwordJobSeeker = await bcrypt.hash('jobseeker', 10);
    const passwordUniversity = await bcrypt.hash('university', 10);
    const passwordCompany = await bcrypt.hash('company', 10);
    const passwordSuperadmin = await bcrypt.hash('superadmin', 10);
    const passwordAdmin = await bcrypt.hash('admin', 10);

    // Seed job seekers
    await prisma.job_seekers.create({
        data: {
            email: 'jobseeker@mail.com',
            password: passwordJobSeeker,
            full_name: 'Job Seeker',
            verified: 'true',
            job_seeker_details: {
                create: {
                    resume_url: 'http://example.com/resume.pdf',
                    bio: 'Experienced job seeker',
                },
            },
        },
    });

    // Seed universities
    await prisma.universities.create({
        data: {
            email: 'university@mail.com',
            password: passwordUniversity,
            university_name: 'University',
            verified: 'true',
            status: 'accepted',
            university_detail: {
                create: {
                    phone_number: '0123456789',
                    logo_url: 'http://example.com/logo.png',
                    address: '123 University St',
                    photo_url: 'http://example.com/photo.png',
                },
            },
        },
    });

    // Seed companies
    await prisma.companies.create({
        data: {
            email: 'company@mail.com',
            password: passwordCompany,
            company_name: 'Company',
            phone_number: '0123456789',
            verified: 'true',
            status: 'accepted',
            company_detail: {
                create: {
                    logo_url: 'http://example.com/logo.png',
                    address: '456 Company Ave',
                    photo_url: 'http://example.com/photo.png',
                },
            },
        },
    });

    // Seed super admins
    await prisma.admins.createMany({
        data: [
            { full_name: 'Superadmin', email: 'superadmin@mail.com', password: passwordSuperadmin, role: 'superadmin' },
            { full_name: 'Admin', email: 'admin@mail.com', password: passwordAdmin, role: 'admin' },
        ],
    });

    console.log('Database has been seeded');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
