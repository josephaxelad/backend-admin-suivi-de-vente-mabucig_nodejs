const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

class adminAuth{
    static roles(roles){
        return async (req, res, next) =>{
            try {
                const token = req.headers.authorization.split(' ')[1];
                const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
                const id = decodedToken.id;

                Admin.findOne({ _id: id })
                .then(admin => {
                    if (roles.includes(admin.role)) {
                        next();
                    } else {
                        res.status(401).json({ error : "Vous n'avez pas la permission " })
                    }
                })
                .catch(error => res.status(404).json({ error }));
                
              } catch (error){
                res.status(401).json({
                  error
                });
              } 
        }
    }
}

module.exports = adminAuth;





// module.exports = (req, res, next) => {
//   try {
//     const token = req.headers.authorization.split(' ')[1];
//     const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
//     const id = decodedToken.id;
//     if (req.body.id && req.body.id !== id) {
//       throw 'Invalid user ID';
//     } else {
//       next();
//     }
//   } catch {
//     res.status(401).json({
//       error: new Error('Invalid request!')
//     });
//   }
// };