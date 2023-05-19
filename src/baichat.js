class BAIChatDelta {
    constructor(data) {
      this.data = data;
    }
  
    get text() {
      return this.data["text"];
    }
  
    get id() {
      return this.data["id"];
    }
  
    get model() {
      return this.data["detail"]["model"];
    }
  
    get delta() {
      return this.data["delta"];
    }
  
    get detail() {
      return this.data["detail"];
    }
  }
  
  class BAIChatResponse {
    constructor(data) {
      this.data = data.map((item) => new BAIChatDelta(item));
    }
  
    get text() {
      return this.data[this.data.length - 1].text;
    }
  
    get id() {
      return this.data[this.data.length - 1].id;
    }
  
    get model() {
      return this.data[this.data.length - 1].model;
    }
  
    [Symbol.iterator]() {
      return this.data[Symbol.iterator]();
    }
  }
  
  class BAIChat {
    constructor() {
      this.URL = "https://chatbot.theb.ai/";
      this.API_URL = "https://chatbot.theb.ai/api/chat-process";
      this.CONFIG_FILE = "~/.config/baichat/config.json";
  
      this.config = this.loadConfig();
      this.chat_id = this.config ? this.config["chat_id"] : "";
    }
  
    loadConfig() {
      // Implement loading config from local storage or other storage method
      return false;
    }
  
    saveConfig() {
      // Implement saving config to local storage or other storage method
    }
  
    get_random_string(length = 15) {
      let result = "";
      const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
      for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
      }
      return result;
    }
  
    ask(prompt) {
      const url = this.API_URL;
      const chat_id = this.chat_id || `chatcmpl-${this.get_random_string()}`;
  
      const payload = JSON.stringify({
        prompt: prompt.replace(/"/g, "\n"),
        options: { parentMessageId: chat_id },
      });
  
      return $.ajax({
        url: url,
        method: "POST",
        data: payload,
        contentType: "application/json",
        dataType: "text",
        beforeSend: (xhr) => {
          xhr.setRequestHeader("Accept", "application/json, text/plain, */*");
          xhr.setRequestHeader("Accept-Language", "en-US,en;q=0.5");
          xhr.setRequestHeader("Origin", "https://chatbot.theb.ai");
          xhr.setRequestHeader("Referer", "https://chatbot.theb.ai");
          xhr.setRequestHeader(
            "User-Agent",
            "Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/112.0"
          );
        },
      })
        .then((response) => {
          const result = response
            .trim()
            .split("\n")
            .map((line) => JSON.parse(line));
          return new BAIChatResponse(result);
        })
        .then((response) => {
          this.chat_id = response.id;
          this.saveConfig();
          return response;
        });
    }
  }
  
  // Usage example:
  const chat = new BAIChat();