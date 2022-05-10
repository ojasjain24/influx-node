const request = require('request');
const url = "https://api.covid19india.org/data.json";
request({url : url}, (error, response)=>{
const data = JSON.parse(response.body);
console.log(data['cases_time_series']);
})
