import {
  done,
  cancel,
  getList,
  add,
  getWorkersList,
} from './async-action';
import { store$, errorAction, clearErrorAction } from './store';

import './main.css';

const form = <HTMLFormElement>document.getElementById('form');
const job = <HTMLInputElement>document.getElementById('job');
const assignee = <HTMLSelectElement>document.getElementById('assignee');
const attachment = <HTMLInputElement>document.getElementById('attachment');
const list = document.getElementById('list');
const errorTxt = document.getElementById('error-text');
const loadingTxt = document.getElementById('loading-text');

if (form && job && assignee && attachment) {
  form.onsubmit = (event) => {
    event.preventDefault();
    store$.dispatch(clearErrorAction());
    if (
      !job.value ||
      !assignee.options[assignee.selectedIndex] ||
      !attachment?.files
    ) {
      store$.dispatch(errorAction('form isian tidak lengkap!'));
      return;
    }
  
    // register user
    store$.dispatch<any>(
      add({
        job: job.value,
        assignee_id: assignee.options[assignee.selectedIndex].value,
        attachment: attachment?.files[0],
      })
    );
  
    // reset form
    form.reset();
  };
}

// presentation layer
store$.subscribe(() => {
  const state = store$.getState();
  render(state);
});
const state = store$.getState();
render(state);

store$.dispatch<any>(getList);
store$.dispatch<any>(getWorkersList);

function render(state) {
  // render error
  if(errorTxt){
    if (state.error) {
      errorTxt.textContent = state.error.toString();
    } else {
      errorTxt.textContent = '';
    }
  }
  if(loadingTxt){
    if (state.loading) {
      // loadingTxt.style = '';
      loadingTxt.style.display = 'unset';
    } else {
      loadingTxt.style.display = 'none';
    }
  }

  if(assignee){
    // add asignee options
    assignee.innerHTML = '';
    for (let i = 0; i < state.workers.length; i++) {
      const worker = state.workers[i];
      const option = document.createElement('option');
      option.text = worker.name;
      option.value = worker.id;
      assignee.add(option);
    }
  }

  if(list){
    // render list of worker
    list.innerHTML = '';
    for (let i = 0; i < state.tasks.length; i++) {
      const task = state.tasks[i];
      const li = document.createElement('div');
      let innerHtml = `
        <a href="${task.attachment}" target="_blank">lampiran</a>
        <span>${task.job}</span> -
        <span>${task.assignee}</span>
      `;
      if (task.done) {
        innerHtml += '\n<span>sudah selesai</span>';
        li.innerHTML = innerHtml;
      } else {
        const cancelBtn = document.createElement('button');
        cancelBtn.innerText = 'batal';
        cancelBtn.onclick = function () {
          store$.dispatch<any>(cancel(task.id));
        };
        const doneBtn = document.createElement('button');
        doneBtn.innerText = 'selesai';
        doneBtn.onclick = function () {
          store$.dispatch<any>(done(task.id));
        };
        li.innerHTML = innerHtml;
        li.append(cancelBtn, doneBtn);
      }
      list.append(li);
    }
  }
}
