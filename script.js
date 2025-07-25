const taskInput = document.getElementById("taskInput");
const deadlineInput = document.getElementById("deadlineInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

const regexTextOnly = /^[a-zA-Z\s]+$/;
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let filter = "all";

function getDeadlineColor(deadline) {
  if (!deadline) return "bg-gray-100";
  const today = new Date();
  const due = new Date(deadline);
  const diff = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
  if (diff < 0 || diff === 0) return "bg-red-300";
  if (diff <= 2) return "bg-yellow-200";
  return "bg-green-100";
}

function renderTasks() {
  taskList.innerHTML = "";

  const filteredTasks = tasks.filter(task => {
    if (filter === "done") return task.done;
    if (filter === "not_done") return !task.done;
    return true;
  });

  filteredTasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = "flex justify-between items-center px-4 py-2 rounded " + getDeadlineColor(task.deadline);

    const span = document.createElement("span");
    span.className = "flex-1";
    const text = document.createElement("div");
    text.textContent = task.text;
    text.className = task.done ? "line-through text-gray-400" : "";
    span.appendChild(text);

    if (task.deadline) {
      const deadlineText = document.createElement("small");
      deadlineText.textContent = "Deadline: " + task.deadline;
      deadlineText.className = "block text-sm text-gray-600";
      span.appendChild(deadlineText);
    }

    // ! ✅ tombol selesai
    const doneBtn = document.createElement("button");
    doneBtn.innerHTML = "✅";
    doneBtn.className = "ml-2 text-green-500 hover:text-green-700";
    doneBtn.onclick = () => toggleTask(index, true);

    // ! ❌ tombol belum selesai
    const undoneBtn = document.createElement("button");
    undoneBtn.innerHTML = "❌";
    undoneBtn.className = "ml-1 text-yellow-500 hover:text-yellow-700";
    undoneBtn.onclick = () => toggleTask(index, false);

    // ! ✏️ Tombol edit
    const editBtn = document.createElement("button");
    editBtn.innerHTML = "✏️";
    editBtn.className = "ml-2 text-blue-500 hover:text-blue-700";
    editBtn.onclick = () => {
      const input = document.createElement("input");
      input.type = "text";
      input.value = task.text;
      input.className = "flex-1 px-2 py-1 border rounded focus:outline-none";
      input.onkeypress = (e) => {
        if (e.key === "Enter") {
          if (regexTextOnly.test(input.value.trim())) {
            task.text = input.value.trim();
            saveTasks();
            renderTasks();
          } else {
            alert("Eitssss Tugas cuma boleh berisi huruf dan spasi.");
          }
        }
      };
      input.onblur = () => {
        if (regexTextOnly.test(input.value.trim())) {
          task.text = input.value.trim();
          saveTasks();
          renderTasks();
        }
      };
      li.replaceChild(input, span);
      input.focus();
    };

    // !🗑️ Tombol hapus + konfirmasi
    const deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = "🗑️";
    deleteBtn.className = "ml-2 text-red-500 hover:text-red-700";
    deleteBtn.onclick = () => {
      if (confirm("Di apus nih beneran?")) {
        deleteTask(index);
      }
    };

    li.appendChild(span);
    li.appendChild(doneBtn);
    li.appendChild(undoneBtn);
    li.appendChild(editBtn);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
  });
}

function addTask() {
  const text = taskInput.value.trim();
  const deadline = deadlineInput.value;

  if (!text || !regexTextOnly.test(text)) {
    alert("Oyyyyy Tugas cuma boleh huruf dan ga boleh kosong.");
    return;
  }

  if (!deadline) {
    alert("Harus di isi ya tanggal deadlinenya biar kepikiran.");
    return;
  }

  tasks.push({ text, done: false, deadline });
  saveTasks();
  taskInput.value = "";
  deadlineInput.value = "";
  renderTasks();
}

function toggleTask(index, value) {
  tasks[index].done = value;
  saveTasks();
  renderTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// !Event listener tombol tambah
addTaskBtn.addEventListener("click", addTask);
taskInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addTask();
});

// TODO Filter
document.querySelectorAll(".filter-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    filter = btn.dataset.filter;
    document.querySelectorAll(".filter-btn").forEach((b) => {
      b.classList.remove("bg-blue-500", "text-white");
      b.classList.add("bg-gray-200");
    });
    btn.classList.remove("bg-gray-200");
    btn.classList.add("bg-blue-500", "text-white");
    renderTasks();
  });
});

// Set default tombol aktif
document.querySelector('.filter-btn[data-filter="all"]').classList.add("bg-blue-500", "text-white");

// Render awal
renderTasks();
