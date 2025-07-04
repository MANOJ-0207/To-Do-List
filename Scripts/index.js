if(localStorage.getItem("tasks")==null)
    initializeLocalStorage();

function initializeLocalStorage()
{
    var allTasks={};
    allTasks.Personal=[];
    allTasks.Business=[];
    allTasks.Other=[];
    localStorage.setItem("tasks",JSON.stringify(allTasks));
}

var taskTypeSelected="Personal";
var taskStatusSelected = "all";

updateTasksDiv();

function addTab()
{   
    document.getElementById("addSection").classList.toggle("hidden");
    document.getElementById("tasksSection").classList.toggle("hidden");    
}

function addTask() {
    if (fillCheck()) {
        var task = {
            name: document.getElementById("task").value,
            description: document.getElementById("description").value,
            date: document.getElementById("date").value,
            time: document.getElementById("time").value,
            type: document.querySelector('input[name="type"]:checked').value,
            status: "Pending"
        };

        var allTasks = JSON.parse(localStorage.getItem("tasks"));
        var tasksArray = getTasksArray(task.type);
        tasksArray.push(task);
        setTasksArray(allTasks, tasksArray, task.type);
        localStorage.setItem("tasks", JSON.stringify(allTasks));
        updateTasksDiv();
        addTab();
        resetInput();
    }
}

function calculateTimeDiff(dateStr, timeStr) {
    let deadline = new Date(`${dateStr}T${timeStr}`);
    let now = new Date();
    let diff = deadline - now;

    if (diff <= 0) return "Deadline Passed";

    let days = Math.floor(diff / (1000 * 60 * 60 * 24));
    let hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return `${days} days ${hours} hours to go`;
}

function changeTaskType()
{
    taskTypeSelected=document.getElementById("taskType").value;
    updateTasksDiv();
    updateCount();
}

function changeTaskStatusSelected(taskStatus)
{
    deselectAll();
    document.getElementById(taskStatus).classList.add("selected");
    document.getElementById(taskStatus+'DropDown').classList.add("selectedDropDown");
    taskStatusSelected = taskStatus;
    updateTasksDiv();
}

function createTaskDiv(task,i)
{
    var taskDiv=document.createElement('div');
    taskDiv.classList.add("task");
    var taskDivID=(i+task.type);
    taskDiv.setAttribute("id",taskDivID);

    var logoDiv=document.createElement('div');
    logoDiv.classList.add("logo");
    logoDiv.innerHTML="T";
    logoDiv.setAttribute("onclick","completeTask('"+(i+task.type)+"','"+task.type+"',"+i+")");
    taskDiv.appendChild(logoDiv);

    var taskContent=document.createElement('div');
    taskContent.classList.add("taskContent");
    taskContent.innerHTML=`<h2>${task.name}</h2><span>${task.description}</span>`
    taskDiv.appendChild(taskContent);

    var timeRemaining=document.createElement('div');
    timeRemaining.classList.add("remainingTime");
    timeRemaining.setAttribute("id",(i+task.type)+"RemainingTime");
    let deadLine = calculateTimeDiff(task.date, task.time);
    timeRemaining.innerHTML=deadLine;
    taskDiv.appendChild(timeRemaining);

    var closeButton=document.createElement('div');
    closeButton.classList.add("closeButton");
    closeButton.setAttribute("id",i+task.type+"CloseButton");
    closeButton.innerHTML=`<button class="closeButton" onclick="deleteTask(`+i+`,'`+task.type+`')"><i class="fa-solid fa-x"></i></button>`;
    taskDiv.appendChild(closeButton);

    tasksList.appendChild(taskDiv);    
    if(task.status!="Pending")
        completeTask(taskDivID,task.type,i);
}

function completeTask(taskDivId,taskType,taskId)
{   
    var taskDiv=document.getElementById(taskDivId);
    var task=getTask(taskType,taskId);
    task.status="Completed";
    setTask(taskType,taskId,task);
    taskDiv.classList.add("completed");
    var logoDiv=taskDiv.firstChild;
    logoDiv.setAttribute("onclick","unCompleteTask('"+taskType+"',"+taskId+")");
    logoDiv.innerHTML='<i class="fa-solid fa-check"></i>';
    document.getElementById(taskDivId+"RemainingTime").innerHTML="";
    document.getElementById(taskDivId+"CloseButton").innerHTML="";
    var allTasks=JSON.parse(localStorage.getItem("tasks"));
    location.reload;
    updateCount();
}

function unCompleteTask(taskType,taskId)
{
    var task=getTask(taskType,taskId);
    task.status="Pending";
    setTask(taskType,taskId,task);
    updateTasksDiv();
    updateCount();
}

function clearCompletedTasks()
{
    var allTasks=JSON.parse(localStorage.getItem("tasks"));
    var tasksArray=getTasksArray(taskTypeSelected);
    tasksArray=tasksArray.filter(task => task.status !== "Completed");
    console.log(allTasks,tasksArray,taskTypeSelected);
    setTasksArray(allTasks,tasksArray,taskTypeSelected);
    updateTasksDiv();
    document.getElementById("dropDown").classList.toggle("show");
}

