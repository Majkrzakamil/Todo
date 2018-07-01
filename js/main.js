var tasks = [];
var rows = [];
var selectedIds = [];

var paginationConfig = {
    currentPage: 0,
    rowsPerPage: 5,
    pagesNo: null,
    offset: null
}

var sortDirection = 'asc';
var sortProperty = 'description';

window.onload = function() {
    const submitButton = document.getElementById('submit');
    submitButton.addEventListener('click', addTask);

    const clearSelectedButton = document.getElementById('clear-selected');
    clearSelectedButton.addEventListener('click', removeSelected);

    const descriptionSortButton = document.getElementById('description-sort');
    descriptionSortButton.addEventListener('click', sort);

    const prioritySortButton = document.getElementById('priority-sort');
    prioritySortButton.addEventListener('click', sort);

    const checkboxSortButton = document.getElementById('checkbox-sort');
    checkboxSortButton.addEventListener('click', sort);

    const nextButton = document.getElementById('next');
    nextButton.addEventListener('click', nextPage);

    const previousButton = document.getElementById('previous');
    previousButton.addEventListener('click', previousPage);

    const rowsPerPageSelect = document.getElementById('rows-per-page');
    rowsPerPageSelect.addEventListener('change', updateRowsPerPage);

    const input = document.getElementById('description');
    input.addEventListener('keyup', function(e) {
        if (e.keyCode === 13) {
            addTask();
        }
    });

    disablePagination();
    loadTasks();
    updatePagination();
    afterTasksUpdate();
}

function loadTasks() {
    let tasksInMemory = localStorage.getItem('tasks');
    if (tasksInMemory) {
        tasks = JSON.parse(tasksInMemory);
    }
}

function updatePagination() {
    paginationConfig.pagesNo = Math.ceil(tasks.length / paginationConfig.rowsPerPage);
}

function addTask() {
    const input = document.getElementById('description');
    const priority = document.getElementById('priority');

    let newTask = {
        id: Math.random().toString(36).substr(5),
        description: input.value.trim(),
        priority: priority.value,
        isDone: false
    };

    if (validateTask(newTask)) {
        tasks.push(newTask);
        input.value = '';
        updatePagination();
        afterTasksUpdate();
    }
}

function validateTask(newTask) {
    let isValid = true;

    if (!newTask.description) {
        alert('Please fill description');
        isValid = false;
    }

    tasks.forEach(t => {
        if (t.description === newTask.description) {
            alert('Task with such description already exists');
            isValid = false;
        }
    });

    return isValid;
}

function removeTask(e) {
    const id = e.target.id;
    tasks = tasks.filter(t => t.id !== id);
    updatePagination();
    afterTasksUpdate();
}

function disablePagination() {
    const config = paginationConfig;

    const nextButton = document.getElementById('next');
    const previousButton = document.getElementById('previous');

    if(config.pagesNo < 2){
        nextButton.disabled = true;
        previousButton.disabled = true;
        nextButton.classList.add('disabled');
        previousButton.classList.add('disabled');
    } else if(config.currentPage === 0 && config.pagesNo > 1){
        nextButton.disabled = false;
        previousButton.disabled = true;
        nextButton.classList.remove('disabled');
        previousButton.classList.add('disabled');
    } else if(config.currentPage === config.pagesNo - 1){
        nextButton.disabled = true;
        previousButton.disabled = false;
        nextButton.classList.add('disabled');
        previousButton.classList.remove('disabled');
    } else {
        nextButton.disabled = false;
        previousButton.disabled = false;
        nextButton.classList.remove('disabled');
        previousButton.classList.remove('disabled');
    }
}

function onSelect(e) {
    const id = e.target.id

    if (e.target.checked) {
        selectedIds.push(id);
        
        task = tasks.find(t => t.id === id);
        task.isDone = e.target.checked;
        console.log(task.isDone);
    } else {
        selectedIds = selectedIds.filter(id => {
            id !== e.target.id;
        });
        task = tasks.find(t => t.id === id);
        task.isDone = e.target.checked;
        console.log(task.isDone);
    }
    updateLocalStorage();
}

function removeSelected() {
    tasks = tasks.filter(t =>
        selectedIds.indexOf(t.id) === -1
    );

    selectedIds = [];
    updatePagination();
    afterTasksUpdate();
}

function clearAll() {
    tasks = [];
    updatePagination();
    afterTasksUpdate();
}

