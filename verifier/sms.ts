import twilio from "twilio";
import dotenv from "dotenv";
dotenv.config();

const client = new twilio.Twilio(
  process.env.TWILIO_SID as string,
  process.env.TWILIO_AUTHTOKEN as string
);

export async function sendWebsiteDownSMS(phNo: string, websiteUrl: string) {
  const message = `⚠️ Your website might be down.\nReported by validators.\nWebsite: ${websiteUrl}\n`;
  
  await client.messages.create({
    body: message,
    from: process.env.TWILIO_MOBILE_NO,
    to: phNo,
  });

  console.log("Website down SMS sent to", phNo);
}

export async function sendLowBalanceSMS(phNo: string, websiteUrl: string, balance: string) {
    const message = `⚠️ Low balance alert for your website.\nWebsite: ${websiteUrl}\nBalance: ${balance}\nValidators will not check this site until topped up.\n`;
  
    await client.messages.create({
      body: message,
      from: process.env.TWILIO_MOBILE_NO,
      to: phNo,
    });
}