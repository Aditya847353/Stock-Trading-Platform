const mongoose = require("mongoose");
const { UsersSchema } = require("../schemas/UsersSchema");

const UsersModel = mongoose.model("users", UsersSchema);

module.exports = { UsersModel };
