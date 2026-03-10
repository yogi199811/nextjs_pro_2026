// import User from "@/models/userModel";
// import nodemailer from "nodemailer";
// import { v4 as uuid } from "uuid";

// export default async function sendEmail({ email, emailType, userId }: any) {
//   try {
//     if (emailType === "VERIFY") {
//       await User.findByIdAndUpdate(userId, {
//         verifyToken: uuid(),
//         verifyTokenExpiry: Date.now() + 3600000,
//       });
//     }else if(emailType==="RESET"){
//       await User.findByIdAndUpdate(userId, {
//         forgotPasswordToken: uuid(),
//         forgotPasswordTokenExpiry: Date.now() + 3600000,
//       });
//     }

//     // const transporter = nodemailer.createTransport({
//     //   host: "smtp.ethereal.email",
//     //   port: 587,
//     //   secure: false, // Use true for port 465, false for port 587
//     //   auth: {
//     //     user: "maddison53@ethereal.email",
//     //     pass: "jn7jnAPss4f63QBp6D",
//     //   },
//     // });

//     // Looking to send emails in production? Check out our Email API/SMTP product!
// var transporter = nodemailer.createTransport({
//   host: "sandbox.smtp.mailtrap.io",
//   port: 2525,
//   auth: {
//     user: "ada7d37860e187",
//     pass: "2297df68280505"
//   }
// });

//     const mailOptions = {
//       from: "yogeshkushwaha1998@gmail.com",
//       to: email,
//       subject:
//         emailType === "VERIFY" ? "Verify your email" : "Reset your password",

//       html: "<b>Hello world?</b>",
//     };

//     const mailResponse = await transporter.sendMail(mailOptions);
//     return mailResponse;
//   } catch (error: any) {
//     throw new Error(error.message);
//     // console.log("geting error while sending mail", error);
//   }
// }

import User from "@/models/userModel";
import nodemailer from "nodemailer";
import { v4 as uuid } from "uuid";

export default async function sendEmail({ email, emailType, userId }: any) {
  try {
    const token = uuid();
    const baseUrl = process.env.DOMAIN;

    if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(userId, {
        verifyToken: token,
        verifyTokenExpiry: Date.now() + 3600000,
      });
    } else if (emailType === "RESET") {
      await User.findByIdAndUpdate(userId, {
        forgotPasswordToken: token,
        forgotPasswordTokenExpiry: Date.now() + 3600000,
      });
    }

    const transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS,
      },
    });

    const url =
      emailType === "VERIFY"
        ? `${baseUrl}/verifyemail?token=${token}`
        : `${baseUrl}/resetpassword?token=${token}`;

    const mailOptions = {
      from: "yogeshkushwaha1998@gmail.com",
      to: email,
      subject:
        emailType === "VERIFY" ? "Verify Your Email" : "Reset Your Password",
      html: `
        <div style="font-family: Arial; padding:20px">
          <h2>${emailType === "VERIFY" ? "Email Verification" : "Password Reset"}</h2>
          <p>
            ${
              emailType === "VERIFY"
                ? "Click below to verify your email."
                : "Click below to reset your password."
            }
          </p>
          <a href="${url}" style="padding:10px 20px; background:#0070f3; color:#fff; text-decoration:none; border-radius:5px;">
            ${emailType === "VERIFY" ? "Verify Email" : "Reset Password"}
          </a>
          <p style="margin-top:15px;">${url}</p>
          <p style="font-size:12px;color:gray;">Link expires in 1 hour.</p>
        </div>
      `,
    };

    return await transporter.sendMail(mailOptions);
  } catch (error: any) {
    throw new Error(error.message);
  }
}
