import { inngest } from "../client.js";
import Ticket from "../../models/ticket.models.js";
import User from "../../models/user.models.js";
import { NonRetriableError } from "inngest";
import { sendMail } from "../../utils/mailer.js";
import analyzeTicket from "../../utils/ai.js";


export const onTicketCreated = inngest.createFunction(
  { id: "on-ticket-created", retries: 2 },
  { event: "ticket/created" },
  async ({ event, step }) => {
        console.log("\n========================================");
        console.log("🚀 INNGEST: onTicketCreated TRIGGERED");
        console.log("📦 Event data:", JSON.stringify(event.data, null, 2));
        console.log("========================================\n");
        
        try {
            const { ticketId } = event.data;
            console.log("🎫 Processing ticket ID:", ticketId);
            
            const ticket = await step.run("fetch-ticket", async () => {
              const ticketObject = await Ticket.findById(ticketId);
              if (!ticketObject) {
                throw new NonRetriableError("Ticket not found");
              }
              return ticketObject;
            });

            await step.run("update-ticket-status", async () => {
              await Ticket.findByIdAndUpdate(ticket._id, { status: "TODO" });
            });

            const aiResponse = await analyzeTicket(ticket);
            console.log("🤖 AI Response:", JSON.stringify(aiResponse, null, 2));

            const relatedskills = await step.run("process-ai-response", async () => {
              let skills = [];
              
              if (aiResponse && aiResponse.relatedSkills) {
                await Ticket.findByIdAndUpdate(ticket._id, {
                  priority: !["low", "medium", "high"].includes(aiResponse.priority)
                    ? "medium"
                    : aiResponse.priority,
                  helpfulNotes: aiResponse.helpfulNotes || "AI analysis completed",
                  status: "IN_PROGRESS",
                  relatedSkills: aiResponse.relatedSkills,
                });
                skills = aiResponse.relatedSkills;
              } else {
                console.log("⚠️ AI response was null or missing relatedSkills, using defaults");
                await Ticket.findByIdAndUpdate(ticket._id, {
                  priority: "medium",
                  helpfulNotes: "AI analysis unavailable - manual review required",
                  status: "IN_PROGRESS",
                  relatedSkills: ["general"],
                });
                skills = ["general"];
              }
              
              return skills;
            });

            const moderator = await step.run("assign-moderator", async () => {
              console.log("🔍 Looking for moderator with skills:", relatedskills);
              
              let user = null;
              
              if (relatedskills && relatedskills.length > 0) {
                user = await User.findOne({
                  role: "moderator",
                  skills: {
                    $elemMatch: {
                      $regex: relatedskills.join("|"),
                      $options: "i",
                    },
                  },
                });
                console.log("👤 Moderator with matching skills:", user?.email || "not found");
              }
              
              if (!user) {
                user = await User.findOne({ role: "moderator" });
                console.log("👤 Any moderator:", user?.email || "not found");
              }
              
              if (!user) {
                user = await User.findOne({ role: "admin" });
                console.log("👤 Admin fallback:", user?.email || "not found");
              }
              
              if (user) {
                await Ticket.findByIdAndUpdate(ticket._id, {
                  assignedTo: user._id,
                });
                console.log("✅ Ticket assigned to:", user.email);
              } else {
                console.log("⚠️ No user found to assign ticket");
              }
              
              return user;
            });

            await step.run("send-email-notification", async () => {
              if (moderator) {
                const finalTicket = await Ticket.findById(ticket._id);
                await sendMail(
                  moderator.email,
                  "Ticket Assigned",
                  `A new ticket is assigned to you ${finalTicket.title}`
                );
              }
            });

            return { success: true };
        }
        catch(err)
        {
             console.error("❌ Error running the step", err.message);
             return { success: false };
        }
  }
);
