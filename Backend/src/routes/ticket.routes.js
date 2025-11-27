import {Router} from "express"
import {verifyJWT} from "../middlewares/auth.middleware.js"
import{
    createTicket,
    getTickets,
    getTicket,
    deleteTicket,
    getAssignedTickets
} from "../controllers/ticket.controller.js"

const router= Router();

router.use(verifyJWT);

router.route("/").get(getTickets).post(createTicket);
router.route("/assigned-to-me").get(getAssignedTickets);
router.route("/:id").get(getTicket).delete(deleteTicket);

export default router;
