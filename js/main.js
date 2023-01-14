const bookshelfs = [];
const RENDER_EVENT = 'render-bookshelf';
const SAVED_EVENT = 'saved-bookshelf';
const STORAGE_KEY = 'BOOKSHELF_APPS';

function generateId() {
  return +new Date();
}

function generateBookshelfObject(id, task, penulis, tahunTerbit, isComplete) {
  return {
    id,
    task,
    penulis,
    tahunTerbit,
    isComplete,
  }
}

function findBookshelf(bookshelfId) {
  for (const bookshelfItem of bookshelfs) {
    if (bookshelfItem.id === bookshelfId) {
      return bookshelfItem;
    }
  }
  return null;
}

function findBookshelfIndex(bookshelfId) {
  for (const index in bookshelfs) {
    if (bookshelfs[index].id === bookshelfId) {
      return index;
    }
  }
  return -1;
}

function isStorageExist() {
  if (typeof (Storage) === undefined) {
    alert('Browser kamu tidak mendukung local storage');
    return false;
  }
  return true;
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(bookshelfs);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const bookshelf of data) {
      bookshelfs.push(bookshelf);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}


function makeBookshelf(bookshelfObject) {
  const {id, task, penulis, tahunTerbit, isComplete} = bookshelfObject;

  const textTitle = document.createElement('h2');
  textTitle.innerText = task;

  const textTimestamp = document.createElement('h3');
  textTimestamp.innerText = 'Karya : '+ penulis;
  
  const textTYear = document.createElement('h3');
  textTYear.innerText = 'Tahun : '+ tahunTerbit;

  const textContainer = document.createElement('div');
  textContainer.classList.add('inner');
  textContainer.append(textTitle, textTimestamp, textTYear);

  const container = document.createElement('div');
  container.classList.add('item', 'shadow')
  container.append(textContainer);
  container.setAttribute('id', `bookshelf-${id}`);

  if (isComplete) {
    const undoButton = document.createElement('button');
    undoButton.classList.add('undo-button');
    undoButton.addEventListener('click', function () {
      undoTaskFromCompleted(id);
    });

    const trashButton = document.createElement('button');
    trashButton.classList.add('trash-button');
    trashButton.addEventListener('click', function () {
      removeTaskFromCompleted(id);
    });

    container.append(undoButton, trashButton);
  } else {

    const checkButton = document.createElement('button');
    checkButton.classList.add('check-button');
    checkButton.addEventListener('click', function () {
      addTaskToCompleted(id);
    });

    const trashButton = document.createElement('button');
    trashButton.classList.add('trash-button');
    trashButton.addEventListener('click', function () {
      removeTaskFromCompleted(id);
    });

    container.append(checkButton, trashButton);
  }

  return container;
}

function addBookshelf() {
  const textBookshelf = document.getElementById('title').value;
  const penulis = document.getElementById('author').value;
  const tahunTerbit = document.getElementById('year').value;

  const generatedID = generateId();
  const bookshelfObject = generateBookshelfObject(generatedID, textBookshelf, penulis, tahunTerbit, false);
  bookshelfs.push(bookshelfObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function addTaskToCompleted(bookshelfId) {
  const bookshelfTarget = findBookshelf(bookshelfId);

  if (bookshelfTarget == null) return;

  bookshelfTarget.isComplete = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function removeTaskFromCompleted(bookshelfId) {
  const bookshelfTarget = findBookshelfIndex(bookshelfId);

  if (bookshelfTarget === -1) return;

  bookshelfs.splice(bookshelfTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function undoTaskFromCompleted(bookshelfId) {

  const bookshelfTarget = findBookshelf(bookshelfId);
  if (bookshelfTarget == null) return;

  bookshelfTarget.isComplete = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

document.addEventListener('DOMContentLoaded', function () {

  const submitForm = document.getElementById('form');

  submitForm.addEventListener('submit', function (event) {
    event.preventDefault();
    addBookshelf();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

document.addEventListener(SAVED_EVENT, () => {
  console.log('Data berhasil di simpan.');
});

document.addEventListener(RENDER_EVENT, function () {
  const uncompletedBookshelfList = document.getElementById('bookshelfs');
  const listCompleted = document.getElementById('completed-bookshelfs');

  uncompletedBookshelfList.innerHTML = '';
  listCompleted.innerHTML = '';

  for (const bookshelfItem of bookshelfs) {
    const bookshelfElement = makeBookshelf(bookshelfItem);
    if (bookshelfItem.isComplete) {
      listCompleted.append(bookshelfElement);
    } else {
      uncompletedBookshelfList.append(bookshelfElement);
    }
  }
})