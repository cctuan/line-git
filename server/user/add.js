
import mongoose from "mongoose";
import UserSchema from './schema';
import * as Room from './../room';
import * as User from './index';
const UserModel = mongoose.model('User', UserSchema);

export default {
	userToRoom: (gitId, roomId) => {
		return new Promise((resolve, reject) => {
			Room.add.roomToUser(roomId, gitId).then((room) => {
				return User.get.one({gitId: getId});
			}).then((user) => {
				if (!user || !user.gitId) {
					UserModel.create({gitId: gitId, roomIds: [roomId]}, (err, user) => {
						if (err) {
							reject(err);
							return;
						}
						resolve(user);
					});
					return;
				} else if (user.roomIds.indexOf(roomId) === -1) {
					user.roomIds.push(roomId);
					user.save((err) => {
						if (err) {
							reject(err);
							return;
						}
						resolve(user);
					})
					return;
				} else {
					resolve(user);
					return;
				}
			});
		}, (err) => {
			reject(err);
		});
	},
	user: (mid, gitId) => {
		Room.add.roomToUser(mid, gitId);
		return new Promise((resolve, reject) => {
			UserModel.findOne({gitId: gitId}, (err, user) => {
				if (err || !user) {
					UserModel.create({gitId: gitId, mid: mid, roomIds: [mid]}, (err, newUser) => {
						if (err) {
							reject(err);
							return;
						}
						resolve(newUser);
					})
					return;
				}

				if (user.roomIds.indexOf(mid) === -1) {
					user.roomIds.push(mid);
				}
				if (!user.mid) {
					user.mid = mid;
					user.save((err) => {
						if (err) {
							reject(err);
							return;
						}
						resolve(user);
					})
					return;
				}
				resolve(user);
			});
		}, (err) => {
			reject(err);
		});
	}
};
