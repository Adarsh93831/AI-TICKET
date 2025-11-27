import { createAgent, gemini } from "@inngest/agent-kit";

const analyzeTicket = async (ticket) => {
    console.log("🎫 analyzeTicket called with:", { title: ticket.title, description: ticket.description });
    console.log("🔑 GEMINI_API_KEY exists:", !!process.env.GEMINI_API_KEY);
    console.log("🔑 GEMINI_API_KEY prefix:", process.env.GEMINI_API_KEY?.substring(0, 10) + "...");

    try {
        const supportAgent = createAgent({

        model: gemini({
            model: "gemini-2.5-flash",
            apiKey: process.env.GEMINI_API_KEY,
        }),
        name: "AI Ticket Triage Assistent",
        system: `You are an expert AI assistent that processes technical support tickets.
    
    Your job is to:
    1.Summarise the issue.
    2.Estimate its priority.
    3.Provide helpful notes and resourses links for human moderators.
    4.List relevant technical skills required.

    IMPORTANT:
    - Respond with *only* valid raw JSON.
    - Do NOT include markdown, code fences, comments, or any extra formatting.
    - The format must be a raw JSON object.
    
    Repeat:Do not warp your output in markdown or code fences`
    });

    console.log("🤖 Calling Gemini API...");

    const response =
        await supportAgent.run(`You are a ticket triage agent. Only return a strict JSON object with no extra text, headers, or markdown.
        
Analyze the following support ticket and provide a JSON object with:

- summary: A short 1-2 sentence summary of the issue.
- priority: One of "low", "medium", or "high".
- helpfulNotes: A detailed technical explanation that a moderator can use to solve this issue. Include useful external links or resources if possible.
- relatedSkills: An array of relevant skills required to solve the issue (e.g., ["React", "MongoDB"]).

Respond ONLY in this JSON format and do not include any other text or markdown in the answer:

{
"summary": "Short summary of the ticket",
"priority": "high",
"helpfulNotes": "Here are useful tips...",
"relatedSkills": ["React", "Node.js"]
}

---

Ticket information:

- Title: ${ticket.title}
- Description: ${ticket.description}`);



console.log("✅ Gemini API response received");
    console.log("📄 Raw response:", JSON.stringify(response.output, null, 2));

    const raw = response.output[0].content;
    console.log("📝 Raw content:", raw);

    try {
        const match = raw.match(/```json\s*([\s\S]*?)\s*```/i);
        const jsonString = match ? match[1] : raw.trim();
        console.log("🔍 Parsed JSON string:", jsonString);
        const parsed = JSON.parse(jsonString);
        console.log("✅ Successfully parsed AI response:", parsed);
        return parsed;
    } catch (e) {
        console.log("❌ Failed to parse JSON from AI response: " + e.message);
        console.log("📄 Raw that failed to parse:", raw);
        return null;
    }
    } catch (error) {
        console.error("❌ Gemini API Error:", error.message);
        console.error("❌ Full error:", error);
        return null;
    }
};

export default analyzeTicket;




















