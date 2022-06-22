const Product = require('../models/Product');
const capitalize = require('capitalize')
const fs = require('fs');


/**
 * Ajoute un élément 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.create =  (req, res, next) => {
    const object = JSON.parse(req.body.product)
    object.sku = capitalize.words(object.sku)
    delete req.body._id;
    const product = new Product({
        ...object,
        picture : req.file ? req.file.filename : 'product_default.png',
    });
    product.save()
    .then(() => {res.status(201).json({ message: 'Le produit '+capitalize.words(object.sku)+' a été ajouté avec succès !'})})
    .catch(error =>{
        if (error.errors) {
            if (error.errors.sku) { return res.status(400).json({ message : error.errors.sku.message}) }
        }
        res.status(400).json({ error })
    });
}

/**
 * Modifie un élément
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.modify =  (req, res, next) => {
    const object = JSON.parse(req.body.product);
    object.sku = capitalize.words(object.sku)
    delete req.body._id;
    Product.updateOne({ _id: req.params.id }, { 
        ...object,
        picture : req.file ? req.file.filename : 'product_default.png',
        })
        .then(() => res.status(200).json({ message:'Le produit '+capitalize.words(object.sku)+' a été modifié avec succès !'}))
        .catch(error => {
            if (error.errors) {
                if (error.errors.sku) { return res.status(400).json({ message : error.errors.sku.message}) }
            }
            res.status(400).json({ error })
            res.status(400).json({ error })
    });

}


/**
 * Supprime un élément définitivement de la base de donnée
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.delete = (req, res, next) => {
    Product.findOne({ _id: req.params.id })
    .then(product => {
        const filename = product.picture;
        if (filename == 'product_default.png') {
            Product.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Le produit '+capitalize.words(product.sku)+' supprimé définitivement !'}))
            .catch(error => res.status(400).json({ error }));
        } else {
            fs.unlink(`images/produits/${filename}`, () => {
                Product.deleteOne({ _id: req.params.id })
                .then(() => res.status(200).json({ message: 'Le produit '+capitalize.words(product.sku)+' supprimé définitivement !'}))
                .catch(error => res.status(400).json({ error }));
            });
        }
        
    })
    .catch(error => res.status(500).json({ error }));
    
}

/**
 * Récupère un seul élément par son identifiant
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.getOne = (req, res, next) => {
    Product.aggregate([
        { "$lookup": {
            "from": "marks",
            "localField": "idMark",
            "foreignField": "_id",
            "as": "mark"
        },},
        { "$unwind": "$mark" },
        {"$project" : { "idMark" : 0 }},
        { "$match" : { "isDisabled": false, "_id" : req.params.id }}
    ])
    .then(product => res.status(200).json(product))
    .catch(error => res.status(400).json({ error }));
}

/**
 * Récupère tous les élément sauf les éléments supprimés
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.getAll =  (req, res, next) => {
    Product.aggregate([
        { "$lookup": {
            "from": "marks",
            "localField": "idMark",
            "foreignField": "_id",
            "as": "mark"
        },},
        { "$unwind": "$mark" },
        {"$project" : { "idMark" : 0 }},
        { "$match" : { "isDisabled": false }}
    ])
    .then(products => res.status(200).json(products))
    .catch(error => res.status(400).json({ error }));
}


