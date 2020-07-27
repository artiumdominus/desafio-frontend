import './reset.css';
import './style.scss';

const cardTemplate = require('./card.pug');
const tableTemplate = require('./table.pug');

window.onload = () => {
  
  if (window.addEventListener) {
    document.addEventListener('DOMMouseScroll', dealScroll, false);
  }
  document.onmousewheel = dealScroll;

  document.getElementById('sobre_link').addEventListener('click', () => {
    smoothScroll(home);
  })
  
  document.getElementById('desafio_link').addEventListener('click', () => {
    smoothScroll(home, () => { smoothScroll(sobre); });
  })

  loadUser("artiumdominus");
}

const home = document.getElementById('home');
const sobre = document.getElementById('sobre');
const card = document.getElementById('card');

function dealScroll(event) {
  let delta = 0;

  if (!event) event = window.event;

  if (event.wheelDelta) {
    delta = event.wheelDelta / 60;
  } else if (event.detail) {
    delta -= event.detail / 2;
  }

  const frames = [home, sobre];
  const deltaToUp = delta < 0;

  while (frames.length > 0) {
    let frame = deltaToUp ? frames.shift() : frames.pop();
    let currentPosition = frame.offsetTop;
    if (deltaToUp ? currentPosition > -window.innerHeight : currentPosition < 0) {
      let nextPosition = parseInt(currentPosition) + (delta * 20);
      frame.style.top =
       `${
          deltaToUp
            ? (nextPosition > -window.innerHeight ? nextPosition : -window.innerHeight)
            : (nextPosition < 0 ? nextPosition : 0)
        }px`;
      break;
    }
  }
}

function smoothScroll(frame, callback = undefined, delta = 20) {
  let currentPosition = frame.offsetTop;

  if (currentPosition > -window.innerHeight) {
    frame.style.top = `${currentPosition - delta}px`;

    setTimeout(() => {
      smoothScroll(frame, callback, delta - 0.01);
    })
  } else {
    frame.style.top = -window.innerHeight;
    if (callback !== undefined) {
      setTimeout(() => {
        callback();
      }, 250);
    }
  }
}

function getJSON(url) {
  return new Promise((resolve, reject) => {
    const xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
      if (this.readyState === 4 && this.status === 200) {
        const obj = JSON.parse(this.responseText);
        resolve(obj);
      }
    }

    xhttp.open('GET', url, true);
    xhttp.send();
  });
}

async function loadUser(username) {
  const userModel = await getJSON(`https://api.github.com/users/${username}`);

  card.innerHTML = cardTemplate(userModel);

  document.getElementById('ver_repositorios').addEventListener('click', () => {
    loadTable(`https://api.github.com/users/${username}/repos`, 'Lista dos Repositórios');
  });
  document.getElementById('ver_favoritos').addEventListener('click', () => {
    loadTable(`https://api.github.com/users/${username}/starred`, 'Lista dos Favoritos');
  });
}

async function loadTable(url, title) {
  const reposModel = await getJSON(url);

  card.classList.add('listing');
  const repos = reposModel.slice(0, 10);
  document.querySelector('.table-column').innerHTML = tableTemplate({ title, repos });
}
