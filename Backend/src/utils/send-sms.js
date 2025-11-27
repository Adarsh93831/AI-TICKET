import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);


export const sendSMS = async (to, content) => {
  try {
    const message = await client.messages.create({
      body: content,
      from: twilioPhone,
      to,
    });

    console.log(`✅ SMS sent  ${message}`);
    return message;
  } catch (error) {
    console.error(`❌ Failed to send SMS to ${to}:`, error.message);
    throw error;
  }
};
