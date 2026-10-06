// ==========================================
// NEXVIORA - TASK SYSTEM
// ==========================================

const taskList = document.querySelector(".task-list");
const addTaskBtn = document.querySelector("#addTaskBtn");

let tasks = JSON.parse(localStorage.getItem("nexvioraTasks")) || [
    {
        title: "Complete Array Practice",
        subject: "DSA",
        duration: "45 min",
        priority: "High",
        completed: false
    },
    {
        title: "Revise Digital Electronics",
        subject: "Digital Electronics",
        duration: "30 min",
        priority: "Medium",
        completed: true
    },
    {
        title: "Practice Python Functions",
        subject: "Python",
        duration: "40 min",
        priority: "Medium",
        completed: false
    },
    {
        title: "Read DBMS Notes",
        subject: "DBMS",
        duration: "25 min",
        priority: "Low",
        completed: false
    }
];

function saveTasks() {
    localStorage.setItem("nexvioraTasks", JSON.stringify(tasks));
}

function renderTasks() {

    taskList.innerHTML = "";

    tasks.forEach((task, index) => {

        const taskElement = document.createElement("div");

        taskElement.className = "task";

        taskElement.innerHTML = `
            <div class="check ${task.completed ? "completed" : ""}"
                 data-index="${index}">
                ${task.completed ? "✓" : ""}
            </div>

            <div class="task-info">
                <strong>${task.title}</strong>
                <span>${task.subject} • ${task.duration}</span>
            </div>

            <span class="task-tag ${task.priority.toLowerCase()}">
                ${task.priority}
            </span>

            <button class="delete-task" data-index="${index}">
                🗑
            </button>
        `;

        taskList.appendChild(taskElement);
    });

    updateTaskCount();
}

taskList.addEventListener("click", (event) => {

    const checkbox = event.target.closest(".check");

    if (!checkbox) return;

    const index = checkbox.dataset.index;

    tasks[index].completed = !tasks[index].completed;

    saveTasks();
    renderTasks();
});

taskList.addEventListener("click", (event) => {

    const deleteButton = event.target.closest(".delete-task");

    if (!deleteButton) return;

    const index = deleteButton.dataset.index;

    tasks.splice(index, 1);

    saveTasks();
    renderTasks();
});


// ==========================================
// ADD TASK MODAL
// ==========================================

const taskModal = document.querySelector("#taskModal");
const closeModal = document.querySelector("#closeModal");
const saveTaskBtn = document.querySelector("#saveTaskBtn");

const taskTitle = document.querySelector("#taskTitle");
const taskSubject = document.querySelector("#taskSubject");
const taskDuration = document.querySelector("#taskDuration");
const taskPriority = document.querySelector("#taskPriority");

addTaskBtn.addEventListener("click", () => {

    taskModal.style.display = "flex";

    taskTitle.focus();
});

closeModal.addEventListener("click", () => {

    taskModal.style.display = "none";
});

taskModal.addEventListener("click", (event) => {

    if (event.target === taskModal) {
        taskModal.style.display = "none";
    }

});

saveTaskBtn.addEventListener("click", () => {

    const title = taskTitle.value.trim();
    const subject = taskSubject.value.trim();
    const duration = taskDuration.value.trim();
    const priority = taskPriority.value;

    if (!title || !subject || !duration) {

        alert("Please fill all task details.");
        return;
    }

    const newTask = {

        title: title,
        subject: subject,
        duration: duration + " min",
        priority: priority,
        completed: false
    };

    tasks.push(newTask);

    saveTasks();
    renderTasks();

    taskTitle.value = "";
    taskSubject.value = "";
    taskDuration.value = "";
    taskPriority.value = "Medium";

    taskModal.style.display = "none";
});

function updateTaskCount() {

    const completedTasks =
        tasks.filter(task => task.completed).length;

    const totalTasks = tasks.length;

    const taskStat =
        document.querySelector("#taskStat");

    if (taskStat) {

        taskStat.textContent =
            `${completedTasks} / ${totalTasks}`;
    }

    updateOverallProgress();
}


