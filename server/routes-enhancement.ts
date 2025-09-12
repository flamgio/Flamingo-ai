
import { Router } from "express";
import { geminiEnhancer } from './gemini-enhancer';

const router = Router();

router.post("/enhance-prompt", async (req, res) => {
  try {
    const { prompt } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    // Use the consolidated Gemini enhancement system
    const result = await geminiEnhancer.enhancePrompt(prompt);
    const enhancedPrompt = result.enhanced;
    
    res.json({ 
      enhancedPrompt,
      enhanced: enhancedPrompt,
      result: enhancedPrompt
    });
  } catch (error) {
    console.error("Enhancement error:", error);
    res.status(500).json({ error: "Enhancement failed" });
  }
});

export const enhancePromptRoute = router.post.bind(router);
export default router;
