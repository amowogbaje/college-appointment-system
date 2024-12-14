const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.use(express.json());

if (process.env.NODE_ENV !== 'test') {
    mongoose.connect('mongodb://localhost:27017/appointment_system', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
}
else {
    mongoose.connect('mongodb://localhost:27017/appointment_system_test', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
}


const userRoutes = require('./routes/userRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');

app.get('/', (req, res) => {
    return res.json({
      "message": "Welcome to the Account Feature API",
      "status": res.statusCode,
    });
  });

  app.get('/health', (req, res) => {
    return res.json({
      "message": "This api gateway is up and running",
      "status": res.statusCode,
    });
  });
app.use('/api/users', userRoutes);
app.use('/api/appointments', appointmentRoutes);

module.exports = app;

if (process.env.NODE_ENV !== 'test') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}