
// This function handles valid email checking using Regex expression matching
// Borrowed from: https://stackoverflow.com/questions/46155/how-can-i-validate-an-email-address-in-javascript
export function validateEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
};

// This function uses Regex to check if a string has any whitespace in it
export function hasWhiteSpace(s) {
  return /\s/g.test(s);
};