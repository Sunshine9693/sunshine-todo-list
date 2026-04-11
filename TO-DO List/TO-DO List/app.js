
// DOM ELEMENTS: SIDEBAR & ROUTING
const menuBtn = document.getElementById("menuBtn");
const closeMenuBtn = document.getElementById("closeMenuBtn");
const sidebar = document.getElementById("sidebar");
const sidebarOverlay = document.getElementById("sidebarOverlay");
const navLinks = document.querySelectorAll(".nav-link");
const views = document.querySelectorAll(".view");

const motivationQuote = document.getElementById("motivationQuote");
const smartSuggestion = document.getElementById("smartSuggestion");
const suggestionText = document.getElementById("suggestionText");

const taskInput = document.getElementById("taskInput");
const searchInput = document.getElementById("searchInput");
const dueDateInput = document.getElementById("dueDateInput");
const prioritySelect = document.getElementById("priority");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");

const totalCount = document.getElementById("totalCount");
const completedCount = document.getElementById("completedCount");
const pendingCount = document.getElementById("pendingCount");

const progressValue = document.getElementById("progressValue");
const progressCircle = document.querySelector(".circular-progress");

const modeToggle = document.getElementById("modeToggle");

let tasks = [];
let dragStartIndex;

// SIDEBAR TOGGLE
function toggleSidebar() {
    sidebar.classList.toggle("open");
    sidebarOverlay.classList.toggle("active");
}

menuBtn.addEventListener("click", toggleSidebar);
closeMenuBtn.addEventListener("click", toggleSidebar);
sidebarOverlay.addEventListener("click", toggleSidebar);

// ROUTING / VIEW SWITCHER
navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
        e.preventDefault();
        
        // Remove active class from all links
        navLinks.forEach(nav => nav.classList.remove("tab-active"));
        // Add to clicked link
        e.currentTarget.classList.add("tab-active");
        
        // Hide all views
        views.forEach(view => view.classList.remove("active"));
        
        // Show target view
        const targetId = e.currentTarget.getAttribute("data-target");
        document.getElementById(targetId).classList.add("active");
        
        // Auto-close sidebar on mobile/when link clicked
        toggleSidebar();
    });
});


// ALERTS & NOTIFICATIONS
if ("Notification" in window && Notification.permission !== "granted" && Notification.permission !== "denied") {
    Notification.requestPermission();
}

// ADD TASK

addBtn.addEventListener("click", () => {
    let text = taskInput.value.trim();
    let priority = prioritySelect.value;
    let dueDate = dueDateInput.value;

    if (text === "") {
        alert("Please enter a task!");
        return;
    }

    let newTask = {
        text: text,
        priority: priority,
        dueDate: dueDate,
        completed: false,
        isNew: true
    };

    tasks.push(newTask);
    taskInput.value = "";
    dueDateInput.value = "";

    sortTasks();
    saveData();
    renderTasks();
});



// SORT TASKS
function sortTasks() {
    const priorityWeights = { high: 0, medium: 1, low: 2 };
    
    tasks.sort((a, b) => {
        if (priorityWeights[a.priority] !== priorityWeights[b.priority]) {
            return priorityWeights[a.priority] - priorityWeights[b.priority]; // Highest priority first
        }
        if (a.dueDate && b.dueDate) {
            return new Date(a.dueDate) - new Date(b.dueDate);
        }
        if (a.dueDate) return -1;
        if (b.dueDate) return 1;
        return 0;
    });
}

// RENDER TASKS

