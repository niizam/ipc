$(document).ready(function () {
  let conversation = ''; // Variable to store the conversation history
  let human = 'Me';
  let assistant = 'Herta';
  let humanpict = 'res/profile/stelle.png';
  let assistantpict = 'res/profile/herta.png';
  let prompt = '';

  // Read the contents of the prompt.txt file and assign it to the 'prompt' variable
  $.get("res/prompt.txt", function (data) {
    prompt = data;

    chat.ask(prompt).then((response) => {
      const transmit = response.text;
    });
  }, 'text');
  // Function to send a message to the AI and handle the response
  function sendMessage(message) {
    conversation += `${message}`;
  
    // Send the message to the AI using BAIChat
    chat.ask(conversation).then((response) => {
      const reply = response.text.trim();
  
      // Regular expression to find code blocks
      const codeBlockRegex = /```([\s\S]*?)```/g;
  
      // Check if the reply contains code blocks
      let codeBlocks = [];
      let match;
      while ((match = codeBlockRegex.exec(reply)) !== null) {
        codeBlocks.push(match[1]);
      }
  
      // Replace code blocks with placeholders
      const placeholder = "__CODE_BLOCK__";
      let formattedReply = reply.replace(codeBlockRegex, placeholder);
  
      // Split the formatted reply into lines
      const replyLines = formattedReply.split('\n');
  
      replyLines.forEach((line, index) => {
        if (line.startsWith('${assistant}:')) {
          line = line.replace('${assistant}:', '').trim();
        }
  
        // Replace placeholders with actual code blocks
        line = line.replace(new RegExp(placeholder, "g"), function (match) {
          const codeBlock = codeBlocks.shift();
          return `<pre><code>${codeBlock}</code></pre>`;
        });
  
        // Append the AI's reply to the chat dialogue
        if (line !== '') {
          $('.chat-dialogue').append(`
              <div class="message other">
                <img src="${assistantpict}" alt="other">
                <div class="chat-content">
                  ${index === 0 ? `<span class="chat-name-other">${assistant}</span>` : ''}
                  <div class="chat-bubble">${line}</div>
                </div>
              </div>
            `);
        }
      });
  
      // Scroll to the bottom of the chat dialogue
      $('.chat-dialogue').scrollTop($('.chat-dialogue')[0].scrollHeight);
    });
  }

  // Event handler for sending a message
  $('.send-btn').on('click', function () {
    const message = $('.chat-input').val().trim();
  
    if (message !== '') {
      // Escape double quotes in the message
       const escapedMessage = message.replace(/"/g, "'");
      // Regular expression to find code blocks
      const codeBlockRegex = /```([\s\S]*?)```/g;
  
      // Check if message contains code blocks
      let codeBlocks = [];
      let match;
      while ((match = codeBlockRegex.exec(message)) !== null) {
        codeBlocks.push(match[1]);
      }
  
      // Function to replace placeholders with actual code blocks
      const replacePlaceholdersWithCodeBlocks = (formattedMessage) => {
        return formattedMessage.replace(new RegExp("__CODE_BLOCK__", "g"), function (match) {
          const codeBlock = codeBlocks.shift();
          return `<pre><code>${codeBlock}</code></pre>`;
        });
      };
  
      if (codeBlocks.length > 0) {
        // Replace code blocks with placeholders
        const placeholder = "__CODE_BLOCK__";
        let formattedMessage = message.replace(codeBlockRegex, placeholder);
  
        // Replace placeholders with actual code blocks without appending to the chat-dialogue
        formattedMessage = replacePlaceholdersWithCodeBlocks(formattedMessage);
  
        // Append the user's message (with actual code blocks) to the chat dialogue
        $('.chat-dialogue').append(`
          <div class="message me">
            <div class="chat-content">
              <span class="chat-name">${human}</span>
              <div class="chat-bubble">${formattedMessage}</div>
            </div>
            <img src="${humanpict}" alt="me">
          </div>
        `);
      } else {
        // Append a regular message to the chat dialogue
        $('.chat-dialogue').append(`
          <div class="message me">
            <div class="chat-content">
              <span class="chat-name">${human}</span>
              <div class="chat-bubble">${message}</div>
            </div>
            <img src="${humanpict}" alt="me">
          </div>
        `);
      }
  
      // Scroll to the bottom of the chat dialogue
      $('.chat-dialogue').scrollTop($('.chat-dialogue')[0].scrollHeight);
  
      // Clear the input field
      $('.chat-input').val('');
  
      // Send the message to the AI
      sendMessage(escapedMessage);
    
    
    }
  });

  const chatBubbles = $(".chat-bubble");

//  chatBubbles.each(function () {
//    const chatName = $(this).prev(".chat-name").text();
//    const chatContent = $(this).text();
//    conversation += `\n${chatName}: ${chatContent}`; 
//  }); 

  // Event handler for pressing Enter key in the input field
  $('.chat-input').on('keydown', function (event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      $('.send-btn').click();
    }
  });

  // Event handler for closing the chat box
  $('.close-btn').on('click', function () {
    window.close();
  });

  $('.OK').on('click', function () {
    let nameInput = $('.your-name');
    human = nameInput.val();
    if (human) {
      let popup = document.getElementById('tos-popup');
      popup.style.display = 'none';
    } else {
      console.log("Name shouldn't be empty");
    }
  });

  $('.Cancel').on('click', function () {
    let popup = document.getElementById('tos-popup');
    popup.style.display = 'none';
  });

  $(document).keydown(function(event) {
    if (event.ctrlKey && event.which === 68) {
      // Ctrl+D is pressed
      $(".message.me, .message.other").remove();
      let conversation = '';
    }
  });
  
  $('.your-name').keyup(function() {
    var textareaValue = $(this).val().trim();
    var button = $('.OK');

    if (textareaValue !== '') {
      button.addClass('valid');
    } else {
      button.removeClass('valid');
    }
  });

});