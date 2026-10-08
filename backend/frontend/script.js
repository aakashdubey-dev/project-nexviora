// ==========================================
// NEXVIORA - TASK SYSTEM
// ==========================================

const taskList = document.querySelector(".task-list");
const addTaskBtn = document.querySelector("#addTaskBtn");

let tasks = JSON.parse(localStorage.getItem("nexvioraTasks")) || [
  {
    name: "DSA",
    duration: 45,
    priority: "High",
    completed: false
  },
  {
    name: "Digital Electronics",
    duration: 30,
    priority: "Medium",
    completed: true
  },
  {
    name: "Python Functions",
    duration: 40,
    priority: "Medium",
    completed: false
  },
  {
    name: "DBMS Notes",
    duration: 25,
    priority: "Low",
    completed: false
  }
];

function saveTasks() {
  localStorage.setItem("nexvioraTasks", JSON.stringify(tasks));
}

function renderTasks() {
  if (!taskList) return;

  taskList.innerHTML = "";

  if (tasks.length === 0) {
    taskList.innerHTML = `
      <div class="empty-state">
        <p>No tasks added yet.</p>
      </div>
    `;
    updateTaskCount();
    updateOverallProgress();
    return;
  }

  tasks.forEach((task, index) => {
    const taskItem = document.createElement("div");
    taskItem.className = `task-item ${task.completed ? "completed" : ""}`;

    taskItem.innerHTML = `
      <div class="task-left">
        <input
          type="checkbox"
          class="task-checkbox"
          data-index="${index}"
          ${task.completed ? "checked" : ""}
        >

        <div class="task-info">
          <h4>${task.name}</h4>
          <span>${task.duration} min</span>
        </div>
      </div>

      <div class="task-right">
        <span class="priority-badge ${task.priority.toLowerCase()}">
          ${task.priority}
        </span>

        <button
          class="delete-task-btn"
          data-index="${index}"
          title="Delete task"
        >
          ×
        </button>
      </div>
    `;

    taskList.appendChild(taskItem);
  });

  updateTaskCount();
  updateOverallProgress();
}

function updateTaskCount() {
  const taskCount = document.querySelector("#taskCount");

  if (!taskCount) return;

  const completed = tasks.filter(task => task.completed).length;

  taskCount.textContent = `${completed}/${tasks.length}`;
}

function addTask(name, duration, priority) {
  if (!name) return;

  tasks.push({
    name,
    duration: Number(duration) || 30,
    priority: priority || "Medium",
    completed: false
  });

  saveTasks();
  renderTasks();
}

if (taskList) {
  taskList.addEventListener("change", (event) => {
    if (!event.target.classList.contains("task-checkbox")) return;

    const index = Number(event.target.dataset.index);

    if (!tasks[index]) return;

    tasks[index].completed = event.target.checked;

    saveTasks();
    renderTasks();
  });

  taskList.addEventListener("click", (event) => {
    const deleteButton = event.target.closest(".delete-task-btn");

    if (!deleteButton) return;

    const index = Number(deleteButton.dataset.index);

    if (!tasks[index]) return;

    tasks.splice(index, 1);

    saveTasks();
    renderTasks();
  });
}

// ==========================================
// ADD TASK MODAL
// ==========================================

const taskModal = document.querySelector("#taskModal");
const closeTaskModal = document.querySelector("#closeTaskModal");
const cancelTaskBtn = document.querySelector("#cancelTaskBtn");
const taskForm = document.querySelector("#taskForm");

function openTaskModal() {
  if (!taskModal) return;

  taskModal.classList.add("active");
}

function closeTaskModalFn() {
  if (!taskModal) return;

  taskModal.classList.remove("active");

  if (taskForm) {
    taskForm.reset();
  }
}

if (addTaskBtn) {
  addTaskBtn.addEventListener("click", openTaskModal);
}

if (closeTaskModal) {
  closeTaskModal.addEventListener("click", closeTaskModalFn);
}

if (cancelTaskBtn) {
  cancelTaskBtn.addEventListener("click", closeTaskModalFn);
}

if (taskModal) {
  taskModal.addEventListener("click", (event) => {
    if (event.target === taskModal) {
      closeTaskModalFn();
    }
  });
}

if (taskForm) {
  taskForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const taskNameInput = taskForm.querySelector("#taskName");
    const taskDurationInput = taskForm.querySelector("#taskDuration");
    const taskPriorityInput = taskForm.querySelector("#taskPriority");

    const name = taskNameInput ? taskNameInput.value.trim() : "";
    const duration = taskDurationInput ? taskDurationInput.value : 30;
    const priority = taskPriorityInput ? taskPriorityInput.value : "Medium";

    if (!name) return;

    addTask(name, duration, priority);
    closeTaskModalFn();
  });
}

// ==========================================
// INITIAL TASK RENDER
// ==========================================

renderTasks();

// ==========================================
// STUDY TIMER
// ==========================================

let timerInterval = null;
let timerSeconds = 25 * 60;
let timerRunning = false;

