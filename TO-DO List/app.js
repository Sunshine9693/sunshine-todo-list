
const taskInput = document.getElementById("taskInput");
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



// ADD TASK

addBtn.addEventListener("click", () => {
    let text = taskInput.value.trim();
    let priority = prioritySelect.value;

    if (text === "") {
        alert("Please enter a task!");
        return;
    }

    let newTask = {
        text: text,
        priority: priority,
        completed: false
    };

    tasks.push(newTask);
    taskInput.value = "";

    saveData();
    renderTasks();
});



// RENDER TASKS

function renderTasks() {
    taskList.innerHTML = "";

    tasks.forEach((task, index) => {
        let li = document.createElement("li");
        li.classList.add("task-item", task.priority);

        if (task.completed) li.classList.add("completed");

        li.innerHTML = `
            <span>${index + 1}. ${task.text}</span>

            <div class="task-buttons">
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



// LOCAL STORAGE

function saveData() {
    localStorage.setItem("todoApp", JSON.stringify(tasks));
}

function loadData() {
    let saved = localStorage.getItem("todoApp");
    if (saved) {
        tasks = JSON.parse(saved);
        renderTasks();
    }
}

loadData();