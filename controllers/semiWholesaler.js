const mongoose = require('mongoose');
const SemiWholesaler = require('../models/SemiWholesaler');
const capitalize = require('capitalize')
const ObjectId = mongoose.Types.ObjectId;

exports.create =  (req, res, next) => {
    delete req.body._id;
    const semiWholesaler = new SemiWholesaler({
        name : capitalize.words(req.body.name),
        idAccount : req.body.idAccount ,
        idWholesaler : req.body.idWholesaler ,
        phone1 : req.body.phone1 ,
        phone2 : req.body.phone2 ? req.body.phone2 : undefined ,
        picture : req.body.picture ,
        address : req.body.address ,
    });
    semiWholesaler.save()
    .then(() => res.status(201).json({ message: "Le semi-grossiste "+capitalize.words(req.body.name)+" a été ajouté avec succès !"}))
    .catch(error =>{
        if (error.errors) {
            if (error.errors.idAccount) { return res.status(400).json({ message : error.errors.idAccount.message}) }
            if (error.errors.name) { return res.status(400).json({ message : error.errors.name.message}) }
        }
        res.status(400).json({ error})
    })
}

exports.modify =  (req, res, next) => {
    SemiWholesaler.updateOne({ _id: req.params.id }, { $set :
        { 
            name : capitalize.words(req.body.name),
            idAccount : req.body.idAccount ,
            idWholesaler : req.body.idWholesaler ,
            phone1 : req.body.phone1  ,
            phone2 : req.body.phone2 ? req.body.phone2 : undefined ,
            picture : req.body.picture ,
            address : req.body.address ,
        } })
    .then(() => res.status(200).json({ message: "Le semi-grossiste "+capitalize.words(req.body.name)+" a été modifiée avec succès!"}))
    .catch(error => {
        if (error.errors) {
            return res.status(400).json({ message : error.errors.name.message})
        }
        return res.status(400).json({ error}) 
    });
}

exports.delete = (req, res, next) => {
    SemiWholesaler.findOne({ _id: req.params.id})
    .then(semiWholesaler => {
        SemiWholesaler.deleteOne({ _id: req.params.id })
        .then(() =>  res.status(200).json({ message: "Le semi-grossiste "+capitalize.words(semiWholesaler.name)+" a été supprimée avec succès !"}))
        .catch(error => res.status(400).json({ error }));
    }) 
    .catch(error => res.status(404).json({ error }));
}

exports.getOne = (req, res, next) => {
    SemiWholesaler.findOne({ _id: req.params.id})
    .then(semiWholesaler => res.status(200).json({semiWholesaler})) 
    .catch(error => res.status(404).json({ error }));
}

exports.getAll =  (req, res, next) => {
    SemiWholesaler.aggregate([
        { $lookup: {
            from: "wholesalers",
            localField: "idWholesaler",
            foreignField: "_id",
            as: "wholesaler"
        },},
        { $unwind: "$wholesaler" },

        { $lookup: {
            from: "cities",
            localField: "address.idCity",
            foreignField: "_id",
            as: "address.city"
        },},
        { $unwind: "$address.city" },

        {$project : {password : 0, idWholesaler : 0, address : {idCity : 0}}}
    ])
    .then(semiWholesalers => res.status(200).json(semiWholesalers))
    .catch(error => res.status(400).json({ error }));
}

exports.getByWholesaler =  (req, res, next) => {
    SemiWholesaler.aggregate([
        { $lookup: {
            from: "wholesalers",
            localField: "idWholesaler",
            foreignField: "_id",
            as: "wholesaler"
        },},
        { $unwind: "$wholesaler" },

        { $lookup: {
            from: "cities",
            localField: "address.idCity",
            foreignField: "_id",
            as: "address.city"
        },},
        { $unwind: "$address.city" },

        { $match : { idWholesaler : ObjectId(req.params.id) }},
        {$project : {password : 0, address : {idCity : 0}}}
    ])
    .then(semiWholesalers => res.status(200).json(semiWholesalers))
    .catch(error => res.status(400).json({ error }));
}

exports.isDisabled =  (req, res, next) => {
    SemiWholesaler.findOne({ _id: req.params.id })
    .then(semiWholesaler => {
        SemiWholesaler.updateOne({ _id: req.params.id }, { $set : {isDisabled : req.body.isDisabled} })
        .then(() => res.status(200).json({ 
            message: req.body.isDisabled ? 
            "Le compte du semi-grossiste "+semiWholesaler.name+" a été désactivé avec succès !":
            "Le compte du semi-grossiste "+semiWholesaler.name+" a été activé avec succès !"
        }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(404).json({ error }));

}