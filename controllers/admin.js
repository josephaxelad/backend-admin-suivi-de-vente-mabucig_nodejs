const Admin = require('../models/Admin');
const bcrypt = require('bcrypt'); //Cryptage du mot de passe
const jwt = require('jsonwebtoken'); //Token
const capitalize = require('capitalize')

exports.create =  (req, res, next) => {
    (async () => {
        await bcrypt.hash(req.body.password, 10, function(error, hash){
            if (error) {
                return res.status(500).json({ error });
            }
            delete req.body._id;
            const admin = new Admin({
                firstname : capitalize.words(req.body.firstname),
                lastname : req.body.lastname.toUpperCase(),
                login : req.body.login,
                password : hash,
                picture : req.body.picture,
                role : req.body.role,
                isDisabled : req.body.isDisabled,
            });
            admin.save()
            .then(() => res.status(201).json({ message: 'Administrateur ajouté avec succès !'}))
            .catch(error => {
                if (error.errors) {
                    return res.status(400).json({ message : error.errors.login.message})
                }
                res.status(400).json({ error})
            });
        });

    })();        
}

exports.modifyUser =  (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const id = decodedToken.id;
    Admin.updateOne({ _id: id }, { $set :
        { 
        firstname : capitalize.words(req.body.firstname),
        lastname : req.body.lastname.toUpperCase(),
        login : req.body.login,
        picture : req.body.picture,
        } })
    .then(() => res.status(200).json({ message: 'Administrateur modifié avec succès!'}))
    .catch(error => {
        if (error.errors.login.message) {
            return res.status(400).json({ message : error.errors.login.message})
        }
        res.status(400).json({ error})
    });
}

exports.modifyPassword =  (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const id = decodedToken.id;
    Admin.findOne({ _id : id})
    .then((admin)=>{
        if (!admin) {
            return  res.status(400).json({ message: "Cet administrateur n'existe pas!" });
        }

        (async () => {
            await bcrypt.compare(req.body.oldPassword, admin.password, function(error, result){
                if (error) {
                    res.status(500).json({ error });
                    console.log(error)
                }
                if (result) {
                    (async () => {
                        await bcrypt.hash(req.body.newPassword, 10, function(error, hash){
                            if (error) {
                                res.status(500).json({ error });
                                console.log(error)
                            }
                            Admin.updateOne({ _id: req.params.id }, { $set : {password : hash} })
                            .then(() => res.status(200).json({ message: "Mot de passe modifié avec succès !"}))
                            .catch(error => res.status(400).json({ error }));
                        });
                    })();
                    
                } else {
                    return res.status(400).json({code : 0, message: 'Ancien mot de passe incorrect !' });
                }
            });
    
        })();
    })
    .catch(error => res.status(500).json({ error }));
}

exports.resetPassword =  (req, res, next) => {
    Admin.findOne({ _id : req.params.id})
    .then((admin)=>{
        if (!admin) {
            return  res.status(400).json({ message: "Cet administrateur n'existe pas!" });
        }
        if (admin.role == "superadmin" | "root") {
            return  res.status(400).json({ message: "Action non autorisée!" });
        }

        (async () => {
            await bcrypt.hash('admin', 10, function(error, hash){
                if (error) {
                    res.status(500).json({ error });
                    console.log(error)
                }
                Admin.updateOne({ _id: req.params.id }, { $set : {password : hash} })
                .then(() => res.status(200).json({ message: "Mot de passe reinitialisé avec succès, le nouveau mot de passe est : 'admin' !"}))
                .catch(error => res.status(400).json({ error }));
            });
        })();
    })
    .catch(error => res.status(500).json({ error }));
}

exports.modifyRole =  (req, res, next) => {
    Admin.findOne({ _id : req.params.id})
    .then((admin)=>{
        if (!admin) {
            return  res.status(400).json({ message: "Cet administrateur n'existe pas!" });
        }
        if (admin.role == "superadmin" | "root") {
            return  res.status(400).json({ message: "Action non autorisée!" });
        }
        Admin.updateOne({ _id: req.params.id }, { $set : {role : req.body.role} })
        .then(() => res.status(200).json({ message: "Role de l'administrateur modifié avec succès !"}))
        .catch(error => res.status(400).json({ error }));

    })
    .catch(error => res.status(500).json({ error }));
   
}

exports.isDisabled =  (req, res, next) => {
    Admin.findOne({ _id: req.params.id,isDisabled : false,$not: {role : 'superadmin'} },{password : 0})
    .then(thing => {
        Admin.updateOne({ _id: req.params.id }, { $set : {isDisabled : req.body.isDisabled} })
        .then(() => res.status(200).json({ 
            message: req.body.isDisabled ? 
            "Le compte de l'administrateur a été désactivé avec succès !":
            "Le compte de l'administrateur a été activé avec succès !"
        }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(404).json({ error }));

}

exports.delete = (req, res, next) => {
    Admin.updateOne({ _id: req.params.id },{$set : {isDeleted : true,}})
        .then(() => res.status(200).json({ message: "L'administrateur a été supprimé avec succès !"}))
        .catch(error => res.status(400).json({ error }));
}

exports.deleteHard = (req, res, next) => {
    Admin.findOne({ _id: req.params.id,isDisabled : false,$not: {role : 'superadmin'} },{password : 0})
    .then(thing => {
        Admin.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: "L'administrateur a été supprimé avec succès !"}))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(404).json({ error }));
}

exports.getOne = (req, res, next) => {
    Admin.findOne({ _id: req.params.id,isDisabled : false },{password : 0})
    .then(thing => res.status(200).json(thing))
    .catch(error => res.status(404).json({ error }));
}

exports.getMe = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        const id = decodedToken.id;
        Admin.findOne({ _id: id,isDisabled : false },{password : 0})
        .then(admin => res.status(200).json(admin))
        .catch(error => {res.status(404).json({ error });console.log(error)});
    } catch (error) {
        res.status(404).json({ error  })
    }
}

exports.getAll =  (req, res, next) => {
    Admin.find({ isDisabled : false},{password : 0})
    .then(things => res.status(200).json(things))
    .catch(error => res.status(400).json({ error }));
}

exports.getVeryAll =  (req, res, next) => {
    Admin.find({},{password : 0})
    .then(things => res.status(200).json(things))
    .catch(error => res.status(400).json({ error }));
}

exports.login = (req, res, next) => {
    Admin.findOne({ login : req.body.login})
    .then((admin)=>{
        if (!admin) {
            return  res.status(401).json({code : 0, message: "Ce login n'existe pas!" });
        }
        if (admin.isDisabled) {
            return  res.status(401).json({code : 0, message: "Ce compte est désactivé!" });
        }

        (async () => {
            await bcrypt.compare(req.body.password, admin.password, function(error, result){
                if (error) {
                    res.status(500).json({ error });
                    console.log(error)
                }
                if (result) {
                    res.status(200).json({
                        id: admin._id,
                        token: jwt.sign(
                            { id: admin._id },
                            'RANDOM_TOKEN_SECRET',
                            { expiresIn: '24h' }
                          )
                    });  
                    
                } else {
                    return res.status(401).json({code : 0, message: 'Mot de passe incorrect !' });
                }
            });
    
        })();

    })
    .catch(error => res.status(500).json({ error }));
}

exports.isSignedIn  = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const id = decodedToken.id;
    Admin.findOne({ _id: id,isDisabled : false },{password : 0})
    .then(admin => res.status(200).json({isSignedIn : true,token : token}))
    .catch(error => {res.status(404).json({ error });console.log(false)});
}