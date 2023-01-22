const mongoose = require('mongoose');
const Order = require('../models/Order');
const capitalize = require('capitalize');
const ObjectId = mongoose.Types.ObjectId;
// var dateFormat = require('dateFormat');
// import dateFormat, { masks } from "dateformat";

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

exports.createMany =  (req, res, next) => {
    const orders = req.body.map((order) => {return({...order,sent : true})})
    Order.insertMany(orders)
    .then(() => res.status(201).json({ message: "La ventes ont été effectuées avec succès !"}))
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
    // Order.find()

    Order.aggregate([
        { "$unwind": "$cart" },
        { "$lookup": {
            "from": "products",
            "localField": "cart.idProduct",
            "foreignField": "_id",
            "as": "cart.product"
        },},
        { "$unwind": "$cart.product" },
        { "$lookup": {
            "from": "wholesalers",
            "localField": "idWholesaler",
            "foreignField": "_id",
            "as": "wholesaler"
        },},
        { "$unwind": "$wholesaler" },
            { $lookup: {
                from: "agencies",
                localField: "wholesaler.idAgency",
                foreignField: "_id",
                as: "wholesaler.agency"
            },},
            { $unwind: "$wholesaler.agency" },
                { $lookup: {
                    from: "cities",
                    localField: "wholesaler.agency.idCity",
                    foreignField: "_id",
                    as: "wholesaler.agency.city"
                },},
                { $unwind: "$wholesaler.agency.city" },



        { "$lookup": {
            "from": "semiwholesalers",
            "localField": "idSemiWholesaler",
            "foreignField": "_id",
            "as": "semiWholesaler"
        },},
        { "$unwind": "$semiWholesaler" },
            { $lookup: {
                from: "cities",
                localField: "semiWholesaler.address.idCity",
                foreignField: "_id",
                as: "semiWholesaler.address.city"
            },},
            { $unwind: "$semiWholesaler.address.city" },

        // { "$lookup": {
        //     "from": "products",
        //     "localField": "cart.idProduct",
        //     "foreignField": "_id",
        //     "as": "cart.product"
        // },},
        // { "$unwind": "$semiWholesaler" },

        // { "$lookup": {
        //     "from": "products",
        //     "let": { "cart": "$cart" },
        //      "pipeline": [
        //        { "$match": { "$expr": { "$in": [ "$idProduct", "$$cart" ] } } }
        //       ],
        //       "as": "cart.product"
        //     }}

        // {"$project" : { "idWholesaler" : 0 ,"idSemiWholesaler" : 0}}
    ])
    .then(orders => {res.status(200).json(orders.reverse())})
    .catch(error => res.status(400).json({ error }));
}

exports.getAllGroupBySemiWholesalerAndProduct =  (req, res, next) => {
    Order.aggregate([
        { "$unwind": "$cart" },
        { "$lookup": {
            "from": "products",
            "localField": "cart.idProduct",
            "foreignField": "_id",
            "as": "cart.product"
        },},
        { "$unwind": "$cart.product" },
        { "$lookup": {
            "from": "wholesalers",
            "localField": "idWholesaler",
            "foreignField": "_id",
            "as": "wholesaler"
        },},
        { "$unwind": "$wholesaler" },
            { $lookup: {
                from: "agencies",
                localField: "wholesaler.idAgency",
                foreignField: "_id",
                as: "wholesaler.agency"
            },},
            { $unwind: "$wholesaler.agency" },
                { $lookup: {
                    from: "cities",
                    localField: "wholesaler.agency.idCity",
                    foreignField: "_id",
                    as: "wholesaler.agency.city"
                },},
                { $unwind: "$wholesaler.agency.city" },



        { "$lookup": {
            "from": "semiwholesalers",
            "localField": "idSemiWholesaler",
            "foreignField": "_id",
            "as": "semiWholesaler"
        },},
        { "$unwind": "$semiWholesaler" },
            { $lookup: {
                from: "cities",
                localField: "semiWholesaler.address.idCity",
                foreignField: "_id",
                as: "semiWholesaler.address.city"
            },},
            { $unwind: "$semiWholesaler.address.city" },

        {$group :
            {
                _id :{ 
                    idSemiWholesaler : "$idSemiWholesaler",
                    idProduct : "$cart.idProduct",
                    date : { $dateFromString: {
                        dateString: {$dateToString: { format: "%Y-%m-%d",date: "$date" }},
                        format: "%Y-%m-%d"
                    } } 
                },
                date :  { $first: { $dateFromString: {
                    dateString: {$dateToString: { format: "%Y-%m-%d",date: "$date" }},
                    format: "%Y-%m-%d"
                } } } ,
                qty : { $sum: '$cart.qty' },
                price : { $sum: { $multiply : ['$cart.qty','$cart.price']} },
                product : {$first :"$cart.product"},
                wholesaler :{$first : '$wholesaler'},
                semiWholesaler : {$first :'$semiWholesaler'},
            },
        },

        { $sort : { date : -1 } },
        
    ])
    .then(orders => {res.status(200).json(orders)})
    .catch(error => {console.log(error);res.status(400).json({ error })});
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

        { $match : { idWholesaler: ObjectId(req.params.id)}},

        { $sort : { date : -1} },

        { $limit : 100 }
        
    ])
    .then(orders => {res.status(200).json(orders)})
    .catch(error =>  {console.log(error);res.status(400).json({ error })});
}

