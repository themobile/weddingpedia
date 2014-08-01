/*
 *  User authorizations routing middleware
 */

exports.isLoggedIn = function (req, res, next) {
    if (req.user) {
        next()
    } else {
        return res.redirect('/login')
    }
};

exports.isAdmin = function(req,res,next){
    //todo function to check if is admin
};


