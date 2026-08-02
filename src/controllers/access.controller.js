const AccessService = require("../services/access.service")
const { CREATED, SuccessResponse } = require('../core/success.response')

class AccessController {
  login = async (req, res, next) => {
    new SuccessResponse({
      message: 'Login success!',
      metadata: await AccessService.login(req.body),
      options: {
        limit: 10
      }
    })
    .send(res)
  }
  
  signup = async (req, res, next) => {
    new CREATED({
      message: 'Register success!',
      metadata: await AccessService.signup(req.body),
      options: {
        limit: 10
      }
    })
    .send(res)
  }
}

module.exports = new AccessController()