exports.getAllByWholesalerNumber =  (req, res, next) => {
    Order.find({idWholesaler: ObjectId(req.params.id)}).count()
    .then(result => {res.status(200).json(result)})
    .catch(error =>  {console.log(error);res.status(400).json({ error })});
}

exports.filter = (req, res, next) => {
    Order.aggregate([

        { "$unwind": "$cart" },
        { "$lookup": {
            "from": "products",
            "localField": "cart.idProduct",
            "foreignField": "_id",
            "as": "cart.product"
        },},
        { "$unwind": "$cart.product" },
        { "$lookup": {
            "from": "wholesalers",
            "localField": "idWholesaler",
            "foreignField": "_id",
            "as": "wholesaler"
        },},
        { "$unwind": "$wholesaler" },
            { $lookup: {
                from: "agencies",
                localField: "wholesaler.idAgency",
                foreignField: "_id",
                as: "wholesaler.agency"
            },},
            { $unwind: "$wholesaler.agency" },
                { $lookup: {
                    from: "cities",
                    localField: "wholesaler.agency.idCity",
                    foreignField: "_id",
                    as: "wholesaler.agency.city"
                },},
                { $unwind: "$wholesaler.agency.city" },

        { "$lookup": {
            "from": "semiwholesalers",
            "localField": "idSemiWholesaler",
            "foreignField": "_id",
            "as": "semiWholesaler"
        },},
        { "$unwind": "$semiWholesaler" },
            { $lookup: {
                from: "cities",
                localField: "semiWholesaler.address.idCity",
                foreignField: "_id",
                as: "semiWholesaler.address.city"
            },},
            { $unwind: "$semiWholesaler.address.city" },

            { $match : { 
                $expr: {
                $and: [
                    {$or : [{ $eq: [req.body.minHour, null] },{  $gte : [  { $dateToString: { format: "%H:%M",date: "$date" }} , req.body.minHour ]}]},
                    {$or : [{ $eq: [req.body.maxHour, null] },{  $lte : [  { $dateToString: { format: "%H:%M",date: "$date" }} , req.body.maxHour ]}]},
                    // {$or : [{ $eq: [req.body.minHour, null] },{  $gte : [ { $substrCP: [  { $dateToString: { date: "$date" },}, 11, 16 ] }, req.body.minHour ]}]},
                    // {$or : [{ $eq: [req.body.maxHour, null] },{  $lte : [ { $substrCP: [  { $dateToString: { date: "$date" },}, 11, 16 ] }, req.body.maxHour ]}]},
                    {$or : [{ $eq: [req.body.minDate, null] },{  $gte : [ { $dateFromString: {
                        dateString: {$dateToString: { format: "%Y-%m-%d",date: "$date" }},
                        format: "%Y-%m-%d"
                   } }, new Date(req.body.minDate)] }]},
                    {$or : [{ $eq: [req.body.maxDate, null] },{  $lte : [ { $dateFromString: {
                        dateString: {$dateToString: { format: "%Y-%m-%d",date: "$date" }},
                        format: "%Y-%m-%d"
                   } }, new Date(req.body.maxDate)] }]}, 
                    {$or : [{ $eq: [req.body.products, []] },{ $in : [ '$cart.idProduct', req.body.products.map(x => ObjectId(x))] }]},
                    {$or : [{ $eq: [req.body.wholesalers, []] },{ $in : [ '$idWholesaler', req.body.wholesalers.map(x => ObjectId(x))] }]},
                    {$or : [{ $eq: [req.body.semiWholesalers, []] },{ $in : [ '$idSemiWholesaler', req.body.semiWholesalers.map(x => ObjectId(x))] }]},
                    {$or : [{ $eq: [req.body.minQty, null] },{$gte : [ '$cart.qty' , req.body.minQty] } ]},
                    {$or : [{ $eq: [req.body.maxQty, null] },{$lte : [ '$cart.qty' , req.body.maxQty ] }]},
                    {$or : [{ $eq: [req.body.minPrice, null] },{$gte : ['$cart.price' , req.body.minPrice] }]},
                    {$or : [{ $eq: [req.body.maxPrice, null] },{$lte : ['$cart.price' , req.body.maxPrice]  }]},
                ]
            }
            }},    
        
    ])
    .then(orders => {res.status(200).json(orders.reverse())})
    .catch(error => {console.log(error);res.status(400).json({ error })});
}

