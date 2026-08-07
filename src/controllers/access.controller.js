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

  logout = async (req, res, next) => {
    new SuccessResponse({
      message: 'Logout success!',
      metadata: await AccessService.logout(req.keyStore),
      options: {
        limit: 10
      }
    })
    .send(res)
  }

  handleRefreshToken = async (req, res, next) => {
    new SuccessResponse({
      message: 'Refresh token success!',
      metadata: await AccessService.handleRefreshTokenv2({
        refreshToken: req.refreshToken,
        user: req.user,
        keyStore: req.keyStore,
      }),
      options: {
        limit: 10
      }
    })
    .send(res)
  }
}

module.exports = new AccessController()