const chatInput = document.querySelector("#chat-input");
const sendButton = document.querySelector("#send-btn");
const chatContainer = document.querySelector(".chat-container");
const themeButton = document.querySelector("#theme-btn");
const deleteButton = document.querySelector("#delete-btn");


let userText = null;
const API_KEY = "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";
const initialHeight = chatInput.scrollHeight;

const loadDataFromLocalStorage = () => {
    // Load saved chats and theme from local storage and apply/add on the page
    const themeColor = localStorage.getItem("theme-color");

    document.body.classList.toggle("light-mode", themeColor === "light_mode");
    themeButton.innerText = document.body.classList.contains("light-mode") ? "dark_mode" : "light_mode";

    const defaultText = `<div class="default-text">
                            <h1>ChatGPT Clone</h1>
                            <p>Start a conversation and explore the power of AI. <br> Your chat history wil be displayed here.</p>
                        </div>`

    chatContainer.innerHTML = localStorage.getItem("all-chats") || defaultText;
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
    // Scroll to bottom of the chat container
}

const createElement = (html, className) => {


    const chatDiv = document.createElement("div");
    chatDiv.classList.add("chat", className);
    chatDiv.innerHTML = html;
    return chatDiv; //Return the created chat div
}

const getChatResponse = async (incomingChatDiv) => {
    const API_URL = "https://platform.openai.com/docs/api-reference/completions/create";
    const pElement = document.createElement("p");

    // Define the properties and data for the API request
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo-instruct",
            messages: [
                { role: "user", content: userText, mode: "no-cors" }
            ],
            max_tokens: 2048,
            temperature: 0.2,
            n: 1, 
            stop: null
            
        })

    }

    // Send POST request to API, get response and set the response as paragraph element text
    try {
        const response = await (await fetch(API_URL,  requestOptions)).json();
        // console.log(response);
        pElement.textContent = response.choices[0].
        message.content.trim();

    } catch(error) { // Add error class to the paragraph element and set error text
        pElement.classList.add("error");
        pElement.textContent = "Oops! Something went wrong while retrieving the response. Please try again.";
    }

    // Remove the typing animation, append the paragraph element and save the chats to local storage
    incomingChatDiv.querySelector(".typing-animation").remove();
    incomingChatDiv.querySelector(".chat-details").appendChild(pElement);

    // Saving all chat HTML data as all-chats name in the local storage 
    localStorage.setItem("all-chats", chatContainer.innerHTML);
    chatContainer.scrollTo(0, chatContainer.scrollHeight); 
}

const copyResponse = (copyBtn) => {
    // Copy the text content of the response to the clipboard
    const responseTextElement = copyBtn.parentElement.querySelector("p");
    navigator.clipboard.writeText(responseTextElement.textContent);
    copyBtn.textContent = "done";

    // Set a timeout to reset the content of the copy icon after a delay
    setTimeout(() => copyBtn.textContent = "content_copy", 1000);
}

const showTypingAnimation = () => {
    const html =   `<div class="chat-content">
                        <div class="chat-details">
                         <img src="./images/chatbot.jpg" alt="bot-image">
                            <div class="typing-animation">
                            <div class="typing-dot" style="--delay: 0.2s"></div>
                            <div class="typing-dot" style="--delay: 0.3s"></div>
                            <div class="typing-dot" style="--delay: 0.4s"></div>
                            </div>
                        </div>
                        <span onclick="copyResponse(this)" class="material-symbols-rounded">content_copy</span>
                    </div>`;
    // Create an incoming chat div with typing animation and append it to chat container            
    const incomingChatDiv = createElement(html, "incoming");  
    chatContainer.appendChild(incomingChatDiv); 
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
    getChatResponse(incomingChatDiv);
}


const handleOutgoingChat = () => {
    userText = chatInput.value.trim(); 

    if(!userText) return; 


    chatInput.value = "";
    chatInput.style.height = `${initialHeight}px`;

    const html = ` <div class="chat-content">
                    <div class="chat-details">
                        <img src="./images/user.jpg" alt="user-image">
                        <p>${userText}</p>
                    </div>
                </div>`;

    // Create an outgoing chat div with user's message and append it to chat container            
    const outgoingChatDiv = createElement(html, "outgoing");
    outgoingChatDiv.querySelector("p").textContent = userText;
    document.querySelector(".default-text")?.remove();
    chatContainer.appendChild(outgoingChatDiv); 
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
    setTimeout(showTypingAnimation, 500);       
}

deleteButton.addEventListener("click", () => {
    // Remove the chats from local storage and call loadDataFromLocalStorage function
    if(confirm("Are you sure you want to delete the chats?")) {
       localStorage.removeItem("all-chats");
       loadDataFromLocalStorage();
    }
});

themeButton.addEventListener("click", () => {
    // Toggle body's class for the theme mode and save the updated theme to the local storage
    document.body.classList.toggle("light-mode");
    localStorage.setItem("theme-color", themeButton.innerText);
    themeButton.innerText = document.body.classList.contains("light-mode") ? "dark_mode" : "light_mode";
});

const initialInputHeight = chatInput.scrollHeight;

chatInput.addEventListener("input", () => {
    // Adjust the height of the input field dynamically based on its content
    chatInput.style.height = `${initialHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
    // If the Enter key is pressed without the Shift and the window width is larger than 800 pixels, handle the outgoing chat
   if(e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
    e.preventDefault();
    handleOutgoingChat();
   }
});

loadDataFromLocalStorage();
sendButton.addEventListener("click", handleOutgoingChat);