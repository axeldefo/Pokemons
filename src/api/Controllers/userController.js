const userService = require("../../services/userService");

exports.getAll = async (req, res) => {
    const users = await userService.getAll();
    res.json(users);
};
