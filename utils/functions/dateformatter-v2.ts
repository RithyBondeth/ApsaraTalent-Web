export function dateFormatterv2(dateString: string): string {
    if (!dateString || dateString.trim() === '') {
        return 'Not specified';
    }

    let date: Date;

    // Try to parse different date formats
    if (dateString.includes('/')) {
        // Handle DD/MM/YYYY format
        const parts = dateString.split('/');
        if (parts.length === 3) {
            const [day, month, year] = parts.map(Number);
            
            // Validate the date parts
            if (isNaN(day) || isNaN(month) || isNaN(year) || month < 1 || month > 12 || day < 1 || day > 31) {
                throw new Error('Invalid date format. Expected DD/MM/YYYY');
            }
            
            date = new Date(year, month - 1, day);
        } else {
            throw new Error('Invalid date format. Expected DD/MM/YYYY');
        }
    } else {
        // Try to parse as ISO string or other standard formats
        date = new Date(dateString);
    }

    // Check if the date is valid
    if (isNaN(date.getTime())) {
        throw new Error('Invalid date');
    }

    // Get the month name
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const monthName = monthNames[date.getMonth()];

    // Get the day with ordinal suffix
    const getOrdinalSuffix = (day: number): string => {
        if (day > 3 && day < 21) return 'th';
        switch (day % 10) {
            case 1: return 'st';
            case 2: return 'nd';
            case 3: return 'rd';
            default: return 'th';
        }
    };
    const dayWithSuffix = `${date.getDate()}${getOrdinalSuffix(date.getDate())}`;

    // Format the final string
    return `${monthName} ${dayWithSuffix}, ${date.getFullYear()}`;
}