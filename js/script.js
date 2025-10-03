'use strict';

const skills = {
  data: [
    { title: "html", level: 30, icon: "html.svg" },
    { title: "css", level: 10, icon: "css.svg" },
    { title: "python", level: 45, icon: "python.svg" },
    { title: "c++", level: 50, icon: "c++.svg" }
  ],

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

      const div = document.createElement("div");
      div.textContent = `${skill.level}%`;
      div.style.width = skill.level + "%";

      dd.append(div);
      parentElement.append(dt, dd);
    });
  },

  getComparer(prop) {
    return function(a, b) {
      if (a[prop] > b[prop]) return 1;
      if (a[prop] < b[prop]) return -1;
      return 0;
    };
  },

  sortList(type) {
    if (this.sortMode !== type) {
      this.data.sort(this.getComparer(type));
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
  if (event.target.nodeName === "BUTTON") {
    const type = event.target.dataset.type;
    skills.sortList(type);
  }
});


const navBtn = document.querySelector(".nav-btn");
const navMenu = document.querySelector(".main-nav");

const menu = {
  open() {
    navMenu.classList.remove("main-nav_closed");
    navBtn.classList.remove("nav-btn_open");
    navBtn.classList.add("nav-btn_close");
    navBtn.textContent = "Закрыть меню";
  },

  close() {
    navMenu.classList.add("main-nav_closed");
    navBtn.classList.remove("nav-btn_close");
    navBtn.classList.add("nav-btn_open");
    navBtn.textContent = "Открыть меню";
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
