import { ICompany } from "@/utils/interfaces/company.interface";

export const companyList: ICompany[]  = [
    {
        "id": 1,
        "name": "NextGen Innovations",
        "industry": "Pioneering AI & Cloud Solutions",
        "description": "Pioneering AI & Cloud Solutions lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.",
        "avatar": "NXG",
        "companySize": 250,
        "foundedYear": 2018,
        "location": "Seattle, WA",
        "email": "nextgen@gmail.com",
        "phone": "+1122334455",
        "website": "https://nextgen.com",
        "facebook": "https://www.facebook.com/nextgen",
        "instagram": "https://www.instagram.com/nextgen",
        "linkedin": "https://www.linkedin.com/company/nextgen",
        "x": "https://www.x.com/nextgen",
        "telegram": "https://t.me/nextgen",
        "images": [
            "https://picsum.photos/200/304",
            "https://picsum.photos/200/305",
            "https://picsum.photos/200/306"
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
            { "id": 1, "label": "Full Time" },
            { "id": 2, "label": "Remote" },
            { "id": 3, "label": "Hybrid" },
            { "id": 4, "label": "Freelance" }
        ],
        "values": [
            { "id": 1, "label": "Innovation & Creativity" },
            { "id": 2, "label": "Employee Well-being" },
            { "id": 3, "label": "Collaboration & Teamwork" },
            { "id": 4, "label": "Continuous Learning" },
            { "id": 5, "label": "Customer-Centric Approach" }
        ],
        "benefits": [
            { "id": 1, "label": "Full Health Coverage" },
            { "id": 2, "label": "Unlimited PTO" },
            { "id": 3, "label": "Remote & Hybrid Work Flexibility" },
            { "id": 4, "label": "Equity & Stock Options" },
            { "id": 5, "label": "Yearly Tech Stipend" },
            { "id": 6, "label": "Employee Wellness Programs" }
        ]
    },
    {
        "id": 2,
        "name": "InnoTech Solutions",
        "industry": "Innovative Technology & IT Consulting",
        "description": "Innovative Technology & IT Consulting lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.",
        "avatar": "INN",
        "companySize": 150,
        "foundedYear": 2015,
        "location": "New York, NY",
        "email": "innotech@gmail.com",
        "phone": "+1987654321",
        "website": "https://innotech.com",
        "facebook": "https://www.facebook.com/innotech",
        "instagram": "https://www.instagram.com/innotech",
        "linkedin": "https://www.linkedin.com/company/innotech",
        "x": "https://www.x.com/innotech",
        "telegram": "https://t.me/innotech",
        "images": [
            "https://picsum.photos/200/301",
            "https://picsum.photos/200/302",
            "https://picsum.photos/200/303"
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
                "deadlineDate": "02/04/2025",
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
                "deadlineDate": "02/04/2025",
            }
        ],
        "availableTimes": [
            { "id": 1, "label": "Full Time" },
            { "id": 2, "label": "Remote" },
            { "id": 3, "label": "Contract" }
        ],
        "values": [
            { "id": 1, "label": "Innovation" },
            { "id": 2, "label": "Work-Life Balance" },
            { "id": 3, "label": "Diversity & Inclusion" },
            { "id": 4, "label": "Growth Mindset" }
        ],
        "benefits": [
            { "id": 1, "label": "Comprehensive Health Insurance" },
            { "id": 2, "label": "Flexible Work Hours" },
            { "id": 3, "label": "Remote Work Option" },
            { "id": 4, "label": "Stock Options" },
            { "id": 5, "label": "Performance Bonuses" }
        ]
    }
]