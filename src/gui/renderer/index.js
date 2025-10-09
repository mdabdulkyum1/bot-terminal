const { runAICommand } = require('../../core/aiProcessor.js');

const btn = document.getElementById('askBtn');
const promptBox = document.getElementById('prompt');
const output = document.getElementById('output');

btn.addEventListener('click', async () => {
  const text = promptBox.value.trim();
  if (!text) return;

  output.textContent = 'Processing... ⏳';

  try {
    const response = await runAICommand('ask', text);
    output.textContent = response;
  } catch (error) {
    output.textContent = `❌ Error: ${error.message}`;
  }
});
