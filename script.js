// Default Admin Credentials
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "1234";

// ------------------ ADMIN LOGIN ------------------

function adminLogin() {
    let username = document.getElementById("admin-username").value;
    let password = document.getElementById("admin-password").value;

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        localStorage.setItem("adminLoggedIn", "true");
        showAdminPanel();
    } else {
        alert("Invalid credentials");
    }
}

function logout() {
    localStorage.removeItem("adminLoggedIn");
    location.reload();
}

function showAdminPanel() {
    document.getElementById("login-section").style.display = "none";
    document.getElementById("admin-panel").style.display = "block";
    loadFAQs();
    loadChats();
    updateStats();
}

if (localStorage.getItem("adminLoggedIn") === "true") {
    if (document.getElementById("admin-panel")) {
        showAdminPanel();
    }
}

// ------------------ FAQ MANAGEMENT ------------------

function getFAQs() {
    return JSON.parse(localStorage.getItem("faqs")) || [];
}

function saveFAQs(faqs) {
    localStorage.setItem("faqs", JSON.stringify(faqs));
}

function addFAQ() {

    let keywordsInput = document.getElementById("question").value.trim();
    let answer = document.getElementById("answer").value.trim();

    if (!keywordsInput || !answer) {
        alert("Fill all fields");
        return;
    }

    // Convert comma separated keywords into array
    let keywordsArray = keywordsInput
        .toLowerCase()
        .split(",")
        .map(k => k.trim())
        .filter(k => k !== "");

    let faqs = getFAQs();

    faqs.push({
        keywords: keywordsArray,
        answer: answer
    });

    saveFAQs(faqs);

    document.getElementById("question").value = "";
    document.getElementById("answer").value = "";

    loadFAQs();
    updateStats();
}

function loadFAQs() {

    let faqList = document.getElementById("faq-list");
    if (!faqList) return;

    faqList.innerHTML = "";

    let faqs = getFAQs();

    faqs.forEach((faq, index) => {

        let li = document.createElement("li");

        li.innerHTML = `
            <strong>Keywords:</strong> ${faq.keywords.join(", ")} <br>
            <strong>Answer:</strong> ${faq.answer}
            <br>
            <button onclick="deleteFAQ(${index})">Delete</button>
        `;

        faqList.appendChild(li);
    });
}

function deleteFAQ(index) {
    let faqs = getFAQs();
    faqs.splice(index, 1);
    saveFAQs(faqs);
    loadFAQs();
    updateStats();
}

// ------------------ CHATBOT ------------------

function handleKey(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
}

function sendMessage() {
    let input = document.getElementById("user-input");
    let message = input.value.trim();
    if (!message) return;

    addMessage("user", message);

    let response = getBotResponse(message);

    setTimeout(() => {
        addMessage("bot", response);
        saveChat(message, response);
        updateStats();
    }, 500);

    input.value = "";
}

function getBotResponse(message) {

    let input = message.toLowerCase();
    let faqs = getFAQs();

    for (let faq of faqs) {

        for (let keyword of faq.keywords) {

            if (input.includes(keyword)) {
                return faq.answer;
            }
        }
    }

    return "Sorry 😕 I couldn’t understand. Please ask a diploma college related question.";
}

function addMessage(sender, text) {
    let chatBox = document.getElementById("chat-box");
    if (!chatBox) return;

    let div = document.createElement("div");
    div.className = sender + " message"; // add "message" class for bubble styling

    // Add message text in a span
    let msgText = document.createElement("span");
    msgText.className = "msg-text";
    msgText.innerText = text;

    // Add timestamp
    let msgTime = document.createElement("span");
    msgTime.className = "msg-time";
    let now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    let ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    msgTime.innerText = `${hours}:${minutes} ${ampm}`;

    // Append text and time to the div
    div.appendChild(msgText);
    div.appendChild(msgTime);

    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight; // auto scroll

}

// ------------------ CHAT HISTORY ------------------

function saveChat(userMsg, botMsg) {
    let chats = JSON.parse(localStorage.getItem("chats")) || [];
    chats.push({ user: userMsg, bot: botMsg });
    localStorage.setItem("chats", JSON.stringify(chats));
}

function loadChats() {
    let chatHistory = document.getElementById("chat-history");
    if (!chatHistory) return;

    chatHistory.innerHTML = "";
    let chats = JSON.parse(localStorage.getItem("chats")) || [];

    chats.forEach(chat => {
        let li = document.createElement("li");
        li.innerHTML = `
            <strong>User:</strong> ${chat.user}<br>
            <strong>Bot:</strong> ${chat.bot}
        `;
        chatHistory.appendChild(li);
    });
}

function clearChats() {
    localStorage.removeItem("chats");
    loadChats();
    updateStats();
}

// ------------------ STATS ------------------

