import { locationConstant } from "@/utils/constants/app.constant";
import { ICompany } from "@/utils/interfaces/company.interface";

export const companyList: ICompany[]  = [
    {
        "id": 1,
        "name": "NextGen Innovations",
        "industry": "Pioneering AI & Cloud Solutions",
        "description": "Pioneering AI & Cloud Solutions lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.",
        "avatar": "NXG",
        "cover": "NXG.png",
        "companySize": 250,
        "foundedYear": 2018,
        "location": locationConstant[0],
        "email": "nextgen@gmail.com",
        "password": "nano-tech-123",
        "phone": "+1122334455",
        "website": "https://nextgen.com",
        "facebook": "https://www.facebook.com/nextgen",
        "instagram": "https://www.instagram.com/nextgen",
        "linkedin": "https://www.linkedin.com/company/nextgen",
        "x": "https://www.x.com/nextgen",
        "telegram": "https://t.me/nextgen",
        "images": [
            "https://www.sharespace.work/blog/wp-content/uploads/2021/06/Campfire_2.max-1000x1000-1.jpg",
            "https://d17422uxibeifn.cloudfront.net/wordpress/wp-content/uploads/2020/10/02161646/Google-workspace-header.jpg",
        ],
        "openPositions": [
            { 
                "id": 1, 
                "title": "Machine Learning Engineer", 
                "description": "Develop and optimize AI models for real-world applications.",
                "salary": "$120,000 - $150,000",
                "type": "Full Time",
                "experience": "4+ years",
                "education": "Master's Degree",
                "skills": ["Python", "TensorFlow", "Deep Learning", "NLP"],
                "postedDate": "02/03/2025",
                "deadlineDate": "02/04/2025",
            },
            { 
                "id": 2, 
                "title": "Cloud Architect", 
                "description": "Design and implement scalable cloud infrastructures.",
                "salary": "$110,000 - $140,000",
                "type": "Full Time",
                "experience": "5+ years",
                "education": "Bachelor's Degree",
                "skills": ["AWS", "Azure", "Google Cloud", "Kubernetes", "DevOps"],
                "postedDate": "02/03/2025",
                "deadlineDate": "02/04/2025",
            },
            { 
                "id": 3, 
                "title": "Data Analyst", 
                "description": "Analyze complex data to drive business insights and strategies.",
                "salary": "$85,000 - $110,000",
                "type": "Full Time",
                "experience": "2+ years",
                "education": "Bachelor's Degree",
                "skills": ["SQL", "Power BI", "Tableau", "Python", "Data Visualization"],
                "postedDate": "02/03/2025",
                "deadlineDate": "02/04/2025",
            }
        ],
        "availableTimes": [
            "Full Time",
            "Remote",
            "Contract"
        ],
        "values": [
            "Innovation",
            "Work-Life Balance",
            "Diversity & Inclusion",
            "Growth Mindset"
        ],
        "benefits": [
            "Comprehensive Health Insurance",
            "Flexible Work Hours",
            "Remote Work Option",
            "Stock Options",
            "Performance Bonuses",
        ],
        "careerScopes": ["Web Developer", "Software Engineer", "Accountant", "Finance"],
        "socials": [
            { "id": 1, "social": "Facebook", "link": "bondeth.com" },
            { "id": 2, "social": "Instagram", "link": "rithy-bondeth.com" },
            { "id": 3, "social": "Telegram", "link": "telegram/rithy-bondeth" }
        ]
    },
    {
        "id": 2,
        "name": "InnoTech Solutions",
        "industry": "Innovative Technology & IT Consulting",
        "description": "Innovative Technology & IT Consulting lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.",
        "avatar": "INN",
        "cover": "NXG.png",
        "companySize": 150,
        "foundedYear": 2015,
        "location": locationConstant[1],
        "email": "innotech@gmail.com",
        "password": "nano-tech-123",
        "phone": "+1987654321",
        "website": "https://innotech.com",
        "facebook": "https://www.facebook.com/innotech",
        "instagram": "https://www.instagram.com/innotech",
        "linkedin": "https://www.linkedin.com/company/innotech",
        "x": "https://www.x.com/innotech",
        "telegram": "https://t.me/innotech",
        "images": [
            "https://www.workdesign.com/wp-content/uploads/2020/03/Google-Open-Workspace-Photo-Courtesy-of-Google-e1583416661584.png",
            "https://ml5enisp4q1t.i.optimole.com/w:1600/h:965/q:mauto/f:best/https://interiorarchitects.com/wp-content/uploads/2019/08/21NOKX_0017_000_IA_Nokia_HERE_N3_iawebsite-e1566587330816.jpg",
        ],
        "openPositions": [
            { 
                "id": 1, 
                "title": "Frontend Developer", 
                "description": "Develop modern web applications with cutting-edge technologies.",
                "salary": "$90,000 - $110,000",
                "type": "Full Time",
                "experience": "2+ years",
                "education": "Bachelor's Degree",
                "skills": ["React", "Vue.js", "CSS", "JavaScript"],
                "postedDate": "02/03/2025",
                "deadlineDate": "11/10/2025",
            },
            { 
                "id": 2, 
                "title": "UI/UX Designer", 
                "description": "Create engaging user experiences through innovative design solutions.",
                "salary": "$80,000 - $100,000",
                "type": "Full Time",
                "experience": "3+ years",
                "education": "Bachelor's Degree",
                "skills": ["Figma", "Adobe XD", "Wireframing", "Prototyping"],
                "postedDate": "02/03/2025",
                "deadlineDate": "10/08/2025",
            }
        ],
        "availableTimes": [
            "Full Time",
            "Remote",
            "Contract"
        ],
        "values": [
            "Innovation",
            "Work-Life Balance",
            "Diversity & Inclusion",
            "Growth Mindset"
        ],
        "benefits": [
            "Comprehensive Health Insurance",
            "Flexible Work Hours",
            "Remote Work Option",
            "Stock Options",
            "Performance Bonuses",
        ],
        "careerScopes": ["Web Developer", "Software Engineer", "Accountant", "Finance"],
        "socials": [
            { "id": 1, "social": "Facebook", "link": "bondeth.com" },
            { "id": 2, "social": "Instagram", "link": "rithy-bondeth.com" },
            { "id": 3, "social": "Telegram", "link": "telegram/rithy-bondeth" }
        ]
    }
]