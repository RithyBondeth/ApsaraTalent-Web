import { locationConstant } from "@/utils/constants/app.constant";
import { ICompany } from "@/utils/interfaces/company.interface";

export const companyList: ICompany[]  = [
    {
        "id": 1,
        "name": "NextGen Innovations",
        "industry": "Pioneering AI & Cloud Solutions",
        "description": "Pioneering AI & Cloud Solutions lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.",
        "avatar": "https://img.freepik.com/free-psd/3d-rendering-dj-character_23-2151437601.jpg?semt=ais_hybrid&w=740",
        "cover": "https://www.fracttal.com/hubfs/apple-park.webp",
        "companySize": 250,
        "foundedYear": 2018,
        "location": locationConstant[0],
        "email": "nextgen@gmail.com", //hide
        "password": "nano-tech-123", //hide
        "phone": "+1122334455", //hide
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
                "deadlineDate": "02/05/2025",
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
                "deadlineDate": "02/06/2025",
            }
        ],
        "availableTimes": [
            "Full Time",
            "Remote",
            "Contract"
        ],
        "values": [
            {
                "id": 1,
                "label": "Innovation & Creativity"
            },
            {
                "id": 2,
                "label": "Customer First"
            },
            {
                "id": 3,
                "label": "Integrity & Transparency"
            }
        ],
        "benefits": [
            {
                "id": 1,
                "label": "Health Insurance"
            },
            {
                "id": 2,
                "label": "Flexible Work Hours"
            },
            {
                "id": 3,
                "label": "401(k) Matching"
            }
        ],
        "careerScopes": [
            {
                "id": "d414f632-648a-44b7-a282-886769be2f57",
                "name": "Software Engineering",
                "description": "Building scalable applications and solutions."
            },
            {
                "id": "967a7c48-5278-4f9a-80fb-537ae1fd5e5c",
                "name": "Artificial Intelligence",
                "description": "Advancing AI and machine learning technology."
            },
            {
                "id": "714ee33e-d27c-49a0-9158-68831160f269",
                "name": "AI & Machine Learning",
                "description": "Advancing AI solutions for real-world applications."
            }
        ],
        "socials": [
            { "id": 1, "platform": "Facebook", "url": "bondeth.com" },
            { "id": 2, "platform": "Instagram", "url": "rithy-bondeth.com" },
            { "id": 3, "platform": "Telegram", "url": "telegram/rithy-bondeth" },
            { "id": 4, "platform": "Website", "url": "rithy-bondeth.com" }
        ],
        "createdAt": "2025-03-11T22:10:12.171Z",
    },
    {
        "id": 2,
        "name": "InnoTech Solutions",
        "industry": "Innovative Technology & IT Consulting",
        "description": "Innovative Technology & IT Consulting lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.",
        "avatar": "https://imageio.forbes.com/specials-images/imageserve/613df8e8d679a21b766a1636/bigbun-2/960x0.jpg?height=711&width=711&fit=bounds",
        "cover": "https://plus.unsplash.com/premium_photo-1661962642401-ebd5ae0514ca?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8YXBwbGUlMjBvZmZpY2V8ZW58MHx8MHx8fDA%3D",
        "companySize": 150,
        "foundedYear": 2015,
        "location": locationConstant[1],
        "email": "innotech@gmail.com",
        "password": "nano-tech-123",
        "phone": "+1987654321",
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
            {
                "id": 1,
                "label": "Innovation & Creativity"
            },
            {
                "id": 2,
                "label": "Customer First"
            },
            {
                "id": 3,
                "label": "Integrity & Transparency"
            }
        ],
        "benefits": [
            {
                "id": 1,
                "label": "Health Insurance"
            },
            {
                "id": 2,
                "label": "Flexible Work Hours"
            },
            {
                "id": 3,
                "label": "401(k) Matching"
            }
        ],
        "careerScopes": [
            {
                "id": "d414f632-648a-44b7-a282-886769be2f57",
                "name": "Software Engineering",
                "description": "Building scalable applications and solutions."
            },
            {
                "id": "967a7c48-5278-4f9a-80fb-537ae1fd5e5c",
                "name": "Artificial Intelligence",
                "description": "Advancing AI and machine learning technology."
            },
            {
                "id": "714ee33e-d27c-49a0-9158-68831160f269",
                "name": "AI & Machine Learning",
                "description": "Advancing AI solutions for real-world applications."
            }
        ],
        "socials": [
            { 
                "id": 1, 
                "platform": "Facebook", 
                "url": "bondeth.com"
            },
            { 
                "id": 2, 
                "platform": "Instagram", 
                "url": "rithy-bondeth.com" 
            },
            { 
                "id": 3, 
                "platform": "Telegram", 
                "url": "telegram/rithy-bondeth" 
            },
            { 
                "id": 4, 
                "platform": "Website", 
                "url": "rithy-bondeth.com"
            }
        ],
        "createdAt": "2025-03-11T22:10:12.171Z",
    }
]