function sort(e) {
    
    const buttonId = e.target.id;
    const buttonClass = e.target.classList;
    const descriptionButton = document.getElementById('description-sort');
    const priorityButton = document.getElementById('priority-sort');
    const checkboxButton = document.getElementById('checkbox-sort');

    sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    
    sortByDescription = ((taskA, taskB) => {
        const descA = taskA.description.toLowerCase();
        const descB = taskB.description.toLowerCase();
        return sortDirection === 'asc' 
            ? descA < descB
            : descA > descB;
    });

    const priorities = {
        'Low': 0, 
        'Mid': 1,
        'High': 2
    };

    sortByPriority = ((taskA, taskB) => {
        const priorityA = priorities[taskA.priority];
        const priorityB = priorities[taskB.priority];
        return sortDirection === 'asc'
            ? priorityA > priorityB
            : priorityA < priorityB;
    });

    const checkbox = {
        'false': 0,
        'true': 1,
    }

    sortByCheckbox = ((taskA, taskB) => {
        const checkboxA = checkbox[String(taskA.isDone)];
        const checkboxB = checkbox[String(taskB.isDone)];
        return sortDirection === 'asc'
            ? checkboxA > checkboxB
            : checkboxA < checkboxB;
    });

    if (buttonId === 'description-sort') {
        tasks.sort(sortByDescription);
        buttonClass.remove('ud-arrow');

        priorityButton.classList.remove('u-arrow');
        priorityButton.classList.remove('d-arrow');
        priorityButton.classList.add('ud-arrow');

        checkboxButton.classList.remove('u-arrow');
        checkboxButton.classList.remove('d-arrow');
        checkboxButton.classList.add('ud-arrow');
        
        if(sortDirection === 'asc'){
            buttonClass.remove('u-arrow');
            buttonClass.add('d-arrow');
        } else {
            buttonClass.remove('d-arrow');
            buttonClass.add('u-arrow');
        }
    } 
    else if (buttonId === 'priority-sort') {
        tasks.sort(sortByPriority);
        buttonClass.remove('ud-arrow');

        descriptionButton.classList.remove('u-arrow');
        descriptionButton.classList.remove('d-arrow');
        descriptionButton.classList.add('ud-arrow');

        checkboxButton.classList.remove('u-arrow');
        checkboxButton.classList.remove('d-arrow');
        checkboxButton.classList.add('ud-arrow');

        if(sortDirection === 'asc'){
            buttonClass.remove('u-arrow');
            buttonClass.add('d-arrow');
        } else {
            buttonClass.remove('d-arrow');
            buttonClass.add('u-arrow');
        }
    } else if(buttonId === 'checkbox-sort'){
        tasks.sort(sortByCheckbox);
        buttonClass.remove('ud-arrow');

        descriptionButton.classList.remove('u-arrow');
        descriptionButton.classList.remove('d-arrow');
        descriptionButton.classList.add('ud-arrow');

        priorityButton.classList.remove('u-arrow');
        priorityButton.classList.remove('d-arrow');
        priorityButton.classList.add('ud-arrow');

        if(sortDirection === 'asc'){
            buttonClass.remove('u-arrow');
            buttonClass.add('d-arrow');
        } else {
            buttonClass.remove('d-arrow');
            buttonClass.add('u-arrow');
        }
    }

    

    afterTasksUpdate();
}

function emptyPage() {
    const message = document.getElementById("todoList");
    
    if(rows.length === 0 && paginationConfig.currentPage !== 0) {
        paginationConfig.currentPage = 0;
        afterTasksUpdate();
    } else if(rows.length === 0) {
        message.classList.add('message');
        message.innerHTML = 'Add task to your list.';
    } else {
        message.classList.remove('message');
    }
}

function updateRowsPerPage(e) {
    paginationConfig.rowsPerPage = parseInt(e.target.value);
    updatePagination();
    afterTasksUpdate();
}

function nextPage() {
    pager('next');
}

function previousPage() {
    pager('previous');
}

function pager(action) {
    
    const config = paginationConfig; 

    switch (action) {
        case 'next':
            if ((config.currentPage + 1) < config.pagesNo) { 
                ++config.currentPage;
            }
            break;
         
        case 'previous':
            if ((config.currentPage - 1) >= 0){
                --config.currentPage;
            }
            break;
        
        default:
            break;
    }

    afterTasksUpdate();
}

function afterTasksUpdate() {
    updateLocalStorage();
    updateRowsToBeDisplayed();
    updateView();
    disablePagination();
}

function updateRowsToBeDisplayed() {
    rows = [];
    const config = paginationConfig;
    const start = (config.currentPage !== 0) ?
                   config.currentPage * config.rowsPerPage :
                   0;
    const end = start + config.rowsPerPage;

    for (i = start; i < end && i < tasks.length; i++) {
        let task = tasks[i];
        if (task) {
            rows.push(task);
        }
    }
}

function updateLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function updateView() {

    const ul = document.getElementById("todoList");
    const displayRows = document.getElementById("display-rows");
    const config = paginationConfig;
    const start = (config.currentPage !== 0) ?
                   config.currentPage * config.rowsPerPage + 1:
                   1;

    const end = (config.currentPage === config.pagesNo - 1) ?
                tasks.length :
                start + config.rowsPerPage - 1 ;

    displayRows.innerHTML = start + " - " + end + " of " + tasks.length;

    ul.innerHTML = '';

    rows.forEach(t => {

        const li = document.createElement('li');
        const checkbox = document.createElement('input');
        const taskSpan = document.createElement('span');
        const prioritySpan = document.createElement('span');
        const deleteSpan = document.createElement('span');
        
        checkbox.id = t.id;        
        checkbox.type = 'checkbox';
        checkbox.checked = t.isDone;
        checkbox.onclick = onSelect;

        taskSpan.innerHTML = t.description;
        prioritySpan.innerHTML = t.priority;
        
        deleteSpan.setAttribute('id', t.id);
        // deleteSpan.innerHTML = "&nbsp;&#10007;&nbsp;";
        deleteSpan.onclick = removeTask;

        li.appendChild(taskSpan);
        li.appendChild(prioritySpan);
        li.appendChild(checkbox);
        li.appendChild(deleteSpan);

        ul.appendChild(li);
    });

    emptyPage();
}

