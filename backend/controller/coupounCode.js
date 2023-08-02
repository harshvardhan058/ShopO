const express = require("express");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/ErrorHandler");
const { isSeller } = require("../middleware/auth");
const CoupounCode = require("../model/coupounCode");
const router = express.Router();

// create coupoun code
router.post(
  "/create-coupon-code",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      // coupon code is already registered
      const isCoupounCodeExists = await CoupounCode.find({
        name: req.body.name,
      });

      // if it does then show error
      if (isCoupounCodeExists.length !== 0) {
        return next(new ErrorHandler("Coupoun code already exists!", 400));
      }

      // if it does not registered save it
      const coupounCode = await CoupounCode.create(req.body);

      // send response
      res.status(201).json({
        success: true,
        coupounCode,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// get all coupons of a shop here id is seller id
router.get(
  "/get-coupon/:id",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      // get the all coupons from the seller id
      const couponCodes = await CoupounCode.find({ shopId: req.seller.id });

      //  send the response with the all couponcodes
      res.status(201).json({
        success: true,
        couponCodes,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// delete coupoun code of a shop here is is coupon id
router.delete(
  "/delete-coupon/:id",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      // find the coupon with id
      const couponCode = await CoupounCode.findByIdAndDelete(req.params.id);

      // if the coupon is not exist then show error
      if (!couponCode) {
        return next(new ErrorHandler("Coupon code dosen't exists!", 400));
      }

      // if it does then send the response
      res.status(201).json({
        success: true,
        message: "Coupon code deleted successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// get coupon code value by its name
//  it is for the checkout page at the time of checkout when user enter the name of coupoun the value of coupon apply
// name is couopn name
router.get(
  "/get-coupon-value/:name",
  catchAsyncErrors(async (req, res, next) => {
    try {
      // find the coupon code by name that entered by user
      const couponCode = await CoupounCode.findOne({ name: req.params.name });

      // if it does send the response of coupon to the user
      res.status(200).json({
        success: true,
        couponCode,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

module.exports = router;

// just to check about the branch concept
