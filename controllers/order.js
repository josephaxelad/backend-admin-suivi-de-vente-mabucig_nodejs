const mongoose = require('mongoose');
const Order = require('../models/Order');
const capitalize = require('capitalize');
const ObjectId = mongoose.Types.ObjectId;

exports.create =  (req, res, next) => {
    delete req.body._id;
    const order = new Order({
        date : req.body.date,
        cart : req.body.cart,
        price : req.body.price,
        idWholesaler : req.body.idWholesaler,
        idSemiWholesaler : req.body.idSemiWholesaler,
        sent : true
    });
    order.save()
    .then(() => res.status(201).json({ message: "La vente a été effectuée avec succès !"}))
    .catch(error =>{
        res.status(400).json({ error})
    })
}

exports.modify =  (req, res, next) => {
    Order.updateOne({ _id: req.params.id }, { $set :
        { 
            name : capitalize.words(req.body.name) ,
        } })
    .then(() => res.status(200).json({ message: "La ville "+capitalize.words(req.body.name)+" a été modifiée avec succès!"}))
    .catch(error => {
        if (error.errors) {
            return res.status(400).json({ message : error.errors.name.message})
        }
        return res.status(400).json({ error}) 
    });
}

exports.delete = (req, res, next) => {
    Order.findOne({ _id: req.params.id})
    .then(city => {
        City.deleteOne({ _id: req.params.id })
        .then(() =>  res.status(200).json({ message: "La ville "+capitalize.words(city.name)+" a été supprimée avec succès !"}))
        .catch(error => res.status(400).json({ error }));
    }) 
    .catch(error => res.status(404).json({ error }));
}

exports.getOne = (req, res, next) => {
    Order.findOne({ _id: req.params.id})
    .then(order => res.status(200).json({order})) 
    .catch(error => res.status(404).json({ error }));
}

exports.getAll =  (req, res, next) => {
    Order.aggregate([
        { "$lookup": {
            "from": "wholesalers",
            "localField": "idWholesaler",
            "foreignField": "_id",
            "as": "wholesaler"
        },},
        { "$unwind": "$wholesaler" },

        { "$lookup": {
            "from": "semiWholesaler",
            "localField": "idSemiWholesaler",
            "foreignField": "_id",
            "as": "semiWholesaler"
        },},
        { "$unwind": "$semiWholesaler" },

        {"$project" : { "idWholesaler" : 0 ,"idSemiWholesaler" : 0}}
    ])
    .then(orders => res.status(200).json(orders))
    .catch(error => res.status(400).json({ error }));
}

exports.getAllByWholesaler =  (req, res, next) => {
    // find({ idWholesaler: req.params.id})
    Order.aggregate([
        { "$lookup": {
            "from": "wholesalers",
            "localField": "idWholesaler",
            "foreignField": "_id",
            "as": "wholesaler"
        },},
        { "$unwind": "$wholesaler" },

        { "$lookup": {
            "from": "semiwholesalers",
            "localField": "idSemiWholesaler",
            "foreignField": "_id",
            "as": "semiWholesaler"
        },},
        { "$unwind": "$semiWholesaler" },

        // {"$project" : { "idWholesaler" : 1 ,"idSemiWholesaler" : 0}},
        { $match : { idWholesaler: ObjectId(req.params.id)}}
        
    ])
    .then(orders => res.status(200).json(orders))
    .catch(error =>  {console.log(error);res.status(400).json({ error })});
}


