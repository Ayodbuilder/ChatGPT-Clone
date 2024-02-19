// const chatInput = document.querySelector("#chat-input");
// const sendButton = document.querySelector("#send-btn");
// const chatContainer = document.querySelector(".Chat-Container");
// const themeButton = document.querySelector("#theme-btn");
// const deleteButton = document.querySelector("#delete-btn");

// let userText = null;
// const API_KEY = "";

// const createElement = (html, className) => {
//     const chatDiv = document.createElement("div");
//     chatDiv.classList.add("Chat", className);
//     chatDiv.innerHTML = html;
//     return chatDiv;
// }

// const getChatResponse = async (incomingChatDiv) => {
//     const API_URL ="https://api.openai.com/v1/completions";
//     const pElement = document.createElement("p");


//     const requestOptions = {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//             "Authorization": `Bearer ${API_KEY}`
//         },
//         body: JSON.stringify({
//             model: "gpt-3.5-turbo-instruct",
//             prompt: userText,
//             max_tokens: 2048,
//             temperature: 0.2,
//             n: 1,
//             stop: null
//         })
//     }

//     try{
//         const response =  await(await fetch(API_URL, requestOptions)).JSON();
//         pElement.textContent = response.choices[0].text;
//         console.log(response);
//     }catch(error) {
//         // console.log(error);
// }
//     incomingChatDiv.querySelector(".typing-animation").remove();
//     incomingChatDiv.querySelector(".Chat-details").appendChild(pElement);
// }


// const showTypingAnimation = () =>{
//     const html = ` <div class="Chat-content">
//     <div class="Chat-details">
//         <img src="images/chatbot.jpg" alt="chatbox-image">
//         <div class="typing-animation">
//             <div class="typing-dot" style="--delay: 0.2s"></div>
//             <div class="typing-dot" style="--delay: 0.3s"></div>
//             <div class="typing-dot" style="--delay: 0.4s"></div>
//         </div>
//     </div>
//     <span class="material-symbols-outlined">content_copy</span>
// </div>`;
// const incomingChatDiv = createElement(html, "incoming");
// chatContainer.appendChild(incomingChatDiv);
// getChatResponse(incomingChatDiv);
// }


// const handleOutgoingChat = () => {
//     userText = chatInput.value.trim();
//     const html = `<div class="Chat-content">
//     <div class="Chat-details">
//         <img src="images/user.jpg" alt="user-image">
//         <p>${userText}</p>
//     </div>
// </div>`;
// const outgoingChatDiv = createElement(html, "outgoing");
// chatContainer.appendChild(outgoingChatDiv);
// setTimeout(showTypingAnimation, 500);
// }


// sendButton.addEventListener("click", handleOutgoingChat);



document.addEventListener("DOMContentLoaded", function () {
    const chatInput = document.querySelector("#chat-input");
    const sendButton = document.querySelector("#send-btn");
    const chatContainer = document.querySelector(".Chat-Container");
    const themeButton = document.querySelector("#theme-btn");
    const deleteButton = document.querySelector("#delete-btn");

    let userText = null;
    let isLightMode = true;

    const API_KEY = "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";

    const createChatElement = (html, className) => {
        const chatDiv = document.createElement("div");
        chatDiv.classList.add("Chat", className);
        chatDiv.innerHTML = html;
        return chatDiv;
    }

    const getChatResponse = async () => {
        const API_URL = "https://api.openai.com/v1/chat/completions";

        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: "text-davinci-003",
                prompt: userText,
                max_tokens: 2048,
                temperature: 0.2,
                n: 1,
                stop: null
            })
        }

        try {
            const response = await fetch(API_URL, requestOptions);
            const data = await response.json();
            return data.choices[0].text.trim();
        } catch (error) {
            console.error(error);
            return "Failed to get response from AI";
        }
    }

    const showTypingAnimation = async () => {
        const html = `
            <div class="Chat-content">
                <div class="Chat-details">
                    <img src="images/chatbot.jpg" alt="chatbox-image">
                    <div class="typing-animation">
                        <div class="typing-dot" style="--delay: 0.2s"></div>
                        <div class="typing-dot" style="--delay: 0.3s"></div>
                        <div class="typing-dot" style="--delay: 0.4s"></div>
                    </div>
                </div>
            </div>`;
        const incomingChatDiv = createChatElement(html, "incoming");
        chatContainer.appendChild(incomingChatDiv);
        const response = await getChatResponse();
        updateChat(response, "incoming");
    }

    const updateChat = (message, className) => {
        const html = `
            <div class="Chat-content">
                <div class="Chat-details">
                    <img src="images/${className === 'incoming' ? 'chatbot' : 'user'}.jpg" alt="${className === 'incoming' ? 'chatbot' : 'user'}-image">
                    <p>${message}</p>
                </div>
            </div>`;
        const chatDiv = createChatElement(html, className);
        chatContainer.appendChild(chatDiv);
    }

    const handleOutgoingChat = async () => {
        userText = chatInput.value.trim();
        if (userText) {
            updateChat(userText, "outgoing");
            chatInput.value = "";
            setTimeout(showTypingAnimation, 500);
        }
    }

    const toggleTheme = () => {
        document.body.classList.toggle("light-mode");
        isLightMode = !isLightMode;
    }

    const deleteChat = () => {
        chatContainer.innerHTML = ""; 
    }

    sendButton.addEventListener("click", handleOutgoingChat);
    themeButton.addEventListener("click", toggleTheme);
    deleteButton.addEventListener("click", deleteChat);
});
