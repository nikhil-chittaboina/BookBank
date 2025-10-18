
// Middleware to check user role to restrict them based on role
const role = (requiredRole) => {
    return (req, res, next) => {
        const userRole = req.user.role;
        console.log("Role middleware invoked. User role:", userRole);
        if (userRole === requiredRole) {
            next();
        } else {
            res.status(403).json({ error: 'Forbidden' });
        }
    };
};
module.exports = role;
