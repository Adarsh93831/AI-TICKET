import {Router} from "express"
import {verifyJWT} from "../middlewares/auth.middleware.js"
import{
    addOrUpdateSkills,
    addOrUpdatePhoneNumber,
    updateUser,
    getUsers,
} from "../controllers/user.controller.js"

const router=Router();

router.use(verifyJWT);

router.route("/addOrUpdateSkills").post(addOrUpdateSkills);

router.route("/addOrUpdatePhoneNumber").post(addOrUpdatePhoneNumber);

router.route("/updateUser").patch(updateUser);

router.route("/getUsers").get(getUsers);



export default router;



