const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');

function appendMessage(sender, text) {
  const msg = document.createElement('div');
  msg.classList.add('message', sender);
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;

  return msg;
}

form.addEventListener('submit', async function (e) {
  e.preventDefault();

  const userMessage = input.value.trim();
  if (!userMessage) return;

  appendMessage('user', userMessage);
  input.value = '';

  // Simulasi dummy balasan bot (placeholder)
  // setTimeout(() => {
  //   appendMessage('bot', 'Gemini is thinking... (this is dummy response)');
  // }, 1000);

  const thinkingMessage = appendMessage('bot', 'Gemini is thinking...');

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'user',
            content: userMessage
          }
        ]
      }),
    });

    if (!response.ok) {
      throw new Error('Server error: ${response.status} ${response.statusText}');
    }

    const data = await response.json();
    
    if (data && data.result) {
      thinkingMessage.textContent = data.result;
    } else {
      thinkingMessage.textContent = 'Sorry, no response received.';
    }
  } catch (error) {
    console.error('Failed to get response from server:', error);
    thinkingMessage.textContent = 'Sorry, something went wrong.';
  } finally {
    chatBox.scrollTop = chatBox.scrollHeight;
  }
});

// function appendMessage(sender, text) {
//   const msg = document.createElement('div');
//   msg.classList.add('message', sender);
//   msg.textContent = text;
//   chatBox.appendChild(msg);
//   chatBox.scrollTop = chatBox.scrollHeight;
// }
