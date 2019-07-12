// Were using axios to make a Global Header, Not requests
import axios from 'axios';

// our function takes in a token- from local storage;
// if the token is there, it will add it to the header
// if not, it will delete it from the header
const setAuthToken = token => {
  // the token we pass in is from local storage
  // Here we check if it exists or not.
  if (token) {
    axios.defaults.headers.common["x-auth-token"] = token;
  } else {
    delete axios.defaults.headers.common['x-auth-token'];
  }
}

export default setAuthToken;
