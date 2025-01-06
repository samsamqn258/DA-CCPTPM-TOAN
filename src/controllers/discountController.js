const discountService = require("../services/discountService");
const { SuccessResponse } = require("../core/successResponse");

class DiscountController {

    // ở đây
    getValidDiscounts = async (req, res, next) => {
        new SuccessResponse({
            message: 'get discount active success',
            metaData: await discountService.getValidDiscounts(req.user)
        }).send(res)
    }
    getDiscountByIdForUser = async (req, res, next) => {
        new SuccessResponse({
            message: 'get discount active success',
            metaData: await discountService.getDiscountByIdForUser({discount_id: req.params.discount_id, user: req.user})
        }).send(res)
    }
    createDiscount = async (req, res, next) => {
        const {file} = req
        if(!file){
            throw new Error('file missing')
        }
        new SuccessResponse({
            message: 'create discount success',
            metaData: await discountService.createDiscount(req.body, file)
        }).send(res)

    }
    // ở đây
    getDiscountById = async (req, res, next) => {
        const discount_id = req.params.discount_id
        new SuccessResponse({
            message: 'get discount by id success',
            metaData: await discountService.getDiscountById(discount_id)
        }).send(res)
    }


  createDiscount = async (req, res, next) => {
    const { file } = req;
    if (!file) {
      throw new Error("file missing");

    }
    new SuccessResponse({
      message: "create discount success",
      metaData: await discountService.createDiscount(req.body, file),
    }).send(res);
  };

  getDiscountById = async (req, res, next) => {
    const discount_id = req.params.discount_id;
    new SuccessResponse({
      message: "get discount by id success",
      metaData: await discountService.getDiscountById(discount_id),
    }).send(res);
  };

  getDiscountByCode = async (req, res, next) => {
    new SuccessResponse({
      message: "get discount by code success",
      metaData: await discountService.getDiscountByCode(
        req.params.discountCode
      ),
    }).send(res);
  };

  getActiveDiscounts = async (req, res, next) => {
    const { limit, page } = req.query;
    new SuccessResponse({
      message: "get active discounts success",
      metaData: await discountService.getActiveDiscounts({ limit, page }),
    }).send(res);
  };

  updateDiscountById = async (req, res, next) => {
    new SuccessResponse({
      message: "update discount success",
      metaData: await discountService.updateDiscountById({
        discount_id: req.params.discount_id,
        dataUpdate: req.body,
      }),
    }).send(res);
  };

  softDeleteDiscount = async (req, res, next) => {
    const discount_id = req.params.discount_id;
    new SuccessResponse({
      message: "soft delete discount success",
      metaData: await discountService.softDeleteDiscount(discount_id),
    }).send(res);
  };

  isDiscountExpired = async (req, res, next) => {
    new SuccessResponse({
      message: "check discount expiration success",
      metaData: await discountService.isDiscountExpired(
        req.params.discountCode
      ),
    }).send(res);
  };

  getPublicDiscounts = async (req, res, next) => {
    const { limit, page } = req.query;
    new SuccessResponse({
      message: "get public discounts success",
      metaData: await discountService.getPublicDiscounts({ limit, page }),
    }).send(res);
  };
}

module.exports = new DiscountController();

