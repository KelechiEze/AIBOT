const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const port = 5000;

app.use(express.json()); 
app.use(cors()); 

// Example AI Service endpoint (replace this with your actual AI API call)
const getAIResponse = async (message, conversation) => {
  try {
    const response = await axios.post("https://your-ai-api.com/endpoint", {
      message: message,
      conversation: conversation, // Send the entire conversation to the AI
    });
    // Assuming the API returns a `reply` field in its response
    return response.data.reply || "No reply from AI"; 
  } catch (error) {
    console.error("Error calling AI API:", error.response?.data || error.message);
    return "Sorry, I couldn't understand that.";
  }
};

// POST endpoint to handle chat message (updated to '/send-message')
app.post("/send-message", async (req, res) => {
  const { message, conversation } = req.body;

  // Validate input
  if (!message || typeof message !== "string" || message.trim() === "") {
    return res.status(400).json({ error: "Message is required and must be a non-empty string" });
  }

  // Validate conversation array
  if (!Array.isArray(conversation)) {
    return res.status(400).json({ error: "Conversation must be an array" });
  }

  try {
    // Send message and conversation history to AI service and get a reply
    const aiReply = await getAIResponse(message, conversation);

    // Respond with AI reply
    res.json({ message: aiReply });
  } catch (error) {
    console.error("Error processing request:", error.message);
    res.status(500).json({ error: "Internal Server Error: Unable to process AI request" });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

