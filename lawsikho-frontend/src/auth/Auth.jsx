import {jwtDecode} from 'jwt-decode';

export const isTokenValid = (token) => {
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000; // in seconds
    return decoded.exp && decoded.exp > currentTime;
  } catch (err) {
    return false;
  }
};