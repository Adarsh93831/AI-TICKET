import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendMail = async (to, subject, text) => {
  const msg = {
    to,
    from: process.env.SENDER_EMAIL,
    subject,
    text
  };

  try {
   
    
    await sgMail.send(msg);
    console.log('✅ Email sent successfully');
    return { success: true };
  } catch (error) {
    console.error('❌ Error sending email:', error.response?.body || error.message);
    return { success: false, error };
  }
};

export{
     sendMail
}