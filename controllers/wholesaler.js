const Wholesaler = require('../models/Wholesaler');
const bcrypt = require('bcrypt'); //Cryptage du mot de passe
const jwt = require('jsonwebtoken'); //Token
const capitalize = require('capitalize');

exports.create =  (req, res, next) => {
    (async () => {
        await bcrypt.hash(req.body.password, 10, function(error, hash){
            if (error) {
                return res.status(500).json({ error });
            }
            delete req.body._id;
            const wholesaler = new Wholesaler({
                idAccount : req.body.idAccount ,
                name : capitalize.words(req.body.name) ,
                login : req.body.login ,
                password : hash ,
                phone : req.body.phone ,
                company : capitalize.words(req.body.company) ,
                idsMarket : req.body.idsMarket ,
                idAgency : req.body.idAgency ,
                idGroup : req.body.idGroup ,
            });
            wholesaler.save()
            .then(() => res.status(201).json({ message: 'Le grossiste a été ajouté avec succès !'}))
            .catch(error => {
                if (error.errors) {
                    if (error.errors.login) { return res.status(400).json({ message : error.errors.login.message}) }
                    if (error.errors.name) { return res.status(400).json({ message : error.errors.name.message}) }
                    if (error.errors.company) { return res.status(400).json({ message : error.errors.company.message}) }
                }
                res.status(400).json({ error})
            });
        });

    })();        
}

exports.modify =  (req, res, next) => {
    Wholesaler.updateOne({ _id: req.params.id }, { $set :
        { 
            idAccount : req.body.idAccount ,
            name : capitalize.words(req.body.name) ,
            login : req.body.login ,
            phone : req.body.phone ,
            company : capitalize.words(req.body.company) ,
            idsMarket : req.body.idsMarket ,
            idAgency : req.body.idAgency ,
            idGroup : req.body.idGroup ,
        } })
    .then(() => res.status(200).json({ message: "Le grossiste "+capitalize.words(req.body.name)+" a été modifié avec succès!"}))
    .catch(error => {
        if (error.errors) {
            if (error.errors.login) { return res.status(400).json({ message : error.errors.login.message}) }
            if (error.errors.name) { return res.status(400).json({ message : error.errors.name.message}) }
            if (error.errors.company) { return res.status(400).json({ message : error.errors.company.message}) }
        }
        return res.status(400).json({ error}) 
    });
}

exports.delete = (req, res, next) => {
    Wholesaler.findOne({ _id: req.params.id})
    .then(wholesaler => {
        Wholesaler.deleteOne({ _id: req.params.id })
        .then(() =>  res.status(200).json({ message: "Le grossiste "+capitalize.words(wholesaler.name)+" a été supprimé avec succès !"}))
        .catch(error => res.status(400).json({ error }));
    }) 
    .catch(error => res.status(404).json({ error }));
}

exports.getOne = (req, res, next) => {
    Wholesaler.findOne({ _id: req.params.id})
    .then(wholesaler => res.status(200).json({wholesaler})) 
    .catch(error => res.status(404).json({ error }));
}

exports.getAll =  (req, res, next) => {
    Wholesaler.aggregate([
        { $lookup: {
            from: "cities",
            localField: "idsMarket",
            foreignField: "_id",
            as: "markets"
        },},

        { $lookup: {
            from: "agencies",
            localField: "idAgency",
            foreignField: "_id",
            as: "agency"
        },},
        { $unwind: "$agency" },
            { $lookup: {
                from: "cities",
                localField: "agency.idCity",
                foreignField: "_id",
                as: "agency.city"
            },},
            { $unwind: "$agency.city" },

        { $lookup: {
            from: "groups",
            localField: "idGroup",
            foreignField: "_id",
            as: "group"
        },},
        { $unwind: "$group" },

        {$project : { password :0, idsMarket : 0, idAgency : 0, agency : {idCity : 0}}}
    ])
    .then(wholesalers =>{res.status(200).json(wholesalers)})
    .catch(error =>{console.log(error), res.status(400).json({ error })});
}

exports.getMe = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        const id = decodedToken.id;
        Wholesaler.findOne({ _id: id,isDisabled : false },{password : 0})
        .then(wholesaler => res.status(200).json(wholesaler))
        .catch(error => {res.status(404).json({ error })});
    } catch (error) {
        res.status(404).json({ error  })
    }
}

exports.login = (req, res, next) => {
    Wholesaler.aggregate([
        { $lookup: {
            from: "cities",
            localField: "idsMarket",
            foreignField: "_id",
            as: "markets"
        },},

        { $lookup: {
            from: "agencies",
            localField: "idAgency",
            foreignField: "_id",
            as: "agency"
        },},
        { $unwind: "$agency" },
            { $lookup: {
                from: "cities",
                localField: "agency.idCity",
                foreignField: "_id",
                as: "agency.city"
            },},
            { $unwind: "$agency.city" },

        { $lookup: {
            from: "groups",
            localField: "idGroup",
            foreignField: "_id",
            as: "group"
        },},
        { $unwind: "$group" },
        { $match : { login : req.body.login }},
        {$project : {  idsMarket : 0, idAgency : 0, agency : {idCity : 0}}}
    ])
    .then((wholesalers)=>{
        if (!wholesalers[0]) {
            return  res.status(401).json({code : 0, message: "Ce login n'existe pas!" });
        }
        if (wholesalers[0].isDisabled) {
            return  res.status(401).json({code : 0, message: "Ce compte est désactivé!" });
        }

        (async () => {
            await bcrypt.compare(req.body.password, wholesalers[0].password, function(error, result){
                if (error) {
                    res.status(500).json({ error });
                    console.log(error)
                }
                if (result) {
                    res.status(200).json({
                        user : wholesalers[0],
                        id: wholesalers[0]._id,
                        token: jwt.sign(
                            { id: wholesalers[0]._id },
                            'RANDOM_TOKEN_SECRET_WHOLESALER_TUTU',
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

exports.resetPassword =  (req, res, next) => {
    Wholesaler.findOne({ _id : req.params.id})
    .then((wholesaler)=>{
        if (!wholesaler) {
            return  res.status(400).json({ message: "Ce grossiste n'existe pas!" });
        }

        (async () => {
            await bcrypt.hash('grossiste', 10, function(error, hash){
                if (error) {
                    res.status(500).json({ error });
                    console.log(error)
                }
                Wholesaler.updateOne({ _id: req.params.id }, { $set : {password : hash} })
                .then(() => res.status(200).json({ message: "Mot de passe reinitialisé avec succès, le nouveau mot de passe est : 'grossiste' !"}))
                .catch(error => res.status(400).json({ error }));
            });
        })();
    })
    .catch(error => res.status(500).json({ error }));
}

exports.isDisabled =  (req, res, next) => {
    Wholesaler.findOne({ _id: req.params.id })
    .then(wholesaler => {
        Wholesaler.updateOne({ _id: req.params.id }, { $set : {isDisabled : req.body.isDisabled} })
        .then(() => res.status(200).json({ 
            message: req.body.isDisabled ? 
            "Le compte du grossiste "+wholesaler.name+" a été désactivé avec succès !":
            "Le compte du grossiste "+wholesaler.name+" a été activé avec succès !"
        }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(404).json({ error }));

}