const timerDisplay = document.querySelector("#timerDisplay");
const startTimerBtn = document.querySelector("#startTimerBtn");
const pauseTimerBtn = document.querySelector("#pauseTimerBtn");
const resetTimerBtn = document.querySelector("#resetTimerBtn");

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds
  ).padStart(2, "0")}`;
}

function updateTimerDisplay() {
  if (!timerDisplay) return;

  timerDisplay.textContent = formatTime(timerSeconds);
}

function startTimer() {
  if (timerRunning) return;

  timerRunning = true;

  timerInterval = setInterval(() => {
    if (timerSeconds > 0) {
      timerSeconds--;
      updateTimerDisplay();
    } else {
      pauseTimer();
      recordStudySession(25);
    }
  }, 1000);
}

function pauseTimer() {
  timerRunning = false;

  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

function resetTimer() {
  pauseTimer();

  timerSeconds = 25 * 60;

  updateTimerDisplay();
}

if (startTimerBtn) {
  startTimerBtn.addEventListener("click", startTimer);
}

if (pauseTimerBtn) {
  pauseTimerBtn.addEventListener("click", pauseTimer);
}

if (resetTimerBtn) {
  resetTimerBtn.addEventListener("click", resetTimer);
}

updateTimerDisplay();

// ==========================================
// STUDY SESSION STORAGE
// ==========================================

let studySessions =
  JSON.parse(localStorage.getItem("nexvioraStudySessions")) || [];

function saveStudySessions() {
  localStorage.setItem(
    "nexvioraStudySessions",
    JSON.stringify(studySessions)
  );
}

function recordStudySession(minutes) {
  studySessions.push({
    date: new Date().toISOString(),
    minutes: Number(minutes) || 0
  });

  saveStudySessions();
  updateStudyTime();
}

function getTotalStudyMinutes() {
  return studySessions.reduce(
    (total, session) => total + Number(session.minutes || 0),
    0
  );
}

function updateStudyTime() {
  const studyTimeElements = document.querySelectorAll(".study-time-value");

  const totalMinutes = getTotalStudyMinutes();

  studyTimeElements.forEach((element) => {
    if (totalMinutes >= 60) {
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;

      element.textContent = `${hours}h ${minutes}m`;
    } else {
      element.textContent = `${totalMinutes}m`;
    }
  });
}

updateStudyTime();

// ==========================================
// EXPLORE AI BUTTON
// ==========================================

const exploreAiBtn = document.querySelector("#exploreAiBtn");

if (exploreAiBtn) {
  exploreAiBtn.addEventListener("click", () => {
    const aiPracticeBtn = document.querySelector("#aiPracticeBtn");

    if (aiPracticeBtn) {
      aiPracticeBtn.click();
    }
  });
}

// ==========================================
// NOTIFICATIONS
// ==========================================

const notificationBtn = document.querySelector("#notificationBtn");
const notificationPanel = document.querySelector("#notificationPanel");

if (notificationBtn && notificationPanel) {
  notificationBtn.addEventListener("click", () => {
    notificationPanel.classList.toggle("active");
  });
}

// ==========================================
// SUBJECT SYSTEM
// ==========================================

let subjects =
  JSON.parse(localStorage.getItem("nexvioraSubjects")) || [
    {
      name: "Data Structures & Algorithms",
      shortName: "DSA",
      progress: 68
    },
    {
      name: "Digital Electronics",
      shortName: "DE",
      progress: 52
    },
    {
      name: "Python",
      shortName: "Python",
      progress: 74
    },
    {
      name: "Database Management System",
      shortName: "DBMS",
      progress: 41
    }
  ];

function saveSubjects() {
  localStorage.setItem("nexvioraSubjects", JSON.stringify(subjects));
}

function renderSubjects() {
  const subjectsList = document.querySelector("#subjectsList");

  if (!subjectsList) return;

  subjectsList.innerHTML = "";

  if (subjects.length === 0) {
    subjectsList.innerHTML = `
      <div class="empty-state">
        <p>No subjects added yet.</p>
      </div>
    `;

    return;
  }

  subjects.forEach((subject, index) => {
    const subjectCard = document.createElement("div");

    subjectCard.className = "subject-card";

    subjectCard.innerHTML = `
      <div class="subject-card-header">
        <div>
          <span class="subject-short">${subject.shortName}</span>
          <h4>${subject.name}</h4>
        </div>

        <button
          class="delete-subject-btn"
          data-index="${index}"
          title="Delete subject"
        >
          ×
        </button>
      </div>

      <div class="progress-row">
        <span>Progress</span>
        <strong>${subject.progress}%</strong>
      </div>

      <div class="progress-bar">
        <div
          class="progress-fill"
          style="width:${subject.progress}%"
        ></div>
      </div>
    `;

    subjectsList.appendChild(subjectCard);
  });
}

renderSubjects();

// ==========================================
// SUBJECT MODAL
// ==========================================

const manageSubjectsBtn = document.querySelector("#manageSubjectsBtn");
const subjectModal = document.querySelector("#subjectModal");
const closeSubjectModal = document.querySelector("#closeSubjectModal");
const subjectForm = document.querySelector("#subjectForm");

function openSubjectModal() {
  if (!subjectModal) return;

  subjectModal.classList.add("active");
}

function closeSubjectModalFn() {
  if (!subjectModal) return;

  subjectModal.classList.remove("active");

  if (subjectForm) {
    subjectForm.reset();
  }
}

if (manageSubjectsBtn) {
  manageSubjectsBtn.addEventListener("click", openSubjectModal);
}

if (closeSubjectModal) {
  closeSubjectModal.addEventListener(
    "click",
    closeSubjectModalFn
  );
}

if (subjectModal) {
  subjectModal.addEventListener("click", (event) => {
    if (event.target === subjectModal) {
      closeSubjectModalFn();
    }
  });
}

if (subjectForm) {
  subjectForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const nameInput = subjectForm.querySelector("#subjectName");
    const shortNameInput =
      subjectForm.querySelector("#subjectShortName");
    const progressInput =
      subjectForm.querySelector("#subjectProgress");

    const name = nameInput ? nameInput.value.trim() : "";
    const shortName = shortNameInput
      ? shortNameInput.value.trim()
      : "";
    const progress = progressInput
      ? Number(progressInput.value) || 0
      : 0;

    if (!name) return;

    subjects.push({
      name,
      shortName: shortName || name.substring(0, 3).toUpperCase(),
      progress: Math.max(0, Math.min(100, progress))
    });

    saveSubjects();
    renderSubjects();

    closeSubjectModalFn();
  });
}

const subjectsListElement = document.querySelector("#subjectsList");

if (subjectsListElement) {
  subjectsListElement.addEventListener("click", (event) => {
    const deleteButton = event.target.closest(
      ".delete-subject-btn"
    );

    if (!deleteButton) return;

    const index = Number(deleteButton.dataset.index);

    if (!subjects[index]) return;

    subjects.splice(index, 1);

    saveSubjects();
    renderSubjects();
  });
}

// ==========================================
// AI PRACTICE SYSTEM
// ==========================================

let practiceHistory =
  JSON.parse(localStorage.getItem("nexvioraPracticeHistory")) ||
  [];

function savePracticeHistory() {
  localStorage.setItem(
    "nexvioraPracticeHistory",
    JSON.stringify(practiceHistory)
  );
}

function addPracticeResult(topic, score) {
  practiceHistory.push({
    topic: topic || "General",
    score: Number(score) || 0,
    date: new Date().toISOString()
  });

  savePracticeHistory();
  updatePracticeStats();
  renderPracticeHistory();
  updateOverallProgress();
}

function getAveragePracticeScore() {
  if (practiceHistory.length === 0) return 0;

  const total = practiceHistory.reduce(
    (sum, item) => sum + Number(item.score || 0),
    0
  );

  return Math.round((total / practiceHistory.length) * 10) / 10;
}

function getBestPracticeScore() {
  if (practiceHistory.length === 0) return 0;

  return Math.max(
    ...practiceHistory.map((item) =>
      Number(item.score || 0)
    )
  );
}

function updatePracticeStats() {
  const totalQuestions =
    document.querySelector("#totalQuestions");

  const averageScore =
    document.querySelector("#averageScore");

  const bestScore =
    document.querySelector("#bestScore");

  if (totalQuestions) {
    totalQuestions.textContent = practiceHistory.length;
  }

  if (averageScore) {
    averageScore.textContent =
      getAveragePracticeScore();
  }

  if (bestScore) {
    bestScore.textContent =
      getBestPracticeScore();
  }
}

function renderPracticeHistory() {
  const historyContainer =
    document.querySelector("#practiceHistory");

  if (!historyContainer) return;

  historyContainer.innerHTML = "";

  if (practiceHistory.length === 0) {
    historyContainer.innerHTML = `
      <div class="empty-state">
        <p>No AI practice history yet.</p>
      </div>
    `;

    return;
  }

  practiceHistory
    .slice()
    .reverse()
    .forEach((item) => {
      const historyItem =
        document.createElement("div");

      historyItem.className =
        "practice-history-item";

      const date = new Date(item.date);

      historyItem.innerHTML = `
        <div>
          <strong>${item.topic}</strong>
          <span>${date.toLocaleDateString()}</span>
        </div>

        <strong>${item.score}/10</strong>
      `;

      historyContainer.appendChild(historyItem);
    });
}

updatePracticeStats();
renderPracticeHistory();

// ==========================================
// AI PRACTICE MODAL
// ==========================================

const aiPracticeBtn =
  document.querySelector("#aiPracticeBtn");

const aiPracticeModal =
  document.querySelector("#aiPracticeModal");

const closeAiPracticeModal =
  document.querySelector("#closeAiPracticeModal");

const aiPracticeForm =
  document.querySelector("#aiPracticeForm");

function openAiPracticeModal() {
  if (!aiPracticeModal) return;

  aiPracticeModal.classList.add("active");
}

function closeAiPracticeModalFn() {
  if (!aiPracticeModal) return;

  aiPracticeModal.classList.remove("active");

  if (aiPracticeForm) {
    aiPracticeForm.reset();
  }
}

if (aiPracticeBtn) {
  aiPracticeBtn.addEventListener(
    "click",
    openAiPracticeModal
  );
}

if (closeAiPracticeModal) {
  closeAiPracticeModal.addEventListener(
    "click",
    closeAiPracticeModalFn
  );
}

if (aiPracticeModal) {
  aiPracticeModal.addEventListener(
    "click",
    (event) => {
      if (event.target === aiPracticeModal) {
        closeAiPracticeModalFn();
      }
    }
  );
}

// ==========================================
// AI PRACTICE FORM
// ==========================================

if (aiPracticeForm) {
  aiPracticeForm.addEventListener(
    "submit",
    async (event) => {
      event.preventDefault();

      const topicInput =
        aiPracticeForm.querySelector(
          "#practiceTopic"
        );

      const difficultyInput =
        aiPracticeForm.querySelector(
          "#practiceDifficulty"
        );

      const topic = topicInput
        ? topicInput.value.trim()
        : "General";

      const difficulty = difficultyInput
        ? difficultyInput.value
        : "Medium";

      const resultBox =
        document.querySelector("#aiPracticeResult");

      if (resultBox) {
        resultBox.innerHTML = `
          <div class="loading-state">
            Generating your practice question...
          </div>
        `;
      }

      try {
        const response = await fetch(
          "/api/generate-question",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              topic,
              difficulty
            })
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || "Failed to generate question"
          );
        }

        if (resultBox) {
          resultBox.innerHTML = `
            <div class="practice-question">
              <h3>Practice Question</h3>

              <p>
                ${data.question || "Question generated successfully."}
              </p>

              <div class="practice-answer-area">
                <textarea
                  id="practiceAnswer"
                  placeholder="Write your answer here..."
                ></textarea>

                <button
                  type="button"
                  id="submitPracticeAnswer"
                  class="primary-btn"
                >
                  Submit Answer
                </button>
              </div>

              <div id="practiceFeedback"></div>
            </div>
          `;
        }

        const submitAnswerBtn =
          document.querySelector(
            "#submitPracticeAnswer"
          );

        if (submitAnswerBtn) {
          submitAnswerBtn.addEventListener(
            "click",
            async () => {
              const answerInput =
                document.querySelector(
                  "#practiceAnswer"
                );

              const feedback =
                document.querySelector(
                  "#practiceFeedback"
                );

              const answer = answerInput
                ? answerInput.value.trim()
                : "";

              if (!answer) {
                if (feedback) {
                  feedback.innerHTML = `
                    <p>Please write an answer first.</p>
                  `;
                }

                return;
              }

              if (feedback) {
                feedback.innerHTML = `
                  <div class="loading-state">
                    Checking your answer...
                  </div>
                `;
              }

              try {
                const checkResponse =
                  await fetch(
                    "/api/check-answer",
                    {
                      method: "POST",
                      headers: {
                        "Content-Type":
                          "application/json"
                      },
                      body: JSON.stringify({
                        question:
                          data.question || "",
                        answer,
                        topic,
                        difficulty
                      })
                    }
                  );

                const checkData =
                  await checkResponse.json();

                if (!checkResponse.ok) {
                  throw new Error(
                    checkData.error ||
                      "Failed to check answer"
                  );
                }

                const score = Number(
                  checkData.score || 0
                );

                addPracticeResult(topic, score);

                if (feedback) {
                  feedback.innerHTML = `
                    <div class="practice-feedback">
                      <h4>Score: ${score}/10</h4>
                      <p>
                        ${
                          checkData.feedback ||
                          "Good effort!"
                        }
                      </p>
                    </div>
                  `;
                }
              } catch (error) {
                console.error(
                  "Answer checking error:",
                  error
                );

                if (feedback) {
                  feedback.innerHTML = `
                    <p>
                      Unable to check the answer right now.
                    </p>
                  `;
                }
              }
            }
          );
        }
      } catch (error) {
        console.error(
          "AI Practice error:",
          error
        );

        if (resultBox) {
          resultBox.innerHTML = `
            <div class="error-state">
              <p>
                Unable to generate the question.
              </p>
            </div>
          `;
        }
      }
    }
  );
}

// ==========================================
// HISTORY TOGGLE
// ==========================================

const historyToggleBtn =
  document.querySelector("#historyToggleBtn");

const practiceHistorySection =
  document.querySelector(
    ".practice-history-section"
  );

if (
  historyToggleBtn &&
  practiceHistorySection
) {
  historyToggleBtn.addEventListener(
    "click",
    () => {
      practiceHistorySection.classList.toggle(
        "history-open"
      );

      const isOpen =
        practiceHistorySection.classList.contains(
          "history-open"
        );

      historyToggleBtn.textContent = isOpen
        ? "Hide History ↑"
        : "View History →";
    }
  );
}

// ==========================================
// STUDY COPILOT
// ==========================================

(function initStudyCopilot() {
  const copilotToggle =
    document.querySelector("#copilotToggle");

  const copilotPanel =
    document.querySelector("#copilotPanel");

  const copilotClose =
    document.querySelector("#copilotClose");

  const copilotInput =
    document.querySelector("#copilotInput");

  const copilotSend =
    document.querySelector("#copilotSend");

  const copilotMic =
    document.querySelector("#copilotMic");

  const copilotImage =
    document.querySelector("#copilotImage");

  const copilotMessages =
    document.querySelector("#copilotMessages");

  const openCopilotBtn =
    document.querySelector("#openCopilotBtn");

  function openCopilot() {
    if (!copilotPanel) return;

    copilotPanel.classList.add("active");

    if (copilotInput) {
      setTimeout(() => {
        copilotInput.focus();
      }, 150);
    }
  }

  function closeCopilot() {
    if (!copilotPanel) return;

    copilotPanel.classList.remove("active");
  }

  function addCopilotMessage(
    message,
    sender = "ai"
  ) {
    if (!copilotMessages) return;

    const messageElement =
      document.createElement("div");

    messageElement.className =
      `copilot-message ${sender}`;

    messageElement.textContent = message;

    copilotMessages.appendChild(
      messageElement
    );

    copilotMessages.scrollTop =
      copilotMessages.scrollHeight;
  }

  async function sendCopilotMessage(
    message
  ) {
    const cleanMessage =
      String(message || "").trim();

    if (!cleanMessage) return;

    addCopilotMessage(
      cleanMessage,
      "user"
    );

    if (copilotInput) {
      copilotInput.value = "";
    }

    addCopilotMessage(
      "Thinking...",
      "ai"
    );

    const loadingMessage =
      copilotMessages
        ? copilotMessages.lastElementChild
        : null;

    try {
      const response = await fetch(
        "/api/jarvis",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            message: cleanMessage
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Request failed"
        );
      }

      if (loadingMessage) {
        loadingMessage.textContent =
          data.reply ||
          data.message ||
          "I couldn't generate a response.";
      }
    } catch (error) {
      console.error(
        "Study Copilot error:",
        error
      );

      if (loadingMessage) {
        loadingMessage.textContent =
          "Sorry, I couldn't connect to the AI right now.";
      }
    }
  }

  if (copilotToggle) {
    copilotToggle.addEventListener(
      "click",
      () => {
        if (
          copilotPanel &&
          copilotPanel.classList.contains(
            "active"
          )
        ) {
          closeCopilot();
        } else {
          openCopilot();
        }
      }
    );
  }

  if (openCopilotBtn) {
    openCopilotBtn.addEventListener(
      "click",
      openCopilot
    );
  }

  if (copilotClose) {
    copilotClose.addEventListener(
      "click",
      closeCopilot
    );
  }

  if (copilotSend) {
    copilotSend.addEventListener(
      "click",
      () => {
        if (!copilotInput) return;

        sendCopilotMessage(
          copilotInput.value
        );
      }
    );
  }

  if (copilotInput) {
    copilotInput.addEventListener(
      "keydown",
      (event) => {
        if (
          event.key === "Enter" &&
          !event.shiftKey
        ) {
          event.preventDefault();

          sendCopilotMessage(
            copilotInput.value
          );
        }
      }
    );
  }

  // ========================================
  // VOICE INPUT
  // ========================================

  let recognition = null;

  if (
    "webkitSpeechRecognition" in window ||
    "SpeechRecognition" in window
  ) {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    recognition =
      new SpeechRecognition();

    recognition.lang = "en-IN";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript =
        event.results[0][0].transcript;

      if (copilotInput) {
        copilotInput.value =
          transcript;
      }

      sendCopilotMessage(transcript);
    };

    recognition.onerror = (event) => {
      console.error(
        "Speech recognition error:",
        event.error
      );
    };
  }

  if (copilotMic) {
    copilotMic.addEventListener(
      "click",
      () => {
        if (!recognition) {
          alert(
            "Voice input is not supported in this browser."
          );

          return;
        }

        try {
          recognition.start();
        } catch (error) {
          console.error(
            "Voice start error:",
            error
          );
        }
      }
    );
  }

  // ========================================
  // IMAGE INPUT
  // ========================================

  if (copilotImage) {
    copilotImage.addEventListener(
      "change",
      async (event) => {
        const file =
          event.target.files &&
          event.target.files[0];

        if (!file) return;

        const reader =
          new FileReader();

        reader.onload = async () => {
          try {
            addCopilotMessage(
              "I uploaded an image. Please analyze it.",
              "user"
            );

            addCopilotMessage(
              "Analyzing the image...",
              "ai"
            );

            const response =
              await fetch(
                "/api/jarvis",
                {
                  method: "POST",
                  headers: {
                    "Content-Type":
                      "application/json"
                  },
                  body: JSON.stringify({
                    message:
                      "Analyze this image and explain what it contains or what I should understand from it.",
                    image:
                      reader.result
                  })
                }
              );

            const data =
              await response.json();

            if (!response.ok) {
              throw new Error(
                data.error ||
                  "Image request failed"
              );
            }

            if (copilotMessages) {
              const lastMessage =
                copilotMessages.lastElementChild;

              if (lastMessage) {
                lastMessage.textContent =
                  data.reply ||
                  data.message ||
                  "I couldn't analyze the image.";
              }
            }
          } catch (error) {
            console.error(
              "Image analysis error:",
              error
            );

            if (copilotMessages) {
              const lastMessage =
                copilotMessages.lastElementChild;

              if (lastMessage) {
                lastMessage.textContent =
                  "Sorry, I couldn't analyze that image.";
              }
            }
          }
        };

        reader.readAsDataURL(file);
      }
    );
  }
})();

// ==========================================
// OVERALL PROGRESS
// ==========================================

function updateOverallProgress() {
  const progressElements =
    document.querySelectorAll(
      ".overall-progress-value"
    );

  if (
    !progressElements ||
    progressElements.length === 0
  ) {
    return;
  }

  const taskProgress =
    tasks.length > 0
      ? (tasks.filter(
          (task) => task.completed
        ).length /
          tasks.length) *
        100
      : 0;

  const subjectProgress =
    subjects.length > 0
      ? subjects.reduce(
          (sum, subject) =>
            sum +
            Number(subject.progress || 0),
          0
        ) / subjects.length
      : 0;

  const practiceProgress =
    practiceHistory.length > 0
      ? (getAveragePracticeScore() / 10) *
        100
      : 0;

  const overall =
    Math.round(
      (taskProgress +
        subjectProgress +
        practiceProgress) /
        3
    );

  progressElements.forEach(
    (element) => {
      element.textContent =
        `${overall}%`;
    }
  );

  const progressBars =
    document.querySelectorAll(
      ".overall-progress-fill"
    );

  progressBars.forEach(
    (bar) => {
      bar.style.width =
        `${overall}%`;
    }
  );
}

updateOverallProgress();

// ==========================================
// APP VIEW ROUTER
// ==========================================

function initAppRouter() {
  const appView =
    document.querySelector("#appView");

  const navItems =
    document.querySelectorAll(
      ".sidebar-nav a, .sidebar-nav button, .nav-item"
    );

  if (!appView) return;

  function getViewName(element) {
    const id =
      element.id ||
      "";

    const text =
      element.textContent
        .trim()
        .toLowerCase();

    if (
      id.includes("dashboard") ||
      text === "dashboard"
    ) {
      return "dashboard";
    }

    if (
      id.includes("subject") ||
      text.includes("my subjects")
    ) {
      return "subjects";
    }

    if (
      id.includes("task") ||
      text === "tasks"
    ) {
      return "tasks";
    }

    if (
      id.includes("study") ||
      text.includes("study sessions")
    ) {
      return "sessions";
    }

    if (
      id.includes("practice") ||
      text.includes("ai practice")
    ) {
      return "practice";
    }

    if (
      id.includes("analytic") ||
      text.includes("analytics")
    ) {
      return "analytics";
    }

    if (
      id.includes("weak") ||
      text.includes("weak topics")
    ) {
      return "weak";
    }

    if (
      id.includes("setting") ||
      text.includes("settings")
    ) {
      return "settings";
    }

    return null;
  }

  function showDashboard() {
    appView.classList.remove(
      "app-view-visible"
    );
  }

  function renderSubjectsPage() {
    appView.innerHTML = `
      <section class="page-section">
        <div class="page-header">
          <div>
            <span class="page-kicker">Learning</span>
            <h2>My Subjects</h2>
            <p>
              Track your progress across all subjects.
            </p>
          </div>

          <button
            class="primary-btn"
            id="pageAddSubjectBtn"
          >
            + Add Subject
          </button>
        </div>

        <div class="subjects-page-grid">
          ${
            subjects.length
              ? subjects
                  .map(
                    (subject, index) => `
                      <article class="subject-page-card">
                        <div class="subject-card-header">
                          <div>
                            <span class="subject-short">
                              ${subject.shortName}
                            </span>
                            <h3>
                              ${subject.name}
                            </h3>
                          </div>

                          <button
                            class="delete-subject-btn"
                            data-page-index="${index}"
                          >
                            ×
                          </button>
                        </div>

                        <div class="progress-row">
                          <span>Progress</span>
                          <strong>
                            ${subject.progress}%
                          </strong>
                        </div>

                        <div class="progress-bar">
                          <div
                            class="progress-fill"
                            style="width:${subject.progress}%"
                          ></div>
                        </div>
                      </article>
                    `
                  )
                  .join("")
              : `
                <div class="empty-state large">
                  <h3>No subjects yet</h3>
                  <p>
                    Add your first subject to start tracking progress.
                  </p>
                </div>
              `
          }
        </div>
      </section>
    `;

    appView.classList.add(
      "app-view-visible"
    );
  }

  function renderWeakTopicsPage() {

    const addButton =
      document.querySelector(
        "#pageAddSubjectBtn"
      );

    if (addButton) {
      addButton.addEventListener(
        "click",
        openSubjectModal
      );
    }

    appView
      .querySelectorAll(
        ".delete-subject-btn"
      )
      .forEach((button) => {
        button.addEventListener(
          "click",
          () => {
            const index = Number(
              button.dataset.pageIndex
            );

            if (!subjects[index]) return;

            subjects.splice(index, 1);

            saveSubjects();
            renderSubjects();
            renderSubjectsPage();
          }
        );
      });
  }

  function renderTasksPage() {
    appView.innerHTML = `
      <section class="page-section">
        <div class="page-header">
          <div>
            <span class="page-kicker">Productivity</span>
            <h2>Tasks</h2>
            <p>
              Manage your daily study tasks.
            </p>
          </div>

          <button
            class="primary-btn"
            id="pageAddTaskBtn"
          >
            + Add Task
          </button>
        </div>

        <div class="tasks-page-list">
          ${
            tasks.length
              ? tasks
                  .map(
                    (task, index) => `
                      <article class="task-page-card ${
                        task.completed
                          ? "completed"
                          : ""
                      }">
                        <div class="task-left">
                          <input
                            type="checkbox"
                            class="page-task-checkbox"
                            data-page-index="${index}"
                            ${
                              task.completed
                                ? "checked"
                                : ""
                            }
                          >

                          <div>
                            <h3>
                              ${task.name}
                            </h3>

                            <p>
                              ${task.duration} min
                            </p>
                          </div>
                        </div>

                        <div class="task-right">
                          <span class="priority-badge ${task.priority.toLowerCase()}">
                            ${task.priority}
                          </span>

                          <button
                            class="delete-page-task-btn"
                            data-page-index="${index}"
                          >
                            Delete
                          </button>
                        </div>
                      </article>
                    `
                  )
                  .join("")
              : `
                <div class="empty-state large">
                  <h3>No tasks yet</h3>
                  <p>
                    Add a task to start planning your study day.
                  </p>
                </div>
              `
          }
        </div>
      </section>
    `;

    appView.classList.add(
      "app-view-visible"
    );

    const addButton =
      document.querySelector(
        "#pageAddTaskBtn"
      );

    if (addButton) {
      addButton.addEventListener(
        "click",
        openTaskModal
      );
    }

    appView
      .querySelectorAll(
        ".page-task-checkbox"
      )
      .forEach((checkbox) => {
        checkbox.addEventListener(
          "change",
          () => {
            const index = Number(
              checkbox.dataset.pageIndex
            );

            if (!tasks[index]) return;

            tasks[index].completed =
              checkbox.checked;

            saveTasks();
            renderTasks();
            renderTasksPage();
          }
        );
      });

    appView
      .querySelectorAll(
        ".delete-page-task-btn"
      )
      .forEach((button) => {
        button.addEventListener(
          "click",
          () => {
            const index = Number(
              button.dataset.pageIndex
            );

            if (!tasks[index]) return;

            tasks.splice(index, 1);

            saveTasks();
            renderTasks();
            renderTasksPage();
          }
        );
      });
  }

  function renderSessionsPage() {
    const totalMinutes =
      getTotalStudyMinutes();

    const hours =
      Math.floor(totalMinutes / 60);

    const minutes =
      totalMinutes % 60;

    appView.innerHTML = `
      <section class="page-section">
        <div class="page-header">
          <div>
            <span class="page-kicker">Focus</span>
            <h2>Study Sessions</h2>
            <p>
              Build consistent study time with focused sessions.
            </p>
          </div>

          <button
            class="primary-btn"
            id="pageStartSessionBtn"
          >
            Start Session
          </button>
        </div>

        <div class="session-summary-grid">
          <article class="summary-card">
            <span>Total Study Time</span>
            <strong>
              ${hours}h ${minutes}m
            </strong>
          </article>

          <article class="summary-card">
            <span>Sessions</span>
            <strong>
              ${studySessions.length}
            </strong>
          </article>
        </div>

        <div class="session-history">
          <h3>Recent Sessions</h3>

          ${
            studySessions.length
              ? studySessions
                  .slice()
                  .reverse()
                  .slice(0, 10)
                  .map(
                    (session) => `
                      <div class="session-row">
                        <span>
                          ${new Date(
                            session.date
                          ).toLocaleDateString()}
                        </span>

                        <strong>
                          ${session.minutes} min
                        </strong>
                      </div>
                    `
                  )
                  .join("")
              : `
                <div class="empty-state">
                  <p>
                    No study sessions recorded yet.
                  </p>
                </div>
              `
          }
        </div>
      </section>
    `;

    appView.classList.add(
      "app-view-visible"
    );

    const startButton =
      document.querySelector(
        "#pageStartSessionBtn"
      );

    if (startButton) {
      startButton.addEventListener(
        "click",
        () => {
          const timerModal =
            document.querySelector(
              "#studyTimerModal"
            );

          if (timerModal) {
            timerModal.classList.add(
              "active"
            );
          }
        }
      );
    }
  }

  function renderPracticePage() {
    appView.innerHTML = `
      <section class="page-section">
        <div class="page-header">
          <div>
            <span class="page-kicker">AI Learning</span>
            <h2>AI Practice</h2>
            <p>
              Practice concepts and get instant feedback.
            </p>
          </div>

          <button
            class="primary-btn"
            id="pageStartPracticeBtn"
          >
            Start AI Practice
          </button>
        </div>

        <div class="practice-page-stats">
          <article class="summary-card">
            <span>Total Questions</span>
            <strong>
              ${practiceHistory.length}
            </strong>
          </article>

          <article class="summary-card">
            <span>Average Score</span>
            <strong>
              ${getAveragePracticeScore()}/10
            </strong>
          </article>

          <article class="summary-card">
            <span>Best Score</span>
            <strong>
              ${getBestPracticeScore()}/10
            </strong>
          </article>
        </div>

        <div class="practice-intro-card">
          <h3>Practice smarter</h3>
          <p>
            Choose a topic and difficulty, then solve an AI-generated question.
          </p>
        </div>
      </section>
    `;

    appView.classList.add(
      "app-view-visible"
    );

    const startButton =
      document.querySelector(
        "#pageStartPracticeBtn"
      );

    if (startButton) {
      startButton.addEventListener(
        "click",
        openAiPracticeModal
      );
    }
  }

  function renderAnalyticsPage() {
    const taskCompletion =
      tasks.length > 0
        ? Math.round(
            (tasks.filter(
              (task) => task.completed
            ).length /
              tasks.length) *
              100
          )
        : 0;

    const subjectAverage =
      subjects.length > 0
        ? Math.round(
            subjects.reduce(
              (sum, subject) =>
                sum +
                Number(
                  subject.progress || 0
                ),
              0
            ) / subjects.length
          )
        : 0;

    appView.innerHTML = `
      <section class="page-section">
        <div class="page-header">
          <div>
            <span class="page-kicker">Insights</span>
            <h2>Analytics</h2>
            <p>
              Understand your study performance at a glance.
            </p>
          </div>
        </div>

        <div class="analytics-grid">
          <article class="analytics-card">
            <span>Task Completion</span>
            <strong>${taskCompletion}%</strong>

            <div class="progress-bar">
              <div
                class="progress-fill"
                style="width:${taskCompletion}%"
              ></div>
            </div>
          </article>

          <article class="analytics-card">
            <span>Subject Progress</span>
            <strong>${subjectAverage}%</strong>

            <div class="progress-bar">
              <div
                class="progress-fill"
                style="width:${subjectAverage}%"
              ></div>
            </div>
          </article>

          <article class="analytics-card">
            <span>AI Average</span>
            <strong>
              ${getAveragePracticeScore()}/10
            </strong>
          </article>

          <article class="analytics-card">
            <span>Best AI Score</span>
            <strong>
              ${getBestPracticeScore()}/10
            </strong>
          </article>
        </div>

        <div class="analytics-section">
          <h3>Subject Progress</h3>

          ${
            subjects.length
              ? subjects
                  .map(
                    (subject) => `
                      <div class="analytics-progress-row">
                        <div>
                          <span>
                            ${subject.name}
                          </span>

                          <strong>
                            ${subject.progress}%
                          </strong>
                        </div>

                        <div class="progress-bar">
                          <div
                            class="progress-fill"
                            style="width:${subject.progress}%"
                          ></div>
                        </div>
                      </div>
                    `
                  )
                  .join("")
              : `
                <div class="empty-state">
                  <p>
                    Add subjects to see analytics.
                  </p>
                </div>
              `
          }
        </div>

        <div class="analytics-section">
          <h3>Practice Performance</h3>

          <div class="analytics-practice-box">
            <div>
              <span>Questions attempted</span>
              <strong>
                ${practiceHistory.length}
              </strong>
            </div>

            <div>
              <span>Average score</span>
              <strong>
                ${getAveragePracticeScore()}/10
              </strong>
            </div>

            <div>
              <span>Best score</span>
              <strong>
                ${getBestPracticeScore()}/10
              </strong>
            </div>
          </div>
        </div>
      </section>
    `;

    appView.classList.add(
      "app-view-visible"
    );
}}    function renderWeakTopicsPage() {
    const groups = {};

    practiceHistory.forEach((item) => {
      const score = Number(item.score || 0);
      const key = item.topic || "Unknown topic";

      if (score <= 6) {
        if (!groups[key]) {
          groups[key] = {
            topic: key,
            scores: []
          };
        }

        groups[key].scores.push(score);
      }
    });

    const weakTopics = Object.values(groups).sort((a, b) => {
      const avgA =
        a.scores.reduce((sum, score) => sum + score, 0) /
        a.scores.length;

      const avgB =
        b.scores.reduce((sum, score) => sum + score, 0) /
        b.scores.length;

      return avgA - avgB;
    });

    const content = weakTopics.length
      ? weakTopics
          .map((item) => {
            const average =
              item.scores.reduce(
                (sum, score) => sum + score,
                0
              ) / item.scores.length;

            const percentage = Math.max(
              0,
              Math.min(100, average * 10)
            );

            return `
              <article class="weak-topic-card">
                <div class="weak-topic-top">
                  <div>
                    <h3>${item.topic}</h3>
                    <p>
                      ${item.scores.length} attempt(s)
                    </p>
                  </div>

                  <strong>
                    ${average.toFixed(1)}/10
                  </strong>
                </div>

                <div class="progress-bar">
                  <div
                    class="progress-fill"
                    style="width:${percentage}%"
                  ></div>
                </div>

                <span class="weak-label">
                  ${
                    average < 4
                      ? "Needs attention"
                      : "Needs more practice"
                  }
                </span>
              </article>
            `;
          })
          .join("")
      : `
          <div class="empty-state large">
            <h3>No weak topics yet</h3>
            <p>
              Topics with scores of 6/10 or below
              will appear here.
            </p>
          </div>
        `;

    appView.innerHTML = `
      <section class="page-section">

        <div class="page-header">
          <div>
            <span class="page-kicker">
              Improvement
            </span>

            <h2>Weak Topics</h2>

            <p>
              Focus on topics where your AI practice
              scores are lowest.
            </p>
          </div>
        </div>

        <div class="weak-topic-grid">
          ${content}
        </div>

      </section>
    `;

    appView.classList.add("app-view-visible");
  }


  // ==========================================
  // SETTINGS PAGE
  // ==========================================

  function renderSettingsPage() {
    appView.innerHTML = `
      <section class="page-section">

        <div class="page-header">
          <div>
            <span class="page-kicker">
              Preferences
            </span>

            <h2>Settings</h2>

            <p>
              Manage your Nexviora preferences.
            </p>
          </div>
        </div>

        <div class="settings-grid">

          <div class="page-panel setting-row">
            <div>
              <h3>Practice History</h3>
              <p>
                AI practice attempts are saved
                in this browser.
              </p>
            </div>

            <span class="setting-badge">
              Enabled
            </span>
          </div>

          <div class="page-panel setting-row">
            <div>
              <h3>Local Progress</h3>
              <p>
                Tasks, subjects and study sessions
                are stored locally.
              </p>
            </div>

            <span class="setting-badge">
              Local
            </span>
          </div>

          <div class="page-panel setting-row">
            <div>
              <h3>Study Copilot</h3>
              <p>
                Use your AI study assistant for
                text, voice and image questions.
              </p>
            </div>

            <button
              class="page-secondary"
              id="settingsCopilotBtn"
            >
              Open Copilot
            </button>
          </div>

        </div>
      </section>
    `;

    const settingsCopilotBtn =
      document.querySelector("#settingsCopilotBtn");

    if (settingsCopilotBtn) {
      settingsCopilotBtn.addEventListener(
        "click",
        () => {
          const openButton =
            document.querySelector("#openCopilotBtn");

          if (openButton) {
            openButton.click();
          }
        }
      );
    }
  }


  // ==========================================
  // NAVIGATION
  // ==========================================

  function openPage(view) {
    switch (view) {
      case "dashboard":
        showDashboard();
        break;

      case "subjects":
        renderSubjectsPage();
        break;

      case "tasks":
        renderTasksPage();
        break;

      case "sessions":
        renderSessionsPage();
        break;

      case "practice":
        renderPracticePage();
        break;

      case "analytics":
        renderAnalyticsPage();
        break;

      case "weak":
        renderWeakTopicsPage();
        break;

      case "settings":
        renderSettingsPage();
        break;

      default:
        showDashboard();
    }
  }


  navItems.forEach((item) => {
    item.addEventListener("click", (event) => {
      event.preventDefault();

      const view = getViewName(item);

      if (!view) return;

      navItems.forEach((nav) => {
        nav.classList.remove("active");
      });

      item.classList.add("active");

      openPage(view);
    });
  });


  // ==========================================
  // INITIAL STATE
  // ==========================================

  showDashboard();



initAppRouter();  
    function renderSettingsPage() {
        showAppView("Settings", "Basic dashboard preferences and local data controls.", `
            <div class="settings-grid">
                <div class="page-panel setting-row">
                    <div>
                        <h3>Practice History</h3>
                        <p>Keep AI attempts saved in this browser.</p>
                    </div>
                    <span class="setting-badge">Enabled</span>
                </div>

                <div class="page-panel setting-row">
                    <div>
                        <h3>Local Progress</h3>
                        <p>Tasks, subjects and study time are stored locally.</p>
                    </div>
                    <span class="setting-badge">Local</span>
                </div>

                <div class="page-panel setting-row">
                    <div>
                        <h3>AI Assistant</h3>
                        <p>Use text, voice and image questions through Study Copilot.</p>
                    </div>
                    <button class="page-secondary" id="settingsCopilotBtn">
                        Open Copilot
                    </button>
                </div>
            </div>
        `);

        document.querySelector("#settingsCopilotBtn")?.addEventListener("click", () => {
            if (copilotToggle) copilotToggle.click();
        });
    }

    function openPage(name) {
        switch (name) {
            case "Dashboard":
                showDashboard();
                break;

            case "My Subjects":
                renderSubjectsPage();
                break;

            case "Tasks":
                renderTasksPage();
                break;

            case "Study Sessions":
                renderStudySessionsPage();
                break;

            case "AI Practice":
                renderAIPracticePage();
                break;

            case "Analytics":
                renderAnalyticsPage();
                break;

            case "Weak Topics":
                renderWeakTopicsPage();
                break;

            case "Settings":
                renderSettingsPage();
                break;

            default:
                showDashboard();
        }
    }

    navItems.forEach(item => {
        item.addEventListener("click", event => {
            event.preventDefault();

            navItems.forEach(n => n.classList.remove("active"));
            item.classList.add("active");

            openPage(
                item.textContent.replace(/\s+/g, " ").trim()
            );
        });
    });

    historyButton?.addEventListener("click", () => {
        if (!historySection) return;

        const open = historySection.classList.toggle("history-open");

        historyButton.textContent = open
            ? "Hide History ↑"
            : "View History →";
    });

    copilotOpen?.addEventListener("click", () => {
        copilotToggle?.click();
    });

    // Keep dashboard history collapsed on first load.
    if (historySection) {
        historySection.classList.remove("history-open");
    };