var axios = require('axios');
const BASE_URL='https://sheets.googleapis.com';
var _ = require('lodash');




// var generateJWT= function(){

// }

var getAccessToken = async function(){
	var jwt = require('jsonwebtoken');
	var axios = require('axios');
	var qs = require('qs');

	var key = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
	var payload = {
		"iss":key.client_email,
		"scope":"https://www.googleapis.com/auth/spreadsheets",
		"aud":"https://oauth2.googleapis.com/token",
	}
	
	var jwt_token = jwt.sign(payload,key.private_key, { algorithm: 'RS256',expiresIn:'20s'});
	
	var data = qs.stringify({
		'grant_type': 'urn:ietf:params:oauth:grant-type:jwt-bearer',
		'assertion': jwt_token 
	});
	var config = {
		method: 'post',
		url: 'https://oauth2.googleapis.com/token',
		headers: { 
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		data : data
	};

	var response = await axios(config)
	var access_token = response.data;
	access_token.expires_at = new Date(new Date().getTime()+(access_token.expires_in-5*60)*1000).toISOString();
	return access_token;
}

var passthrough=async function(options){

	// var access_token = _.get(options.integration,'config.access_token');
	// if(!access_token)
		// access_token = await getAccessToken(options.integration);
	// if(new Date(access_token.expires_at)<new Date()) // get new access token if access token is expired.
		// access_token = await getAccessToken(options.integration);



	var access_token = await getAccessToken();

	var config = {
		method: options.method,
		url:BASE_URL+options.url,
		headers: {},
		params:{
			access_token:access_token.access_token
		},
		// data:{},
	};
	// these interfere with google sheet apis
	delete options.params.org_id;
	delete options.params.integration_id;

	// _.merge(config.headers,options.headers);
	_.merge(config.params,options.params);
	
	var methods = ['put','post','PUT','POST'];
	if(methods.indexOf(config.method)>-1)
		config.data=options.data;
	var res= await axios(config);
	return res.data;
}


var getDataFromOneSheet=async function(sheet_id,range){
	// get por budget codes from reference sheet related to this type2 budget.
	console.log('>>>>>>>> fetching data');
	var options = {
		method:'GET',
		url:`/v4/spreadsheets/${sheet_id}/values/${range}`,
		// integration:integration,
		params:{},
	}
	var data = await passthrough(options);
    console.log(data);
	return data.values;
}



module.exports={
	passthrough,
	getDataFromOneSheet,
};