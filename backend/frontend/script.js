// ==========================================
// NEXVIORA - TASK SYSTEM
// ==========================================

const taskList = document.querySelector(".task-list");
const addTaskBtn = document.querySelector("#addTaskBtn");

// ---------- LOAD TASKS ----------

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

// ---------- SAVE TASKS ----------

function saveTasks() {
    localStorage.setItem(
        "nexvioraTasks",
        JSON.stringify(tasks)
    );
}

// ---------- DISPLAY TASKS ----------

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

// ---------- COMPLETE / UNCOMPLETE TASK ----------

taskList.addEventListener("click", (event) => {

    const checkbox = event.target.closest(".check");

    if (!checkbox) return;

    const index = checkbox.dataset.index;

    tasks[index].completed = !tasks[index].completed;

    saveTasks();
    renderTasks();
});

// ---------- DELETE TASK ----------

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

// ---------- OPEN MODAL ----------

addTaskBtn.addEventListener("click", () => {

    taskModal.style.display = "flex";

    taskTitle.focus();
});

// ---------- CLOSE MODAL ----------

closeModal.addEventListener("click", () => {

    taskModal.style.display = "none";
});

// ---------- CLOSE OUTSIDE ----------

taskModal.addEventListener("click", (event) => {

    if (event.target === taskModal) {
        taskModal.style.display = "none";
    }

});

// ---------- SAVE NEW TASK ----------

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

    // CLEAR FORM

    taskTitle.value = "";
    taskSubject.value = "";
    taskDuration.value = "";
    taskPriority.value = "Medium";

    // CLOSE MODAL

    taskModal.style.display = "none";
});

// ---------- TASK COUNT ----------

function updateTaskCount() {

    const completedTasks =
        tasks.filter(task => task.completed).length;

    const totalTasks = tasks.length;

    const taskStat =
        document.querySelector(".stat-card:nth-child(2) h2");

    if (taskStat) {

        taskStat.textContent =
            `${completedTasks} / ${totalTasks}`;
    }
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

        // AI Practice sidebar button
        if (item.textContent.includes("AI Practice")) {

            if (aiModal) {
                aiModal.style.display = "flex";
            }
        }

        // Study Session sidebar button
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

// ---------- LOAD SAVED STUDY TIME ----------

let totalStudySeconds =
    Number(localStorage.getItem("nexvioraStudyTime")) || 0;

// ---------- FORMAT STUDY TIME ----------

function formatStudyTime(seconds) {

    const hours =
        Math.floor(seconds / 3600);

    const minutes =
        Math.floor((seconds % 3600) / 60);

    return `${hours}h ${minutes}m`;
}

// ---------- UPDATE DASHBOARD STUDY TIME ----------

function updateStudyTime() {

    if (studyTimeDisplay) {

        studyTimeDisplay.textContent =
            formatStudyTime(totalStudySeconds);
    }
}

// ---------- UPDATE TIMER DISPLAY ----------

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

// ---------- OPEN TIMER ----------

studySessionBtn.addEventListener("click", (event) => {

    event.preventDefault();

    studyTimer.style.display = "flex";
});

// ---------- CLOSE TIMER ----------

closeTimer.addEventListener("click", () => {

    studyTimer.style.display = "none";
});

// ---------- START TIMER ----------

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

// ---------- STOP TIMER ----------

stopTimer.addEventListener("click", () => {

    clearInterval(timerInterval);

    timerInterval = null;

    isTimerRunning = false;
});

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

// ---------- OPEN AI PRACTICE ----------

aiPracticeBtn.addEventListener("click", () => {

    aiModal.style.display = "flex";
});

// ---------- CLOSE AI PRACTICE ----------

closeAiModal.addEventListener("click", () => {

    aiModal.style.display = "none";
});

// ---------- CLOSE AI MODAL OUTSIDE ----------

aiModal.addEventListener("click", (event) => {

    if (event.target === aiModal) {

        aiModal.style.display = "none";
    }

});

// ---------- GENERATE QUESTION ----------

// ---------- GENERATE QUESTION ----------

generateQuestion.addEventListener("click", async () => {

    const subject =
        document.querySelector("#aiSubject").value;

    const topic =
        document.querySelector("#aiTopic").value.trim();

    if (!subject || !topic) {

        alert(
            "Please select a subject and enter a topic."
        );

        return;
    }

    questionArea.style.display = "block";

    aiAnswer.value = "";
    aiResult.textContent = "";

    questionText.textContent = "🤖 Nexviora AI is generating your question...";

    try {

        const response = await fetch("/api/ask", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                question:
                    `Generate ONE practice question for a student.

Subject: ${subject}
Topic: ${topic}

Requirements:
- Ask only one question.
- Keep it suitable for a beginner/intermediate college student.
- Do not give the answer.
- Return only the question.`
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "AI request failed");
        }

        questionText.textContent = data.answer;

    } catch (error) {

        console.error("AI Error:", error);

        questionText.textContent =
            "❌ AI question generate nahi ho paaya. Please try again.";

    }

});

// ---------- CHECK ANSWER ----------

checkAnswer.addEventListener("click", () => {

    const answer =
        aiAnswer.value.trim();

    if (!answer) {

        alert("Please write your answer first.");

        return;
    }

    aiResult.textContent =
        "✅ Answer submitted! Nexviora AI will evaluate your answer in the next upgrade.";

});

// ==========================================
// INITIAL LOAD
// ==========================================

renderTasks();

updateStudyTime();

updateTimerDisplay();

console.log(
    "Nexviora loaded successfully 🚀"
);