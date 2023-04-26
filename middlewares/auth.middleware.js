const jsonwebtoken = require('jsonwebtoken');

module.exports = (req, res, next) =>
{
    const authHeader = req.get('authorization')
    if (!authHeader)
    {
        const error = new Error('Not Authenticated')
        error.status = 401
        throw error
    }

    let decodeToken;
    let token = authHeader.split(" ")[1]
    try
    {
        decodeToken = jsonwebtoken.verify(token, 'privateKey')
    } catch (error)
    {
        error.status = 401
        throw error
    }

    if (!decodeToken)
    {
        const error = new Error('Not Authenticated')
        error.status = 401
        throw error
    }

    req.userId = decodeToken.userId
    next()
}