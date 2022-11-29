const { request, response } = require("express")

const isAdminRole = (req = request, res = response, next) => {

    if (!req.user) {
        return res.status(500).json({
            msg: 'Must verify token before the role verification'
        })
    }

    const {role, name} = req.user;

    if (role !== 'ADMIN_ROLE'){
        return res.status(401).json({
            msg: `${name} is not administrator - You are not allowed.`
        })
    }

    next();


}

const hasRole  = ( ...restOfRoles ) =>{

    return (req, res = response, next) =>{
        //console.log(restOfRoles, req.user.role);

        if (!req.user) {
            return res.status(500).json({
                msg: 'Must verify token before the role verification'
            })
        }

        if ( !restOfRoles.includes(req.user.role)) {
            return res.status(401).json({
                msg: `You must have one of these roles ${restOfRoles} to continue`
            })
            
        }

        
        next();
    }
}

module.exports = { isAdminRole, hasRole }