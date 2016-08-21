
import request from 'request';
import CryptoJS from "crypto-js";
import KEY from './key.json';
// import {addUser} from './user';
//import conversationRouter from './conversationRouter.js';
import events from 'events';

var LINEConnect = {
	_events: new events.EventEmitter(),

	_server: null,

	_config: {},

	init: (config) => {
		LINEConnect._config = config;
	},

	attachServer: (http) => {
		http.post('/events',
			/* LINEConnect._verifySigniture, */
			LINEConnect._startParseContent.bind(LINEConnect));
	},

	_verifySigniture : (req, res, next) => {
		var channelSignature = req.get('X-LINE-ChannelSignature');
		var sha256 = CryptoJS.HmacSHA256(JSON.stringify(req.body),
			LINEConnect._config.channelSecret);
		var base64encoded = CryptoJS.enc.Base64.stringify(sha256);
		if (base64encoded === channelSignature) {
			next();
		} else {
			res.status(401).end();
		}
	},

	_logError: (msg) => {
		LINEConnect._events.emit(KEY.TYPE.WARN, msg);
	},

	on: (eventType, callback) => {
		return LINEConnect._events.on(eventType, callback);
	},

	_startParseContent: (req, res) => {
		var results = req.body.result;
		if (!results || !results.length) {
			LINEConnect._logError('[Warning] - getting incorrect content from LINE');
			// ask for resend
			res.status(300).end();
			return;
		}
		// assume we can parse the data, early send 200 response to server
		res.status(200).end();
		results.forEach(LINEConnect._replyFromResult.bind(LINEConnect));
	},

	_replyFromResult: (result) => {
		var eventType = result.eventType;
		switch (eventType) {
			case LINEConnect._config.messageType: // receiving messages
				LINEConnect._replyFromMessage(result.content);
				break;
			case LINEConnect._config.operationType: // receiving opeations
				LINEConnect._replyFromOperations(result.content);
				break;
			default:
				LINEConnect._logError(
					'[Warning] - getting incorrect eventType from LINE');
				return undefined;
				break;
		}
	},

	_replyFromMessage: (content) => {
		if (!content.contentType) {
			LINEConnect._logError(
				'[Warnning] - cannot parse content without contentType');
			return;
		}
		switch (content.contentType) {
			case 1:
				LINEConnect.userMessageHandler(content);
				break;
			case 2:
			case 3:
				LINEConnect.roomMessageHandler(content);
				break;
		}
	},

	userMessageHandler: (content) => {
		if (!content.from) {
			LINEConnect._logError(
				'[Warnning] - cannot parse user content without from');
			return;
		}
		LINEConnect.messageHandler(content, KEY.TYPE.USER);

	},

	roomMessageHandler: (content) => {
		if (!content.to || !content.to.length) {
			LINEConnect._logError(
				'[Warnning] - cannot parse group/room content without to');
			return;
		}
		LINEConnect.messageHandler(content, KEY.TYPE.GROUP);
	},

	messageHandler: (content, type) => {
		switch (content.contentType) {
			case KEY.MESSAGE.CONTENT_TYPE.TEXT:
				if (type === KEY.TYPE.GROUP) {
					LINEConnect._events.emit(KEY.BROADCAST.TYPE.RECEIVE_GROUP_TEXT, {
						id: content.to,
						content: content.text
					});
				} else if (type === KEY.TYPE.USER) {
					LINEConnect._events.emit(KEY.BROADCAST.TYPE.RECEIVE_USER_TEXT, {
						id: content.from,
						content: content.text
					});
				}
				break;
			case KEY.MESSAGE.CONTENT_TYPE.IMAGE:
			case KEY.MESSAGE.CONTENT_TYPE.VIDEO:
			case KEY.MESSAGE.CONTENT_TYPE.AUDIO:
			case KEY.MESSAGE.CONTENT_TYPE.STICKER:
			case KEY.MESSAGE.CONTENT_TYPE.CONTACT:
				break;
			default:
				LINEConnect._logError('cannot handle this content type');
				break;
		}
	},

	replyFromAddedFriendOperation: (mid) => {
		if (!mid) {
			return;
		}
		LINEConnect._events.emit(KEY.BROADCAST.TYPE.RECEIVE_USER_ADDED,
			mid);
	},

	replyFromGroupOperation: (groupIds) => {
		if (!groupIds || !groupIds.length) {
			return;
		}
		LINEConnect._events.emit(KEY.BROADCAST.TYPE.RECEIVE_INVITED_GROUP,
			groupIds);
	},

	replyFromBlocked: () => {

	},

	_replyFromOperations: (content) => {
		if (!content.params || content.params.length === 0) {
			return;
		}
		content.params.forEach((item) => {
			LINEConnect.replyFromOperation(content.opType, item);
		}.bind(LINEConnect));
	},
	_replyFromOperation: (type, content) => {
		switch (type) {
			case KEY.OPERATION.TYPE.ADDED_FRIEND:
				LINEConnect.replyFromAddedFriendOperation(content.from);
				break;
			case KEY.OPERATION.TYPE.INVITED_GROUP:
				LINEConnect.replyFromGroupOperation(content.to);
				break;
			case KEY.OPERATION.TYPE.INVITED_ROOM:
				LINEConnect.replyFromGroupOperation(content.to);
				break;
			case KEY.OPERATION.TYPE.BLOCKED:
				break;
		}
	}
};

export default  LINEConnect;
