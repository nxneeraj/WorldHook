// client.js — Socket.IO client
(function(){
    const socket = io();
    const logsDiv = document.getElementById('logs');
  
    socket.on('log', entry => {
      const line = document.createElement('div');
      line.textContent = entry;
      logsDiv.appendChild(line);
      logsDiv.scrollTop = logsDiv.scrollHeight;
    });
  
    socket.on('connect',    () => console.log('🛰️ Connected'));
    socket.on('disconnect', () => console.warn('🔌 Disconnected'));
  })();
  