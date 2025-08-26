import { Request, Response } from "express";
import { geminiEnhancer } from "./gemini-enhancer";
import { authenticateToken, type AuthRequest } from "./auth";

/**
 * Route to enhance prompts using Gemini
 */
export const enhancePromptRoute = async (req: AuthRequest, res: Response) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ message: "Prompt is required" });
    }

    // Check if enhancement is needed
    if (!geminiEnhancer.needsEnhancement(prompt)) {
      return res.json({
        needsEnhancement: false,
        original: prompt,
        enhanced: prompt
      });
    }

    // Enhance the prompt
    const result = await geminiEnhancer.enhancePrompt(prompt);

    res.json({
      needsEnhancement: true,
      original: result.original,
      enhanced: result.enhanced
    });
  } catch (error) {
    console.error("Prompt enhancement error:", error);
    res.status(500).json({ message: "Enhancement failed" });
  }
};