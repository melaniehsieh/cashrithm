const ThrowError = require("../utils/ThrowError");
const wrapAsync = require("../utils/wrapAsync");
const Entities = require("../model/entitiesModel");


exports.getAllUserEntities = wrapAsync(async(req,  res, next) => {
  const entities = await Entities.find();
  
  res.status(200).json({
    status: "success",
    length: entities.length,
    data: {
      entities
    }
  });
});

exports.getUserEntities = wrapAsync(async(req,  res, next) => {
  const id = req.params.id;
  
  const entities = await Entities.findById(id);
  
  if(!entities) {
    return next(new ThrowError(404, "No user entities found with that id"));
  }
  
  res.status(200).json({
    status: "success",
    data: {
      entities
    }
  });
});

exports.getLoggedInUserEntities = wrapAsync(async(req,  res, next) => {
  const id = req.user._id;
  
  const entities = await Entities.findOne({user:id});
  
  if(!entities) {
    return next(new ThrowError(404, "No user entities found with that id"));
  }
  
  res.status(200).json({
    status: "success",
    entities
  });
});

exports.getUserRecord = wrapAsync(async (req, res, next) => {
  const {id} = req.params;
  console.log(req.user);
  
  const data = await Entities.findOne({user: req.user._id});
  const record = data.transaction.id(id);
  
  res.status(200).json({
    status: "success",
    record
  });
});

exports.deleteUserEntities = wrapAsync(async(req,  res, next) => {
  const {id} = req.params;
  
  const entities = await Entities.findByIdAndDelete(id);
  
  if(!entities) {
    return next(new ThrowError(404, "No user entities found with that id"));
  }
  
  res.status(204).json({
    status: "success"
  });
});


exports.deleteAllUserEntities = wrapAsync(async(req,  res, next) => {
  //const user = await Entities.deleteMany();
  
  res.status(204).json({
    status: "success"
  });
});