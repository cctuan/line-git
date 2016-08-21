
import mongoose from "mongoose";

const Schema = mongoose.Schema;
const RoomSchema = Schema({
	roomId: {
		type: String,
		required: true
	},
	userIds: {
		type: [String],
		default: []
	}
}, {
	timestamps: true
});

export default RoomSchema;
