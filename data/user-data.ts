import { IEmployee } from '@/utils/interfaces/employee.interface';

export const userList: IEmployee[] = [
        {
            id: 1,
            firstname: 'John',
            lastname: 'Doe',
            username: 'john_doe',
            gender: 'male',
            avatar: "JAN",
            phone: '+855 96 555 5555',
            email: 'john.doe@example.com',
            job: "Software Engineer",
            location: "Phnom Penh, Cambodia",
            skills: [
                {
                    id: "9223cf97-7c5d-40bf-b14c-e71aa7dbe7d1",
                    name: "Nest.js",
                    description: "Expert in Nest.js backend framework."
                },
                {
                    id: "2cd319c5-95b1-4da7-b52c-e3d912d2c8c2",
                    name: "React.js ",
                    description: "Expert in React.js frontend framework.",
                }
            ],
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.",
            resume: "resume.pdf",
            coverLetter: "cover_letter.pdf",
            status: [
                { id: 1, label: 'Profile Completion', value: '90%' }, 
                { id: 2, label: 'Accomplishment', value: '20+' }, 
                { id: 3, label: 'Likes', value: '35' }
            ],
            yearsOfExperience: "5+ years experience",
            experiences: [
                { id: "337f4edf-c8b0-4d57-987b-3d22fef5e9bb", title: 'Software Engineer', description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.', startDate: '2020-01-01', endDate: '2024-01-01' },
                { id: "62198aed-fe05-40e9-8d72-bf6237bac6ca", title: 'Software Engineer', description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.', startDate: '2020-01-01', endDate: '2024-01-01' },
            ],
            availability: "Available for full time",
            educations: [
                { id: "15fdb81a-a13a-4f2e-95f7-cdedfb0bedc3", school: 'Cambodia Academic Digital and Technology', degree: 'Computer Science', year: '2020-2024'  }, 
                { id: "4d86bc21-c221-4b68-b290-b5371da96fcb", school: 'Royal University of Phnom Penh', degree: 'English', year: '2020-2024' },
            ],
            socials: [
                { id: "f2130f72-b1d2-4764-a3b5-41ffc26f828f", platform: 'Facebook', url: 'https://www.facebook.com/john_doe' },
                { id: "f2130f72-c1d2-4764-a3b5-41ffc26f828f", platform: 'Github', url: 'https://www.github.com/john_doe' },
                { id: "f2130f72-d1d2-4764-a3b5-41ffc26f828f", platform: 'LinkedIn', url: 'https://www.linkedin.com/in/john_doe' },
                { id: "f2130f72-e1d2-4764-a3b5-41ffc26f828f", platform: 'Website', url: 'https://www.john-doe.com' }, 
                { id: "f2130f72-f1d2-4764-a3b5-41ffc26f828f", platform: 'Email', url: 'john.doe@example.com' },
            ]
        },
        {
            id: 2,
            firstname: 'Rithy',
            lastname: 'Bondeth',
            username: 'rithybondeth',
            gender: 'female',
            avatar: "BON",
            phone: '+855 96 555 5555',
            email: 'rithybondeth@gmail.com',
            job: "Software Engineer",
            location: "Phnom Penh, Cambodia",
            skills: [
                {
                    id: "9223cf97-7c5d-40bf-b14c-e71aa7dbe7d1",
                    name: "Nest.js",
                    description: "Expert in Nest.js backend framework."
                },
                {
                    id: "2cd319c5-95b1-4da7-b52c-e3d912d2c8c2",
                    name: "React.js ",
                    description: "Expert in React.js frontend framework.",
                }
            ],
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.",
            resume: "resume.pdf",
            coverLetter: "cover_letter.pdf",
            status: [
                { id: 1, label: 'Profile Completion', value: '90%' }, 
                { id: 2, label: 'Accomplishment', value: '20+' }, 
                { id: 3, label: 'Likes', value: '35' },
            ],
            yearsOfExperience: "3+ years experience",
            experiences: [
                { id: "337f4edf-c8b0-4d57-987b-3d22fef5e9bb", title: 'Software Engineer', description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.', startDate: '2020-01-01', endDate: '2024-01-01' },
                { id: "62198aed-fe05-40e9-8d72-bf6237bac6ca", title: 'Software Engineer', description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.', startDate: '2020-01-01', endDate: '2024-01-01' },
            ],
            availability: "Available for full time",
            educations: [
                { id: "15fdb81a-a13a-4f2e-95f7-cdedfb0bedc3", school: 'Cambodia Academic Digital and Technology', degree: 'Computer Science', year: '2020-2024'  }, 
                { id: "4d86bc21-c221-4b68-b290-b5371da96fcb", school: 'Royal University of Phnom Penh', degree: 'English', year: '2020-2024' },
            ],
            socials: [
                { id: "f2130f72-b1d2-4764-a3b5-41ffc26f828f", platform: 'Facebook', url: 'https://www.facebook.com/john_doe' },
                { id: "f2130f72-c1d2-4764-a3b5-41ffc26f828f", platform: 'Github', url: 'https://www.github.com/john_doe' },
                { id: "f2130f72-d1d2-4764-a3b5-41ffc26f828f", platform: 'LinkedIn', url: 'https://www.linkedin.com/in/john_doe' },
                { id: "f2130f72-e1d2-4764-a3b5-41ffc26f828f", platform: 'Website', url: 'https://www.john-doe.com' }, 
                { id: "f2130f72-f1d2-4764-a3b5-41ffc26f828f", platform: 'Email', url: 'john.doe@example.com' },
            ]
        }
    ]