function renderTasks() {
    taskList.innerHTML = "";

    tasks.forEach((task, index) => {
        let li = document.createElement("li");
        li.classList.add("task-item", task.priority);
        li.draggable = true;
        li.setAttribute("data-index", index);

        // Drag Events
        li.addEventListener("dragstart", dragStart);
        li.addEventListener("dragover", dragOver);
        li.addEventListener("drop", dragDrop);
        li.addEventListener("dragenter", dragEnter);
        li.addEventListener("dragleave", dragLeave);
        li.addEventListener("dragend", dragEnd);

        if (task.completed) li.classList.add("completed");

        if (task.isNew) {
            li.classList.add("animate-in");
            delete task.isNew;
        }

        let dueDateHtml = "";
        if (task.dueDate) {
            let dueTime = new Date(task.dueDate).getTime();
            let now = new Date().getTime();
            
            let dateObj = new Date(task.dueDate);
            let dateString = dateObj.toLocaleDateString() + " " + dateObj.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

            if (dueTime < now && !task.completed) {
                dueDateHtml = `<div class="deadline-text overdue"><i class="fas fa-exclamation-circle"></i> Overdue: ${dateString}</div>`;
            } else {
                dueDateHtml = `<div class="deadline-text"><i class="far fa-clock"></i> Due: ${dateString}</div>`;
            }
        }

        li.innerHTML = `
            <div style="display: flex; flex-direction: column; flex: 1;">
                <span><i class="fas fa-grip-vertical" style="color:#888; margin-right:10px; cursor:grab;" title="Drag to reorder"></i> ${task.text}</span>
                ${dueDateHtml}
            </div>

            <div class="task-buttons" style="display: flex; align-items: center;">
                <button class="completeBtn" data-index="${index}">
                    <i class="fa-solid fa-check"></i>
                </button>

                <button class="deleteBtn" data-index="${index}">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        `;

        taskList.appendChild(li);
    });

    updateCounter();
    updateProgress();
    updateSmartSuggestion();

    // Preserve search filter on re-render
    if (searchInput && searchInput.value) {
        searchInput.dispatchEvent(new Event("input"));
    }
}



// DRAG AND DROP FUNCTIONS (new using Antigravity)

function dragStart(e) {
    dragStartIndex = +this.getAttribute("data-index");
    this.classList.add("dragging");
}

function dragOver(e) {
    e.preventDefault();
}

function dragEnter(e) {
    e.preventDefault();
    this.classList.add("drag-over");
}

function dragLeave() {
    this.classList.remove("drag-over");
}

function dragDrop(e) {
    e.preventDefault();
    let dragEndIndex = +this.getAttribute("data-index");
    this.classList.remove("drag-over");

    if (dragStartIndex !== dragEndIndex) {
        let itemToMove = tasks.splice(dragStartIndex, 1)[0];
        tasks.splice(dragEndIndex, 0, itemToMove);
        saveData();
        renderTasks();
    }
}

function dragEnd() {
    this.classList.remove("dragging");
    document.querySelectorAll(".task-item").forEach(item => item.classList.remove("drag-over"));
}


// DELETE & COMPLETE

taskList.addEventListener("click", (e) => {

    // Delete task
    if (e.target.closest(".deleteBtn")) {
        let index = e.target.closest(".deleteBtn").dataset.index;
        tasks.splice(index, 1);
        saveData();
        renderTasks();
    }

    // Complete task
    if (e.target.closest(".completeBtn")) {
        let index = e.target.closest(".completeBtn").dataset.index;
        tasks[index].completed = !tasks[index].completed;
        
        // Give a new motivational boost when a task is checked off!
        if (tasks[index].completed) displayRandomQuote();
        
        saveData();
        renderTasks();
    }
});



// COUNTER UPDATE

function updateCounter() {
    let total = tasks.length;
    let completed = tasks.filter(t => t.completed).length;

    totalCount.textContent = total;
    completedCount.textContent = completed;
    pendingCount.textContent = total - completed;
}



// PROGRESS CIRCLE

function updateProgress() {
    let total = tasks.length;
    let completed = tasks.filter(t => t.completed).length;

    let percent = total === 0 ? 0 : Math.round((completed / total) * 100);

    progressValue.textContent = percent + "%";

    let degree = percent * 3.6;

    progressCircle.style.background = `
        conic-gradient(#4CAF50 ${degree}deg, #ddd 0deg)
    `;
}