exports.filterGroupBySemiWholesalerAndProduct =  (req, res, next) => {
    Order.aggregate([
        { "$unwind": "$cart" },
        { "$lookup": {
            "from": "products",
            "localField": "cart.idProduct",
            "foreignField": "_id",
            "as": "cart.product"
        },},
        { "$unwind": "$cart.product" },
        { "$lookup": {
            "from": "wholesalers",
            "localField": "idWholesaler",
            "foreignField": "_id",
            "as": "wholesaler"
        },},
        { "$unwind": "$wholesaler" },
            { $lookup: {
                from: "agencies",
                localField: "wholesaler.idAgency",
                foreignField: "_id",
                as: "wholesaler.agency"
            },},
            { $unwind: "$wholesaler.agency" },
                { $lookup: {
                    from: "cities",
                    localField: "wholesaler.agency.idCity",
                    foreignField: "_id",
                    as: "wholesaler.agency.city"
                },},
                { $unwind: "$wholesaler.agency.city" },



        { "$lookup": {
            "from": "semiwholesalers",
            "localField": "idSemiWholesaler",
            "foreignField": "_id",
            "as": "semiWholesaler"
        },},
        { "$unwind": "$semiWholesaler" },
            { $lookup: {
                from: "cities",
                localField: "semiWholesaler.address.idCity",
                foreignField: "_id",
                as: "semiWholesaler.address.city"
            },},
            { $unwind: "$semiWholesaler.address.city" },

        {$group :
            {
                _id :{ 
                    idSemiWholesaler : "$idSemiWholesaler",
                    idProduct : "$cart.idProduct",
                    date : { $dateFromString: {
                        dateString: {$dateToString: { format: "%Y-%m-%d",date: "$date" }},
                        format: "%Y-%m-%d"
                    } } 
                },
                date : { $first: { $dateFromString: {
                    dateString: {$dateToString: { format: "%Y-%m-%d",date: "$date" }},
                    format: "%Y-%m-%d"
                } } } ,
                qty : { $sum: '$cart.qty' },
                price : { $sum: { $multiply : ['$cart.qty','$cart.price']} },
                product : {$first :"$cart.product"},
                wholesaler :{$first : '$wholesaler'},
                semiWholesaler : {$first :'$semiWholesaler'},
            },
        },

        { $match : { 
            $expr: {
            $and: [
                {$or : [{ $eq: [req.body.minDate, null] },{  $gte : [ { $dateFromString: {
                    dateString: {$dateToString: { format: "%Y-%m-%d",date: "$date" }},
                    format: "%Y-%m-%d"
               } }, new Date(req.body.minDate)] }]},
                {$or : [{ $eq: [req.body.maxDate, null] },{  $lte : [ { $dateFromString: {
                    dateString: {$dateToString: { format: "%Y-%m-%d",date: "$date" }},
                    format: "%Y-%m-%d"
               } }, new Date(req.body.maxDate)] }]}, 
                {$or : [{ $eq: [req.body.products, []] },{ $in : [ '$product._id', req.body.products.map(x => ObjectId(x))] }]},
                {$or : [{ $eq: [req.body.wholesalers, []] },{ $in : [ '$Wholesaler._id', req.body.wholesalers.map(x => ObjectId(x))] }]},
                {$or : [{ $eq: [req.body.semiWholesalers, []] },{ $in : [ '$SemiWholesaler._id', req.body.semiWholesalers.map(x => ObjectId(x))] }]},
                {$or : [{ $eq: [req.body.minQty, null] },{$gte : [ '$qty' , req.body.minQty] } ]},
                {$or : [{ $eq: [req.body.maxQty, null] },{$lte : [ '$qty' , req.body.maxQty ] }]},
                {$or : [{ $eq: [req.body.minPrice, null] },{$gte : ['$price' , req.body.minPrice] }]},
                {$or : [{ $eq: [req.body.maxPrice, null] },{$lte : ['$price' , req.body.maxPrice]  }]},
            ]
        }
        }},

        { $sort : { date : -1 } },
        
    ])
    .then(orders => {res.status(200).json(orders)})
    .catch(error => {console.log(error);res.status(400).json({ error })});
}