// ==========================================
// SIDEBAR NAVIGATION
// ==========================================

const navItems =
    document.querySelectorAll(".nav-item");

navItems.forEach((item) => {

    item.addEventListener("click", (event) => {

        event.preventDefault();

        navItems.forEach((nav) => {
            nav.classList.remove("active");
        });

        item.classList.add("active");

        if (item.textContent.includes("AI Practice")) {

            if (aiModal) {
                aiModal.style.display = "flex";
            }
        }

        if (item.id === "studySessionBtn") {

            if (studyTimer) {
                studyTimer.style.display = "flex";
            }
        }

    });

});


// ==========================================
// EXPLORE AI
// ==========================================

const exploreButton =
    document.querySelector(".upgrade-card button");

exploreButton.addEventListener("click", () => {

    aiModal.style.display = "flex";

});


// ==========================================
// NOTIFICATIONS
// ==========================================

const notificationButton =
    document.querySelector(".icon-button");

notificationButton.addEventListener("click", () => {

    alert(
        "🔔 Notifications\n\n" +
        "You have 2 learning reminders for today."
    );

});


// ==========================================
// STUDY SESSION TIMER
// ==========================================

const studySessionBtn =
    document.querySelector("#studySessionBtn");

const studyTimer =
    document.querySelector("#studyTimer");

const closeTimer =
    document.querySelector("#closeTimer");

const startTimer =
    document.querySelector("#startTimer");

const stopTimer =
    document.querySelector("#stopTimer");

const timerDisplay =
    document.querySelector("#timerDisplay");

const studyTimeDisplay =
    document.querySelector("#studyTime");

let timerInterval = null;
let sessionSeconds = 0;
let isTimerRunning = false;

let totalStudySeconds =
    Number(localStorage.getItem("nexvioraStudyTime")) || 0;

function formatStudyTime(seconds) {

    const hours =
        Math.floor(seconds / 3600);

    const minutes =
        Math.floor((seconds % 3600) / 60);

    return `${hours}h ${minutes}m`;
}

function updateStudyTime() {

    if (studyTimeDisplay) {

        studyTimeDisplay.textContent =
            formatStudyTime(totalStudySeconds);
    }
}

function updateTimerDisplay() {

    const hours =
        Math.floor(sessionSeconds / 3600);

    const minutes =
        Math.floor((sessionSeconds % 3600) / 60);

    const seconds =
        sessionSeconds % 60;

    timerDisplay.textContent =
        `${String(hours).padStart(2, "0")}:` +
        `${String(minutes).padStart(2, "0")}:` +
        `${String(seconds).padStart(2, "0")}`;
}

studySessionBtn.addEventListener("click", (event) => {

    event.preventDefault();

    studyTimer.style.display = "flex";
});

closeTimer.addEventListener("click", () => {

    studyTimer.style.display = "none";
});

startTimer.addEventListener("click", () => {

    if (isTimerRunning) return;

    isTimerRunning = true;

    timerInterval = setInterval(() => {

        sessionSeconds++;
        totalStudySeconds++;

        updateTimerDisplay();
        updateStudyTime();

        localStorage.setItem(
            "nexvioraStudyTime",
            totalStudySeconds
        );

    }, 1000);

});

stopTimer.addEventListener("click", () => {

    clearInterval(timerInterval);

    timerInterval = null;

    isTimerRunning = false;
});

// ==========================================
// AI PRACTICE HISTORY
// ==========================================

const PRACTICE_HISTORY_KEY = "nexvioraPracticeHistory";

let practiceHistory =
    JSON.parse(localStorage.getItem(PRACTICE_HISTORY_KEY)) || [];

const totalQuestions =
    document.querySelector("#totalQuestions");

const averageScore =
    document.querySelector("#averageScore");

const bestScore =
    document.querySelector("#bestScore");

const practiceHistoryList =
    document.querySelector("#practiceHistory");


