import e from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "passport";
import "./config/passport.js"
import { onUserSignup } from "./inngest/functions/on-signup.js";
import { onTicketCreated } from "./inngest/functions/on-ticket-create.js";
import { inngest } from "./inngest/client.js";
import { serve } from "inngest/express";

const app = e();

app.use(
  cors({
    origin: (process.env.CORS_ORIGIN || "http://localhost:3000,http://localhost:8288,http://localhost:5173").split(","),
    credentials: true,
  })
);


app.use(e.json());
app.use(e.urlencoded({ extended: true, limit: "16kb" }));
app.use(e.static("public"));
app.use(cookieParser());
app.use(passport.initialize());


import userRouter from "./routes/user.routes.js";
import authRouter from "./routes/auth.routes.js"
import ticketRouter from "./routes/ticket.routes.js"


app.use("/api/v1/users", userRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/tickets",ticketRouter);



app.use(
  "/api/v1/inngest",
  serve({
    client: inngest,
    functions: [onUserSignup, onTicketCreated],
  })
);



export { app };