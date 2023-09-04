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

function addTask()
{
    if(fillCheck())
    {
        var task={};
        task.name=document.getElementById("task").value;
        task.description=document.getElementById("description").value;
        task.date=document.getElementById("date").value;
        task.time=document.getElementById("time").value;
        var taskType=document.querySelector('input[name="type"]:checked').value;
        task.type=taskType;
        task.status="Pending";
        var allTasks=JSON.parse(localStorage.getItem("tasks"));
        var tasksArray=getTasksArray(taskType);
        tasksArray.push(task);
        setTasksArray(allTasks,tasksArray,taskType);
        localStorage.setItem("tasks",JSON.stringify(allTasks));
        updateTasksDiv();
        addTab();
        resetInput();
    }
    else
    {
        alert("Please Enter All Details about the task");
    }
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
    var deadLine=calculateTimeDiff(task.date+" "+task.time);
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
    var tasksArray=getTasksArray(taskTypeSelected);
    var len=tasksArray.length;
    for(var i=0;i<len;i++)
    {
        var task=tasksArray[i];
        if(task.status==="Completed")
            deleteTask(i,taskTypeSelected);
    }
    updateTasksDiv();
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
function fillCheck() 
{
    if (document.getElementById("task").value.length === 0 || 
    document.getElementById("description").value.length === 0 || 
    document.getElementById("date").value.length === 0 ||
    document.getElementById("time").value.length === 0)
    {
        document.getElementById("submitButton").style.cursor="not-allowed";
        return false;
    }
    else
        document.getElementById("submitButton").style.cursor="pointer";
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