function updateStats() {
    let totalFaqs = getFAQs().length;
    let totalChats = JSON.parse(localStorage.getItem("chats"))?.length || 0;

    if (document.getElementById("total-faqs"))
        document.getElementById("total-faqs").innerText = totalFaqs;

    if (document.getElementById("total-chats"))
        document.getElementById("total-chats").innerText = totalChats;
}
// ------------------ COLLEGE DETAILS ------------------

function saveCollegeDetails() {
    let details = {
        collegeName: document.getElementById("college-name").value,
        department: document.getElementById("department").value,
        projectTitle: document.getElementById("project-title").value,
        studentName: document.getElementById("student-name").value,
        rollNumber: document.getElementById("roll-number").value,
        guideName: document.getElementById("guide-name").value,
        academicYear: document.getElementById("academic-year").value
    };

    localStorage.setItem("collegeDetails", JSON.stringify(details));
    alert("College Details Saved Successfully!");
    loadCollegeDetails();
}

// Load in Admin Panel fields
function loadCollegeDetailsToForm() {
    let details = JSON.parse(localStorage.getItem("collegeDetails"));
    if (!details) return;

    document.getElementById("college-name").value = details.collegeName ||"";
    document.getElementById("department").value = details.department || "";
    document.getElementById("project-title").value = details.projectTitle || "";
    document.getElementById("student-name").value = details.studentName || "";
    document.getElementById("roll-number").value = details.rollNumber || "";
    document.getElementById("guide-name").value = details.guideName || "";
    document.getElementById("academic-year").value = details.academicYear || "";
}

// Load on User + Admin Page Display
function loadCollegeDetails() {
    let container = document.getElementById("college-info");
    let details = JSON.parse(localStorage.getItem("collegeDetails"));

    if (!container || !details) return;

    container.innerHTML = `
        <h1>${details.collegeName}</h1>
        <p>${details.department}</p>
        <p><strong>Project Title:</strong> ${details.projectTitle}</p>
        <p><strong>Student:</strong> ${details.studentName} |
        <strong>Roll No:</strong> ${details.rollNumber}</p>
        <p><strong>Guide:</strong> ${details.guideName} |
        <strong>Year:</strong> ${details.academicYear}</p>
    `;
}

// Auto load when page opens
window.onload = function () {
    loadCollegeDetails();
    loadCollegeDetailsToForm();
};
//download
function downloadChats() {
    let chats = JSON.parse(localStorage.getItem("chats")) || [];

    if (chats.length === 0) {
        alert("No chats available to download.");
        return;
    }

    let textContent = "Chat History:\n\n";

    chats.forEach((chat, index) => {
        textContent += `#${index + 1}\n`;
        textContent += `User: ${chat.user}\n`;
        textContent += `Bot: ${chat.bot}\n`;
        textContent += `--------------------------\n`;
    });

    // Create a blob and download
    let blob = new Blob([textContent], { type: "text/plain" });
    let url = URL.createObjectURL(blob);
    let a = document.createElement("a");
    a.href = url;
    a.download = "chat_history.txt";
    a.click();
    URL.revokeObjectURL(url);
}
// ------------------ VOICE INPUT ------------------

function startVoice() {
    if (!('webkitSpeechRecognition' in window)) {
        alert("Voice recognition not supported in this browser. Use Chrome.");
        return;
    }

    const recognition = new webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.start();

    const voiceBtn = document.getElementById("voice-btn");
    voiceBtn.classList.add("listening");

    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript;
        document.getElementById("user-input").value = transcript;
        
        voiceBtn.classList.remove("listening");

        // Auto send message after speaking
        sendMessage();
    };

    recognition.onerror = function() {
        voiceBtn.classList.remove("listening");
        alert("Voice recognition error. Try again.");
    };

    recognition.onend = function() {
        voiceBtn.classList.remove("listening");
    };
}
function downloadChat() {

    const chatBox = document.getElementById("chat-box");

    if (chatBox.innerText.trim() === "") {
        alert("No chat available to download!");
        return;
    }

    // Add header details
    const now = new Date();
    const dateTime = now.toLocaleString();

    const header = 
`USHA RAMA College AI Chatbot
Chat History
Generated on: ${dateTime}
-------------------------------------------

`;

    const chatContent = chatBox.innerText;

    const finalText = header + chatContent;

    const blob = new Blob([finalText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "College_AI_Chat_History.txt";
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
// Load saved theme on page load
window.onload = function () {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
        document.body.classList.add("dark");
        document.getElementById("themeToggle").innerText = "☀";
    }
};

// Toggle Function
function toggleDarkMode() {
    const body = document.body;
    const toggleBtn = document.getElementById("themeToggle");

    body.classList.toggle("dark");

    if (body.classList.contains("dark")) {
        toggleBtn.innerText = "☀";
        localStorage.setItem("theme", "dark");
    } else {
        toggleBtn.innerText = "🌙";
        localStorage.setItem("theme", "light");
    }
}


