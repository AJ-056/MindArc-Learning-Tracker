
/**
 * System Logger: Intercepts console methods to maintain a log of app activity
 * for debugging purposes, which can be downloaded by the user.
 */

class SystemLogger {
  private logs: string[] = [];
  private originalConsole: any = {};

  constructor() {
    this.logs.push(`[SYSTEM START] ${new Date().toISOString()}`);
    this.init();
  }

  private init() {
    const methods: Array<keyof Console> = ['log', 'warn', 'error', 'info', 'debug'];
    
    methods.forEach(method => {
      this.originalConsole[method] = console[method];
      (console as any)[method] = (...args: any[]) => {
        // Log to original console
        this.originalConsole[method].apply(console, args);
        
        // Save to our buffer
        const timestamp = new Date().toISOString();
        const message = args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' ');
        
        this.logs.push(`[${timestamp}] [${method.toUpperCase()}] ${message}`);
        
        // Limit log size to prevent memory issues
        if (this.logs.length > 1000) {
          this.logs.shift();
        }
      };
    });
  }

  public getLogText(): string {
    return this.logs.join('\n');
  }

  public downloadLogs() {
    const text = this.getLogText();
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mindarc-system-logs-${new Date().getTime()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

export const logger = new SystemLogger();
