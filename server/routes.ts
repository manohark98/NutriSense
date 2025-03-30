import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function registerRoutes(app: Express): Promise<Server> {
  // Start the Flask server
  startFlaskServer();

  // Create a proxy to forward /api requests to the Flask server
  app.use('/api', async (req, res) => {
    try {
      const url = `http://localhost:8000${req.url}`;
      
      const headers: Record<string, string> = {};
      // Copy headers from the incoming request except host
      for (const [key, value] of Object.entries(req.headers)) {
        if (key !== 'host' && typeof value === 'string') {
          headers[key] = value;
        }
      }

      const fetchOptions: RequestInit = {
        method: req.method,
        headers,
      };

      // Handle request body for POST/PUT requests
      if (['POST', 'PUT'].includes(req.method || '')) {
        if (req.headers['content-type']?.includes('multipart/form-data')) {
          // For file uploads, stream the raw body
          const response = await fetch(url, {
            method: req.method,
            body: req,
            headers,
            duplex: 'half',
          });
          
          // Copy status and headers from Flask response
          res.status(response.status);
          response.headers.forEach((value, key) => {
            res.set(key, value);
          });
          
          // Stream the response back
          const data = await response.arrayBuffer();
          res.send(Buffer.from(data));
        } else {
          // For JSON data
          fetchOptions.body = JSON.stringify(req.body);
          const response = await fetch(url, fetchOptions);
          
          res.status(response.status);
          response.headers.forEach((value, key) => {
            res.set(key, value);
          });
          
          const data = await response.json();
          res.json(data);
        }
      } else {
        // For GET/DELETE requests
        const response = await fetch(url, fetchOptions);
        
        res.status(response.status);
        response.headers.forEach((value, key) => {
          res.set(key, value);
        });
        
        const data = await response.json();
        res.json(data);
      }
    } catch (error) {
      console.error('Proxy error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

function startFlaskServer() {
  const flaskScriptPath = path.join(__dirname, 'app.py');
  
  console.log('Starting Flask server...');
  
  const flaskProcess = spawn('python3', [flaskScriptPath], {
    stdio: 'pipe',
    env: process.env,
  });

  flaskProcess.stdout.on('data', (data) => {
    console.log(`Flask: ${data}`);
  });

  flaskProcess.stderr.on('data', (data) => {
    console.error(`Flask error: ${data}`);
  });

  flaskProcess.on('close', (code) => {
    console.log(`Flask process exited with code ${code}`);
  });

  // Gracefully shutdown Flask on process exit
  process.on('exit', () => {
    flaskProcess.kill();
  });
}
