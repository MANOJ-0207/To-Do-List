function resetLocalStorage()
{
    var tasks=[];
    localStorage.setItem("tasks",JSON.stringify(tasks));
    console.log(localStorage.getItem("tasks").length)
}
// resetLocalStorage()

var taskTypeSelected="Personal";
updateTasksDiv();

function addTab()
{   
    document.getElementById("addSection").classList.add("hidden");
    document.getElementById("tasksSection").classList.remove("hidden");    
}

function addTask()
{
    var task={};
    task.name=document.getElementById("task").value;
    task.description=document.getElementById("description").value;
    task.date=document.getElementById("date").value;
    task.time=document.getElementById("time").value;
    task.type=document.querySelector('input[name="type"]:checked').value;
    var tasksArray=JSON.parse(localStorage.getItem("tasks"));
    tasksArray.push(task);
    localStorage.setItem("tasks",JSON.stringify(tasksArray));
    console.log("Added");
    updateTasksDiv();
    console.log(tasksArray);
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
}

function deleteTask(taskId)
{
    var tasksArray=JSON.parse(localStorage.getItem("tasks"));
    if(taskId==0)
        tasksArray.shift();
    else
        tasksArray.splice(taskId,taskId);
    localStorage.setItem("tasks",JSON.stringify(tasksArray));
    console.log(tasksArray);
    updateTasksDiv();
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

function updateCount()
{
    var taskCount=JSON.parse(localStorage.getItem("tasks")).length;
    document.getElementById("count").innerHTML=taskCount;
}

function updateTasksDiv()
{
    var tasksArray=JSON.parse(localStorage.getItem("tasks"));
    var len=tasksArray.length;
    if(len===0)
    {
        document.getElementById("tasksContainer").classList.add("hidden");
        return;
    }
    else
    {
        document.getElementById("tasksContainer").classList.remove("hidden");
    }
    var tasksList=document.getElementById("tasksList")
    while(tasksList.firstChild)
        tasksList.removeChild(tasksList.firstChild);
    for(var i=0;i<len;i++)
    {
        var task=tasksArray[i];
        var taskDiv=document.createElement('div');
        taskDiv.classList.add("task");
        var logoDiv=document.createElement('div');
        logoDiv.classList.add("logo");
        logoDiv.innerHTML="T";
        taskDiv.appendChild(logoDiv);
        var taskContent=document.createElement('div');
        taskContent.classList.add("taskContent");
        taskContent.innerHTML=`<h2>${task.name}</h2><span>${task.description}</span`
        taskDiv.appendChild(taskContent);
        var timeRemaining=document.createElement('div');
        timeRemaining.classList.add("remainingTime");
        // console.log(task.date+" "+task.time)
        var deadLine=calculateTimeDiff(task.date+" "+task.time);
        timeRemaining.innerHTML=deadLine;
        taskDiv.appendChild(timeRemaining);
        var closeButton=document.createElement('div');
        closeButton.classList.add("closeButton");
        closeButton.innerHTML='<button class="closeButton" onclick="deleteTask('+i+')"><i class="fa-solid fa-x"></i></button>';
        taskDiv.appendChild(closeButton);
        tasksList.appendChild(taskDiv);    
    }
    document.getElementById("tasksSection").classList.add("hidden");
    document.getElementById("addSection").classList.remove("hidden");
    updateCount();
}
