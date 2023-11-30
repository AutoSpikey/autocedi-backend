const axios =  require('axios');

axios.interceptors.request.use( (config) => {     
    // do something before request is sent
    console.log('Middleware triggered before Axios request');
    return config;
}, function(error){
    return Promise.reject(error);
});

axios.interceptors.response.use( (response) => {
    // do something after response is sent
    console.log('Middleware triggered after response');
    return response;
}, function(error){
    return Promise.reject(error);
})

module.exports = axios;