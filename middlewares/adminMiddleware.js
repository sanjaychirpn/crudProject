const adminMiddleware = (req, res, next) => {
    console.log(req.user.user.isadmin)
    if (req.user && req.user.user.isadmin) {
        next();
    } else {
        res.status(403).json({ msg: 'Access denied. Admins only.' });
    }
};

module.exports = adminMiddleware;