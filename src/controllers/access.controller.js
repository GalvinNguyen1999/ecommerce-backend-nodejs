const AccessService = require("../services/access.service")

class AccessController {
  signup = async (req, res, next) => {
    return res.status(200).json(await AccessService.signup(req.body))
  }
}

module.exports = new AccessController()