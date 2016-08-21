
import request from 'request';

let Reply = {
	_channelToken: '',
	_channelUrl: 'https://api.line.me',
	_eventToChannelId: 1383378250,
	_eventType: '138311608800106203',
	_linkMessageType: '137299299800026303',
	_linkMessageId: 1341301715,

	init: (config) => {
		Reply._channelToken = config.channelToken;
		Reply._channelUrl = config.channelUrl;
		Reply._eventToChannelId = config.eventToChannelId;
		Reply._linkMessageType = config.linkMessageType;
		Reply._linkMessageId = config.linkMessageId;
		Reply._eventType = config.eventType;
	},

	replyLink: (mid, data, callback) => {
		var _this = Reply;
		Reply.replyToLine(mid, {
			templateId: data.templateId,
			"previewUrl": data.imgLink,
			"textParams": {
	      "name": data.name,
	      "number": data.number,
	      "total": data.total
	    },
	    "subTextParams": {
	    	"address": data.subtext
	    },
	    "linkUriParams": {
	      "url": data.url
	    }
		}, callback, {
			eventType: _this._linkMessageType,
			eventToChannelId: _this._linkMessageId
		});
	},

	replyVideo: (mid, data, callback) => {
	  Reply.replyToLine(mid, {
	    contentType: 3,
	    toType: 1,
	   	"originalContentUrl":data.originalContentUrl,
			"previewImageUrl":data.previewImageUrl
	  }, callback);
	},

	replyImage: (mid, url, callback) => {
		Reply.replyToLine(mid, {
			contentType: 2,
			toType: 1,
			"originalContentUrl": url,
	    "previewImageUrl": url
		}, callback);
	},

	replyText: (mid, text, callback) => {
		console.log('[DEBUG] - reply to LINE : ' + text);
		Reply.replyToLine(mid, {
			contentType: 1,
			toType: 1,
			text: text
		}, callback);
	},

	replyToLine : (who, content, callback, options) => {
		var _this = Reply;
		var option = options || {};
		var data = {
			to: typeof who === 'string' ? [who] : who,
			toChannel: option.eventToChannelId || _this._eventToChannelId,
			eventType: option.eventType || _this._eventType,
			content: content
		};
		request({
			method: 'POST',
			url: _this._channelUrl + '/v1/events',
			headers: {
				'Content-Type': 'application/json',
				'X-LINE-ChannelToken': _this._channelToken
			},
			json: data
		}, function(err, res, body) {
			console.log('[DEBUG] - reply to LINE');
			console.log(body);
			if (err) {
				callback && callback(err);
			} else {
				callback && callback();
			}
		});
	},

	getProfile: (who) => {
		var _this = Reply;
		return new Promise((resolve, reject) => {
			request({
				method: 'GET',
				url: _this._channelUrl + '/v1/profiles?mids=' + who,
				headers: {
					'Content-Type': 'application/json',
					'X-LINE-ChannelToken': _this._channelToken
				},
			}, (err, res, body) => {
				if (err) {
					reject({
						status: 400,
						reason: err
					});
					return;
				}
				let result = {};
				try {
					result = JSON.parse(body);
				} catch (e) {}

				if (!result || !result.contacts || result.contacts.count === 0) {
					reject({
						status: 400,
						reason: 'cannot found'
					});
					return;
				}
				resolve({
					status: 200,
					data: result.contacts
				});
			});
		});
	}
}
export default Reply;
