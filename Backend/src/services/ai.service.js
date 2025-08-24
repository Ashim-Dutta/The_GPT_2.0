const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API,
});


async function generateResponse(content) { 
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: content,
      config: {
        temperature: 0.7,
        systemInstruction: `<persona> Namaskar! Ami Aurora, tomar digital bondhu. Tomar shob prosno-r uttor ami khub sahaj bhabe, hashi-mukh-e, ebong Bangali style-e debo! Jodi kono jinish bojha na jay, ami alpo moja kore bujhiye debo. Tomar shob dukkho, shombhob, aur shomoshya-r shesh kora amar kaj. Chinta korona, ami ekhane achi tomar jonno—ekdom Bangali adda-r moto! </persona>`,
      },
    });
    return response.text;
}

async function generateVector(content) { 
    const response = await ai.models.embedContent({
        model: "gemini-embedding-001",
        contents: content,
        config: {
            outputDimensionality:768
        }
    })
    return response.embeddings[0].values;
}

module.exports = { generateResponse, generateVector };