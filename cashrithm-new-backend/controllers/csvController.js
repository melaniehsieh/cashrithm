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

const transformedData = (data, type) => {
  return data.map((el) => {
    return Object.fromEntries(
      Object.entries(el).map(([key, value]) => {
        //key = "type";
        if(key === "_id") {
          key = `${type}Vendor`;
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
  
  return transformedData(data, "expense");
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
  
  return transformedData(data, "revenue");
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

const updateUserTransaction = wrapAsync(async (data, req, next) => {
  const userEntities = await Entities.findOne({user:req.user._id});
  
  const y = await Entities.findByIdAndUpdate(userEntities._id, {
    $push: {transaction: data}
 }, {
    new: true,
    runValidators: true
  });
  
  return y;
});
/*
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
*/
const calcAndUpdateCurrentCategory = wrapAsync(async (req) => {
   const data = await CategoryCSV.aggregate([
      { $match: { user: req.user._id } },
      { $group: {
        _id: "$type",
        //numberDoc: {$sum: 1},
        vendors: { $addToSet: "$vendor" }
      } }
    ]);
     console.log(data);
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
   //console.log(transformedData);
   // Retrieve the current user Entities from the currently logged in user
    const userEntities = await Entities.findOne({user:req.user._id});
   
   // Update the current user entities object with the transformed category data
    const updatedEntities = await Entities.findByIdAndUpdate(userEntities._id, {
      category: transformedData
      //$push: {category: transformedData}
   }, {
     new: true,
     runValidators: true
   });
});

const transformDataFunc = (data) => {
  return data.map((el) => {
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
};


const calculateAndUpdateTotalRevenueExpense = async (req, csvId) => {
  const totalRevenue = await CSV.aggregate([
    { $match: { select: "revenue", user: req.user._id, csvId } },
    { $group: {
      _id: "$select",
      //_id: "$vendor",
      allTotalRevenue: {$sum: "$amount"}
      //numberDoc: {$sum: 1}
    } }
  ]);
  
  const totalExpense = await CSV.aggregate([
    { $match: { select: "expense", user: req.user._id, csvId } },
    { $group: {
      _id: "$select",
      //_id: "$vendor",
      allTotalExpense: {$sum: "$amount"}
      //numberDoc: {$sum: 1}
    } }
  ]);
  
  // Transform total Revenue
  const dt1 = transformDataFunc(totalRevenue);
  
  // Transform total Expense
  const dt2 = transformDataFunc(totalExpense);
    
  const combinedData = {...dt1[0], ...dt2[0]}
  return combinedData;
  //console.log(combinedData);
  /*
   // Retrieve the current user Entities from the currently logged in user
    const userEntities = await Entities.findOne({user:req.user._id});
   
   // Update the current user entities object with the transformed category data
    const updatedEntities = await Entities.findByIdAndUpdate(userEntities._id, {
      $push: {totalRevenueExpense: combinedData}
   }, {
     new: true,
     runValidators: true
   });*/
};

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
    // Calculate and update total revenue and expense
    const newDat = await calculateAndUpdateTotalRevenueExpense(req, newParsedData[newParsedData.length - 1].csvId);
    console.log(newDat);
    
    // Calculate total expense
    const dat = await calcTotalExpense(req.user._id, newParsedData[newParsedData.length - 1].csvId);
    //const datExpense = {expense: dat};
    
    // calculate total revenue
    const dat2 = await calcTotalRevenue(req.user._id, newParsedData[newParsedData.length - 1].csvId);
    //const datRevenue = {revenue: dat2};

    
    // NOTE NOT YET FINALIZED
    let val;
    if(dat.length >= dat2.length) {
      const doc = dat.map((el, i) => {
        const s = {...el, ...dat2[i]};
        return s;
      });
      val = {doc, ...newDat};
      //console.log(`${dat.length} is bigger than ${dat2.length}`);
    } else if (dat2.length >= dat.length) {
      const doc = dat2.map((el, i) => {
        const s = {...el, ...dat[i]};
        return s;
      });
      val = {doc, ...newDat};
      //console.log(`${dat.length} is bigger than ${dat2.length}`);
    }
    
    console.log(val);
    
    // Update user transaction
    const trasac = await updateUserTransaction(val, req, next)
    
    res.status(200).json({
      status: "success",
      processedDoc: trasac,
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
      _id: "$select",
      //_id: "$vendor",
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
  
  // Calculate total revenue and expense
  exports.calcBasedOnSelect = wrapAsync(async (req, res, next) => {
  const data = await CSV.aggregate([
    { $match: { user: req.user._id, csvId: 1 } },
    { $group: {
      _id: "$select",
      //_id: "$vendor",
      total: {$sum: "$amount"},
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