// Save practice attempt
function savePracticeAttempt(attempt) {

    practiceHistory.unshift(attempt);

    localStorage.setItem(
        PRACTICE_HISTORY_KEY,
        JSON.stringify(practiceHistory)
    );

    updatePracticeStats();
    renderPracticeHistory();
    updateOverallProgress();
}


// Update statistics
function updatePracticeStats() {

    if (!practiceHistory.length) {

        totalQuestions.textContent = "0";
        averageScore.textContent = "0/10";
        bestScore.textContent = "0/10";

        return;
    }

    const scores =
        practiceHistory.map(item => Number(item.score));

    const total =
        scores.reduce((sum, score) => sum + score, 0);

    const average =
        total / scores.length;

    const best =
        Math.max(...scores);

    totalQuestions.textContent =
        practiceHistory.length;

    averageScore.textContent =
        `${average.toFixed(1)}/10`;

    bestScore.textContent =
        `${best}/10`;
}


// Render practice history
function renderPracticeHistory() {

    if (!practiceHistoryList) return;

    if (!practiceHistory.length) {

        practiceHistoryList.innerHTML = `
            <div class="empty-history">
                <span>🤖</span>
                <p>No practice attempts yet.</p>
                <small>
                    Complete an AI Practice question to see your results here.
                </small>
            </div>
        `;

        return;
    }

    practiceHistoryList.innerHTML = "";

    practiceHistory.forEach((attempt) => {

        const historyItem =
            document.createElement("div");

        historyItem.className = "history-item";

        historyItem.innerHTML = `
            <div class="history-main">

                <div class="history-info">

                    <strong>
                        ${attempt.topic}
                    </strong>

                    <span>
                        ${attempt.subject} • ${attempt.level}
                    </span>

                    <small>
                        ${attempt.date}
                    </small>

                </div>

                <div class="history-score">
                    <strong>
                        ${attempt.score}/10
                    </strong>

                    <span>
                        ${attempt.verdict}
                    </span>
                </div>

            </div>

            <div class="history-question">
                <strong>Question:</strong>
                <p>${attempt.question}</p>
            </div>

            <div class="history-answer">
                <strong>Your Answer:</strong>
                <p>${attempt.answer}</p>
            </div>

            <div class="history-feedback">
                <strong>AI Feedback:</strong>
                <p>${attempt.feedback}</p>
            </div>
        `;

        practiceHistoryList.appendChild(historyItem);
    });
}
// ==========================================
// AI PRACTICE
// ==========================================

const aiPracticeBtn =
    document.querySelector("#aiPracticeBtn");

const aiModal =
    document.querySelector("#aiModal");

const closeAiModal =
    document.querySelector("#closeAiModal");

const generateQuestion =
    document.querySelector("#generateQuestion");

const questionArea =
    document.querySelector("#questionArea");

const questionText =
    document.querySelector("#questionText");

const aiAnswer =
    document.querySelector("#aiAnswer");

const checkAnswer =
    document.querySelector("#checkAnswer");

const aiResult =
    document.querySelector("#aiResult");


// ==========================================
// LEVEL BASED SUBJECT SYSTEM
// ==========================================

const aiLevel =
    document.querySelector("#aiLevel");

const aiSubject =
    document.querySelector("#aiSubject");

const subjectsByLevel = {

    "Class 6-8": [
        "Mathematics",
        "Science",
        "English",
        "Social Science",
        "Computer"
    ],

    "Class 9-10": [
        "Mathematics",
        "Science",
        "English",
        "Social Science",
        "Computer"
    ],

    "Class 11-12": [
        "Physics",
        "Chemistry",
        "Mathematics",
        "Biology",
        "Computer Science",
        "English"
    ],

    "BTech": [
        "Data Structures",
        "C++",
        "Python",
        "DBMS",
        "Operating Systems",
        "Computer Networks",
        "Web Development",
        "Digital Electronics"
    ]
};


// ==========================================
// UPDATE SUBJECTS BASED ON LEVEL
// ==========================================

