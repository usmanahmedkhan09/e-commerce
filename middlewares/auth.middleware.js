const jsonwebtoken = require('jsonwebtoken');

module.exports = (req, res, next) =>
{
    const authHeader = req.get('authorization')
    if (!authHeader)
    {
        const error = new Error('Not Authenticated')
        error.status = 401
        return next(error)
        throw error
    }

    let decodeToken;
    let token = authHeader.split(" ")[1]
    try
    {
        decodeToken = jsonwebtoken.verify(token, 'privateKey')
    } catch (error)
    {
        console.log('hererer', decodeToken)
        error.status = 401
        return next(error)
        throw error
    }

    if (!decodeToken)
    {
        const error = new Error('Not Authenticated')
        error.status = 401
        return next(error)
        throw error
    }

    req.userId = decodeToken.userId
    next()
}