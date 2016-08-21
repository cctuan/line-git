
import webhook from './github_webhooks.js';
import hub from 'octonode';

var Git = {
	hub: hub,
	client: null,
	webhook: webhook,
	attachServer: (http, config) => {
		Git.webhook.attachServer(http);
		if (config && config.github && config.github.username &&
			config.github.password) {
			Git.client = Git._hub.client({
				client: config.github.username,
				password: config.github.password
			});
		}
	},

	on: (type, callback) => {
		Git.webhook.on(type, callback);
	}
};

export default Git;