aiLevel.addEventListener("change", () => {

    const selectedLevel =
        aiLevel.value;

    aiSubject.innerHTML =
        '<option value="">Select Subject</option>';

    if (!selectedLevel) return;

    subjectsByLevel[selectedLevel].forEach((subject) => {

        const option =
            document.createElement("option");

        option.value = subject;
        option.textContent = subject;

        aiSubject.appendChild(option);
    });

});


// ==========================================
// OPEN AI PRACTICE
// ==========================================

aiPracticeBtn.addEventListener("click", () => {

    aiModal.style.display = "flex";

});


// ==========================================
// CLOSE AI PRACTICE
// ==========================================

closeAiModal.addEventListener("click", () => {

    aiModal.style.display = "none";

});

aiModal.addEventListener("click", (event) => {

    if (event.target === aiModal) {

        aiModal.style.display = "none";
    }

});


// ==========================================
// GENERATE AI QUESTION
// ==========================================

generateQuestion.addEventListener("click", async () => {

    const level =
        aiLevel.value;

    const subject =
        aiSubject.value;

    const topic =
        document.querySelector("#aiTopic").value.trim();


    if (!level || !subject || !topic) {

        alert(
            "Please select your level, subject and enter a topic."
        );

        return;
    }


    questionArea.style.display = "block";

    aiAnswer.value = "";

    aiResult.textContent = "";

    questionText.textContent =
        "🤖 Nexviora AI is generating your question...";


    try {

        const response =
            await fetch("/api/ask", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    question:
                        `Generate ONE practice question for a student.

Education Level: ${level}
Subject: ${subject}
Topic: ${topic}

Requirements:
- Ask only one question.
- Make the question appropriate for the student's education level.
- Use language suitable for the student's level.
- Do not give the answer.
- Return only the question.`
                })

            });


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.error || "AI request failed"
            );
        }


        questionText.textContent =
            data.answer;


    } catch (error) {

        console.error("AI Error:", error);

        questionText.textContent =
            "❌ AI question generate nahi ho paaya. Please try again.";
    }

});


// ==========================================
// CHECK ANSWER - AI EVALUATION
// ==========================================

checkAnswer.addEventListener("click", async () => {

    const answer = aiAnswer.value.trim();
    const question = questionText.textContent;
    const level = aiLevel.value;
    const subject = aiSubject.value;
    const topic = document.querySelector("#aiTopic").value.trim();

    if (!answer) {
        alert("Please write your answer first.");
        return;
    }

    if (!question || question.includes("generating")) {
        alert("Please generate a question first.");
        return;
    }

    checkAnswer.disabled = true;

    aiResult.textContent =
        "🤖 Nexviora AI is checking your answer...";

    try {

        const response = await fetch("/api/evaluate", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                question: question,
                answer: answer,
                level: level,
                subject: subject,
                topic: topic
            })

        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.error || "Evaluation failed"
            );
        }


        // Show result
        aiResult.innerHTML = `
            <strong>Score: ${data.score}/10</strong>
            <br><br>
            <strong>${data.verdict}</strong>
            <br><br>
            ${data.feedback}
        `;


        // ==========================================
        // SAVE PRACTICE ATTEMPT
        // ==========================================

        const attempt = {

            date: new Date().toLocaleString(),

            level: level,

            subject: subject,

            topic: topic,

            question: question,

            answer: answer,

            score: Number(data.score),

            verdict: data.verdict,

            feedback: data.feedback

        };


        savePracticeAttempt(attempt);

        console.log(
            "Practice attempt saved successfully:",
            attempt
        );


    } catch (error) {

        console.error(
            "Evaluation Error:",
            error
        );

        aiResult.textContent =
            "❌ Answer evaluate nahi ho paaya. Please try again.";

    } finally {

        checkAnswer.disabled = false;

    }

});
// ==========================================
// MY SUBJECTS SYSTEM
// ==========================================

const SUBJECTS_KEY = "nexvioraSubjects";


