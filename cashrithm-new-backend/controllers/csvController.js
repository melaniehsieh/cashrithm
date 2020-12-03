const multer = require("multer");
//const fs = require('fs');
const { promises: fs } = require("fs");
const path = require('path');
const neatCsv = require('neat-csv');
const { promisify } = require("util");
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CSV = require("../model/csvModel");
const Entities = require("../model/entitiesModel");
const CategoryCSV = require("../model/categoryModel");
const ThrowError = require("../utils/ThrowError");
const wrapAsync = require("../utils/wrapAsync");


// Multer Configuration
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `public/image`);
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, `user-${Date.now()}.${ext}`);
  }
});


const multerFilter = (req, file, cb) => {
  if(file.mimetype.startsWith('text/csv')) {
    cb(null, true);
  } else {
    cb(new ThrowError(400, 'Invalid file type please upload only a CSV file'), false);
  }
};


const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

exports.uploadCSV = upload.single('csv');

const transformedData = (data) => {
  return data.map((el) => {
    return Object.fromEntries(
      Object.entries(el).map(([key, value]) => {
        //key = "type";
        if(key === "_id") {
          key = "vendor";
        }
        return [key, value];
      })
    );
  });
}

const calcTotalExpense = async (userId, csvId) => {
  const data = await CSV.aggregate([
    { $match: { select: "expense", user: userId, csvId } },
    { $group: {
      //_id: "$Select",
      _id: "$vendor",
      totalExpense: {$sum: "$amount"}
      //numberDoc: {$sum: 1}
    } }
  ]);
  
  return transformedData(data);
};

const calcTotalRevenue = async (userId, csvId) => {
  const data =  await CSV.aggregate([
    { $match: { select: "revenue", user: userId, csvId } },
    { $group: {
      //_id: "$Select",
      _id: "$vendor",
      totalRevenue: {$sum: "$amount"}
      //numberDoc: {$sum: 1}
    } }
  ]);
  
  return transformedData(data);
};

const transformTransactionDoc = (el, req, num) => {
  const transformedData = Object.fromEntries(
    Object.entries(el).map(([key, value]) => {
      return [key.toLowerCase(), value];
    })
  );
      
  // Converting to number
  transformedData.amount = parseInt(transformedData.amount, 10);
  
  // Transforming to toLowerCase
  transformedData.select = transformedData.select.toLowerCase();
  transformedData.option = transformedData.option.toLowerCase();
  transformedData.vendor = transformedData.vendor.toLowerCase();
  
  // Getting logged in user from req object
  transformedData.user = req.user._id;
  transformedData.csvId = num;
  //console.log(transformedData);
    
  return transformedData;
};

const updateCurrentUserRevenue = wrapAsync(async (datRevenue, req, next) => {
  const userEntities = await Entities.findOne({user:req.user._id});
  
  const y = await Entities.findByIdAndUpdate(userEntities._id, {
    $push: {transactionRevenue: datRevenue}
 }, {
    new: true,
    runValidators: true
  });
});

const updateCurrentUserExpense = wrapAsync(async (datExpense, req, next) => {
  const userEntities = await Entities.findOne({user:req.user._id});
      
  const y = await Entities.findByIdAndUpdate(userEntities._id, {
    $push: {transactionExpense: datExpense}
 }, {
    new: true,
    runValidators: true
  });
});

const calcAndUpdateCurrentCategory = wrapAsync(async (req) => {
   const data = await CategoryCSV.aggregate([
      { $match: { user: req.user._id } },
      { $group: {
        _id: "$type",
        //numberDoc: {$sum: 1},
        vendors: { $addToSet: "$vendor" }
      } }
    ]);
     
     // Transformed the data by setting the "_id" property to "type"
    const transformedData = data.map((el) => {
      return Object.fromEntries(
        Object.entries(el).map(([key, value]) => {
          //key = "type";
          if(key === "_id") {
            key = "type";
          }
          return [key, value];
        })
      );
    });
   
   // Retrieve the current user Entities from the currently logged in user
    const userEntities = await Entities.findOne({user:req.user._id});
   
   // Update the current user entities object with the transformed category data
    const updatedEntities = await Entities.findByIdAndUpdate(userEntities._id, {
     category: transformedData
   }, {
     new: true,
     runValidators: true
   });
});

exports.uploadTransactionCsv = wrapAsync(async (req, res, next) => {
    if(!req.file) {
      return next(new ThrowError(400, "Please upload a transaction csv"));
    }
    
    // ***variable
    let num = 1;
   
   // Checking if user has already upload a transaction csv file if not we set the csvId to 1 and else we increment it
    const t = await CSV.find({user:req.user._id});
    
    if(t.length > 1) {
      const f = await CSV.find({user:req.user._id});
      num = f[f.length - 1].csvId + 1;
    }
   
    // Parsing and Processing the csv file
    let data = await fs.readFile(path.join(req.file.path));
    let parsedData = await neatCsv(data);
    
    // Looping through the passed array and processing
    const newParsedData = parsedData.map((el) => {
      // Transform the uploaded data
      const transformedData = transformTransactionDoc(el, req, num);
      
      return transformedData;
    });
    
    // Insert all the csv file parsed
    const doc = await CSV.insertMany(newParsedData);
    
    // Calculate total expense
    const dat = await calcTotalExpense(req.user._id, newParsedData[newParsedData.length - 1].csvId);
    const datExpense = {expense: dat};
    
    // calculate total revenue
    const dat2 = await calcTotalRevenue(req.user._id, newParsedData[newParsedData.length - 1].csvId);
    const datRevenue = {revenue: dat2};
    
    // Update the current user Entities revenue
    if(dat2[0].totalRevenue) {
      updateCurrentUserRevenue(datRevenue, req, next);
    }
  
    // Update the current user Entities expense
    if(dat[0].totalExpense) {
      updateCurrentUserExpense(datExpense, req, next);
    }
    
    res.status(200).json({
      status: "success",
      length: doc.length,
      data: doc
    });
});

