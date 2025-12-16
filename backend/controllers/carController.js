const Car = require('../models/Car');

exports.addCar = async (req,res) => {
  const owner = req.user?.id || req.body.owner;
  const { make, model, regNo, fuelType, year, vin, color } = req.body;
  
  const imageUrl = req.file ? `uploads/${req.file.filename}` : undefined;

  try {
    const car = new Car({ owner, make, model, regNo, fuelType, year, vin, color, imageUrl });
    await car.save();
    res.status(201).json(car);
  } catch (error) {
    if (error.code === 11000) { // Duplicate key error
      return res.status(400).json({ message: `A car with this ${Object.keys(error.keyValue)[0]} already exists.` });
    }
    res.status(500).json({ message: 'Error adding car.', error });
  }
};

exports.listCarsByOwner = async (req,res) => {
  try {
    const cars = await Car.find({ owner: req.user.id });
    res.json(cars);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cars.', error });
  }
};

exports.deleteCar = async (req, res) => {
  try {
    const car = await Car.findOne({ _id: req.params.id, owner: req.user.id });
    if (!car) {
      return res.status(404).json({ message: 'Car not found or you do not have permission to delete it.' });
    }
    await car.remove();
    res.json({ message: 'Car deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting car.', error });
  }
};

exports.updateCar = async (req, res) => {
  try {
    const { make, model, year, regNo, vin, color, fuelType } = req.body;
    let imageUrl;

    if (req.file) {
      imageUrl = `uploads/${req.file.filename}`;
    }

    const car = await Car.findOne({ _id: req.params.id, owner: req.user.id });

    if (!car) {
      return res.status(404).json({ message: 'Car not found or permission denied.' });
    }

    car.make = make || car.make;
    car.model = model || car.model;
    car.year = year || car.year;
    car.regNo = regNo || car.regNo;
    car.vin = vin || car.vin;
    car.color = color || car.color;
    car.fuelType = fuelType || car.fuelType;
    if (imageUrl) {
      car.imageUrl = imageUrl;
    }

    const updatedCar = await car.save();
    res.json(updatedCar);
  } catch (error) {
    res.status(500).json({ message: 'Error updating car.', error });
  }
};

exports.getCarById = async (req, res) => {
  try {
    const car = await Car.findOne({ _id: req.params.id, owner: req.user.id });
    if (!car) {
      return res.status(404).json({ message: 'Car not found.' });
    }
    res.json(car);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching car details.', error });
  }
};

