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
const {checkGreaterThan} = require("../utils/helper");


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
  } else if (file.mimetype.startsWith('text/comma-separated-values')) {
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

// Transform transaction file
const transformedData = (data, type) => {
  return data.map((el) => {
    return Object.fromEntries(
      Object.entries(el).map(([key, value]) => {
        //key = "type";
        if(key === "_id") {
          key = `${type}_vendor`;
        }
        return [key, value];
      })
    );
  });
};


// Calculate total expense 
const calcTotalExpense = async (userId, csvId) => {
  const data = await CSV.aggregate([
    { $match: { select: "expense", user: userId, csvId } },
    { $group: {
      //_id: "$Select",
      _id: "$vendor",
      total_expense: {$sum: "$amount"}
      //numberDoc: {$sum: 1}
    } }
  ]);
  
  // Transform the calculated data
  return transformedData(data, "expense");
};

// calculate total revenue
const calcTotalRevenue = async (userId, csvId) => {
  const data =  await CSV.aggregate([
    { $match: { select: "revenue", user: userId, csvId } },
    { $group: {
      //_id: "$Select",
      _id: "$vendor",
      total_revenue: {$sum: "$amount"}
      //numberDoc: {$sum: 1}
    } }
  ]);
  
  // Transform the calculated data
  return transformedData(data, "revenue");
};

const retrieveUserCategoryAndGroup = async (userId, totalDifference) => {
  const data = await Entities.findOne({user: userId});
  
  const newData = data.category.map(parentEl => {
    const newObj = [];
    let total = 0;
    totalDifference.map(el => {
      if(parentEl.vendors.length > 1) {
        parentEl.vendors.map(vendor => {
          if(vendor.trim() === el.vendor.trim()) {
            total += el.revenue_expense_difference;
            newObj.push({vendor, value: el.revenue_expense_difference});
          };
        });
      }
      
      if(parentEl.vendors.includes(el.vendor)) {
        newObj.push({vendor: parentEl[0], value: el.revenue_expense_difference});
      }
    });
    return { category: parentEl.type, total, vendor_details: newObj};
  });
  
  /*console.log(data.category);
  console.log(totalDifference);
  console.log(JSON.stringify(newData));*/
  return newData;
};

const differenceTotalRevenueExpenseByVendor = async (userId, csvId) => {
  
  const totalRevenueByVendor = await calcTotalRevenue(userId, csvId);
  const totalExpenseByVendor = await calcTotalExpense(userId, csvId);
  
  // Lets just assumed both the total revenue and expense will be of the same length
  const totalDifference = totalRevenueByVendor.map((revenueEl, i) => {
    const newObj = {};
    
    totalExpenseByVendor.map((expenseEl, i) => {
      if(revenueEl.revenue_vendor === expenseEl.expense_vendor){
        newObj["vendor"] = revenueEl.revenue_vendor;
        newObj["revenue_expense_difference"] = revenueEl.total_revenue - expenseEl.total_expense;
        //return newObj;
      }
      return;
    });
    return newObj;
  });
  
  //console.log(totalExpenseByVendor);
  //console.log(totalRevenueByVendor);
  //console.log(totalDifference);
  return retrieveUserCategoryAndGroup(userId, totalDifference);
};


// Transform transaction file of options
const transformedGroupedOptionData = (data) => {
  return data.map((el) => {
    return Object.fromEntries(
      Object.entries(el).map(([key, value]) => {
        //key = "type";
        if(key === "_id") {
          key = `option`;
        }
        if(value === "") {
          value = "no option"
        };
        return [key, value];
      })
    );
  });
};

// calculate total grouped by option
const groupByOptionAndCalculateTotal = async (userId, csvId) => {
  const  data = await CSV.aggregate([
    { $match: { user: userId, csvId }},
    { $group: {
      _id: "$option",
      total_by_option: {$sum: "$amount"}
    } }
  ]);
  
  return transformedGroupedOptionData(data);
};

// Updating the current logged in user Entities transaction
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

// Calculating and updating current logged in user category
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

// Used to transform all total revenue and expense without grouping
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


// Calculate all total revenue and expense without grouping
const calculateAllTotalRevenueExpense = async (req, csvId) => {
  const totalRevenue = await CSV.aggregate([
    { $match: { select: "revenue", user: req.user._id, csvId } },
    { $group: {
      _id: "$select",
      //_id: "$vendor",
      all_total_revenue: {$sum: "$amount"}
      //numberDoc: {$sum: 1}
    } }
  ]);
  
  const totalExpense = await CSV.aggregate([
    { $match: { select: "expense", user: req.user._id, csvId } },
    { $group: {
      _id: "$select",
      //_id: "$vendor",
      all_total_expense: {$sum: "$amount"}
      //numberDoc: {$sum: 1}
    } }
  ]);
  
  // Transform total Revenue
  const dt1 = transformDataFunc(totalRevenue);
  
  // Transform total Expense
  const dt2 = transformDataFunc(totalExpense);
    
  const combinedData = {...dt1[0], ...dt2[0]}
  return combinedData;
};

// Transform transaction document
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

// Beginning of uploading transaction file
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
    const allTotalRevenueExpense = await calculateAllTotalRevenueExpense(req, newParsedData[newParsedData.length - 1].csvId);
    
    // User category group by vendors
    const total = await differenceTotalRevenueExpenseByVendor(req.user._id, newParsedData[newParsedData.length - 1].csvId);
    
    // Calculate and group by option
    const optionData = await groupByOptionAndCalculateTotal(req.user._id, newParsedData[newParsedData.length - 1].csvId);
    
    /*console.log(allTotalRevenueExpense);
    console.log(total);
    console.log(optionData);*/
    
    // Creating the overall document
    let document = {
      title: req.body.title,
      ...allTotalRevenueExpense,
      total_doc_by_option: optionData,
      category_by_vendor: total
    };
    
    
    // NOTE NOT YET FINALIZED
    /*let val;
    if(dat.length >= dat2.length) {
      const doc = dat.map((el, i) => {
        const s = {...el, ...dat2[i]};
        return s;
      });
      val = {doc, total_doc_by_option: optionData, ...newDat, title: req.body.title };
      //console.log(`${dat.length} is bigger than ${dat2.length}`);
    } else if (dat2.length >= dat.length) {
      const doc = dat2.map((el, i) => {
        const s = {...el, ...dat[i]};
        return s;
      });
      val = {doc, total_doc_by_option: optionData, ...newDat, title: req.body.title };
      //console.log(`${dat.length} is bigger than ${dat2.length}`);
    }*/
    
    // Update user transaction
    const trasac = await updateUserTransaction(document, req, next)
    
    res.status(200).json({
      status: "success",
      processedDoc: trasac,
      result: doc.length,
      data: doc
    });
});

// beginning of uploading Category csv
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


// Remaining RESTFUL API endpoint

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