// Category csv
exports.uploadCategoryCsv = wrapAsync(async (req, res, next) => {
    if(!req.file) {
      return next(new ThrowError(400, "Please upload a category csv"));
    }
    
    // Parsing and Processing the csv file
    let data = await fs.readFile(path.join(req.file.path));
    let parsedData = await neatCsv(data);
    
    //  Convert the Amount value to number
    const newParsedData = parsedData.map((el) => {
      // Transform the uploaded data
      const transformedData = Object.fromEntries(
        Object.entries(el).map(([key, value]) => {
          
          return [key.toLowerCase(), value];
        })
      );
      
      
      // Transforming to toLowerCase
      transformedData.type = transformedData.type.toLowerCase();
      transformedData.vendor = transformedData.vendor.toLowerCase();
      
      // Getting logged in user from req object
      transformedData.user = req.user._id;
      //console.log(transformedData);
      
      return transformedData;
    });
    //console.log(newParsedData);
    
    const oldData = await CategoryCSV.find({ user: req.user._id })
    
    if(oldData.length > 1) {
      oldData.map(async(el) => {
        await CategoryCSV.findByIdAndDelete(el._id);
      });
    }
    
    // Calculate and update current user entities
    await calcAndUpdateCurrentCategory(req);
    
    console.log(oldData);
    
    // Insert all the csv file parsed
    const doc = await CategoryCSV.insertMany(newParsedData);
    
    res.status(200).json({
      status: "success",
      length: doc.length,
      data: doc
    });
});


// Get all csv documents
exports.getAllTransactionCSVDoc = wrapAsync(async (req, res, next) => {
  const data = await CSV.find({});
  
  res.status(200).json({
    status: "success",
    length: data.length,
    data
  });
});

exports.deleteAllTransactionCSVDoc = wrapAsync(async (req, res, next) => {
  const data = await CSV.deleteMany();
  
  res.status(204).json({
    status: "success"
  });
});


// Get all csv documents
exports.getAllCategoryCSVDoc = wrapAsync(async (req, res, next) => {
  const data = await CategoryCSV.find({});
  
  res.status(200).json({
    status: "success",
    length: data.length,
    data
  });
});

exports.deleteAllCategoryCSVDoc = wrapAsync(async (req, res, next) => {
  const data = await CategoryCSV.deleteMany();
  
  res.status(204).json({
    status: "success"
  });
});

exports.calcBasedOnSelectRevenue = wrapAsync(async (req, res, next) => {
  const data = await CSV.aggregate([
    { $match: { select: "revenue", user: req.user._id } },
    { $group: {
      //_id: "$Select",
      _id: "$vendor",
      totalRevenue: {$sum: "$amount"},
      numberDoc: {$sum: 1}
    } }
    ]);
    //console.log(data);
    res.status(200).json({
      status: "success",
      length: data.length,
      data
    })
  });
  
  exports.calcBasedOnSelectExpense = wrapAsync(async (req, res, next) => {
  const data = await CSV.aggregate([
    { $match: { select: "expense", user: req.user._id } },
    { $group: {
      //_id: "$Select",
      _id: "$vendor",
      totalExpense: {$sum: "$amount"},
      numberDoc: {$sum: 1}
    } }
    /*{ $project: {
      _id: 0,
      totalExpense: { $sum: "$Amount"}
    } }*/
   ]);
   //console.log(data);
   res.status(200).json({
      status: "success",
      length: data.length,
      data
   });
});
  
  exports.categorizeByVendor = wrapAsync(async (req, res, next) => {
    // Group the category by the vendor
    const data = await CategoryCSV.aggregate([
      { $match: { user: req.user._id } },
      { $group: {
        _id: "$type",
        //numberDoc: {$sum: 1},
        vendors: { $addToSet: "$vendor" }
      } }
    ]);
     
     // Transformed the data by setting the "_id" property to "type"
    const transformedData = data.map((el) => {
      return Object.fromEntries(
        Object.entries(el).map(([key, value]) => {
          //key = "type";
          if(key === "_id") {
            key = "type";
          }
          return [key, value];
        })
      );
    });
   
   // Retrieve the current user Entities from the currently logged in user
    const userEntities = await Entities.findOne({user:req.user._id});
   
   // Update the current user entities object with the transformed category data
    const updatedEntities = await Entities.findByIdAndUpdate(userEntities._id, {
     category: transformedData
   }, {
     new: true,
     runValidators: true
   });
   //console.log(updatedEntities);
   
   // Sending the response
    res.status(200).json({
      status: "success",
      length: data.length,
      data: {
        data,
        updatedEntities
      }
   });
});