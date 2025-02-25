import facebookIcon from '@/assets/socials/facebook.png';
import linkedInIcon from '@/assets/socials/linkedin.png';
import githubIcon from '@/assets/socials/github.png';
import emailIcon from '@/assets/socials/email.png';
import browserIcon from '@/assets/socials/browser.png';
import { IUser } from "@/utils/interfaces/employee.interface";

export const userList: IUser[] = [
        {
            id: 1,
            avatar: "JAN",
            firstname: 'John',
            lastname: 'Doe',
            username: 'john_doe',
            phone: '+855 96 555 5555',
            email: 'john.doe@example.com',
            job: "Software Engineer",
            location: "Phnom Penh, Cambodia",
            skills: ["Software Engineer", "Graphic Designer"],
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.",
            document: {
                resume: "resume.pdf",
                coverLetter: "cover_letter.pdf",
            },
            status: [
                { id: 1, label: 'Profile Completion', value: '90%' }, 
                { id: 2, label: 'Accomplishment', value: '20+' }, 
                { id: 3, label: 'Likes', value: '35' }
            ],
            yearsOfExperience: "5+ years experience",
            experiences: [
                { id: 1, title: 'Software Engineer', description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.', startDate: '2020-01-01', endDate: '2024-01-01' },
                { id: 2, title: 'Software Engineer', description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.', startDate: '2020-01-01', endDate: '2024-01-01' },
            ],
            availability: "Available for full time",
            educations: [
                { id: 1, school: 'Cambodia Academic Digital and Technology', degree: 'Computer Science', year: '2020-2024'  }, 
                { id: 2, school: 'Royal University of Phnom Penh', degree: 'English', year: '2020-2024' },
            ],
            social: [
                { id: 1, icon: facebookIcon, label: 'Facebook', value: 'https://www.facebook.com/john_doe' },
                { id: 2, icon: githubIcon, label: 'Github', value: 'https://www.github.com/john_doe' },
                { id: 3, icon: linkedInIcon, label: 'LinkedIn', value: 'https://www.linkedin.com/in/john_doe' },
                { id: 4, icon: browserIcon, label: 'Website', value: 'https://www.john-doe.com' }, 
                { id: 5, icon: emailIcon, label: 'Email', value: 'john.doe@example.com' },
            ]
        },
        {
            id: 2,
            avatar: "BON",
            firstname: 'Rithy',
            lastname: 'Bondeth',
            username: 'rithybondeth',
            phone: '+855 96 555 5555',
            email: 'rithybondeth@gmail.com',
            job: "Software Engineer",
            location: "Phnom Penh, Cambodia",
            skills: ["Flutter", "React Native", "React", "Node.js", "Express", "MongoDB", "PostgreSQL", "Docker", "Kubernetes", "AWS", "CI/CD"],
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.",
            document: {
                resume: "resume.pdf",
                coverLetter: "cover_letter.pdf",
            },
            status: [
                { id: 1, label: 'Profile Completion', value: '90%' }, 
                { id: 2, label: 'Accomplishment', value: '20+' }, 
                { id: 3, label: 'Likes', value: '35' },
            ],
            yearsOfExperience: "3+ years experience",
            experiences: [
                { id: 1, title: 'Web Developer at DEBC', description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.', startDate: '2020-01-01', endDate: '2024-01-01' },
                { id: 2, title: 'Mobile App Developer at AllWeb', description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.', startDate: '2020-01-01', endDate: '2024-01-01' },
            ],
            availability: "Available for full time",
            educations: [
                { id: 1, school: 'Cambodia Academic Digital and Technology', degree: 'Computer Science', year: '2020-2024' }, 
                { id: 2, school: 'Royal University of Phnom Penh', degree: 'English', year: '2020-2024' },
            ],
            social: [
                { id: 1, icon: facebookIcon, label: 'Bondeth', value: 'https://www.facebook.com/john_doe' },
                { id: 2, icon: githubIcon, label: 'Rithy Bondeth', value: 'https://www.github.com/john_doe' },
                { id: 3, icon: linkedInIcon, label: 'Hem RithyBondeth', value: 'https://www.linkedin.com/in/john_doe' },
                { id: 4, icon: browserIcon, label: 'codehub.dev', value: 'https://www.john-doe.com'},
                { id: 5, icon: emailIcon, label: 'rithybondeth@gmail.com', value: 'john.doe@example.com' },
            ]
        }
    ]