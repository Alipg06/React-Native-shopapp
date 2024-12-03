// Check if a string is empty or consists of only whitespace
export const isNotEmpty = (value) => {
  return value.trim() !== "";
};

export const isCharactersLong = (value, length) => {
  return value.trim().length === length;
};

// Check if a string is a valid URL
export const isUrlValid = (value) => {
  const urlPattern = /^(http|https):\/\/\S+$/;
  return urlPattern.test(value);
};

// Check if a string represents a valid positive number
export const isPriceValid = (value) => {
  const numericValue = parseFloat(value);
  return !isNaN(numericValue) && numericValue > 0;
};

// Check if a string is a valid email address
export const isValidEmail = (value) => {
  // Regular expression for validating email addresses
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return emailPattern.test(value);
};

// Check if confirmPassword matches the password
export const isPasswordMatched = (confirmPassword, password) => {
  return confirmPassword === password;
};
