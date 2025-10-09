import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { logger } from '../utils/logger.js';
import { CommandBlock } from './commandBlock.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SESSIONS_DIR = path.join(__dirname, '../../data/sessions');

export class SessionManager {
  constructor() {
    this.currentSession = [];
    this.sessionId = this.generateSessionId();
    this.sessionFile = path.join(SESSIONS_DIR, `${this.sessionId}.json`);
  }

  generateSessionId() {
    const now = new Date();
    return `session_${now.getFullYear()}_${String(now.getMonth() + 1).padStart(2, '0')}_${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}_${String(now.getMinutes()).padStart(2, '0')}`;
  }

  async initialize() {
    try {
      await fs.ensureDir(SESSIONS_DIR);
      await this.loadSession();
      logger.info(`Session initialized: ${this.sessionId}`);
    } catch (error) {
      logger.error(`Failed to initialize session: ${error.message}`);
      throw error;
    }
  }

  async loadSession() {
    try {
      if (await fs.pathExists(this.sessionFile)) {
        const data = await fs.readJson(this.sessionFile);
        this.currentSession = data.blocks.map(blockData => CommandBlock.fromJSON(blockData));
        logger.info(`Loaded session with ${this.currentSession.length} blocks`);
      }
    } catch (error) {
      logger.error(`Failed to load session: ${error.message}`);
      this.currentSession = [];
    }
  }

  async saveSession() {
    try {
      const sessionData = {
        id: this.sessionId,
        startTime: this.currentSession[0]?.startTime || Date.now(),
        lastSaved: Date.now(),
        blocks: this.currentSession.map(block => block.toJSON())
      };

      await fs.writeJson(this.sessionFile, sessionData, { spaces: 2 });
      logger.info(`Session saved: ${this.currentSession.length} blocks`);
    } catch (error) {
      logger.error(`Failed to save session: ${error.message}`);
    }
  }

  addBlock(block) {
    this.currentSession.push(block);
    this.saveSession(); // Auto-save after each block
  }

  getBlocks() {
    return this.currentSession;
  }

  getBlockById(id) {
    return this.currentSession.find(block => block.id === id);
  }

  getRecentBlocks(count = 10) {
    return this.currentSession.slice(-count);
  }

  async clearSession() {
    this.currentSession = [];
    await this.saveSession();
    logger.info('Session cleared');
  }

  async listSessions() {
    try {
      const files = await fs.readdir(SESSIONS_DIR);
      const sessions = [];

      for (const file of files) {
        if (file.endsWith('.json')) {
          const sessionFile = path.join(SESSIONS_DIR, file);
          const data = await fs.readJson(sessionFile);
          sessions.push({
            id: data.id,
            startTime: data.startTime,
            lastSaved: data.lastSaved,
            blockCount: data.blocks?.length || 0
          });
        }
      }

      return sessions.sort((a, b) => b.lastSaved - a.lastSaved);
    } catch (error) {
      logger.error(`Failed to list sessions: ${error.message}`);
      return [];
    }
  }

  async loadSessionById(sessionId) {
    try {
      const sessionFile = path.join(SESSIONS_DIR, `${sessionId}.json`);
      if (await fs.pathExists(sessionFile)) {
        const data = await fs.readJson(sessionFile);
        this.currentSession = data.blocks.map(blockData => CommandBlock.fromJSON(blockData));
        this.sessionId = sessionId;
        this.sessionFile = sessionFile;
        logger.info(`Loaded session: ${sessionId}`);
        return true;
      }
      return false;
    } catch (error) {
      logger.error(`Failed to load session ${sessionId}: ${error.message}`);
      return false;
    }
  }

  async deleteSession(sessionId) {
    try {
      const sessionFile = path.join(SESSIONS_DIR, `${sessionId}.json`);
      if (await fs.pathExists(sessionFile)) {
        await fs.remove(sessionFile);
        logger.info(`Deleted session: ${sessionId}`);
        return true;
      }
      return false;
    } catch (error) {
      logger.error(`Failed to delete session ${sessionId}: ${error.message}`);
      return false;
    }
  }

  getSessionStats() {
    const totalBlocks = this.currentSession.length;
    const aiBlocks = this.currentSession.filter(block => block.isAICommand).length;
    const systemBlocks = totalBlocks - aiBlocks;
    const errorBlocks = this.currentSession.filter(block => block.status === 'error').length;
    
    const totalDuration = this.currentSession.reduce((sum, block) => sum + block.getDuration(), 0);
    
    return {
      sessionId: this.sessionId,
      totalBlocks,
      aiBlocks,
      systemBlocks,
      errorBlocks,
      successRate: totalBlocks > 0 ? ((totalBlocks - errorBlocks) / totalBlocks * 100).toFixed(1) : 0,
      totalDuration: this.formatDuration(totalDuration),
      avgBlockDuration: totalBlocks > 0 ? this.formatDuration(totalDuration / totalBlocks) : '0ms'
    };
  }

  formatDuration(ms) {
    if (ms < 1000) return `${Math.round(ms)}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    return `${Math.floor(ms / 60000)}m ${Math.floor((ms % 60000) / 1000)}s`;
  }
}
