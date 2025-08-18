const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');

function scrollToBottom() {
  chatBox.scrollTop = chatBox.scrollHeight;
}

function createMessageEl(sender, text) {
  const wrap = document.createElement('div');
  wrap.className = `msg msg--${sender}`;

  const avatar = document.createElement('div');
  avatar.className = `avatar avatar--${sender}`;
  avatar.textContent = sender === 'user' ? 'U' : 'G';

  const bubble = document.createElement('div');
  bubble.className = 'bubble';
  bubble.textContent = text;

  wrap.appendChild(avatar);
  wrap.appendChild(bubble);
  return wrap;
}

function appendMessage(sender, text) {
  const el = createMessageEl(sender, text);
  chatBox.appendChild(el);
  scrollToBottom();

  return el.querySelector('.bubble');
}

function appendTyping() {
  const wrap = document.createElement('div');
  wrap.className = 'msg msg--bot';

  const avatar = document.createElement('div');
  avatar.className = 'avatar avatar--bot';
  avatar.textContent = 'G';

  const bubble = document.createElement('div');
  bubble.className = 'bubble';

  const typing = document.createElement('div');
  typing.className = 'typing';
  typing.innerHTML = '<span class="dot"></span><span class="dot"></span><span class="dot"></span>';

  bubble.appendChild(typing);
  wrap.appendChild(avatar);
  wrap.appendChild(bubble);
  chatBox.appendChild(wrap);
  scrollToBottom();

  return { wrap, bubble };
}

form.addEventListener('submit', async function (e) {
  e.preventDefault();

  const userMessage = input.value.trim();
  if (!userMessage) return;

  appendMessage('user', userMessage);
  input.value = '';

  const thinking = appendTyping();

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
      throw new Error(`Server error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data && data.result) {
      thinking.bubble.textContent = data.result;
    } else {
      thinking.bubble.textContent = 'Sorry, no response received';
    }
  } catch (error) {
    console.error('Failed to get response from server:', error);
    thinking.bubble.textContent = 'Sorry, something went wrong';
  } finally {
    scrollToBottom();
  }
});