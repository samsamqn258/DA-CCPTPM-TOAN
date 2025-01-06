const userModel = require("../models/userModel");
const dotenv = require("dotenv");
dotenv.config();
const keyTokenService = require("../services/keyTokenService");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const JWT = require("jsonwebtoken");
const {
  findByEmail,
  findById,
  updateUser,
} = require("../repositories/userRepository");
const {
  BadRequestError,
  NotFoundError,
  Unauthorized,
} = require("../core/errorResponse");
const { createTokenPair } = require("../auth/authUtils");
const { getInfoData, removeUndefinedObject } = require("../utils/index");
const {
  listEmployeesOfShop,
  listEmployees,
  listManageOfShop,
  listManage,
  updateStatus,
} = require("../repositories/userRepository");
const sendEmail = require("../utils/email");
const shopModel = require("../models/shopModel");
const { default: mongoose } = require("mongoose");
const roles = {
  ADMIN: "101",
  USER: "102",
  EMPLOYEE: "103",
  BRANCH_MANAGER: "104",
};
class UserService {
  static updateStatus = async (user_id) => {
    return await updateStatus(user_id);
  };
  static listEmployeesOfShop = async (shop_id) => {
    return await listEmployeesOfShop(shop_id);
  };
  static listEmployees = async () => {
    return await listEmployees();
  };
  static listManageOfShop = async (shop_id) => {
    return await listManageOfShop(shop_id);
  };
  static listManage = async () => {
    return await listManage();
  };
  //   static login = async ({ email, password, refreshToken = null }) => {
  //     const checkUser = await findByEmail(email);
  //     if (!checkUser) {
  //       throw new NotFoundError("user not found");
  //     }

  //     const matchPassword = await bcrypt.compare(password, checkUser.password);
  //     if (!matchPassword) {
  //       throw new NotFoundError("user not found");
  //     }
  //     const publicKey = process.env.PUBLIC_KEY;
  //     const privateKey = process.env.PRIVATE_KEY;
  //     console.log(`private::: ${privateKey}, puplickey:::${publicKey}`);
  //     const token = await createTokenPair(
  //       { userId: checkUser._id, roles: checkUser.roles },
  //       publicKey,
  //       privateKey
  //     );
  //     if (!token) {
  //       throw new BadRequestError("create token fail");
  //     }
  //     const keyToken = await keyTokenService.createKeyToken({
  //       userId: checkUser._id,
  //       publicKey,
  //       privateKey,
  //       refreshToken: token.refreshToken,
  //     });
  //     if (!keyToken) throw new BadRequestError("create key token error");
  //     return {
  //       user: getInfoData({
  //         fileds: ["_id", "email", "name", "avatar"],
  //         object: checkUser,
  //       }),
  //       token: token,
  //     };
  //   };
  static loginUser = async ({ email, password, shop_id, deviceToken }) => {
    const checkUser = await findByEmail(email);
    if (!checkUser || checkUser.roles !== roles.USER) {
      throw new NotFoundError("user not found");
    }

    const matchPassword = await bcrypt.compare(password, checkUser.password);
    if (!matchPassword) {
      throw new NotFoundError("user not found");
    }

    const publicKey = process.env.PUBLIC_KEY;
    const privateKey = process.env.PRIVATE_KEY;

    // **Lưu deviceToken vào user**
    checkUser.deviceToken = deviceToken; // Cập nhật token mới
    console.log(checkUser.deviceToken);
    await checkUser.save(); // Lưu thay đổi vào cơ sở dữ liệu

    const token = await createTokenPair(
      { userId: checkUser._id, roles: checkUser.roles, shop_id },
      publicKey,
      privateKey
    );

    if (!token) {
      throw new BadRequestError("create token fail");
    }

    const keyToken = await keyTokenService.createKeyToken({
      userId: checkUser._id,
      publicKey,
      privateKey,
      refreshToken: token.refreshToken,
    });
    if (!keyToken) throw new BadRequestError("create key token error");

    return {
      user: getInfoData({
        fileds: [
          "_id",
          "email",
          "name",
          "avatar",
          "deviceToken",
          "points",
          "roles",
        ],
        object: checkUser,
      }),
      token,
    };
  };