function deselectAll()
{
    var taskStatusDiv=document.getElementById("taskStatusTypes");
    var statusTypes=taskStatusDiv.children;
    for(var i=0;i<3;i++)
    {
        statusTypes[i].classList.remove("selected");
    }
    var dropDown=document.getElementById("dropDown");
    var dropDownButtons=dropDown.children;
    for(var i=0;i<3;i++)
    {
        dropDownButtons[i].classList.remove("selectedDropDown");
    }
}
function deleteTask(taskId,taskType)
{
    var allTasks=JSON.parse(localStorage.getItem("tasks"));
    var tasksArray=getTasksArray(taskType);
    if(taskId==0)
        tasksArray.shift();
    else
        tasksArray.splice(taskId,taskId);
    console.log(tasksArray);
    setTasksArray(allTasks,tasksArray,taskType);
    console.log(localStorage.getItem("tasks"));
    updateTasksDiv();
    updateCount();
}
function dropDown() 
{
  document.getElementById("dropDown").classList.toggle("show");
}
function fillCheck() {
    const task = document.getElementById("task").value.trim();
    const description = document.getElementById("description").value.trim();
    const date = document.getElementById("date").value;
    const time = document.getElementById("time").value;
    const submitButton = document.getElementById("submitButton");

    if (!task) {
        alert("Please enter a task name.");
        submitButton.style.cursor = "not-allowed";
        return false;
    }

    if (!description) {
        alert("Please enter a task description.");
        submitButton.style.cursor = "not-allowed";
        return false;
    }

    if (!date) {
        alert("Please select a valid date.");
        submitButton.style.cursor = "not-allowed";
        return false;
    }

    if (!time) {
        alert("Please select a valid time.");
        submitButton.style.cursor = "not-allowed";
        return false;
    }

    const taskDateTime = new Date(`${date}T${time}`);
    const now = new Date();

    if (isNaN(taskDateTime.getTime())) {
        alert("Invalid date or time format.");
        submitButton.style.cursor = "not-allowed";
        return false;
    }

    if (taskDateTime <= now) {
        alert("Please select a future date and time.");
        submitButton.style.cursor = "not-allowed";
        return false;
    }

    submitButton.style.cursor = "pointer";
    return true;
}


function getTasksArray(taskType)
{
    var allTasks=JSON.parse(localStorage.getItem("tasks"));
    var tasksArray;
    switch(taskType)
    {
        case ("Other"):
            tasksArray = allTasks.Other;
            break;
        case ("Business"):
            tasksArray = allTasks.Business;
            break;
        default:
            tasksArray = allTasks.Personal;
    }
    return tasksArray;
}

function getTask(taskType,i)
{   
    var tasksArray=getTasksArray(taskType);
    return tasksArray[i];
}   

function resetInput()
{
    document.getElementById("task").value='';
    document.getElementById("description").value='';
    document.getElementById("date").value='';
    document.getElementById("time").value='';
}

function setTasksArray(allTasks,tasksArray,taskType)
{ 
    switch(taskType)
    {
        case ("Other"):
            allTasks.Other = tasksArray;
            break;
        case ("Business"):
            allTasks.Business = tasksArray;
            break;
        case ("Personal"):
            allTasks.Personal=tasksArray;
    }
    localStorage.setItem("tasks",JSON.stringify(allTasks));
}

function setTask(taskType,i,task)
{
    var tasksArray=getTasksArray(taskType);
    tasksArray[i]=task;
    var allTasks=JSON.parse(localStorage.getItem("tasks"));
    setTasksArray(allTasks,tasksArray,taskType);
}

function updateCount()
{
    var tasksArray=getTasksArray(taskTypeSelected);
    var len=tasksArray.length;
    var pendingCount=0;
    var totalCount=len;
    var completeCount=0;
    for(var i=0;i<len;i++)
    {
        var task=tasksArray[i];
        if(task.status=="Pending")
            pendingCount++;
        else
            completeCount++;
    }
    if(taskStatusSelected=="all")
        document.getElementById("count").innerHTML=totalCount;
    else if(taskStatusSelected=="completed")
        document.getElementById("count").innerHTML=completeCount;
    else
        document.getElementById("count").innerHTML=pendingCount;
}

function updateTasksDiv()
{
    var tasksArray=getTasksArray(taskTypeSelected);
    var allTasks=JSON.parse(localStorage.getItem("tasks"));
    var len=tasksArray.length;
    var tasksList=document.getElementById("tasksList");
    var taskContainer=document.getElementById("tasksContainer");
    taskContainer.classList.remove("hidden");
    while(tasksList.firstChild)
            tasksList.removeChild(tasksList.firstChild);
    if(allTasks.Personal.length==0 && allTasks.Other.length==0 && allTasks.Business.length==0)
    {
        taskContainer.classList.add("hidden");
        return;
    }
    else if(len==0)
    {
        tasksList.innerHTML="<h1> --- Nill ---</h1>"
    }
    else
    {
        var containsTasks=false;
        for(var i=0;i<len;i++)
        {
            var task=tasksArray[i];
            if(taskStatusSelected=="completed")
            {
                if(task.status=="Completed")
                {
                    createTaskDiv(task,i);
                    containsTasks=true;
                }
            }
            else if(taskStatusSelected=="active")
            {
                if(task.status=="Pending")
                {
                    createTaskDiv(task,i);
                    containsTasks=true;
                }
                    
            }
            else if(taskStatusSelected=="all")
            {
                createTaskDiv(task,i);
                containsTasks=true;
            }
        }
        updateCount();
    }
}

function dropDown() {
    const dropdown = document.getElementById("dropDown");

    if (dropdown.classList.contains("show")) {
        dropdown.classList.remove("show");
        document.removeEventListener("click", handleOutsideClick);
    } else {
        dropdown.classList.add("show");
        setTimeout(() => {
            document.addEventListener("click", handleOutsideClick);
        }, 0); // wait to avoid immediate close
    }

    function handleOutsideClick(event) {
        const dropBtn = document.querySelector(".dropbtn");
        if (!dropdown.contains(event.target) && !dropBtn.contains(event.target)) {
            dropdown.classList.remove("show");
            document.removeEventListener("click", handleOutsideClick);
        }
    }
}
