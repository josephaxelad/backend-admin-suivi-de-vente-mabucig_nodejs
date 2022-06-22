const Group = require('../models/Group');
const capitalize = require('capitalize')

exports.create =  (req, res, next) => {
    delete req.body._id;
    const group = new Group({
        name : capitalize.words(req.body.name) 
    });
    group.save()
    .then(() => res.status(201).json({ message: "Le groupe d'entreprise "+capitalize.words(req.body.name)+" a été ajouté avec succès !"}))
    .catch(error =>{
        if (error.errors) {
            return res.status(400).json({ message : error.errors.name.message})
        }
        res.status(400).json({ error})
    })
}

exports.modify =  (req, res, next) => {
    Group.updateOne({ _id: req.params.id }, { $set :
        { 
            name : capitalize.words(req.body.name) ,
        } })
    .then(() => res.status(200).json({ message: "Le groupe d'entreprise "+capitalize.words(req.body.name)+" a été modifié avec succès!"}))
    .catch(error => {
        if (error.errors) {
            return res.status(400).json({ message : error.errors.name.message})
        }
        return res.status(400).json({ error}) 
    });
}

exports.delete = (req, res, next) => {
    Group.findOne({ _id: req.params.id})
    .then(city => {
        Group.deleteOne({ _id: req.params.id })
        .then(() =>  res.status(200).json({ message: "Le groupe d'entreprise "+capitalize.words(city.name)+" a été supprimé avec succès !"}))
        .catch(error => res.status(400).json({ error }));
    }) 
    .catch(error => res.status(404).json({ error }));
}

exports.getOne = (req, res, next) => {
    Group.findOne({ _id: req.params.id})
    .then(group => res.status(200).json({group})) 
    .catch(error => res.status(404).json({ error }));
}

exports.getAll =  (req, res, next) => {
    Group.find()
    .then(groups => res.status(200).json(groups))
    .catch(error => res.status(400).json({ error }));
}