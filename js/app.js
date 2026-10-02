/* Secure Dynamic Task Manager
   All task markup is built with createElement() and textContent only. */

var taskInput = document.getElementById("taskInput");
var addTaskBtn = document.getElementById("addTaskBtn");
var loadSamplesBtn = document.getElementById("loadSamplesBtn");
var taskList = document.getElementById("taskList");
var taskMessage = document.getElementById("taskMessage");
var totalCount = document.getElementById("totalCount");
var pendingCount = document.getElementById("pendingCount");
var completedCount = document.getElementById("completedCount");

var EMPTY_MESSAGE = "Task cannot be empty";
var SAMPLE_TASKS = [
  "Review DOM selectors",
  "Practice createElement",
  "Study event delegation"
];
var taskCounter = 0;

function generateTaskId() {
  var id;
  do {
    taskCounter += 1;
    id = "task-" + taskCounter;
  } while (taskList.querySelector('[data-task-id="' + id + '"]'));
  return id;
}

function createButton(className, label) {
  var button = document.createElement("button");
  button.type = "button";
  button.className = className;
  button.textContent = label;
  return button;
}

function createTaskElement(taskText, taskId) {
  var li = document.createElement("li");
  li.classList.add("task-item");
  li.dataset.taskId = taskId;
  li.dataset.state = "pending";

  var span = document.createElement("span");
  span.classList.add("task-text");
  span.textContent = taskText;

  li.appendChild(span);
  li.appendChild(createButton("complete-btn", "Complete"));
  li.appendChild(createButton("edit-btn", "Edit"));
  li.appendChild(createButton("remove-btn", "Remove"));
  return li;
}

function addTask(taskText) {
  var text = typeof taskText === "string" ? taskText.trim() : "";
  if (text === "") {
    taskMessage.textContent = EMPTY_MESSAGE;
    return;
  }
  var taskItem = createTaskElement(text, generateTaskId());
  taskList.appendChild(taskItem);
  taskInput.value = "";
  taskMessage.textContent = "";
  updateTaskCounts();
}

function toggleTaskComplete(taskItem) {
  var isCompleted = taskItem.classList.toggle("completed");
  taskItem.dataset.state = isCompleted ? "completed" : "pending";
  updateTaskCounts();
}

function beginTaskEdit(taskItem) {
  var span = taskItem.querySelector(".task-text");
  if (!span) return;
  var input = document.createElement("input");
  input.type = "text";
  input.className = "edit-input";
  input.value = span.textContent;
  input.setAttribute("aria-label", "Edit task");
  taskItem.replaceChild(input, span);
  taskItem.querySelector(".edit-btn").textContent = "Save";
  input.focus();
}

function saveTaskEdit(taskItem) {
  var input = taskItem.querySelector(".edit-input");
  if (!input) return;
  var text = input.value.trim();
  if (text === "") {
    taskMessage.textContent = EMPTY_MESSAGE;
    input.focus();
    return;
  }
  var span = document.createElement("span");
  span.classList.add("task-text");
  span.textContent = text;
  taskItem.replaceChild(span, input);
  taskItem.querySelector(".edit-btn").textContent = "Edit";
  taskMessage.textContent = "";
}

function removeTask(taskItem) {
  taskItem.remove();
  updateTaskCounts();
}

function updateTaskCounts() {
  var items = taskList.querySelectorAll(".task-item");
  var completed = 0;
  items.forEach(function (item) {
    if (item.dataset.state === "completed") completed += 1;
  });
  totalCount.textContent = items.length;
  completedCount.textContent = completed;
  pendingCount.textContent = items.length - completed;
}

function handleTaskListClick(event) {
  var target = event.target;
  var taskItem = target.closest(".task-item");
  if (!taskItem || !taskList.contains(taskItem)) return;

  if (target.matches(".complete-btn")) {
    toggleTaskComplete(taskItem);
  } else if (target.matches(".edit-btn")) {
    if (taskItem.querySelector(".edit-input")) {
      saveTaskEdit(taskItem);
    } else {
      beginTaskEdit(taskItem);
    }
  } else if (target.matches(".remove-btn")) {
    removeTask(taskItem);
  }
}

function loadSampleTasks() {
  var fragment = document.createDocumentFragment();
  SAMPLE_TASKS.forEach(function (text) {
    fragment.appendChild(createTaskElement(text, generateTaskId()));
  });
  taskList.appendChild(fragment);
  taskMessage.textContent = "";
  updateTaskCounts();
}

// Single delegated click listener for all task actions.
taskList.addEventListener("click", handleTaskListClick);

addTaskBtn.addEventListener("click", function () { addTask(taskInput.value); });
loadSamplesBtn.addEventListener("click", loadSampleTasks);

// Keyboard: Enter adds a task, or saves the task being edited.
taskInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") addTask(taskInput.value);
});
taskList.addEventListener("keydown", function (event) {
  if (event.key === "Enter" && event.target.matches(".edit-input")) {
    saveTaskEdit(event.target.closest(".task-item"));
  }
});

updateTaskCounts();
