export class CommandBlock {
  constructor(input) {
    this.id = this.generateId();
    this.input = input;
    this.output = '';
    this.error = '';
    this.status = 'pending'; // pending, processing, executing, completed, error
    this.startTime = Date.now();
    this.endTime = null;
    this.exitCode = null;
    this.isAICommand = this.detectAICommand(input);
  }

  generateId() {
    return `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  detectAICommand(input) {
    return input.startsWith('ai ') || 
           input.startsWith('?') || 
           input.startsWith('explain ') ||
           input.startsWith('edit ') ||
           input.startsWith('ask ') ||
           input.startsWith('analyze ') ||
           input.startsWith('read ') ||
           input.startsWith('project ');
  }

  setStatus(status) {
    this.status = status;
    if (status === 'completed' || status === 'error') {
      this.endTime = Date.now();
    }
  }

  setOutput(output) {
    this.output = output;
  }

  setError(error) {
    this.error = error;
  }

  setExitCode(code) {
    this.exitCode = code;
  }

  getDuration() {
    if (this.endTime) {
      return this.endTime - this.startTime;
    }
    return Date.now() - this.startTime;
  }

  getDurationFormatted() {
    const duration = this.getDuration();
    if (duration < 1000) {
      return `${duration}ms`;
    } else if (duration < 60000) {
      return `${(duration / 1000).toFixed(1)}s`;
    } else {
      return `${Math.floor(duration / 60000)}m ${Math.floor((duration % 60000) / 1000)}s`;
    }
  }

  getStatusIcon() {
    switch (this.status) {
      case 'pending': return '⏳';
      case 'processing': return '🔄';
      case 'executing': return '⚙️';
      case 'completed': return this.isAICommand ? '🤖' : '✓';
      case 'error': return '❌';
      default: return '❓';
    }
  }

  getStatusColor() {
    switch (this.status) {
      case 'pending': return 'yellow';
      case 'processing': return 'blue';
      case 'executing': return 'cyan';
      case 'completed': return 'green';
      case 'error': return 'red';
      default: return 'gray';
    }
  }

  toJSON() {
    return {
      id: this.id,
      input: this.input,
      output: this.output,
      error: this.error,
      status: this.status,
      startTime: this.startTime,
      endTime: this.endTime,
      exitCode: this.exitCode,
      isAICommand: this.isAICommand,
      duration: this.getDuration()
    };
  }

  static fromJSON(data) {
    const block = new CommandBlock(data.input);
    block.id = data.id;
    block.output = data.output;
    block.error = data.error;
    block.status = data.status;
    block.startTime = data.startTime;
    block.endTime = data.endTime;
    block.exitCode = data.exitCode;
    return block;
  }
}
