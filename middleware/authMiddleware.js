const jwt = require('jsonwebtoken');
const config = require('../utils/config');

const authMiddleware = (req, res, next) => {
        const token = req.headers.authorization;

        if (!token) {
            return res.json({ error: 'Token not found' });
        }

        const getTokenFrom = (req) => {
            const authorization = req.headers.authorization;

            if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
                return authorization.substring(7);
            }

            return null;
        }

        try {
            jwt.verify(getTokenFrom(req), config.JWT_SECRET, (error, decodedToken) => {
                if (error) {
                    return res.json({ error: 'Token is invalid' });
                }

                req.userId = decodedToken.id;
                req.userName = decodedToken.name
                next();
            });
        } catch (error) {
            return res.json({ error: 'Token is invalid' });
        }
    }


module.exports = authMiddleware