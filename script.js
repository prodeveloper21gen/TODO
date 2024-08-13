const bon = document.querySelector('.bon'); 
const blok = document.querySelector('.blok');
const box = document.querySelector('.box');
const btnLight = document.querySelector('.btnLight');
const btnNight = document.querySelector('.btnNight');
const boxElement = document.querySelector('.box');
const apiUrl = 'https://66b99baffa763ff550f8d5e8.mockapi.io/apiBack/ApiBack';
const taskModal = document.getElementById('taskModal');
const modalTitle = document.getElementById('modalTitle');
const taskIdInput = document.getElementById('taskId');
const taskTitleInput = document.getElementById('taskTitle');
const taskDescriptionInput = document.getElementById('taskDescription');
const saveTaskButton = document.getElementById('saveTask');
const closeModalButton = document.querySelector('.close');

btnLight.onclick = () => {
    bon.style.backgroundColor = 'rgb(217, 241, 238)';
    bon.style.color = 'black';
    blok.style.backgroundColor = 'rgb(179, 199, 236)';
    btnLight.style.backgroundColor = 'black';
    btnNight.style.backgroundColor = 'rgb(217, 241, 238)';
}

btnNight.onclick = () => {
    bon.style.backgroundColor = 'rgb(2, 2, 2)';
    bon.style.color = 'white';
    blok.style.backgroundColor = 'rgb(19, 17, 27)';
    btnLight.style.backgroundColor = 'black';
    btnNight.style.backgroundColor = 'rgb(217, 241, 238)';
}

async function fetchTasks() {
    try {
        const response = await fetch(apiUrl);
        const tasks = await response.json();
        tasks.forEach(task => addTask(task.id, task.title, task.description, task.done));
    } catch (error) {
        console.error('Error fetching tasks:', error);
    }
}
function addTask(id, title, description) {
    const taskCard = document.createElement('div');
    taskCard.classList.add('taskcard');
    taskCard.setAttribute('data-id', id);
    taskCard.innerHTML = `
        <h3 class="taskzag">${title}</h3>
        <p class="taskdes">${description}</p>
        <button class="taskbtnEdit" onclick="editTask(this)">✏️</button>
        <button class="taskbtnEdit" onclick="deleteTask(this)">🗑️</button>
        <input class="taskcheckbox" type="checkbox" onclick="toggleDone(this)">
    `;
    boxElement.appendChild(taskCard);
}

async function createTask(title, description) {
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, description})
        });
        const newTask = await response.json();
        addTask(newTask.id, newTask.title, newTask.description);
    } catch (error) {
        console.error('Error creating task:', error);
    }
}

function editTask(element) {
    const taskCard = element.parentElement;
    const id = taskCard.getAttribute('data-id');
    const title = taskCard.querySelector('h3').innerText;
    const description = taskCard.querySelector('p').innerText;

    taskIdInput.value = id;
    taskTitleInput.value = title;
    taskDescriptionInput.value = description;
    modalTitle.innerText = 'Edit Task';
    taskModal.style.display = 'block';
}

async function updateTask(id, title, description) {
    try {
        await fetch(`${apiUrl}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, description })
        });

        const taskCard = document.querySelector(`.taskcard[data-id='${id}']`);
        taskCard.querySelector('h3').innerText = title;
        taskCard.querySelector('p').innerText = description;
    } catch (error) {
        console.error('Error updating task:', error);
    }
}

async function deleteTask(element) {
    const taskCard = element.parentElement;
    const id = taskCard.getAttribute('data-id');

    try {
        await fetch(`${apiUrl}/${id}`, {
            method: 'DELETE'
        });
        taskCard.remove();
    } catch (error) {
        console.error('Error deleting task:', error);
    }
}

document.querySelector('.btnAdd').addEventListener('click', () => {
    taskIdInput.value = '';
    taskTitleInput.value = '';
    taskDescriptionInput.value = '';
    modalTitle.innerText = 'Add Task';
    taskModal.style.display = 'block';
});

saveTaskButton.addEventListener('click', () => {
    const id = taskIdInput.value;
    const title = taskTitleInput.value;
    const description = taskDescriptionInput.value;

    if (id) {
        updateTask(id, title, description);
    } else {
        createTask(title, description);
    }
    taskModal.style.display = 'none';
});

closeModalButton.addEventListener('click', () => {
    taskModal.style.display = 'none';
});

fetchTasks();