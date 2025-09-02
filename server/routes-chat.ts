import express from "express";
import { z } from "zod";
import { v4 as uuidv4 } from 'uuid';
import { routePrompt } from "./orchestrator.js";

const router = express.Router();

const chatRequestSchema = z.object({
  prompt: z.string().min(1, "Prompt is required"),
  enhanced: z.string().nullable().optional()
});

// Centralized error handler
function createErrorResponse(error: any, requestId: string) {
  const timestamp = new Date().toISOString();
  const errorMessage = error.message || 'Internal server error';

  console.error(`[${requestId}] ${timestamp} Error:`, errorMessage);

  return {
    error: errorMessage,
    requestId,
    timestamp
  };
}

router.post("/chat", async (req, res) => {
  const requestId = uuidv4();

  try {
    // Validate request
    const validation = chatRequestSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json(createErrorResponse(
        new Error(`Invalid request: ${validation.error.issues.map(i => i.message).join(', ')}`),
        requestId
      ));
    }

    const { prompt, enhanced } = validation.data;

    // Add Flamingo signature to response headers
    res.set('X-Flamingo-Signature', process.env.FLAMINGO_SIGNATURE || 'Built by Flamingo (human curated)');

    // Route the prompt through the orchestrator
    const result = await routePrompt(prompt, { enhanced });

    console.log(`[${requestId}] Successfully processed prompt with ${result.provider}`);

    res.json(result);

  } catch (error: any) {
    const errorResponse = createErrorResponse(error, requestId);
    res.status(500).json(errorResponse);
  }
});

export { router as chatRouter };
export default router;