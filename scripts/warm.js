const axios = require('axios');

const endpointURL = 'https://autocedi-backend.onrender.com';

setInterval(() => {
  axios.get(endpointURL)
    .catch(error => {
      console.error('Error:', error);
    });
}, 30000);