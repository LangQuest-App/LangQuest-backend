import express from "express";
import dotenv from "dotenv";
import { prisma } from "../utils/prisma";

dotenv.config();

const userResponseRouter = express.Router();

interface UserResponseInput {
  scriptLineId: number;
  response: string;
}

userResponseRouter.post("/", async (req, res) => {
  try {
    const { scriptLineId, response }: UserResponseInput = req.body;

    if (!scriptLineId || !response) {
      console.error("❌ Missing required fields:", { scriptLineId, response });
      return res.status(400).json({ 
        error: "Missing required fields",
        details: "scriptLineId and response are required"
      });
    }

    // Validate data types
    if (typeof scriptLineId !== 'number' || typeof response !== 'string') {
      console.error("❌ Invalid data types:", { 
        scriptLineId: typeof scriptLineId, 
        response: typeof response 
      });
      return res.status(400).json({ 
        error: "Invalid data types",
        details: "scriptLineId must be a number, response must be a string"
      });
    }

    console.log("📝 Creating user response:", { scriptLineId, response: response.substring(0, 50) + "..." });

    // Check if script line exists
    const scriptLineExists = await prisma.scriptLine.findUnique({
      where: { id: scriptLineId }
    });

    if (!scriptLineExists) {
      console.error("❌ Script line not found:", scriptLineId);
      return res.status(404).json({ 
        error: "Script line not found",
        details: `Script line with ID ${scriptLineId} does not exist`
      });
    }

    // Create user response
    const userResponse = await prisma.userResponse.create({
      data: {
        scriptLineId,
        response
      },
      include: {
        scriptLine: {
          select: {
            id: true,
            text: true,
            speaker: true,
            order: true,
            answer: true,
            scene: {
              select: {
                id: true,
                title: true,
                language: true
              }
            }
          }
        }
      }
    });

    console.log("✅ User response created successfully:", {
      id: userResponse.id,
      scriptLineId: userResponse.scriptLineId,
      responseLength: userResponse.response.length
    });

    // Format response
    const formattedResponse = {
      id: userResponse.id,
      scriptLineId: userResponse.scriptLineId,
      response: userResponse.response,
      createdAt: userResponse.createdAt,
      scriptLine: userResponse.scriptLine
    };

    res.status(201).json({
      message: "User response created successfully",
      data: formattedResponse
    });

  } catch (error) {
    console.error("💥 Error creating user response:", error);
    console.error("Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      type: error?.constructor?.name
    });
    
    res.status(500).json({ 
      error: "Failed to create user response",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

userResponseRouter.get("/", async (req, res) => {
  try {
    console.log("📋 Fetching all user responses...");

    const userResponses = await prisma.userResponse.findMany({
      include: {
        scriptLine: {
          select: {
            id: true,
            text: true,
            speaker: true,
            order: true,
            answer: true,
            scene: {
              select: {
                id: true,
                title: true,
                language: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    console.log("✅ Found", userResponses.length, "user responses");

    res.json({
      message: "User responses retrieved successfully",
      count: userResponses.length,
      data: userResponses
    });

  } catch (error) {
    console.error("💥 Error fetching user responses:", error);
    res.status(500).json({ 
      error: "Failed to fetch user responses",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

export { userResponseRouter };
