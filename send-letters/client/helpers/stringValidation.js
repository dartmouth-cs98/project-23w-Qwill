
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

// This function uses Regex to check if a string has any characters that are not allowed in usernames
export function hasRestrictedChar(s) {
  var code, i, len;

  for (i = 0, len = s.length; i < len; i++) {
      code = s.charCodeAt(i);
      if ( !(code === 95) &&  // underscore
        !(code === 46) &&  // period
        !(code > 47 && code < 58) &&  // numeric (0-9)
        !(code > 64 && code < 91) &&  // upper alpha (A-Z)
        !(code > 96 && code < 123)) {  // lower alpha (a-z)
          return true;
      }
  }
  return false;
};