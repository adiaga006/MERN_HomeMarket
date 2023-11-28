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
            password: "Password must be greater than 8 characters and less than 255 characters",
            name: "",
            email: "",
          };
          return res.json({ error });
        } else {
          // If Email & Number exists in Database then:
          try {
            console.log('Before findOne');
            const data = await userModel.findOne({ email: email });
            console.log('After findOne', data);
          
            if (data) {
              if (data.verify) {
                // User already verified
                console.log('User already verified');
                error = {
                  ...error,
                  password: "",
                  name: "",
                  email: "Email already exists",
                };
                return res.json({ error });
              }
          
              // User exists but not verified, delete and recreate
              console.log('User exists but not verified, deleting and recreating');
              await userModel.deleteOne({ email: email });
          
              const otp = generateOTP();
              const hashedPassword = bcrypt.hashSync(password, 10);
          
              // Create new user with new OTP
              let newUser = new userModel({
                name,
                email,
                password: hashedPassword,
                otp,
                userRole: 0,
              });
          
              try {
                // Save new user to the database
                const savedUser = await newUser.save();
          
                // Send OTP email
                sendOTPEmail(email, otp);
          
                console.log('Account created successfully. Please confirm OTP to verify account');
                return res.json({
                  success: "Account created successfully. Please confirm OTP to verify account",
                  user: savedUser,
                });
              } catch (err) {
                console.log('Error during user save:', err);
                return res.json({ error: "An error occurred during signup. Please try again." });
              }
            }
          
            // User does not exist, create new user
            console.log('User does not exist, creating new user');
            const otp = generateOTP();
            const hashedPassword = bcrypt.hashSync(password, 10);
          
            let newUser = new userModel({
              name,
              email,
              password: hashedPassword,
              otp,
              userRole: 0,
            });
          
            try {
              // Save new user to the database
              const savedUser = await newUser.save();
          
              // Send OTP email
              sendOTPEmail(email, otp);
          
              console.log('Account created successfully. Please confirm OTP to verify account');
              return res.json({
                success: "Account created successfully. Please confirm OTP to verify account",
                user: savedUser,
              });
            } catch (err) {
              console.log('Error during user save:', err);
              return res.json({ error: "An error occurred during signup. Please try again." });
            }
          } catch (err) {
            console.log('Error during findOne:', err);
            return res.json({ error: "An error occurred during signup. Please try again." });
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
        user.verified = true;
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
      if (!data.verified) {
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
            success: 'Đăng nhập thành công.',
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
  async resetPasswordAfterOtp(req, res) {
    let { email, otp, newPassword } = req.body;
    try {
      // Tìm người dùng trong cơ sở dữ liệu
      const user = await userModel.findOne({ email });
  
      // Kiểm tra xem người dùng tồn tại và mã OTP khớp không
      if (user && user.verified) {
        if (user.otp === otp) {
          // Đặt mật khẩu mới
          const hashedPassword = bcrypt.hashSync(newPassword, 10);
          user.password = hashedPassword;
  
          // Xóa mã OTP sau khi đã sử dụng
          user.otp = null;
  
          // Lưu người dùng vào cơ sở dữ liệu
          await user.save();
  
          return res.json({ success: 'Password has been reset successfully.' });
        } else {
          return res.json({ error: 'Invalid OTP. Please try again.' });
        }
      } else {
        return res.json({ error: 'Email chưa được đăng kí hoặc tài khoản chưa được xác minh.' });
      }
    } catch (error) {
      console.error(error);
      return res.json({ error: 'An error occurred while processing your request. Please try again.' });
    }
  }
  
  // Hàm để gửi mã OTP để đặt lại mật khẩu
  async sendOtpForResetPassword(req, res) {
    let { email } = req.body;
    try {
      // Kiểm tra xem email có tồn tại trong cơ sở dữ liệu không
      const user = await userModel.findOne({ email });
  
      if (user) {
        // Tạo mã OTP mới
        const otp = generateOTP();
  
        // Lưu mã OTP vào cơ sở dữ liệu
        user.otp = otp;
        await user.save();
  
        // Gửi email chứa mã OTP
        sendOTPEmail(email, otp);
  
        return res.json({ success: 'OTP has been sent to your email. Please check your inbox.' });
      } else {
        return res.json({ error: 'Email not found. Please check your email address.' });
      }
    } catch (error) {
      console.error(error);
      return res.json({ error: 'An error occurred while processing your request. Please try again.' });
    }
  }
}

const authController = new Auth();
module.exports = authController;
