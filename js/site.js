function loadTasks() {
    let tasks = getTasks();
    displayData(tasks);
}


function getTasks() {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    localStorage.setItem("tasks", JSON.stringify(tasks));
    return tasks;
}

function clearModals(){
    document.getElementById("taskTitle").value = "";
    document.getElementById("dueDate").value = "";
    document.getElementById("eTaskTitle").value = "";
    document.getElementById("eDueDate").value = "";
    
}

function displayData(taskList) {
    const template = document.getElementById("Data-Template");
    const resultsBody = document.getElementById("resultsBody");
    resultsBody.innerHTML = "";    // clear table first

    for (let i = 0; i < taskList.length; i++) {
        const dataRow = template.content.cloneNode(true);

        dataRow.getElementById("tTitle").textContent = taskList[i].title;
        dataRow.getElementById("tCreated").textContent = taskList[i].created;
        dataRow.getElementById("tDueDate").textContent = taskList[i].dueDate;
        dataRow.getElementById("tCompleted").textContent = taskList[i].completed;
        dataRow.getElementById("tId").textContent = taskList[i].id;
        dataRow.getElementById("tButtons").setAttribute("data-id", taskList[i].id);
        dataRow.getElementById("tTable").setAttribute("data-id", taskList[i].id);

        resultsBody.appendChild(dataRow);
    }
}


function saveNewTask() {
    let tasks = getTasks();

    let task = {
        created: `${new Date()}`,
        title: document.getElementById("taskTitle").value,
        dueDate: document.getElementById("dueDate").value,
        completed: "false",
        id: generateId()
    };

    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    displayData(tasks);
}


function isDone(button){
    const resultsBody = document.getElementById("resultsBody");
    const trHead = button.parentElement.parentElement;
    const currentId = trHead.getAttribute("data-id");
    const data = trHead.querySelectorAll("td");
    
    let id = button.parentElement.getAttribute("data-id");
    let index = getIndex(id);
    let tasks = getTasks();

    let completed = data[4].textContent;
    if(completed == "false"){
        data[0].classList.add("complete");
        data[1].classList.add("complete");
        data[2].classList.add("complete");
        data[4].textContent = "true";
        tasks[index].completed = "true";
        localStorage.setItem("tasks", JSON.stringify(tasks));
        button.classList.remove("btn-success");
        button.classList.add("btn-secondary");
    }
    else if (completed == "true"){
        data[0].classList.remove("complete");
        data[2].classList.remove("complete");
        data[1].classList.remove("complete");
        data[4].textContent = "false";
        tasks[index].completed = "false";
        localStorage.setItem("tasks", JSON.stringify(tasks));
        button.classList.remove("btn-secondary");
        button.classList.add("btn-success");
    }
}

function editTask(button){
    const resultsBody = document.getElementById("resultsBody");
    const data = resultsBody.querySelectorAll("td");
    const currentId = button.parentElement.getAttribute("data-id");
    let index = getIndex(currentId);
    let allTasks = getTasks();
    document.getElementById("eTaskTitle").value = allTasks[index].title;
    document.getElementById("eDueDate").value = allTasks[index].dueDate;
    document.getElementById("editModal").setAttribute("data-id", currentId);
}


function editSaveTask(m) {
    let tasks = getTasks();
    let id = m.getAttribute("data-id");
    let index = getIndex(id);
    tasks[index].title = document.getElementById("eTaskTitle").value;
    tasks[index].dueDate = document.getElementById("eDueDate").value;
    localStorage.setItem("tasks", JSON.stringify(tasks));
    displayData(tasks);
}


function deleteTask(button){
    const resultsBody = document.getElementById("resultsBody");
    const data = resultsBody.querySelectorAll("td");
    const currentId = button.parentElement.getAttribute("data-id");
    let index = getIndex(currentId);
    let allTasks = getTasks();
    let result = allTasks.splice(index, 1);
    localStorage.setItem("tasks", JSON.stringify(allTasks));
    displayData(allTasks);
}


function generateId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}


function getIndex(id) {
    let tasks = JSON.parse(localStorage.getItem("tasks"));
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].id === id) {
            return i;
        }
    }
    return "Couldn't Find Task";
}


function findById(id) {
    let tasks = JSON.parse(localStorage.getItem("tasks"));
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].id === id) {
            return tasks[i];
        }
    }
    return "Couldn't Find Task";
}


function qTooltip(icon, isHover) {
    if (isHover) {
        icon.classList.remove("fa-question-circle");
        icon.classList.remove("fas");
        icon.classList.add("far");
        icon.classList.add("fa-question-circle");
        $('[data-toggle="tooltip"]').tooltip();
    } else {
        icon.classList.remove("fa-question-circle");
        icon.classList.remove("far");
        icon.classList.add("fas");
        icon.classList.add("fa-question-circle");
    }
}
