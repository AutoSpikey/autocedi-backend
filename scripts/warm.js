const axios = require('axios');

const endpointURL = 'https://autocedi-backend.onrender.com';

setInterval(() => {
  axios.get(endpointURL)
    .then(response => {
      console.log('Response status:', response.status);
      console.log('Response data:', response.data);
    })
    .catch(error => {
      console.error('Error:', error);
    });
}, 30000);