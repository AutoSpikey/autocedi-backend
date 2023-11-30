const axios =  require('axios');

axios.interceptors.request.use( (config) => {     
    // do something before request is sent
    logger.info(`Sending Request ... \n ${config}`);
    return config;
}, function(error){
    return Promise.reject(error);
});

axios.interceptors.response.use( (response) => {
    // do something after response is sent
    logger.info(`Sending response ... \n ${response}`);
    return response;
}, function(error){
    return Promise.reject(error);
})

module.exports = axios;