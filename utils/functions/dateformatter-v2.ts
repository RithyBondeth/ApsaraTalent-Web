export function dateFormatterv2(dateString: string): string {
    // Split the input date string into day, month, year
    const [day, month, year] = dateString.split('/').map(Number);
  
    // Validate the date
    if (isNaN(day) || isNaN(month) || isNaN(year) || month < 1 || month > 12 || day < 1 || day > 31) {
      throw new Error('Invalid date format. Expected DD/MM/YYYY');
    }
  
    // Create a Date object (months are 0-indexed in JavaScript)
    const date = new Date(year, month - 1, day);
  
    // Check if the date is valid (handles cases like February 30th)
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
    const dayWithSuffix = `${day}${getOrdinalSuffix(day)}`;
  
    // Format the final string
    return `${monthName} ${dayWithSuffix}, ${year}`;
  }