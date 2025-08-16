import nodemailer from "nodemailer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";
import dotenv from "dotenv";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const sendWebsicyanertEmail = async (
  email: string,
  websiteUrl: string
) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.email,
      pass: process.env.password,
    },
  });

  const templatePath = path.join(__dirname, "WebsiteDown.html");
  let htmlTemplate = fs.readFileSync(templatePath, "utf-8");
  htmlTemplate = htmlTemplate.replace("{{WEBSITE_URL}}", websiteUrl);

  const mailOptions = {
    from: process.env.email,
    to: email,
    subject: "⚠️ DecenTrack Alert: Your Website Might Be Down",
    html: htmlTemplate,
  };

  await transporter.sendMail(mailOptions);
  console.log("Downtime alert sent to", email);
};

export const sendLowBalanceEmail = async (
  email: string,
  websiteUrl: string,
  balance: string
) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.email,
      pass: process.env.password,
    },
  });

  const templatePath = path.join(__dirname, "WebsiteLowBalance.html");
  let htmlTemplate = fs.readFileSync(templatePath, "utf-8");
  htmlTemplate = htmlTemplate
    .replace("{{WEBSITE_URL}}", websiteUrl)
    .replace("{{BALANCE}}", balance);

  const mailOptions = {
    from: process.env.email,
    to: email,
    subject: "⚠️ DecenTrack: Low Balance Warning for Your Website",
    html: htmlTemplate,
  };

  await transporter.sendMail(mailOptions);
  console.log("Low balance alert sent to", email);
};

// sendLowBalanceEmail("abhishekbr989@gmail.com","asd","0.000001")
