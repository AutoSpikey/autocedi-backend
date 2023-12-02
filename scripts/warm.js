const axios = require('axios');
const endpointURL = 'https://autocedi-backend.onrender.com';

function ping(){
  axios.get(endpointURL).then(() => {
    if(!up) {
      console.log("server up");
      up = true;
    }
  })
    .catch(error => {
      console.error('Error:', error);
      up = false
    });
}

let up = false;
ping()
setInterval(ping, 30000);