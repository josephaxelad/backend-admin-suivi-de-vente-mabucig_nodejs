//Créé application express

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');

// Importer les routes
const adminRoutes = require('./routes/admin')
const agencyRoutes = require('./routes/agency')
const cityRoutes = require('./routes/city')
const groupRoutes = require('./routes/group')
const markRoutes = require('./routes/mark')
const orderRoutes = require('./routes/order')
const productRoutes = require('./routes/product')
const semiWholesalerRoutes = require('./routes/semiWholesaler')
const wholesalerRoutes = require('./routes/wholesaler')


  mongoose.connect('mongodb://127.0.0.1:27017/suivi-de-ventes-mabucig?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: true
   })
  .then(() => console.log('Connexion à MongoDB réussie (local) !'))
  .catch((error) => console.log(error,'Connexion à MongoDB échouée (local) !'));

  // mongoose.connect('mongodb+srv://josephaxelad:n4141O154@cluster0.im1bb.mongodb.net/mabucig?retryWrites=true&w=majority',
  // { useNewUrlParser: true,
  //   useUnifiedTopology: true,
  //   autoIndex: true
  //  })
  // .then(() => console.log('Connexion à MongoDB réussie (en ligne) !'))
  // .catch((error) => console.log(error,'Connexion à MongoDB échouée (en ligne) !'));

 

  
// Eviter les erreurs de CORS signifie « Cross Origin Resource Sharing »
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

app.use(express.json());

// Routes
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/admin', adminRoutes);
app.use('/api/agency', agencyRoutes);
app.use('/api/city', cityRoutes);
app.use('/api/group', groupRoutes);
app.use('/api/mark', markRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/product', productRoutes);
app.use('/api/semi-wholesaler', semiWholesalerRoutes);
app.use('/api/wholesaler', wholesalerRoutes);



// Expoter l'app pour pouvoir l'utiliser dans les autres fichiers
module.exports = app;