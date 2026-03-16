export function encodeDatabaseUrl(url: string | undefined): string | undefined {
  if (!url) return url;
  try {
    // Expected format: postgresql://user:password@host:port/database
    // The password is everything between the first ':' after '://' and the last '@'
    const match = url.match(/^(postgresql:\/\/[^:]+:)(.*)(@[^@]+)$/);
    if (match) {
      const prefix = match[1];
      let password = match[2];
      const suffix = match[3];
      
      // Check if already encoded to prevent double-encoding
      try {
        if (decodeURIComponent(password) !== password) {
          // It might already be encoded, but let's decode it fully first
          // to ensure we encode it consistently with our rules
          password = decodeURIComponent(password);
        }
      } catch (e) {
        // Ignore decode errors
      }

      // URL encode the password
      const encodedPassword = encodeURIComponent(password)
        .replace(/!/g, '%21')
        .replace(/'/g, '%27')
        .replace(/\(/g, '%28')
        .replace(/\)/g, '%29')
        .replace(/\*/g, '%2A');
      return `${prefix}${encodedPassword}${suffix}`;
    }
    return url;
  } catch (e) {
    return url;
  }
}
