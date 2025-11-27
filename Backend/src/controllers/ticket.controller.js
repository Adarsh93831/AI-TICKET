import {inngest} from "../inngest/client.js"
import Ticket from "../models/ticket.models.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {ApiError} from "../utils/ApiError.js"

export const createTicket=asyncHandler(async(req,res)=>{
    if (req.user.role !== 'user') {
        throw new ApiError(403, "Only users can create tickets. Staff members manage existing tickets.");
    }

    const {title, description}=req.body;
    if(!title || !description)
    {
        throw new ApiError(400,"Title and description are required");
    }

    const newTicket=await Ticket.create({
        title,
        description,
        createdBy:req.user._id,
    });

    console.log("\n========================================");
    console.log("📤 SENDING INNGEST EVENT: ticket/created");
    console.log("📦 Ticket ID:", newTicket._id.toString());
    console.log("========================================\n");

    try {
        const sendResult = await inngest.send({
            name: "ticket/created",
            data: {
                ticketId: newTicket._id.toString(),
                title,
                description,
                createdBy: req.user._id.toString(),
            },
        });
        console.log("✅ Inngest event sent successfully:", sendResult);
    } catch (inngestError) {
        console.error("❌ Inngest send error:", inngestError.message);
    }

    return res.status(201).json(new ApiResponse(201, newTicket, "Ticket created and processing started"))

})

export const getTickets= asyncHandler(async(req,res)=>{
    const user=req.user;
    let tickets=[];

    if(user.role === "admin")
    {
        tickets = await Ticket.find({})
                    .populate({
                         path: "assignedTo",
                         select: "email role skills"
                    })
                    .populate({
                         path: "createdBy",
                         select: "email"
                    })
                    .sort({createdAt:-1})
    }
    else if(user.role === "moderator")
    {
        tickets = await Ticket.find({ assignedTo: user._id })
                    .populate({
                         path: "createdBy",
                         select: "email"
                    })
                    .sort({createdAt:-1})
    }
    else
    {
        tickets = await Ticket.find({ createdBy: user._id })
            .select("title description status createdAt")
            .sort({ createdAt: -1 });
    }

    return res.status(200).json(new ApiResponse(200,tickets,"Tickets fetched successfully"));
})

export const getTicket= asyncHandler(async(req,res)=>{
       
        const user=req.user;
        let ticket;

        if(user.role!=="user")
        {
            ticket=await Ticket.findById(req.params.id)
            .populate({
                path:"assignedTo",
                select:"email role skills"
            });
        }
        else{
            ticket= await Ticket.findOne({
                createdBy:user._id,
                _id:req.params.id,
            }).select("title description status createdAt");
        }

        

        if(!ticket){
            throw new ApiError(404,"Ticket not found");
        }

        return res.status(200).json(new ApiResponse(200,ticket,"ticket fetched"))

})

export const deleteTicket = asyncHandler(async(req, res) => {
    const user = req.user;
    const ticketId = req.params.id;

    let ticket;
    if (user.role !== "user") {
        ticket = await Ticket.findById(ticketId);
    } else {
        ticket = await Ticket.findOne({
            _id: ticketId,
            createdBy: user._id
        });
    }

    if (!ticket) {
        throw new ApiError(404, "Ticket not found or you don't have permission to delete it");
    }

    await Ticket.findByIdAndDelete(ticketId);

    return res.status(200).json(new ApiResponse(200, null, "Ticket deleted successfully"));
})

export const getAssignedTickets = asyncHandler(async(req, res) => {
    const user = req.user;

    if (user.role === "user") {
        throw new ApiError(403, "Access denied. This endpoint is for moderators and admins only.");
    }

    const assignedTickets = await Ticket.find({ assignedTo: user._id })
        .populate({
            path: "createdBy",
            select: "email"
        })
        .sort({ createdAt: -1 });

    return res.status(200).json(new ApiResponse(200, assignedTickets, "Assigned tickets fetched successfully"));
})