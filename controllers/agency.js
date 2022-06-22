const Agency = require('../models/Agency');

exports.create =  (req, res, next) => {
    delete req.body._id;
    const agency = new Agency({
        code : req.body.code,
        idCity : req.body.idCity,
    });
    agency.save()
    .then(() => res.status(201).json({ message: "L'agence de distribution a été ajoutée avec succès !"}))
    .catch(error =>{
        if (error.errors) {
            return res.status(400).json({ message : error.errors.code.message})
        }
        res.status(400).json({ error })
    });       
}

exports.modify =  (req, res, next) => {
    Agency.updateOne({ _id: req.params.id }, { $set :
        { 
            code : req.body.code,
            idCity : req.body.idCity,
        } })
    .then(() => res.status(200).json({ message: "L'agence de distribution a été modifiée avec succès!"}))
    .catch(error => {
        if (error.errors) {
            return res.status(400).json({ message : error.errors.code.message})
        }
        res.status(400).json({ error : error })
    });
}

exports.delete = (req, res, next) => {
    Agency.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: "L'agence de distribution a été supprimée avec succès !"}))
    .catch(error => res.status(400).json({ error }));
}

exports.getOne = (req, res, next) => {

    Agency.aggregate([
        { "$lookup": {
            "from": "cities",
            "localField": "idCity",
            "foreignField": "_id",
            "as": "city"
        //   "let": { "idCity": { "$toObjectId": "$idCity" } },
        //   "from": "cities",
        //   "pipeline": [
        //     { "$match": { "$expr": { "$eq": [ "$_id", "$$idCity" ] } } }
        //   ],
        //   "as": "city"
        },},
        { "$unwind": "$city" },
        {"$project" : { "idCity" : 0 }}
    ])
    .then(agencies =>{
        const agency = agencies.find(agency => agency._id == req.params.id)
        if (agency) {
            res.status(200).json(agency)
        } else {
            res.status(404).json({ error })
        }   
    }) 
    .catch(error =>{ res.status(404).json({ error })});
    

}

exports.getAll =  (req, res, next) => {
    Agency.aggregate([
        { "$lookup": {
            "from": "cities",
            "localField": "idCity",
            "foreignField": "_id",
            "as": "city"
        //   "let": { "idCity": { "$toObjectId": "$idCity" } },
        //   "from": "cities",
        //   "pipeline": [
        //     { "$match": { "$expr": { "$eq": [ "$_id", "$$idCity" ] } } }
        //   ],
        //   "as": "city"
        },},
        { "$unwind": "$city" },
        {"$project" : { "idCity" : 0 }}
    ])
    .then(agencies =>{
        res.status(200).json(agencies)
    })
    .catch(error =>{console.log(error), res.status(400).json({ error })});
}

