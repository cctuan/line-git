
import mongoose from "mongoose";
import RoomSchema from './schema';
import * as Room from './index';
const RoomModel = mongoose.model('Room', RoomSchema);

export default {
	roomToUser: (roomId, userId) => {
		return new Promise((resolve, reject) => {
			RoomModel.findOne({roomId: roomId}, (err, room) => {
				if (err || !room) {
					RoomModel.create({roomId: roomId, userIds: [userId]}, (err, room) => {
						if (err) {
							reject(err);
							return;
						}
						resolve(room);
						return
					});
					return;
				}

				if (!room.userIds) {
					room.userIds = [];
				}

				if (room.userIds.indexOf(userId) > -1) {
					resolve(room);
					return;
				} else {
					room.userIds.push(userId);
					room.save((err) => {
						if (err) {
							reject(err);
							return;
						}
						resolve(room);
						return;
					});
				}
			});
		}, (err) => {
			reject(err);
		});
	}
};