// DARK MODE

modeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");

    modeToggle.innerHTML = document.body.classList.contains("dark-mode")
        ? `<i class="fa-solid fa-sun"></i>`
        : `<i class="fa-solid fa-moon"></i>`;
});



// SEARCH FUNCTION (new using Antigravity)

if (searchInput) {
    searchInput.addEventListener("input", (e) => {
        let term = e.target.value.toLowerCase();
        document.querySelectorAll(".task-item").forEach(item => {
            let itemText = item.querySelector("span").textContent.toLowerCase();
            if (itemText.includes(term)) {
                item.classList.remove("hidden");
            } else {
                item.classList.add("hidden");
            }
        });
    });
}



// DAILY QUOTES & MOTIVATION (new using Antigravity)
const quotes = [
    "The secret of getting ahead is getting started.",
    "Small steps every day equal massive results.",
    "Believe you can and you're halfway there.",
    "Don't stop until you're proud.",
    "Focus on being productive instead of busy.",
    "You don't have to be great to start, but you have to start to be great.",
    "Discipline is choosing between what you want now and what you want most."
];

function displayRandomQuote() {
    let randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    if (motivationQuote) {
        motivationQuote.innerHTML = `"${randomQuote}"`;
    }
}

// SMART SUGGESTION ENGINE (new using Antigravity)
function updateSmartSuggestion() {
    if (!smartSuggestion || !suggestionText) return;

    if (tasks.length === 0) {
        suggestionText.textContent = "It's quiet here. Add a few tasks to map out your day!";
        smartSuggestion.classList.remove("hidden");
        return;
    }

    let pendingTasks = tasks.filter(t => !t.completed);

    if (pendingTasks.length === 0) {
        suggestionText.textContent = "Incredible work! You've finished everything for now. Take a breather 🎉";
        smartSuggestion.classList.remove("hidden");
        return;
    }
    
    // Grab the most important pending task (tasks array is already sorted by priority/deadline!)
    let nextTask = pendingTasks[0];
    let isOverdue = false;
    
    if (nextTask.dueDate) {
        let dueTime = new Date(nextTask.dueDate).getTime();
        let now = new Date().getTime();
        if (dueTime < now) isOverdue = true;
    }

    if (isOverdue) {
        suggestionText.innerHTML = `Priority Alert! Focus on clearing your overdue task: <strong>"${nextTask.text}"</strong>`;
    } else if (nextTask.priority === "high") {
        suggestionText.innerHTML = `High Priority: You should tackle <strong>"${nextTask.text}"</strong> next.`;
    } else {
        suggestionText.innerHTML = `Next up: Keep your momentum going by finishing <strong>"${nextTask.text}"</strong>.`;
    }
    
    smartSuggestion.classList.remove("hidden");
}

displayRandomQuote();



// LOCAL STORAGE

function saveData() {
    localStorage.setItem("todoApp", JSON.stringify(tasks));
}

function loadData() {
    let saved = localStorage.getItem("todoApp");
    if (saved) {
        tasks = JSON.parse(saved);
        sortTasks(); // Apply priority sorting initially
        renderTasks();
    }
}

loadData();

// REMINDER CHECKER (new using Antigravity)
setInterval(() => {
    let now = new Date().getTime();

    tasks.forEach(task => {
        if (!task.completed && task.dueDate) {
            let dueTime = new Date(task.dueDate).getTime();
            let timeDiff = dueTime - now;
            
            // Remind if due in under 1 hour and haven't reminded yet
            if (timeDiff > 0 && timeDiff <= 3600000 && !task.reminded) {
                if ("Notification" in window && Notification.permission === "granted") {
                    new Notification("Task Reminder!", { 
                        body: `"${task.text}" is due soon! (Priority: ${task.priority.toUpperCase()})` 
                    });
                }
                task.reminded = true;
                saveData();
            }
        }
    });
}, 60000);