const path = require('path');
require('dotenv').config({ path: path.join( '../.env') });

const app = require('./app'); 

const PORT = process.env.PORT || 3000;


const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
})
  .then(() => {
    console.log('Connected to MongoDB');


    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
  });

  