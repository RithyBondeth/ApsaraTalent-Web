// Regex for Khmer phone number validation
// Starts with +855 or 855, followed by 10 digits starting with 1, 7, or 8 (valid mobile prefixes in Cambodia)
export const khmerPhoneNumberRegex = /^(?:\+855|855)(1|7|8)\d{7}$/;

export const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
export const DOCUMENT_SIZE = 5 * 1024 * 1024;

export const genderConstant = [
    { id: 1, label: 'Male', value: 'male' },
    { id: 2, label: 'Female', value: 'female' },
];

export const userRoleConstant = [
    { id: 1, label: 'Employee or (Freelancer)', value: 'employee' },
    { id: 2, label: 'Company or (Employer)', value: 'company' }
];

export const platformConstant = [
    { id: 1, label: 'Facebook', value: 'facebook' },
    { id: 2, label: 'Instagram', value: 'Instagram' },
    { id: 3, label: 'Telegram', value: 'telegram' },
    { id: 4, label: 'LinkedIn', value: 'linkedin' },
    { id: 5, label: 'Github', value: 'github' },
];

export const locationConstant = [
    'Banteay Meanchey',
    'Battambang',
    'Kampong Cham',
    'Kampong Chhnang',
    'Kampong Speu',
    'Kampong Thom',
    'Kampot',
    'Kandal',
    'Kep',
    'Koh Kong',
    'Kratie',
    'Mondulkiri',
    'Oddar Meanchey',
    'Pailin',
    'Phnom Penh',
    'Preah Sihanouk',
    'Preah Vihear',
    'Prey Veng',
    'Pursat',
    'Ratanakiri',
    'Siem Reap',
    'Stung Treng',
    'Svay Rieng',
    'Takeo',
    'Tbong Khmum'
];