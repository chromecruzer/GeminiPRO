// import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
  
//   const MODEL_NAME = "gemini-1.0-pro";
//   const API_KEY = "";
  
//   async function runChat() {
  
//   }
  
//   runChat();

  // nodemon --exec ts-node routes/googleai.ts
  ////


  import express from 'express';
  import bodyParser from 'body-parser';
  import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
  
  const app = express();
  const PORT = process.env.PORT || 3000;
  
  const MODEL_NAME = "gemini-1.0-pro";
  const API_KEY = "";
  
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });
  
  app.set('view engine', 'pug');
  app.use(express.static('public'));
  app.use(bodyParser.urlencoded({ extended: true }));
  
  app.post('/sendMessage', async (req, res) => {
    const { message } = req.body;
    // const result = await model.sendMessage(message);
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
  
    const generationConfig = {
      temperature: 0.9,
      topK: 1,
      topP: 1,
      maxOutputTokens: 2048,
    };
  
    const safetySettings = [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ];
  
    const chat = model.startChat({
      generationConfig,
      safetySettings,
      history: [
      ],
    });
  
    const result = await chat.sendMessage(message);
    const response = result.response.text();
  
    res.render('gemini', { messages: [{ user: message, response }] });
  });
  
  app.get('/', (req, res) => {
    res.render('gemini', { messages: [] });
  });
  
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
  