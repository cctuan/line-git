import request from 'request';
import config from './../config'

export default function(mid, data) {
	return new Promise((resolve, reject) => {
		data.my_mid = mid;
		request({
			method: 'POST',
			uri: config.api_post_url + '/user/register',
			body: JSON.stringify(data), 
			headers: {
				'content-type': 'application/json'
			},
		}, (err, res, body) => {
			if (err) {
				reject({
					status: 500,
					reason: err
				});
				return;
			}
			let result = {};
			try {
				result = JSON.parse(body);
			} catch (e) {}

			resolve({
				status: 200,
				data: result.responseBody
			})
		});
	});
}