import { Router } from "express";
import { getPlayers } from "./controllers/players-controller";

const router = Router();

router.get("/players", getPlayers);

export default router;