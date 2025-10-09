import dotenv from "dotenv";
import fetch from "node-fetch";
import { logger } from '../utils/logger.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../../.env') });

export class AIProvider {
  constructor() {
    this.provider = process.env.AI_PROVIDER || 'gemini';
    this.config = this.loadConfig();
  }

  loadConfig() {
    const config = {
      provider: this.provider,
      maxTokens: parseInt(process.env.OPENAI_MAX_TOKENS) || 4000,
      maxFileSize: parseInt(process.env.MAX_FILE_SIZE) || 1000000,
      allowedExtensions: process.env.ALLOWED_FILE_EXTENSIONS?.split(',') || ['.js', '.ts', '.jsx', '.tsx', '.py', '.java', '.cpp', '.c', '.h', '.json', '.md', '.txt', '.css', '.html', '.xml', '.yaml', '.yml']
    };

    if (this.provider === 'gemini') {
      config.apiKey = process.env.GEMINI_API_KEY;
      config.model = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
      config.baseUrl = 'https://generativelanguage.googleapis.com/v1';
    } else if (this.provider === 'openai') {
      config.apiKey = process.env.OPENAI_API_KEY;
      config.model = process.env.OPENAI_MODEL || 'gpt-4';
      config.baseUrl = 'https://api.openai.com/v1';
    }

    if (!config.apiKey) {
      console.log(`⚠️  ${this.provider.toUpperCase()}_API_KEY not found in .env file`);
      console.log('Please add your API key to the .env file to use AI features.');
      console.log('Example: GEMINI_API_KEY=your_api_key_here');
      config.apiKey = 'demo_key'; // Use demo key for testing
    }

    return config;
  }

  async generateResponse(prompt, options = {}) {
    try {
      // Check if we're in demo mode
      if (this.config.apiKey === 'demo_key') {
        return this.generateDemoResponse(prompt);
      }

      if (this.provider === 'gemini') {
        return await this.generateGeminiResponse(prompt, options);
      } else if (this.provider === 'openai') {
        return await this.generateOpenAIResponse(prompt, options);
      } else {
        throw new Error(`Unsupported AI provider: ${this.provider}`);
      }
    } catch (error) {
      logger.error(`AI Provider Error: ${error.message}`);
      throw error;
    }
  }

  async generateGeminiResponse(prompt, options = {}) {
    const modelName = this.config.model.startsWith('models/') ? this.config.model : `models/${this.config.model}`;
    const response = await fetch(
      `${this.config.baseUrl}/${modelName}:generateContent?key=${this.config.apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: String(prompt) }],
            },
          ],
          generationConfig: {
            maxOutputTokens: options.maxTokens || this.config.maxTokens,
            temperature: options.temperature || 0.7,
          }
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const responseText = await response.text();
    if (!responseText.trim()) {
      throw new Error('Empty response from API');
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      throw new Error(`Invalid JSON response: ${responseText.substring(0, 200)}...`);
    }

    if (data.error) {
      throw new Error(data.error.message || JSON.stringify(data.error));
    }

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "⚠️ No response received.";
    return text;
  }

  async generateOpenAIResponse(prompt, options = {}) {
    const response = await fetch(`${this.config.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify({
        model: this.config.model,
        messages: [
          {
            role: "system",
            content: "You are an expert software developer and AI assistant. Help the user with code analysis, editing, and development tasks. Always be precise and helpful."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: options.maxTokens || this.config.maxTokens,
        temperature: options.temperature || 0.7,
      }),
    });

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message);
    }

    const text = data?.choices?.[0]?.message?.content || "⚠️ No response received.";
    return text;
  }

  generateDemoResponse(prompt) {
    // Generate a demo response based on the prompt
    const responses = [
      "🤖 Demo Mode: This is a sample AI response. To use real AI features, please add your API key to the .env file.",
      "📝 Demo Mode: I understand you're asking about: " + prompt.substring(0, 50) + "... In demo mode, I can't provide real AI responses.",
      "🚀 Demo Mode: Great question! In the full version, I would analyze your prompt and provide intelligent assistance.",
      "💡 Demo Mode: I see you're working with: " + prompt + ". Add your API key to unlock full AI capabilities!",
      "✨ Demo Mode: That's an interesting request. With a real API key, I could help you with code analysis, file editing, and more!"
    ];
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    return randomResponse + "\n\n🔧 To enable full AI features:\n1. Get your API key from Google AI Studio (for Gemini)\n2. Add it to your .env file: GEMINI_API_KEY=your_key_here\n3. Restart the terminal";
  }

  getProviderInfo() {
    return {
      provider: this.provider,
      model: this.config.model,
      maxTokens: this.config.maxTokens,
      maxFileSize: this.config.maxFileSize,
      allowedExtensions: this.config.allowedExtensions
    };
  }

  isFileAllowed(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    return this.config.allowedExtensions.includes(ext);
  }

  isFileSizeAllowed(content) {
    return content.length <= this.config.maxFileSize;
  }
}
