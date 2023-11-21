const { toTitleCase, validateEmail } = require("../config/function");
const bcrypt = require("bcryptjs");
const userModel = require("../models/users");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/keys");
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { deleteModel } = require("mongoose");

function generateOTP() {
  return crypto.randomBytes(4).toString('hex').toUpperCase();
}
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: '20110453@student.hcmute.edu.vn',
    pass: 'Adiagaseason1411',
  },
});

function sendOTPEmail(email, otp) {
  const mailOptions = {
    from: 'Home Market',
    to: email,
    subject: 'OTP for Signup Verification',
    text: `Your OTP for signup verification is: ${otp}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}
class Auth {
  async isAdmin(req, res) {
    let { loggedInUserId } = req.body;
    try {
      let loggedInUserRole = await userModel.findById(loggedInUserId);
      res.json({ role: loggedInUserRole.userRole });
    } catch {
      res.status(404);
    }
  }

  async allUser(req, res) {
    try {
      let allUser = await userModel.find({});
      res.json({ users: allUser });
    } catch {
      res.status(404);
    }
  }

  /* User Registration/Signup controller  */
  async postSignup(req, res) {
    let { name, email, password, cPassword } = req.body;
    let error = {};
    if (!name || !email || !password || !cPassword) {
      error = {
        ...error,
        name: "Filed must not be empty",
        email: "Filed must not be empty",
        password: "Filed must not be empty",
        cPassword: "Filed must not be empty",
      };
      return res.json({ error });
    }
    if (name.length < 3 || name.length > 25) {
      error = { ...error, name: "Name must be 3-25 charecter" };
      return res.json({ error });
    } else {
      if (validateEmail(email)) {
        name = toTitleCase(name);
        if ((password.length > 255) | (password.length < 8)) {
          error = {
            ...error,
            password: "Password must be 8 charecter",
            name: "",
            email: "",
          };
          return res.json({ error });
        } else {
          // If Email & Number exists in Database then:
          try {
            password = bcrypt.hashSync(password, 10);
            const otp = generateOTP();
            const data = await userModel.findOne({ email: email });
            if (data && data.verify == true) {
              error = {
                ...error,
                password: "",
                name: "",
                email: "Email already exists",
              };
              return res.json({ error });
            } if (data && data.verify === false) {
              // Xóa người dùng khỏi cơ sở dữ liệu
              await userModel.deleteOne({ email: email });
              // Gửi lại OTP mới
              sendOTPEmail(email, otp);
              // Tạo người dùng mới với OTP mới
              let newUser = new userModel({
                name,
                email,
                password,
                otp,
                userRole: 0, // Field Name change to userRole from role
              });
            
              try {
                // Lưu người dùng mới vào cơ sở dữ liệu
                const savedUser = await newUser.save();
            
                return res.json({
                  success: "Account created successfully. Please confirm OTP to verify account",
                  user: savedUser,
                });
              } catch (err) {
                console.log(err);
                return res.json({ error: "An error occurred during signup. Please try again." });
              }
            }
            else{
              sendOTPEmail(email, otp);
              let newUser = new userModel({
                name,
                email,
                password,
                otp,
                // ========= Here role 1 for admin signup role 0 for customer signup =========
                userRole: 0, // Field Name change to userRole from role
              });
              newUser
                .save()
                .then((data) => {
                  return res.json({
                    success: "Account create successfully. Please confirm OTP to verify account",
                  });
                })
                .catch((err) => {
                  console.log(err);
                });
            }
          } catch (err) {
            console.log(err);
          }
        }
      } 
    }
  }
  async confirmSignup(req, res) {
    const { email, otp } = req.body;
  
    try {
      // Truy xuất thông tin người dùng từ cơ sở dữ liệu bằng email
      const user = await userModel.findOne({ email });
  
      // Kiểm tra xem người dùng có tồn tại và OTP khớp không
      if (user) {
        if(user.otp==otp){
        // Nếu OTP khớp, đặt trạng thái đã xác minh và đặt lại OTP
        user.isVerified = true;
        user.otp = null; // Hoặc bạn có thể xóa OTP khỏi cơ sở dữ liệu
        await user.save();
  
        return res.json({
          success: 'Tài khoản đã được xác minh và tạo thành công. Vui lòng đăng nhập.',
        });}
        else {
          return res.json({ error: 'OTP không hợp lệ. Vui lòng thử lại.' });
        }
      } else {
        return res.json({ error: 'Không tìm thấy người dùng.' });
      }
    } catch (error) {
      console.error(error);
      return res.json({ error: 'Có lỗi xảy ra trong quá trình xác minh. Vui lòng thử lại.' });
    }
  }
  /* User Login/Signin controller  */
  async postSignin(req, res) {
    let { email, password } = req.body;
    if (!email || !password) {
      return res.json({
        error: "Fields must not be empty",
      });
    }
    try {
      const data = await userModel.findOne({ email: email });
      if (!data) {
        return res.json({
          error: "Invalid email or password",
        });
      } 
      if (!user.isVerified) {
        return res.json({ error: "Account not verified. Please signup again and check your email for OTP." });
      }
      else {
        const login = await bcrypt.compare(password, data.password);
        if (login) {
          const token = jwt.sign(
            { _id: data._id, role: data.userRole },
            JWT_SECRET
          );
          const encode = jwt.verify(token, JWT_SECRET);
          return res.json({
            token: token,
            user: encode,
          });
        } else {
          return res.json({
            error: "Invalid email or password",
          });
        }

      }
    } catch (err) {
      console.log(err);
    }
  }
}

const authController = new Auth();
module.exports = authController;
