
import mongoose from "mongoose";
import UserSchema from './schema';

const UserModel = mongoose.model('User', UserSchema);

export default {
	oneUserRoom: (gitId) => {
		return new Promise((resolve, reject) => {
			UserModel.findOne({gitId: gitId}, (err, user) => {
				if (err) {
					resolve([]);
					return;
				}
				resolve(user.roomIds);
			});
		});
	},
	one: (query) => {
		return new Promise((resolve, reject) => {
			UserModel.findOne(query, (err, user) => {
				if (err) {
					resolve({});
					return;
				}
				resolve(user);
			});
		});
	}
};