'use strict';


function getComparer(prop) {
  return function(a, b) {
    if (a[prop] > b[prop]) return 1;
    if (a[prop] < b[prop]) return -1;
    return 0;
  };
}


const skills = {
  data: [],

getData(path) {
  const sectionSkills = document.querySelector(".section-skills");
  const sortButtons = document.querySelectorAll(".skills-sort button");

  sortButtons.forEach(btn => btn.disabled = true);

  fetch(path)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Ошибка загрузки: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      this.data = data;
      this.generateList(skillList);

      sortButtons.forEach(btn => btn.disabled = false);
    })
    .catch(error => {
  console.error('Не удалось загрузить список навыков:', error);

  const errorMessage = document.createElement("div");
  errorMessage.classList.add("skills-error");
  errorMessage.innerHTML = `
    <p>Не удалось загрузить список навыков.<br>
    Проверьте путь к файлу или соединение с сервером.</p>
    <button type="button" class="retry-btn">Повторить</button>
  `;
  sectionSkills.append(errorMessage);

  const retryButton = errorMessage.querySelector(".retry-btn");
  retryButton.addEventListener("click", () => {
    errorMessage.remove(); 
    this.getData(path);
  });
});

},



  sortMode: null, 

  generateList(parentElement) {
    parentElement.innerHTML = "";

    this.data.forEach(skill => {
      const dt = document.createElement("dt");
      dt.classList.add("skill-item");
      dt.textContent = skill.title;
      dt.style.backgroundImage = `url(img/${skill.icon})`;

      const dd = document.createElement("dd");
      dd.classList.add("skill-level");

      const bar = document.createElement("div");
      bar.textContent = `${skill.level}%`;
      bar.style.width = skill.level + "%";

      dd.append(bar);
      parentElement.append(dt, dd);
    });
  },

  sortList(type) {
    if (this.sortMode !== type) {
      this.data.sort(getComparer(type));
      this.sortMode = type;
    } else {
      this.data.reverse();
    }

    this.generateList(skillList);
  }
};


const skillList = document.querySelector(".skill-list");
skills.generateList(skillList);


const sortBlock = document.querySelector(".skills-sort");
sortBlock.addEventListener("click", function(event) {
  if (event.target && event.target.nodeName === "BUTTON") {
    const type = event.target.dataset.type; 
    skills.sortList(type);
  }
});

const navBtn = document.querySelector(".nav-btn");
const navMenu = document.querySelector(".main-nav");
const navBtnLabel = navBtn.querySelector(".visually-hidden");

const menu = {
  open() {
    navMenu.classList.remove("main-nav_closed");
    navBtn.classList.remove("nav-btn_open");
    navBtn.classList.add("nav-btn_close");
    navBtnLabel.textContent = "Закрыть меню";
    navBtn.setAttribute('aria-expanded', 'true');
  },

  close() {
    navMenu.classList.add("main-nav_closed");
    navBtn.classList.remove("nav-btn_close");
    navBtn.classList.add("nav-btn_open");
    navBtnLabel.textContent = "Открыть меню";
    navBtn.setAttribute('aria-expanded', 'false');
  }
};


menu.close();


navBtn.addEventListener("click", function() {
  if (navBtn.classList.contains("nav-btn_open")) {
    menu.open();
  } else {
    menu.close();
  }
});

const themeSwitch = document.querySelector('#switch');

themeSwitch.checked = document.body.classList.contains('dark-theme');

const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
  document.body.classList.add('dark-theme');
  themeSwitch.checked = true;
} else {
  document.body.classList.remove('dark-theme');
  themeSwitch.checked = false;
}


themeSwitch.addEventListener('change', function() {
  if (this.checked) {
    document.body.classList.add('dark-theme');
    localStorage.setItem('theme', 'dark'); 
  } else {
    document.body.classList.remove('dark-theme');
    localStorage.setItem('theme', 'light');
  }
});

skills.getData('db/skills.json');