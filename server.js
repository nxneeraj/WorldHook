// server.js — Env-driven Express Webhook
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');

const PORT = process.env.PORT || 3000;
const SHELL = path.resolve(__dirname, 'shell.php');
const LOG = path.resolve(__dirname, 'logs', 'requests.log');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Optional Auth
const AUTH = process.env.AUTH_KEY;
if (AUTH) {
  app.use('/webhook', (req, res, next) => {
    if (req.headers['x-auth'] !== AUTH) return res.sendStatus(403);
    next();
  });
}

app.post('/webhook', (req, res) => {
  const entry = `[${new Date().toISOString()}] ${req.ip} → ${JSON.stringify(req.body)}\n`;
  fs.mkdirSync(path.dirname(LOG), { recursive: true });
  fs.appendFileSync(LOG, entry);

  exec(`php ${SHELL}`, (err, out, errout) => {
    if (err) console.error('ExecErr:', err);
    else console.log('ShellOK:', out);
  });

  res.send('OK');
});

app.listen(PORT, () => console.log(`🚀 Listening on port ${PORT}`));

// Integrate Socket.IO for dashboard live updates
const http = require('http').createServer(app);
const io = require('socket.io')(http, { cors: { origin: '*' } });
io.on('connection', sock => console.log('🔌 Dashboard connected'));
fs.watch(LOG, { encoding: 'buffer' }, (event, filename) => {
  if (event === 'change') {
    const lines = fs.readFileSync(LOG, 'utf8').split('\n');
    const last = lines[lines.length - 2];
    if (last) io.emit('log', last);
  }
});
http.listen(PORT, () => {}); // socket on same port
