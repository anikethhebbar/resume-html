import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function generateHtmlWithLLM(text, llm, apiKey) {
  const prompt = `Convert the following resume text into a clean, well-formatted HTML document. Use appropriate HTML5 semantic tags and CSS classes for styling. Ensure the HTML is readable, accessible, valid, and well-formed.

Resume Text:
\`\`\`
${text}
\`\`\`

Desired Output: A complete HTML document with <html>, <head>, and <body> tags.`;

  try {
    switch (llm) {
      case 'openai':
        const openai = new OpenAI({ apiKey });
        const openaiCompletion = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: prompt }],
        });
        return openaiCompletion.choices[0].message.content;

      case 'anthropic':
        const anthropic = new Anthropic({ apiKey });
        const anthropicResponse = await anthropic.messages.create({
          model: "claude-3-sonnet-20240229",
          max_tokens: 4096,
          messages: [
            {
              role: "user",
              content: prompt
            }
          ]
        });
        return anthropicResponse.content[0].text;

      case 'gemini':
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const googleResponse = await model.generateContent(prompt);
        return googleResponse.response.text();

      default:
        throw new Error('Invalid LLM choice');
    }
  } catch (error) {
    console.error('Error generating HTML with LLM:', error);
    throw error;
  }
}