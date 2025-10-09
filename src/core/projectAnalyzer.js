import fs from 'fs-extra';
import path from 'path';
import { glob } from 'glob';
import { logger } from '../utils/logger.js';
import { AIProvider } from './aiProvider.js';

export class ProjectAnalyzer {
  constructor() {
    this.aiProvider = new AIProvider();
    this.projectRoot = process.cwd();
    this.ignorePatterns = [
      'node_modules/**',
      '.git/**',
      'dist/**',
      'build/**',
      '.next/**',
      '.nuxt/**',
      'coverage/**',
      '.nyc_output/**',
      '*.log',
      '.env*',
      '.DS_Store',
      'Thumbs.db'
    ];
  }

  async analyzeProject() {
    try {
      logger.info('🔍 Starting project analysis...');
      
      const projectStructure = await this.getProjectStructure();
      const packageInfo = await this.getPackageInfo();
      const gitInfo = await this.getGitInfo();
      const codeStats = await this.getCodeStatistics();
      
      const analysis = {
        timestamp: new Date().toISOString(),
        projectRoot: this.projectRoot,
        structure: projectStructure,
        packageInfo,
        gitInfo,
        codeStats,
        summary: await this.generateProjectSummary(projectStructure, packageInfo, codeStats)
      };

      logger.info('✅ Project analysis completed');
      return analysis;
    } catch (error) {
      logger.error(`Project analysis failed: ${error.message}`);
      throw error;
    }
  }

  async getProjectStructure() {
    const structure = {
      files: [],
      directories: [],
      totalFiles: 0,
      totalDirectories: 0
    };

    try {
      // Get all files and directories
      const allFiles = await glob('**/*', { 
        cwd: this.projectRoot,
        ignore: this.ignorePatterns,
        dot: true 
      });

      for (const file of allFiles) {
        const fullPath = path.join(this.projectRoot, file);
        const stat = await fs.stat(fullPath);
        
        if (stat.isDirectory()) {
          structure.directories.push({
            name: file,
            path: fullPath,
            type: 'directory'
          });
          structure.totalDirectories++;
        } else {
          const ext = path.extname(file);
          structure.files.push({
            name: file,
            path: fullPath,
            size: stat.size,
            extension: ext,
            modified: stat.mtime,
            type: 'file'
          });
          structure.totalFiles++;
        }
      }

      return structure;
    } catch (error) {
      logger.error(`Error getting project structure: ${error.message}`);
      return structure;
    }
  }

  async getPackageInfo() {
    try {
      const packagePath = path.join(this.projectRoot, 'package.json');
      if (await fs.pathExists(packagePath)) {
        const packageData = await fs.readJson(packagePath);
        return {
          name: packageData.name,
          version: packageData.version,
          description: packageData.description,
          main: packageData.main,
          scripts: packageData.scripts,
          dependencies: packageData.dependencies,
          devDependencies: packageData.devDependencies,
          type: packageData.type
        };
      }
      return null;
    } catch (error) {
      logger.error(`Error reading package.json: ${error.message}`);
      return null;
    }
  }

  async getGitInfo() {
    try {
      const gitPath = path.join(this.projectRoot, '.git');
      if (await fs.pathExists(gitPath)) {
        // Simple git info - could be enhanced with actual git commands
        return {
          isGitRepo: true,
          hasGit: true
        };
      }
      return { isGitRepo: false, hasGit: false };
    } catch (error) {
      logger.error(`Error checking git info: ${error.message}`);
      return { isGitRepo: false, hasGit: false };
    }
  }

