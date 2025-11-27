import { inngest } from "../client.js";
import User from "../../models/user.models.js";
import { NonRetriableError } from "inngest";
import { sendMail } from "../../utils/mailer.js";
import { sendSMS } from "../../utils/send-sms.js";

export const onUserSignup = inngest.createFunction(
  { id: "on-user-signup", retries: 2 },
  { event: "user/signup" },
  async ({ event, step }) => {
    try {
      const { email } = event.data;

      const user = await step.run("get-user-email", async () => {
        const userObject = await User.findOne({ email });
        if (!userObject) {
          throw new NonRetriableError("User no longer exists in our database");
        }
        return userObject;
      });



      await step.run("send-welcome-email", async () => {
        const subject = `Welcome to the app`;
        const welcomeMessage =
          user.authProvider === "google"
            ? `Hi ${user.firstName || ""},\n\nThanks for signing up with Google! You're all set to explore the platform.`
            : `Hi ${user.firstName || ""},\n\nThanks for signing up. Please verify your email to get started.`;

        await sendMail(user.email, subject, welcomeMessage);
        console.log("welcome msg snt");
        
      });


      await step.sleep("wait-2-days", "2d");


      const userAfterDelay = await step.run("recheck-user", async () => {
        const updatedUser = await User.findOne({ email });
        if (!updatedUser) {
          throw new NonRetriableError("User not found after delay.");
        }
        return updatedUser;
      });

      await step.run("send-followup-email", async () => {
        const subject = `Thanks for staying with us!`;
        const message = `Hi ${userAfterDelay.firstName || ""},\n\nIt's been a couple of days since you joined, and we just wanted to say thank you for sticking around. We hope you're enjoying the experience!`;

        await sendMail(userAfterDelay.email, subject, message);
      });

      await step.run("send-followup-sms", async () => {
        if (userAfterDelay.phoneNumber) {
          const smsMessage = `Hi ${userAfterDelay.firstName || ""}, thanks for staying with us! 🎉`;
          await sendSMS(userAfterDelay.phoneNumber, smsMessage);
        } else {
          console.log("User has no phone number to send SMS.");
        }
      });


      return { success: true };
    } catch (error) {
      console.error("❌ Error running step:", error.message);
      return { success: false };
    }
  }
);
