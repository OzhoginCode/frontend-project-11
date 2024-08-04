const handleProcessState = (elements, processState) => {
  switch (processState) {
    case 'filling':
      elements.submitButton.disabled = false;
      break;

    case 'validating':
      elements.submitButton.disabled = true;
      break;

    default:
      throw new Error(`Unknown process state: ${processState}`);
  }
};

const handleProcessError = (error) => {
  console.error(error);
};

const renderList = (urls, listContainer) => {
  if (!urls.length) {
    listContainer.innerHTML = '';
    return;
  }

  const ul = document.createElement('ul');
  urls.forEach((url) => {
    const li = document.createElement('li');
    li.textContent = url;
    ul.prepend(li);
  });

  listContainer.innerHTML = '';
  listContainer.appendChild(ul);
};

const handleChangeRssList = (elements, urls) => {
  const { input, listContainer } = elements;

  renderList(urls, listContainer);

  input.value = '';
  input.focus();
};

const render = (elements) => (path, value) => {
  switch (path) {
    case 'process.processState':
      handleProcessState(elements, value);
      break;

    case 'process.processError':
      handleProcessError(value);
      break;

    case 'form.valid':
      elements.input.classList.toggle('is-invalid', !value);
      break;

    case 'form.error':
      elements.inputError.innerHTML = value;
      break;

    case 'rssList':
      handleChangeRssList(elements, value);
      break;

    default:
      break;
  }
};

export default render;
