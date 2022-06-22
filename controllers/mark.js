const Mark = require('../models/Mark');
const capitalize = require('capitalize')

exports.create =  (req, res, next) => {
    delete req.body._id;
    const mark = new Mark({
        name : capitalize.words(req.body.name) 
    });
    mark.save()
    .then(() => res.status(201).json({ message: "La marque de produit "+capitalize.words(req.body.name)+" a été ajoutée avec succès !"}))
    .catch(error =>{
        if (error.errors) {
            return res.status(400).json({ message : error.errors.name.message})
        }
        res.status(400).json({ error})
    })
}

exports.modify =  (req, res, next) => {
    Mark.updateOne({ _id: req.params.id }, { $set :
        { 
            name : capitalize.words(req.body.name) ,
        } })
    .then(() => res.status(200).json({ message: "La marque de produit "+capitalize.words(req.body.name)+" a été modifiée avec succès!"}))
    .catch(error => {
        if (error.errors) {
            return res.status(400).json({ message : error.errors.name.message})
        }
        return res.status(400).json({ error}) 
    });
}

exports.delete = (req, res, next) => {
    Mark.findOne({ _id: req.params.id})
    .then(city => {
        Mark.deleteOne({ _id: req.params.id })
        .then(() =>  res.status(200).json({ message: "La marque de produit "+capitalize.words(city.name)+" a été supprimée avec succès !"}))
        .catch(error => res.status(400).json({ error }));
    }) 
    .catch(error => res.status(404).json({ error }));
}

exports.getOne = (req, res, next) => {
    Mark.findOne({ _id: req.params.id})
    .then(mark => res.status(200).json({mark})) 
    .catch(error => res.status(404).json({ error }));
}

exports.getAll =  (req, res, next) => {
    Mark.find()
    .then(marks => res.status(200).json(marks))
    .catch(error => res.status(400).json({ error }));
}