
import LINEConnect from './line_connect';
import Reply from './reply';

var LINE_BC = {
	attachServer: (http, config) => {
		LINEConnect.init(config);
		LINEConnect.attachServer(http);
		Reply.init(config);
	},

	on: (type, callback) => {
		LINEConnect.on(type, callback);
	},

	reply: Reply
};

export default LINE_BC;
