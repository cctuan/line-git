
import mongoose from "mongoose";
import RoomSchema from './schema';

const RoomModel = mongoose.model('Room', RoomSchema);

export default {
	one: (query) => {
		return new Promise((resolve, reject) => {
			RoomModel.findOne(query, (err, room) => {
				if (err) {
					resolve([]);
					return;
				}
				resolve(room);
			});
		});
	},

	all: (query) => {
		return new Promise((resolve, reject) => {
			RoomModel.find(query, (err, rooms) => {
				if (err) {
					reject(err);
					return;
				}
				resolve(rooms);
			})
		})
	}
};