exports.sortBy = (req, res, next) => {
    Order.aggregate([
        { "$unwind": "$cart" },
        { "$lookup": {
            "from": "products",
            "localField": "cart.idProduct",
            "foreignField": "_id",
            "as": "cart.product"
        },},
        { "$unwind": "$cart.product" },
        { "$lookup": {
            "from": "wholesalers",
            "localField": "idWholesaler",
            "foreignField": "_id",
            "as": "wholesaler"
        },},
        { "$unwind": "$wholesaler" },
            { $lookup: {
                from: "agencies",
                localField: "wholesaler.idAgency",
                foreignField: "_id",
                as: "wholesaler.agency"
            },},
            { $unwind: "$wholesaler.agency" },
                { $lookup: {
                    from: "cities",
                    localField: "wholesaler.agency.idCity",
                    foreignField: "_id",
                    as: "wholesaler.agency.city"
                },},
                { $unwind: "$wholesaler.agency.city" },

        { "$lookup": {
            "from": "semiwholesalers",
            "localField": "idSemiWholesaler",
            "foreignField": "_id",
            "as": "semiWholesaler"
        },},
        { "$unwind": "$semiWholesaler" },
            { $lookup: {
                from: "cities",
                localField: "semiWholesaler.address.idCity",
                foreignField: "_id",
                as: "semiWholesaler.address.city"
            },},
            { $unwind: "$semiWholesaler.address.city" },

            {$addFields: {
                hour : { $dateToString: { format: "%H:%M",date: "$date" }},
                qty : '$cart.qty',
                price : '$cart.price',
                productName : '$cart.productName',
                wholesalerName : '$wholesaler.name',
                semiWholesalerName : '$semiWholesaler.name',
              },
            },

            { $sort : { [req.params.key] : parseInt(req.params.value) } },
            
            // {$project:
            // {
            //     $switch: {
            //        branches: [
            //           { case: { $eq: [ req.params.key, 'date' ] }, then: { $sort : { date : req.params.value } } },
            //           { case: { $eq: [ req.params.key, 'hour' ] }, then: { $sort : { $date : req.params.value } } },
            //           { case: { $eq: [ req.params.key, 'wholesaler' ] }, then: { $sort : { wholesaler : req.params.value } } },
            //           { case: { $eq: [ req.params.key, 'semiWholesaler' ] }, then: { $sort : { semiWholesaler : req.params.value } } },
            //           { case: { $eq: [ req.params.key, 'productName' ] }, then: { $sort : { "cart.productName" : req.params.value } } },
            //           { case: { $eq: [ req.params.key, 'qty' ] }, then: { $sort : { 'cart.qty' : req.params.value } } },
            //           { case: { $eq: [ req.params.key, 'price' ] }, then: { $sort : { '$cart.price' : req.params.value } } },
            //        ],default: "No scores found."
            //     }
            //  } }   
        
    ])
    .then(orders => {res.status(200).json(orders)})
    .catch(error => {console.log(error);res.status(400).json({ error })});
}
