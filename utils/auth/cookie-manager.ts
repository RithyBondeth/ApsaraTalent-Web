export const clearAuthCookiesServerSide = async () => {
  try {
    console.log('Calling server-side logout API...');
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include', // Include cookies in request
    });
    
    const data = await response.json();
    console.log('Server-side logout response:', data);
    
    if (!response.ok) {
      throw new Error(data.message || 'Logout failed');
    }
    
    return true;
  } catch (error) {
    console.error('Server-side logout error:', error);
    return false;
  }
};

export const clearAuthCookies = () => {
  if (typeof document === 'undefined') return;

  const cookieNames = ['auth-token', 'refresh-token'];
  const hostname = window.location.hostname;
  
  console.log('Clearing auth cookies for domain:', hostname);
  
  cookieNames.forEach(cookieName => {
    // Method 1: Standard expiration
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    
    // Method 2: With current domain
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${hostname};`;
    
    // Method 3: With dot prefix domain
    if (hostname !== 'localhost') {
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${hostname};`;
    }
    
    // Method 4: With secure flag
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; secure;`;
    
    // Method 5: With SameSite
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict;`;
    
    // Method 6: All flags combined
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${hostname}; secure; SameSite=Strict;`;
  });
  
  // Also clear any variations with different paths
  const paths = ['/', '/auth', '/login'];
  paths.forEach(path => {
    cookieNames.forEach(cookieName => {
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path};`;
    });
  });
  
  console.log('All cookie clearing methods attempted');
};