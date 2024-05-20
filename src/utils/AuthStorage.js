// Function to store token in localStorage
export const storeToken = (token) => {
  localStorage.setItem('token', token);
};

// Function to retrieve token from localStorage
export const getToken = () => {
  return localStorage.getItem('token');
};

// Function to clear authentication data from localStorage
export const clearAuthData = () => {
  localStorage.removeItem('token');
};
