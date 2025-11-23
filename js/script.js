"use strict";

function getComparer(prop) {
  return function (a, b) {
    if (a[prop] > b[prop]) return 1;
    if (a[prop] < b[prop]) return -1;
    return 0;
  };
}

const skills = {
  data: [],
  list: null,
  sortButtons: null,
  section: null,
  sortMode: null,

  init(listElement, sortButtons, sectionElement) {
    this.list = listElement;
    this.sortButtons = sortButtons;
    this.section = sectionElement;
  },

  generateList() {
    this.list.innerHTML = "";

    this.data.forEach((skill) => {
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
      this.list.append(dt, dd);
    });
  },

  sortList(type) {
    if (this.data.length === 0) return;

    if (this.sortMode !== type) {
      this.data.sort(getComparer(type));
      this.sortMode = type;
    } else {
      this.data.reverse();
    }

    this.generateList();
  },

  showError(message, path) {
    const errorBlock = document.createElement("div");
    errorBlock.className = "skills-error";

    const text = document.createElement("p");
    text.textContent = message;

    const retryBtn = document.createElement("button");
    retryBtn.textContent = "Повторить";
    retryBtn.className = "retry-btn";

    retryBtn.addEventListener("click", () => {
      errorBlock.remove();
      this.getData(path);
    });

    errorBlock.append(text, retryBtn);
    this.section.append(errorBlock);
  },

  getData(path) {
    this.sortButtons.forEach((btn) => (btn.disabled = true));

    fetch(path)
      .then((response) => {
        if (!response.ok) throw new Error(`Ошибка загрузки: ${response.status}`);
        return response.json();
      })
      .then((data) => {
        if (!Array.isArray(data)) {
          throw new Error("Неверный формат JSON — ожидается массив.");
        }

        this.data = data;
        this.generateList();
        this.sortButtons.forEach((btn) => (btn.disabled = false));
      })
      .catch((error) => {
        console.error(error);
        this.showError("Не удалось загрузить список навыков.", path);
      });
  }
};



document
  .querySelector(".skills-sort")
  .addEventListener("click", function (event) {
    if (event.target.tagName === "BUTTON") {
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
    navBtn.setAttribute("aria-expanded", "true");
  },

  close() {
    navMenu.classList.add("main-nav_closed");
    navBtn.classList.remove("nav-btn_close");
    navBtn.classList.add("nav-btn_open");
    navBtnLabel.textContent = "Открыть меню";
    navBtn.setAttribute("aria-expanded", "false");
  },
};

menu.close();

navBtn.addEventListener("click", function () {
  if (navBtn.classList.contains("nav-btn_open")) {
    menu.open();
  } else {
    menu.close();
  }
});


const themeSwitch = document.querySelector("#switch");

if (themeSwitch) {
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "dark") {
    document.body.classList.add("dark-theme");
    themeSwitch.checked = true;
  } else {
    document.body.classList.remove("dark-theme");
    themeSwitch.checked = false;
  }

  themeSwitch.addEventListener("change", function () {
    if (this.checked) {
      document.body.classList.add("dark-theme");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark-theme");
      localStorage.setItem("theme", "light");
    }
  });
}

const listElement = document.querySelector(".skill-list");
const sortButtons = document.querySelectorAll(".skills-sort button");
const sectionElement = document.querySelector(".section-skills");

skills.init(listElement, sortButtons, sectionElement);
skills.getData("db/skills.json");

