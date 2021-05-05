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
    document.getElementById("dueTime").value = "";
    document.getElementById("eTaskTitle").value = "";
    document.getElementById("eDueDate").value = "";
    document.getElementById("eDueTime").value = "";
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
        dataRow.getElementById("tDueTime").textContent = taskList[i].dueTime;
        dataRow.getElementById("tCompleted").textContent = taskList[i].completed;
        dataRow.getElementById("tId").textContent = taskList[i].id;
        dataRow.getElementById("tButtons").setAttribute("data-id", taskList[i].id);
        dataRow.getElementById("tTable").setAttribute("data-id", taskList[i].id);

        resultsBody.appendChild(dataRow);
    }
}

function createNewTask() {
    let tasks = getTasks();

    
    let task = {
        created: `${new Date().toLocaleString().split(',')[0]}`,
        title: document.getElementById("taskTitle").value,
        dueDate: parseDate(document.getElementById("dueDate").value),
        dueTime: parseTime(document.getElementById("dueTime").value),
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

    let completed = data[5].textContent;
    if(completed == "false"){
        data[0].classList.add("complete");
        data[1].classList.add("complete");
        data[2].classList.add("complete");
        data[3].classList.add("complete");
        data[5].textContent = "true";
        tasks[index].completed = "true";
        localStorage.setItem("tasks", JSON.stringify(tasks));
        button.classList.remove("btn-success");
        button.classList.add("btn-secondary");
    }
    else if (completed == "true"){
        data[0].classList.remove("complete");
        data[1].classList.remove("complete");
        data[2].classList.remove("complete");
        data[3].classList.remove("complete");
        data[5].textContent = "false";
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
    if(allTasks[index].completed == "true"){
        editError();
        return;
    }
    $(function () { $('#editTask').modal(); })
    
    document.getElementById("eTaskTitle").value = allTasks[index].title;
    document.getElementById("eDueDate").value = unparseDate(allTasks[index].dueDate);
    document.getElementById("eDueTime").value = unparseTime(allTasks[index].dueTime);
    document.getElementById("editModal").setAttribute("data-id", currentId);
}


function editSaveTask(button) {
    let tasks = getTasks();
    let id = button.getAttribute("data-id");
    let index = getIndex(id);
    tasks[index].title = document.getElementById("eTaskTitle").value;
    tasks[index].dueDate = parseDate(document.getElementById("eDueDate").value);
    tasks[index].dueTime = parseTime(document.getElementById("eDueTime").value);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    displayData(tasks);
}

function editError(){
    Swal.fire(
        'Task is already completed!',
        'Mark as incomplete before editing',
        'error'
    )
}

function deleteTask(button){
    $('[data-tooltip="tooltip"]').tooltip('hide');
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

function getDigits(d) {
    if (d < 10) {
        if(d[0] == 0 && d[1] != 0){
            return d;
        }
        else{
            return `0${d}`;
        }
    }
    return d;
}

function parseDate(d){
    let result = d.split('-');
    for(let i = 0; i < result.length; i++){
        if (result[i] == '') {
            let date = new Date();
            result[0] = getDigits(date.getMonth() + 1);
            result[1] = getDigits(date.getDate());
            result[2] = date.getFullYear();
            return `${result[0]}/${result[1]}/${result[2]}`;
        }
    }
    return `${result[1]}/${result[2]}/${result[0]}`;
}

function unparseDate(date){
    let result = date.split('/');
    result[0] = getDigits(result[0]);
    result[1] = getDigits(result[1]);
    return `${result[2]}-${result[0]}-${result[1]}`;
}

function parseTime(t) {
    let time = t.split(':');
    if (t == "") {
        let date = new Date();
        let hrs = getDigits(date.getHours());
        let min = getDigits(date.getMinutes());
        if (parseInt(hrs) > 12) {
            return  `${parseInt(hrs) - 12}:${min} PM`;
        } else if (arseInt(hrs) < 12) {
            return  `${hrs}:${min} AM`;
        }
    }
    else{
        if (parseInt(time[0]) > 12) {
            return  `${parseInt(time[0]) - 12}:${time[1]} PM`;
        } else if (parseInt(time[0]) < 12) {
            return  `${time[0]}:${time[1]} AM`;
        }
        return `${time[0]}:${time[1]} PM`;
    }
}

function unparseTime(t){
    let fullTime = t.split(' ');
    let time = fullTime[0].split(':');
    let meridian = fullTime[1];
    let newTime = "";
    if(meridian == "PM"){
        if (parseInt(time[0]) == 12) {
            return newTime += `${parseInt(time[0])}:${time[1]}`;
        } else{
            return  newTime += `${parseInt(time[0]) + 12}:${time[1]}`;
        }
    }
    else {
        return newTime += `${time[0]}:${time[1]}`;
    }
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


function tTip(){
    $('[data-tooltip="tooltip"]').tooltip(
        {
            delay:{show: 150, hide: 100}
        }
    );
}

function tTipHide(){
    $('[data-tooltip="tooltip"]').tooltip('hide');
}

function clearAllTasks(){
    Swal.fire({
    title: 'Delete All Tasks?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete them!'
    }).then((result) => {
    if (result.isConfirmed) {
        Swal.fire(
            'Deleted!',
            'Your Tasks has been deleted.',
            'success'
        )
        localStorage.clear();
    }
        displayData(getTasks());
    })
}

function filterTitle(){
    let tasks = getTasks();
    tasks.sort(function(task1, task2){
    if (task1.title.toLowerCase() < task2.title.toLowerCase()) {
        return -1;
    }
    if (task1.title.toLowerCase() > task2.title.toLowerCase()) {
        return 1;
    }
    return 0;
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
    displayData(tasks);
}

function filterDueTime(){
    let tasks = getTasks();
    tasks.sort(function (task1, task2) {
        if(task1.created == task2.created){
            time1 = unparseTime(task1.dueTime);
            time2 = unparseTime(task2.dueTime);
            if (time1 < time2) {
                return -1;
            }
            if (time1 > time2) {
                return 1;
            }
            return 0;
        }
        else{
            if (task1.created < task2.created) {
                return -1;
            }
            if (task1.created > task2.created) {
                return 1;
            }
            return 0;
        }
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
    displayData(tasks);
}

function filterDueDate(){
    let tasks = getTasks();
    tasks.sort(function(task1, task2){
    if (task1.dueDate < task2.dueDate) {
        return -1;
    }
    if (task1.dueDate > task2.dueDate) {
        return 1;
    }
    return 0;
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
    displayData(tasks);
}

function filterCreated(){
    let tasks = getTasks();
    tasks.sort(function(task1, task2){
    if (task1.created < task2.created) {
        return -1;
    }
    if (task1.created > task2.created) {
        return 1;
    }
    return 0;
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
    displayData(tasks);
}
