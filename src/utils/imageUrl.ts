export const expandImageUrl = (key?: string | null, defaultValue: string = 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400&h=400&fit=crop'): string => {
  if (!key) {
    return defaultValue;
  }

  if (key.startsWith('http') || key.startsWith('data:')) {
    return key;
  }

  // Handle keys that might have a leading slash
  const cleanKey = key.startsWith('/') ? key.slice(1) : key;
  
  // Construct the proxy URL
  // We use the same VITE_API_URL logic as apiInstance.ts
  const apiBase = import.meta.env.VITE_API_URL || '';
  
  // Ensure we don't double up on /api if VITE_API_URL already ends with it
  // or if it's empty (where we'd want /api/file/image)
  const proxyPath = '/api/file/image/';
  
  // If apiBase is just '', the result is /api/file/image/key
  // If apiBase is https://api.xxx.com, the result is https://api.xxx.com/api/file/image/key
  // We use encodeURI to handle spaces and special characters in the key while preserving slashes
  return `${apiBase}${proxyPath}${encodeURI(cleanKey)}`;
};
