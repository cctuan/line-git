
import LINE from './line';
import Git from './github';
import config from './config';
import KEYS from './keys.json';
import mongoose from "mongoose";
import * as User from './user';
import * as Room from './room';


class Main {
	constructor(http) {
		this._http = http;
		this._git = Git;
		this._line = LINE;
		this.init();
	}

	init() {
		mongoose.connect(config.mongo_url);
		this._attachEvents();
		this._git.attachServer(this._http, {

		});
		this._line.attachServer(this._http, {
			channelSecret: config.channelSecret,
			messageType: config.messageType,
			operationType: config.operationType,
			channelToken: config.channelToken,
			channelUrl: config.channelUrl,
			eventToChannelId: config.eventToChannelId,
			eventType: config.eventType,
			linkMessageType: config.linkMessageType,
			linkMessageId: config.linkMessageId
		});
	}

	_attachEvents()	{
		this._git.on('push', this._onGitPush.bind(this));
		this._git.on('pull-request', this._onGitPullRequest.bind(this));
		this._git.on('commit-comment', this._onGitCommitComment.bind(this));
		this._git.on('issue-comment', this._onGitIssueComment.bind(this));
		this._line.on('receive-group-text',
			this._onLineReceiveGroupText.bind(this));
		this._line.on('receive-user-text', this._onLineReceiveUserText.bind(this));
		this._line.on('receive-user-added',
			this._onLineReceiveUserAdded.bind(this));
		this._line.on('receive-user-invited',
			this._onLineReceiveUserInvited.bind(this));
	}

	_parseTextContent(text) {
		if (typeof text !== 'string') {
			return;
		}
		let textArray = text.split(' ');
		if (textArray[0] !== '@git' || textArray.length < 3) {
			return;
		}

		let commandType = textArray[1];
		textArray.splice(0, 2);
		return {
			type: commandType,
			content: textArray
		};
	}

	_onGitPush(data) {
		console.log(data);
	}
	_onGitPullRequest(data) {
		console.log(data);
	}
	_onGitCommitComment(data) {
		console.log(data);
	}
	_onGitIssueComment(data) {
		if (!data.comment || !data.comment.user || !data.issue ||
			!data.issue.user) {
			return;
		}

		let issueTitle = data.issue.title;
		let commentContent = data.comment.body;
		let userGitId = data.issue.user.login;
		let commentGitId = data.comment.user.login;
		let commentUrl = data.comment.url;
		let commentTime = data.comment.updated_at;
		let issueState = data.issue.state;
		let message = '[' + issueState + ']' + issueTitle + '\n' +
			commentContent + '\n@' + commentGitId + '\n' + commentTime + '\n\n' +
			commentUrl;

		if (data.action === 'deleted') {
			// ignore deleted action
			return;
		}
		this._broadToAllRoom(userGitId, message);
	}

	_broadToAllRoom(gitId, msg) {
		User.get.oneUserRoom(gitId).then((roomIds) => {
			this._line.reply.replyText(roomIds, msg);
		}.bind(this));
	}
	// id(array), content
	_onLineReceiveGroupText(data) {
		// for testing
		console.log(data);
		let parsed = this._parseTextContent(data.content);
		if (!parsed) {
			return;
		}
		this._commandHandler(parsed, {ids: data.id}, 'group');
	}
	// id, content
	_onLineReceiveUserText(data) {
		// for testing
		console.log(data);
		let parsed = this._parseTextContent(data.content);
		if (!parsed) {
			return;
		}
		this._commandHandler(parsed, {mid: data.id}, 'user');
		// this._line.reply.replyText(data.id, data.content);
	}

	// id
	_onLineReceiveUserAdded(data) {
		console.log(data);
	}
	// ids
	_onLineReceiveUserInvited(data) {
		console.log(data);
	}

	_commandHandler(command, data, targetType) {
		let type = command.type;
		switch(type) {
			case KEYS.COMMAND_TYPE.REGISTER:
				if (targetType == 'user' && typeof command.content[0] === 'string') {
					let gitId = command.content[0];
					// TODO: need to check gitId valid.
					User.add.user(data.mid, command.content[0]).then((user) => {

					});
				} else if (targetType == 'group' && data.ids.length) {
					command.content.forEach((gitId) => {
						User.add.userToRoom(gitId, data.ids[0]);
					});
				}
				break;
			case KEYS.COMMAND_TYPE.SEARCH:
				break;
		}
	}
}


export default Main;
