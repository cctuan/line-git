
import mongoose from "mongoose";

const Schema = mongoose.Schema;
const UserSchema = Schema({
	gitId: {
		type: String,
		required: true
	},
	roomIds: {
		type: [String],
		default: []
	},
	mid: String
}, {
	timestamps: true
});

export default UserSchema;
