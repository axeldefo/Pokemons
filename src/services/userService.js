const user = require("../models/User")

exports.getAll = async () =>{
    return user.find({});
}

