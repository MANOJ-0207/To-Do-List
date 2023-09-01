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

updateTasksDiv(taskTypeSelected);

function addTab()
{   
    document.getElementById("addSection").classList.toggle("hidden");
    document.getElementById("tasksSection").classList.toggle("hidden");    
}

function addTask()
{
    var task={};
    task.name=document.getElementById("task").value;
    task.description=document.getElementById("description").value;
    task.date=document.getElementById("date").value;
    task.time=document.getElementById("time").value;
    var taskType=document.querySelector('input[name="type"]:checked').value;
    task.type=taskType
    var allTasks=JSON.parse(localStorage.getItem("tasks"));
    var tasksArray=getTasksArray(allTasks,taskType);
    tasksArray.push(task);
    setTasksArray(allTasks,tasksArray,taskType);
    localStorage.setItem("tasks",JSON.stringify(allTasks));
    console.log("Added");
    updateTasksDiv(taskTypeSelected);
    console.log(tasksArray);
    addTab();
    resetInput();
}

function calculateTimeDiff(taskDeadLine)
{
    var parts=taskDeadLine.split("/");
    var deadLineDate=new Date(parts[1]+"/"+parts[0]+"/"+parts[2]);
    var today=new Date().getTime();
    var difference=deadLineDate.getTime()-today;
    // console.log(difference);
    var days = Math.floor(difference / (1000 * 60 * 60 * 24));
    var hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    if(days>=0 && hours>=0)
        return days + " days "+ hours +" hours to go";
    return "Deadline Passed";
}

function changeTaskType()
{
    taskTypeSelected=document.getElementById("taskType").value;
    updateTasksDiv(taskTypeSelected);
}

function createTaskDiv(task,i)
{
    var taskDiv=document.createElement('div');
    taskDiv.classList.add("task");
    taskDiv.setAttribute("id",(i+task.type));
    var logoDiv=document.createElement('div');
    logoDiv.classList.add("logo");
    logoDiv.innerHTML="T";
    logoDiv.setAttribute("onclick","completeTask('"+(i+task.type)+"','"+task.type+"',"+i+")");
    taskDiv.appendChild(logoDiv);
    var taskContent=document.createElement('div');
    taskContent.classList.add("taskContent");
    taskContent.innerHTML=`<h2>${task.name}</h2><span>${task.description}</span`
    taskDiv.appendChild(taskContent);
    var timeRemaining=document.createElement('div');
    timeRemaining.classList.add("remainingTime");
    timeRemaining.setAttribute("id",i+task.type+"RemainingTime");
    var deadLine=calculateTimeDiff(task.date+" "+task.time);
    timeRemaining.innerHTML=deadLine;
    taskDiv.appendChild(timeRemaining);
    var closeButton=document.createElement('div');
    closeButton.classList.add("closeButton");
    closeButton.setAttribute("id",i+task.type+"CloseButton");
    closeButton.innerHTML=`<button class="closeButton" onclick="deleteTask(`+i+`,'`+task.type+`')"><i class="fa-solid fa-x"></i></button>`;
    taskDiv.appendChild(closeButton);
    return taskDiv;
}

function completeTask(taskDivId,taskType,taskId)
{   
    var taskDiv=document.getElementById(taskDivId);
    taskDiv.classList.add("completed");
    taskDiv.firstChild.innerHTML='<i class="fa-solid fa-check"></i>';
    document.getElementById(taskDivId+"RemainingTime").innerHTML="";
    document.getElementById(taskDivId+"CloseButton").innerHTML="";
    var allTasks=JSON.parse(localStorage.getItem("tasks"));
    var tasksArray=getTasksArray(allTasks,taskType);
    if(taskId==0)
        tasksArray.shift();
    else
        tasksArray.splice(taskId,taskId);
    setTasksArray(allTasks,tasksArray,taskType);
    updateCount();
}

function deleteTask(taskId,taskType)
{
    var allTasks=JSON.parse(localStorage.getItem("tasks"));
    var tasksArray=getTasksArray(allTasks,taskType);
    if(taskId==0)
        tasksArray.shift();
    else
        tasksArray.splice(taskId,taskId);
    setTasksArray(allTasks,tasksArray,taskType);
    updateTasksDiv(taskTypeSelected);
    updateCount();
}

function fillCheck() 
{
    if (document.getElementById("task").value.length === 0 || 
    document.getElementById("description").value.length === 0 || 
    document.getElementById("date").value.length === 0 ||
    document.getElementById("time").value.length === 0)
        document.getElementById("submitButton").style.cursor="not-allowed";
    else
        document.getElementById("submitButton").style.cursor="pointer";
}

function getTasksArray(allTasks,taskTypeSelected)
{
    var allTasks=JSON.parse(localStorage.getItem("tasks"));
    var tasksArray;
    switch(taskTypeSelected)
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

function updateCount(taskType)
{
    var allTasks=JSON.parse(localStorage.getItem("tasks"));
    var tasksArray=getTasksArray(allTasks,taskType);
    var taskCount=tasksArray.length;
    document.getElementById("count").innerHTML=taskCount;
}

function updateTasksDiv(taskTypeSelected)
{
    var allTasks=JSON.parse(localStorage.getItem("tasks"));
    var tasksArray=getTasksArray(allTasks,taskTypeSelected);
    var len=tasksArray.length;
    var tasksList=document.getElementById("tasksList");
    var taskContainer=document.getElementById("tasksContainer");
    taskContainer.classList.remove("hidden");
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
        while(tasksList.firstChild)
            tasksList.removeChild(tasksList.firstChild);
        for(var i=0;i<len;i++)
        {
            var task=tasksArray[i];
            var taskDiv=createTaskDiv(task,i);
            tasksList.appendChild(taskDiv);    
        }
        updateCount(task);
    }
}
