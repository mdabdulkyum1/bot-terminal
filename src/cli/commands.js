
import { processAIRequest } from '../core/aiProcessor.js';
import { readFile, writeFile } from '../core/fileHandler.js';
import { addToContext, getContext } from '../core/contextManager.js';
import { logger } from '../utils/logger.js';

export async function askCommand(query, settings) {
  try {
    const context = await getContext();
    const prompt = `${context}\nUser: ${query}`;
    const response = await processAIRequest(prompt, settings);
    await addToContext(`User: ${query}\nAI: ${response}`);
    return response;
  } catch (error) {
    logger.error(`Error processing ask command: ${error.message}`);
    throw error;
  }
}

export async function editCommand(filePath, settings) {
  try {
    const fileContent = await readFile(filePath);
    const prompt = `Edit the following code:\n${fileContent}\nProvide the improved version.`;
    const response = await processAIRequest(prompt, settings);
    await writeFile(filePath, response);
    await addToContext(`User: Edited ${filePath}\nAI: File updated with AI suggestions`);
    return `File ${filePath} has been updated with AI suggestions.`;
  } catch (error) {
    logger.error(`Error processing edit command: ${error.message}`);
    throw error;
  }
}

export async function explainCommand(topic, settings) {
  try {
    const prompt = `Explain ${topic} in simple terms.`;
    const response = await processAIRequest(prompt, settings);
    await addToContext(`User: Explain ${topic}\nAI: ${response}`);
    return response;
  } catch (error) {
    logger.error(`Error processing explain command: ${error.message}`);
    throw error;
  }
}