let subjects =
    JSON.parse(localStorage.getItem(SUBJECTS_KEY)) || [

        {
            name: "Data Structures",
            short: "DS",
            completed: 12,
            total: 18,
            color: "purple-bg"
        },

        {
            name: "Digital Electronics",
            short: "DE",
            completed: 9,
            total: 14,
            color: "blue-bg"
        },

        {
            name: "Python",
            short: "PY",
            completed: 15,
            total: 18,
            color: "green-bg"
        }

    ];


const subjectsList =
    document.querySelector("#subjectsList");

const manageSubjectsBtn =
    document.querySelector("#manageSubjectsBtn");

const subjectModal =
    document.querySelector("#subjectModal");

const closeSubjectModal =
    document.querySelector("#closeSubjectModal");

const subjectName =
    document.querySelector("#subjectName");

const completedTopics =
    document.querySelector("#completedTopics");

const totalTopics =
    document.querySelector("#totalTopics");

const saveSubjectBtn =
    document.querySelector("#saveSubjectBtn");


// Save subjects
function saveSubjects() {

    localStorage.setItem(
        SUBJECTS_KEY,
        JSON.stringify(subjects)
    );
}


// Get short name
function getSubjectShortName(name) {

    const words =
        name.trim().split(/\s+/);

    if (words.length === 1) {

        return words[0]
            .substring(0, 2)
            .toUpperCase();
    }

    return words
        .map(word => word[0])
        .join("")
        .substring(0, 2)
        .toUpperCase();
}


// Get subject color
function getSubjectColor(index) {

    const colors = [
        "purple-bg",
        "blue-bg",
        "green-bg"
    ];

    return colors[index % colors.length];
}


// Render subjects
function renderSubjects() {

    if (!subjectsList) return;

    subjectsList.innerHTML = "";


    subjects.forEach((subject, index) => {

        const percentage =
            subject.total > 0
                ? Math.round(
                    (subject.completed / subject.total) * 100
                )
                : 0;


        const subjectElement =
            document.createElement("div");

        subjectElement.className =
            "subject";


        subjectElement.innerHTML = `

            <div class="subject-icon ${subject.color}">
                ${subject.short}
            </div>


            <div class="subject-info">

                <strong>
                    ${subject.name}
                </strong>

                <span>
                    ${subject.completed} / ${subject.total} topics
                </span>


                <div class="progress-line">

                    <div
                        style="width: ${percentage}%"
                    ></div>

                </div>

            </div>


            <strong>
                ${percentage}%
            </strong>


            <button
                class="delete-subject"
                data-index="${index}"
            >
                🗑
            </button>

        `;


        subjectsList.appendChild(
            subjectElement
        );

    });

}


// Open modal
manageSubjectsBtn.addEventListener(
    "click",
    () => {

        subjectModal.style.display =
            "flex";

        subjectName.focus();

    }
);


// Close modal
closeSubjectModal.addEventListener(
    "click",
    () => {

        subjectModal.style.display =
            "none";

    }
);


// Close on outside click
subjectModal.addEventListener(
    "click",
    (event) => {

        if (event.target === subjectModal) {

            subjectModal.style.display =
                "none";
        }

    }
);


// Add subject
saveSubjectBtn.addEventListener(
    "click",
    () => {

        const name =
            subjectName.value.trim();

        const completed =
            Number(completedTopics.value);

        const total =
            Number(totalTopics.value);


        if (!name) {

            alert(
                "Please enter subject name."
            );

            return;
        }


        if (
            Number.isNaN(completed) ||
            Number.isNaN(total) ||
            total <= 0 ||
            completed < 0
        ) {

            alert(
                "Please enter valid topic numbers."
            );

            return;
        }


        if (completed > total) {

            alert(
                "Completed topics cannot be greater than total topics."
            );

            return;
        }


        const newSubject = {

            name: name,

            short:
                getSubjectShortName(name),

            completed: completed,

            total: total,

            color:
                getSubjectColor(
                    subjects.length
                )

        };


        subjects.push(
            newSubject
        );


        saveSubjects();

        renderSubjects();


        subjectName.value = "";

        completedTopics.value = "";

        totalTopics.value = "";


        subjectModal.style.display =
            "none";

    }
);


