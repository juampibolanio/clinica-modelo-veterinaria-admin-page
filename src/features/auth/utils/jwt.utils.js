/**
 * Decodes a JWT token and returns its payload.
 * @param {string} token - The JWT token to decode.
 * @returns {object | null} The decoded token payload, or null if decoding fails.
 */

export const decodeJwt = (token) => {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
};

/**
 * Checks if a JWT token is expired.
 * @param {string} token - The JWT token to check.
 * @returns {boolean} True if the token is expired or invalid, false otherwise.
 */
export const isTokenExpired = (token) => {
  const decoded = decodeJwt(token);
  if (!decoded || !decoded.exp) return true;

  const now = Date.now() / 1000;
  return decoded.exp < now;
};
