const { Server } = require("socket.io");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");
const { generateResponse } = require("../services/ai.service");
const aiService = require("../services/ai.service");
const messageModel = require("../models/message.model");
const { createMemory,queryMemory} = require("../services/vector.service");

function setupSocketServer(httpServer) {
  const io = new Server(httpServer, {});

  io.use((socket, next) => {
    const cookies = cookie.parse(socket.handshake.headers?.cookie || "");

    if (!cookies.token) {
      return next(new Error("Authentication error: No token provided"));
    }

    try {
      const decoded = jwt.verify(cookies.token, process.env.JWT_SECRET);
      socket.user = decoded; // Attach user info to the socket
      next();
    } catch (error) {
      next(new Error("Authentication error: Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    socket.on("ai-message", async (messagePayload) => {
      try {
          
        /* const message =  await messageModel.create({
              chat: messagePayload.chat,
              content: messagePayload.content,
              user: socket.user._id,
              role: "user",
                
         })
        
        const vectors = await aiService.generateVector(messagePayload.content)*/


        // Run both operations in parallel

        const [message, vectors] = await Promise.all([
          messageModel.create({
            chat: messagePayload.chat,
            content: messagePayload.content,
            user: socket.user._id,
            role: "user",
          }),
          aiService.generateVector(messagePayload.content),
        ])

          await createMemory({
             vectors,
             messageId: message._id,
             metadata: {
               chat: messagePayload.chat,
               user: socket.user._id,
               text: messagePayload.content,
             },
           });

        /*

                const memory = await queryMemory({
                  vectors,
                  limit: 3,
                  metadata: {},
                });
        const chatHistory = (await messageModel.find({ chat: messagePayload.chat }).sort({ createdAt: -1 }).limit(20).lean()).reverse(); */


        // Run both operations in parallel

        const [memory, chatHistory] = await Promise.all([
          queryMemory({
           queryVector: vectors,
            limit: 3,
            metadata: {user:socket.user._id},
          }),
          messageModel.find({ chat: messagePayload.chat }).sort({ createdAt: -1 }).limit(20).lean()
        ])
        
        const stm = chatHistory.map((item) => {
          return {
            role: item.role,
            parts: [{ text: item.content }],
          };
        });

        const ltm = [{
          role: "user",
          parts: [{
            text: `these are some previous messages from the chat to generate response
            ${memory.map(item=>item.metadata.text).join("\n")}
            `}]
        }]

        
         const response = await aiService.generateResponse ([...ltm,...stm]);
        
       /*  const responseMessage = await messageModel.create({
                   chat: messagePayload.chat,
                   content: response,
                   user: socket.user._id,
                   role: "model",
             });

        const responseVectors = await aiService.generateVector(messagePayload.content) */


                socket.emit("ai-response", {
                  content: response,
                  chat: messagePayload.chat,
                });

        const [responseMessage, responseVectors] = await Promise.all([
          messageModel.create({
            chat: messagePayload.chat,
            content: response,
            user: socket.user._id,
            role: "model",
          }),
          aiService.generateVector(response)
        ])

         await createMemory({
           vectors: responseVectors,
           messageId: responseMessage._id,
           metadata: {
             chat: messagePayload.chat,
             user: socket.user._id,
             text: response,
           },
         });

      }
      
      catch (err) {
        console.error("AI Service Error:", err);
        socket.emit("ai-response", {
          content: "Error generating AI response.",
          chat: messagePayload.chat,
        });
      }
    });
  });
}

module.exports = { setupSocketServer };







/*


Flow of this code

1. User Message save in db
2. Generate vector for user message
3. Query Pinecone vector db for relevant context
4. Save user message vector in pinecone
5. Get chat history from db 
6. Generate AI response using context and chat history
7. Save AI response in db
8. Generate vector for AI response
9. Save AI response vector in pinecone
10. Emit/Send AI response to user.


*/