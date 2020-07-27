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
    smoothScroll(home, () => {
      smoothScroll(sobre);
    });
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

  const homeCurrentPosition = home.offsetTop;
  const sobreCurrentPosition = sobre.offsetTop;

  if (delta < 0) {
    if (homeCurrentPosition > -window.innerHeight) {
      const homeNextPosition = parseInt(homeCurrentPosition) + (delta * 20);
      home.style.top =
        `${homeNextPosition > -window.innerHeight
            ? homeNextPosition
            : -window.innerHeight}px`;
    } else if (sobreCurrentPosition > -window.innerHeight) {
      const sobreNextPosition = parseInt(sobreCurrentPosition) + (delta * 20);
      sobre.style.top =
        `${sobreNextPosition > -window.innerHeight
            ? sobreNextPosition
            : -window.innerHeight}px`;
    }
  } else if (delta > 0) {
    if (sobreCurrentPosition < 0) {
      const sobreNextPosition = parseInt(sobreCurrentPosition) + (delta * 20);
      sobre.style.top =
        `${sobreNextPosition < 0 ? sobreNextPosition : 0}px`;
    } else if (homeCurrentPosition < 0) {
      const homeNextPosition = parseInt(homeCurrentPosition) + (delta * 20);
      home.style.top =
        `${homeNextPosition < 0 ? homeNextPosition : 0}px`;
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

function getJSON(url, handler) {
  const xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function() {
    if (this.readyState === 4 && this.status === 200) {
      const obj = JSON.parse(this.responseText);
      handler(obj);
    }
  }

  xhttp.open('GET', url, true);
  xhttp.send();
}

function loadUser(username) {
  getJSON(`https://api.github.com/users/${username}`, userModel => {

    card.innerHTML = cardTemplate(userModel);

    document.getElementById('ver_repositorios').addEventListener('click', () => {
      loadTable(`https://api.github.com/users/${username}/repos`, 'Lista dos Repositórios');
    });
    document.getElementById('ver_favoritos').addEventListener('click', () => {
      loadTable(`https://api.github.com/users/${username}/starred`, 'Lista dos Favoritos');
    });
  });
}

function loadTable(url, title) {
  getJSON(url, reposModel => {
    card.classList.add('listing');
    const repos = reposModel.slice(0, 10);
    document.querySelector('.table-column').innerHTML = tableTemplate({ title, repos });
  });
}