  async getCodeStatistics() {
    const stats = {
      totalLines: 0,
      totalSize: 0,
      filesByExtension: {},
      largestFiles: [],
      recentFiles: []
    };

    try {
      const codeFiles = await glob('**/*.{js,ts,jsx,tsx,py,java,cpp,c,h,json,md,txt,css,html,xml,yaml,yml}', {
        cwd: this.projectRoot,
        ignore: this.ignorePatterns
      });

      for (const file of codeFiles) {
        const fullPath = path.join(this.projectRoot, file);
        const content = await fs.readFile(fullPath, 'utf8');
        const ext = path.extname(file);
        const lines = content.split('\n').length;
        
        stats.totalLines += lines;
        stats.totalSize += content.length;

        // Count by extension
        if (!stats.filesByExtension[ext]) {
          stats.filesByExtension[ext] = { count: 0, lines: 0 };
        }
        stats.filesByExtension[ext].count++;
        stats.filesByExtension[ext].lines += lines;

        // Track largest files
        stats.largestFiles.push({
          file,
          lines,
          size: content.length
        });

        // Track recent files
        const stat = await fs.stat(fullPath);
        stats.recentFiles.push({
          file,
          modified: stat.mtime,
          lines,
          size: content.length
        });
      }

      // Sort and limit
      stats.largestFiles.sort((a, b) => b.lines - a.lines);
      stats.largestFiles = stats.largestFiles.slice(0, 10);
      
      stats.recentFiles.sort((a, b) => b.modified - a.modified);
      stats.recentFiles = stats.recentFiles.slice(0, 10);

      return stats;
    } catch (error) {
      logger.error(`Error getting code statistics: ${error.message}`);
      return stats;
    }
  }

  async generateProjectSummary(structure, packageInfo, codeStats) {
    try {
      const summaryPrompt = `
Analyze this project and provide a comprehensive summary:

PROJECT STRUCTURE:
- Total files: ${structure.totalFiles}
- Total directories: ${structure.totalDirectories}
- File extensions: ${Object.keys(codeStats.filesByExtension).join(', ')}

PACKAGE INFO:
${packageInfo ? `
- Name: ${packageInfo.name}
- Version: ${packageInfo.version}
- Description: ${packageInfo.description}
- Main file: ${packageInfo.main}
- Scripts: ${Object.keys(packageInfo.scripts || {}).join(', ')}
- Dependencies: ${Object.keys(packageInfo.dependencies || {}).length}
- Dev Dependencies: ${Object.keys(packageInfo.devDependencies || {}).length}
` : 'No package.json found'}

CODE STATISTICS:
- Total lines of code: ${codeStats.totalLines.toLocaleString()}
- Total file size: ${(codeStats.totalSize / 1024 / 1024).toFixed(2)} MB
- Files by extension: ${JSON.stringify(codeStats.filesByExtension, null, 2)}
- Largest files: ${codeStats.largestFiles.slice(0, 5).map(f => `${f.file} (${f.lines} lines)`).join(', ')}

Please provide:
1. Project type and purpose
2. Technology stack
3. Key components and structure
4. Development workflow suggestions
5. Potential improvements or issues
`;

      const summary = await this.aiProvider.generateResponse(summaryPrompt);
      return summary;
    } catch (error) {
      logger.error(`Error generating project summary: ${error.message}`);
      return "Unable to generate project summary due to AI provider error.";
    }
  }

  async readFile(filePath) {
    try {
      const fullPath = path.isAbsolute(filePath) ? filePath : path.join(this.projectRoot, filePath);
      
      if (!this.aiProvider.isFileAllowed(fullPath)) {
        throw new Error(`File type not allowed: ${path.extname(fullPath)}`);
      }

      const content = await fs.readFile(fullPath, 'utf8');
      
      if (!this.aiProvider.isFileSizeAllowed(content)) {
        throw new Error(`File too large: ${content.length} characters (max: ${this.aiProvider.config.maxFileSize})`);
      }

      return {
        path: fullPath,
        content,
        size: content.length,
        lines: content.split('\n').length,
        extension: path.extname(fullPath)
      };
    } catch (error) {
      logger.error(`Error reading file ${filePath}: ${error.message}`);
      throw error;
    }
  }

  async writeFile(filePath, content, options = {}) {
    try {
      const fullPath = path.isAbsolute(filePath) ? filePath : path.join(this.projectRoot, filePath);
      
      if (!options.force && !this.aiProvider.isFileAllowed(fullPath)) {
        throw new Error(`File type not allowed: ${path.extname(fullPath)}`);
      }

      await fs.ensureDir(path.dirname(fullPath));
      await fs.writeFile(fullPath, content, 'utf8');
      
      logger.info(`File written: ${fullPath}`);
      return {
        path: fullPath,
        size: content.length,
        lines: content.split('\n').length
      };
    } catch (error) {
      logger.error(`Error writing file ${filePath}: ${error.message}`);
      throw error;
    }
  }
}