  static loginAdmin = async ({ email, password, refreshToken = null }) => {
    const checkUser = await findByEmail(email);
    if (!checkUser || checkUser.roles !== roles.ADMIN) {
      throw new NotFoundError("user not found");
    }

    const matchPassword = await bcrypt.compare(password, checkUser.password);
    if (!matchPassword) {
      throw new NotFoundError("user not found");
    }
    const publicKey = process.env.PUBLIC_KEY;
    const privateKey = process.env.PRIVATE_KEY;
    console.log(`private::: ${privateKey}, puplickey:::${publicKey}`);
    const token = await createTokenPair(
      { userId: checkUser._id, roles: checkUser.roles },
      publicKey,
      privateKey
    );
    if (!token) {
      throw new BadRequestError("create token fail");
    }
    const keyToken = await keyTokenService.createKeyToken({
      userId: checkUser._id,
      publicKey,
      privateKey,
      refreshToken: token.refreshToken,
    });
    if (!keyToken) throw new BadRequestError("create key token error");
    return {
      user: getInfoData({
        fileds: ["_id", "email", "name", "avatar", "roles"],
        object: checkUser,
      }),
      token: token,
    };
  };
  static loginEmployeeAndManager = async ({
    email,
    password,
    shop_id,
    refreshToken = null,
  }) => {
    console.log("ádfadsfafd");

    const checkUser = await findByEmail(email);

    if (!checkUser) {
      throw new NotFoundError("User not found");
    }

    const validRoles = [roles.EMPLOYEE, roles.BRANCH_MANAGER];
    if (
      !validRoles.includes(checkUser.roles) ||
      checkUser.shop_id.toString() !== shop_id
    ) {
      throw new NotFoundError(
        "User role not allowed or shop_id does not match"
      );
    }

    const foundShops = await shopModel.findById(shop_id);
    if (!foundShops) {
      throw new NotFoundError("Shop not found");
    }

    const matchPassword = await bcrypt.compare(password, checkUser.password);
    if (!matchPassword) {
      throw new NotFoundError("Invalid credentials");
    }

    const publicKey = process.env.PUBLIC_KEY;
    const privateKey = process.env.PRIVATE_KEY;

    const token = await createTokenPair(
      { userId: checkUser._id, roles: checkUser.roles, shop_id },
      publicKey,
      privateKey
    );

    if (!token) {
      throw new BadRequestError("Token creation failed");
    }

    const keyToken = await keyTokenService.createKeyToken({
      userId: checkUser._id,
      publicKey,
      privateKey,
      refreshToken: token.refreshToken,
    });

    if (!keyToken) throw new BadRequestError("Key token creation failed");

    return {
      user: getInfoData({
        fileds: ["_id", "email", "name", "avatar", "shop_id", "roles"],
        object: checkUser,
      }),
      token: token,
    };
  };
  static signUp = async ({ name, email, password }) => {
    const checkUser = await findByEmail(email);
    if (checkUser) {
      throw new BadRequestError("email already registed");
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const createUser = await userModel.create({
      name,
      email,
      password: hashPassword,
      roles: roles.USER,
    });
    if (createUser) {
      const publicKey = process.env.PUBLIC_KEY;
      const privateKey = process.env.PRIVATE_KEY;
      console.log(`privateKey ::: ${privateKey}, puplicKey:::: ${publicKey}`);
      const token = await createTokenPair(
        { userId: createUser._id, roles: createUser.roles },
        publicKey,
        privateKey
      );
      if (!token) {
        throw new BadRequestError("create token fail");
      }
      console.log(`token::: ${token}`);
      const keyToken = await keyTokenService.createKeyToken({
        userId: createUser._id,
        publicKey,
        privateKey,
        refreshToken: token.refreshToken,
      });
      if (!keyToken) throw new BadRequestError("create key token error");
      return {
        user: getInfoData({
          fileds: ["_id", "email", "name"],
          object: createUser,
        }),
        token: token,
      };
    }
  };
  static logout = async (keyStore) => {
    const delKey = await keyTokenService.removeKeyById(keyStore._id);
    console.log(delKey);
    return delKey;
  };
  static handlerRefreshToken = async ({ keyStore, refreshToken, userId }) => {
    if (!keyStore) throw new NotFoundError("not found keyStore");
    if (keyStore.refreshTokensUsed.includes(refreshToken)) {
      await keyTokenService.deleteKeyById(userId);
      throw new BadRequestError("refreshToken already used please login again");
    }
    if (keyStore.refreshToken !== refreshToken) {
      throw new Unauthorized("refresh token invalid");
    }
    const existingUser = await findById(userId);
    if (!existingUser) {
      throw new NotFoundError("user not found");
    }
    const token = await createTokenPair(
      { userId: existingUser._id, roles: existingUser.roles },
      process.env.PUBLIC_KEY,
      process.env.PRIVATE_KEY
    );
    await keyTokenService.updateKeyToken(keyStore._id, {
      $set: {
        refreshToken: token.refreshToken,
      },
      $addToSet: {
        refreshTokensUsed: refreshToken,
      },
    });
    return {
      user: getInfoData({
        fileds: ["_id", "email", "name"],
        object: existingUser,
      }),
      token: token,
    };
  };
  static forgotPassword = async ({ email }) => {
    try {
      const checkUser = await userModel.findOne({ email });
      if (!checkUser) {
        throw new NotFoundError("email not found");
      }
      const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

      await sendEmail({
        email: checkUser.email,
        subject: "Đặt lại mật khẩu",
        message: `Mã xác thực của bạn là: ${resetCode}. Mã này sẽ hết hạn sau 2 phút.`,
      });
      const expireTime = new Date(
        new Date().toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" })
      );
      expireTime.setMinutes(expireTime.getMinutes() + 2);
      await userModel.findOneAndUpdate(
        { email },
        {
          $set: {
            resetPasswordCode: resetCode,
            resetPasswordExpire: expireTime,
          },
        },
        {
          new: true,
          lean: true,
        }
      );
      return true;
    } catch (error) {
      console.log(`send email error::: ${error}`);
      throw error;
    }
  };

  static resetPassword = async ({ resetCode, newPassword }) => {
    try {
      const checkUser = await userModel.findOne({ email });
      if (!checkUser) {
        throw new NotFoundError("email not found");
      }
      if (checkUser.resetPasswordCode !== resetCode) {
        throw new BadRequestError("authentication code is incorrect");
      }

      const now = new Date(
        new Date().toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" })
      );

      if (checkUser.resetPasswordExpire < now) {
        throw new BadRequestError("The authentication code has expired");
      }

      const hashPassword = await bcrypt.hash(newPassword, 10);
      await userModel.findOneAndUpdate(
        { email },
        {
          $set: {
            password: hashPassword,
            resetPasswordCode: null,
            resetPasswordExpire: null,
          },
        },
        {
          new: true,
          lean: true,
        }
      );
    } catch (error) {
      console.log(`reset password error::: ${error}`);
      throw error; // Ném lỗi nếu có
    }
  };
  static changePassword = async ({ user, newPassword }) => {
    if (!user) {
      throw new BadRequestError("data missing user");
    }
    const checkUser = await userModel.findById(user._id);
    if (!checkUser) {
      throw new NotFoundError("not found user");
    }
    const hashPassword = await bcrypt.hash(newPassword, 10);
    await checkUser.updateOne({
      $set: {
        password: hashPassword,
      },
    });
  };
  static updatePr = async ({ user, updateData }) => {
    if (!user) {
      throw new BadRequestError("data missing user");
    }

    // Kiểm tra trước khi gọi removeUndefinedObject
    console.log("Data received in updatePr:", updateData); // Kiểm tra dữ liệu nhận được
    const cleanData = removeUndefinedObject(updateData);

    console.log("Clean Data After Removing Undefined:", cleanData); // Kiểm tra sau khi xử lý
    return await updateUser({ user, updateData: cleanData });
  };

  static getUserInfo = async ({ userId, shopId }) => {
    const user = await userModel.findById(userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }
    return {
      user: getInfoData({
        fileds: ["_id", "name", "email", "avatar", "points"],
        object: user,
      }),
      shopId,
    };
  };
  static createEmployee = async (payload) => {
    const { name, email, password, shop_id } = payload;
    const checkUser = await findByEmail(email);
    if (checkUser) {
      throw new BadRequestError("email already registed");
    }
    if (!mongoose.Types.ObjectId.isValid(shop_id)) {
      throw new BadRequestError("Shop không tồn tại trong cơ sở dữ liệu");
    }

    // Kiểm tra xem shop có tồn tại không
    const shopExists = await shopModel.findById(shop_id);
    if (!shopExists) {
      throw new BadRequestError("Shop không tồn tại trong cơ sở dữ liệu");
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const createUser = await userModel.create({
      name,
      email,
      password: hashPassword,
      roles: roles.EMPLOYEE,
      shop_id: shop_id,
    });
    if (createUser) {
      const publicKey = process.env.PUBLIC_KEY;
      const privateKey = process.env.PRIVATE_KEY;
      console.log(`privateKey ::: ${privateKey}, puplicKey:::: ${publicKey}`);
      const token = await createTokenPair(
        { userId: createUser._id, roles: createUser.roles },
        publicKey,
        privateKey
      );
      if (!token) {
        throw new BadRequestError("create token fail");
      }
      console.log(`token::: ${token}`);
      const keyToken = await keyTokenService.createKeyToken({
        userId: createUser._id,
        publicKey,
        privateKey,
        refreshToken: token.refreshToken,
      });
      if (!keyToken) throw new BadRequestError("create key token error");
      return {
        user: createUser,
        token: token,
      };
    }
  };

  static createBranchManager = async (payload) => {
    const { name, email, password, shop_id } = payload;
    const checkUser = await findByEmail(email);
    if (checkUser) {
      throw new BadRequestError("email already registed");
    }
    if (!mongoose.Types.ObjectId.isValid(shop_id)) {
      throw new BadRequestError("Shop not found");
    }

    // Kiểm tra xem shop có tồn tại không
    const shopExists = await shopModel.findById(shop_id);
    if (!shopExists) {
      throw new BadRequestError("shop not found");
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const createUser = await userModel.create({
      name,
      email,
      password: hashPassword,
      roles: roles.BRANCH_MANAGER,
      shop_id: shop_id,
    });
    if (createUser) {
      const publicKey = process.env.PUBLIC_KEY;
      const privateKey = process.env.PRIVATE_KEY;
      console.log(`privateKey ::: ${privateKey}, puplicKey:::: ${publicKey}`);
      const token = await createTokenPair(
        { userId: createUser._id, roles: createUser.roles },
        publicKey,
        privateKey
      );
      if (!token) {
        throw new BadRequestError("create token fail");
      }
      console.log(`token::: ${token}`);
      const keyToken = await keyTokenService.createKeyToken({
        userId: createUser._id,
        publicKey,
        privateKey,
        refreshToken: token.refreshToken,
      });
      if (!keyToken) throw new BadRequestError("create key token error");
      return {
        user: createUser,
        token: token,
      };
    }
  };
}
module.exports = UserService;
