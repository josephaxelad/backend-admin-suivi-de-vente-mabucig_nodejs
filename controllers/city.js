const City = require('../models/City');
const capitalize = require('capitalize')

exports.create =  (req, res, next) => {
    delete req.body._id;
    const city = new City({
        name : capitalize.words(req.body.name) 
    });
    city.save()
    .then(() => res.status(201).json({ message: "La ville "+capitalize.words(req.body.name)+" a été ajoutée avec succès !"}))
    .catch(error =>{
        if (error.errors) {
            return res.status(400).json({ message : error.errors.name.message})
        }
        res.status(400).json({ error})
    })
}

exports.modify =  (req, res, next) => {
    City.updateOne({ _id: req.params.id }, { $set :
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
    City.findOne({ _id: req.params.id})
    .then(city => {
        City.deleteOne({ _id: req.params.id })
        .then(() =>  res.status(200).json({ message: "La ville "+capitalize.words(city.name)+" a été supprimée avec succès !"}))
        .catch(error => res.status(400).json({ error }));
    }) 
    .catch(error => res.status(404).json({ error }));
}

exports.getOne = (req, res, next) => {
    City.findOne({ _id: req.params.id})
    .then(city => res.status(200).json({city})) 
    .catch(error => res.status(404).json({ error }));
}

exports.getAll =  (req, res, next) => {
    City.find()
    .then(cities => res.status(200).json(cities))
    .catch(error => res.status(400).json({ error }));
}