// Delete subject
subjectsList.addEventListener(
    "click",
    (event) => {

        const deleteButton =
            event.target.closest(
                ".delete-subject"
            );


        if (!deleteButton) return;


        const index =
            Number(
                deleteButton.dataset.index
            );


        subjects.splice(index, 1);


        saveSubjects();

        renderSubjects();

    }
);


// ==========================================
// INITIAL LOAD
// ==========================================

renderTasks();
renderSubjects();

updateStudyTime();

updateTimerDisplay();
updatePracticeStats();
renderPracticeHistory();
updateOverallProgress();

console.log(
    "Nexviora loaded successfully 🚀"
);

/* NEXVIORA JARVIS: TEXT + IMAGE + VOICE */
(() => {
    const style = document.createElement("style");
    style.textContent = `
      #jarvisPanel {
        position:fixed; right:20px; bottom:85px; z-index:9999;
        width:min(360px,calc(100vw - 28px)); height:460px;
        background:white; color:#222; border:1px solid #ddd;
        border-radius:16px; box-shadow:0 8px 35px #0002;
        display:none; flex-direction:column; overflow:hidden;
        font:14px Arial,sans-serif;
      }
      #jarvisHead {background:#5636c9;color:white;padding:15px;
        display:flex;justify-content:space-between;font-weight:bold}
      #jarvisMessages {flex:1;overflow:auto;padding:12px}
      .jarvisBubble {padding:10px;margin:8px 0;border-radius:10px;
        background:#f0edff;white-space:pre-wrap;overflow-wrap:anywhere}
      .jarvisUser {background:#e7f5e9}
      #jarvisControls {padding:10px;display:grid;gap:7px;
        border-top:1px solid #eee}
      #jarvisControls input[type=text] {width:100%;box-sizing:border-box;
        padding:10px;border:1px solid #ccc;border-radius:8px}
      #jarvisControls button,#jarvisToggle {
        padding:10px;border:0;border-radius:8px;cursor:pointer}
      #jarvisToggle {position:fixed;right:20px;bottom:20px;z-index:9998;
        background:#5636c9;color:white;font-weight:bold}
      #jarvisPreview {max-width:100%;max-height:100px;display:none}
    `;
    document.head.appendChild(style);

    const toggle = document.createElement("button");
    toggle.id = "jarvisToggle";
    toggle.textContent = "🤖 Ask JARVIS";
    document.body.appendChild(toggle);

    const panel = document.createElement("section");
    panel.id = "jarvisPanel";
    panel.innerHTML = `
      <div id="jarvisHead">
        <span>🤖 Nexviora JARVIS</span>
        <button id="jarvisClose" aria-label="Close">✕</button>
      </div>
      <div id="jarvisMessages" aria-live="polite">
        <div class="jarvisBubble">Hi! Type, speak, or upload a question photo.</div>
      </div>
      <div id="jarvisControls">
        <img id="jarvisPreview" alt="Selected question photo">
        <input id="jarvisInput" type="text" placeholder="Ask anything...">
        <input id="jarvisFile" type="file" accept="image/png,image/jpeg,image/webp" hidden>
        <div style="display:flex;gap:6px;flex-wrap:wrap">
          <button id="jarvisSend">Send</button>
          <button id="jarvisMic">🎙️ Speak</button>
          <button id="jarvisPhoto">📷 Photo</button>
          <button id="jarvisSpeak">🔊 Read answers: ON</button>
        </div>
        <small>Voice requires microphone permission. Image AI may require a paid model.</small>
      </div>`;
    document.body.appendChild(panel);

    const $ = id => document.getElementById(id);
    const messages = $("jarvisMessages");
    const input = $("jarvisInput");
    const fileInput = $("jarvisFile");
    const preview = $("jarvisPreview");
    let imageData = null;
    let speakAnswers = true;
    let busy = false;

    toggle.onclick = () => {
        panel.style.display = "flex";
        toggle.style.display = "none";
        input.focus();
    };
    $("jarvisClose").onclick = () => {
        panel.style.display = "none";
        toggle.style.display = "block";
    };

    function bubble(text, isUser = false) {
        const el = document.createElement("div");
        el.className = "jarvisBubble" + (isUser ? " jarvisUser" : "");
        el.textContent = text;
        messages.appendChild(el);
        messages.scrollTop = messages.scrollHeight;
        return el;
    }

    fileInput.onchange = () => {
        const file = fileInput.files[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            bubble("Please choose an image smaller than 5 MB.");
            fileInput.value = "";
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            imageData = reader.result;
            preview.src = imageData;
            preview.style.display = "block";
        };
        reader.readAsDataURL(file);
    };

    $("jarvisPhoto").onclick = () => fileInput.click();

    $("jarvisSpeak").onclick = () => {
        speakAnswers = !speakAnswers;
        $("jarvisSpeak").textContent =
            "🔊 Read answers: " + (speakAnswers ? "ON" : "OFF");
        if (!speakAnswers) speechSynthesis.cancel();
    };

    async function sendMessage(textFromVoice = "") {
        const message = (textFromVoice || input.value).trim();
        if (busy || (!message && !imageData)) return;

        busy = true;
        $("jarvisSend").disabled = true;

        if (message) bubble(message, true);
        if (imageData) bubble("📷 Image attached", true);

        input.value = "";
        const attachedImage = imageData;
        imageData = null;
        preview.removeAttribute("src");
        preview.style.display = "none";
        fileInput.value = "";

        const loading = bubble("JARVIS is thinking...");

        try {
            const response = await fetch("/api/assistant", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message,
                    imageData: attachedImage
                })
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Request failed");

            loading.textContent = data.answer;

            if (speakAnswers && "speechSynthesis" in window) {
                speechSynthesis.cancel();
                const utterance = new SpeechSynthesisUtterance(data.answer);
                utterance.lang = "hi-IN";
                speechSynthesis.speak(utterance);
            }
        } catch (error) {
            loading.textContent = "Error: " + error.message;
        } finally {
            busy = false;
            $("jarvisSend").disabled = false;
            input.focus();
        }
    }

    $("jarvisSend").onclick = () => sendMessage();
    input.addEventListener("keydown", e => {
        if (e.key === "Enter") sendMessage();
    });


const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

let recognition = null;
let isListening = false;

$("jarvisMic").onclick = () => {
    if (!SpeechRecognition) {
        bubble("Voice input is not supported. Please use updated Chrome.");
        return;
    }

    if (isListening) {
        recognition.stop();
        return;
    }

    recognition = new SpeechRecognition();
    recognition.lang = "en-IN"; // English voice; use "hi-IN" for Hindi
    recognition.interimResults = true;
    recognition.continuous = false;
    recognition.maxAlternatives = 1;

    let finalTranscript = "";

    recognition.onstart = () => {
        isListening = true;
        $("jarvisMic").textContent = "🛑 Stop Listening";
    };

    recognition.onresult = (event) => {
        let interimTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;

            if (event.results[i].isFinal) {
                finalTranscript += transcript + " ";
            } else {
                interimTranscript += transcript;
            }
        }

        input.value = (finalTranscript + interimTranscript).trim();
    };

    recognition.onerror = (event) => {
        if (event.error === "no-speech") {
            bubble("Voice not detected. Please speak after pressing the mic.");
        } else if (event.error === "not-allowed") {
            bubble("Microphone blocked. Allow microphone access in Chrome settings.");
        } else {
            bubble("Voice error: " + event.error);
        }
    };

    recognition.onend = () => {
        isListening = false;
        $("jarvisMic").textContent = "🎙️ Speak";

        if (finalTranscript.trim()) {
            input.value = finalTranscript.trim();
            sendMessage();
        }
    };

    try {
        recognition.start();
    } catch (error) {
        isListening = false;
        $("jarvisMic").textContent = "🎙️ Speak";
        bubble("Could not start microphone. Please try again.");
    }
};
})();
function updateOverallProgress() {
    // Progress update temporarily skipped
}