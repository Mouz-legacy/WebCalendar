import "../css/calendar.css";
import "../css/style.css";
import "../css/login.css";
import { calendarPage } from "../components/calendar";
import {
  signInWithEmail,
  signUpWithEmail,
  monitorAuthState,
  backUpData,
  signOutFromApp,
} from "../api";
import { signOut } from "firebase/auth";

const routesHtml = {
  404: "/html/404.html",
  "": "/html/calendar.html",
  "/": "/html/calendar.html",
  "/calendar": "/html/calendar.html",
  "/register": "/html/register.html",
  "/login": "/html/login.html",
  "/event": "/html/event.html",
  "/dayevent": "/html/dayevent.html",
};

const routesNavigationLinks = {
  "/calendar": "calendar-id",
  "/login": "login-id",
  "/register": "register-id",
  "default-page": "calendar-id",
};

const monthKeyValuePairs = {
  0: "January",
  1: "February",
  2: "March",
  3: "April",
  4: "May",
  5: "June",
  6: "July",
  7: "August",
  8: "September",
  9: "October",
  10: "November",
  11: "December",
};

const dayKeyValuePairs = {
  0: "Sunday",
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
};

const monthNumberKeyValuePairs = {
  January: 0,
  February: 1,
  March: 2,
  April: 3,
  May: 4,
  June: 5,
  July: 6,
  August: 7,
  September: 8,
  October: 9,
  November: 10,
  December: 11,
};

const countDaysInMonthKeyValuePairs = {
  January: 31,
  February: 28,
  March: 31,
  April: 30,
  May: 31,
  June: 30,
  July: 31,
  August: 31,
  September: 30,
  October: 31,
  November: 30,
  December: 31,
};

let user = {
  name: "",
  events: [],
  id: "",
};

const setUser = (userAccount) => {
  user = userAccount;
};

const route = (event) => {
  event = event || window.event;
  event.preventDefault();
  window.history.pushState({}, "", event.target.href);
  handleLocation();
};

const handleLocation = async () => {
  const path = window.location.pathname;
  if (path == "/event" || path == "/dateEvent") {
    switch (path) {
      case "/event":
        const route = routesHtml[path] || routesHtml[404];
        const html = await fetch(route).then((data) => data.text());
        document.getElementById("main-page").innerHTML = html;
        break;
      case "/dateEvent":
        break;
    }
    registerEventListeners(path);
  } else {
    const route = routesHtml[path] || routesHtml[404];
    const html = await fetch(route).then((data) => data.text());
    document.getElementById("main-page").innerHTML = html;
    const navigationRoute =
      routesNavigationLinks[path] || routesNavigationLinks["default-page"];
    handleNavigationLinks(navigationRoute);
    registerEventListeners(path);
  }
};

const checkHtmlTagForClass = (element, customClass) => {
  return document.getElementById(element).classList.contains(customClass);
};

const handleNavigationLinks = (id) => {
  let keys = Object.keys(routesNavigationLinks);
  keys.forEach((key) => {
    if (checkHtmlTagForClass(routesNavigationLinks[key], "button-header")) {
      document
        .getElementById(routesNavigationLinks[key])
        .classList.remove("button-header");
    }
  });
  document.getElementById(id).classList.add("button-header");
};

const calculateChoosenMonth = (month, year, direction) => {
  let chooseMonth = "";
  let date = new Date();
  if (month == undefined) {
    month = monthKeyValuePairs[date.getMonth()];
  }

  if (direction) {
    year = monthNumberKeyValuePairs[month] == 11 ? parseInt(year) + 1 : year;
    chooseMonth =
      monthNumberKeyValuePairs[month] + 1 > 11
        ? monthKeyValuePairs[0]
        : monthKeyValuePairs[monthNumberKeyValuePairs[month] + 1];
  } else {
    year = monthNumberKeyValuePairs[month] == 0 ? parseInt(year) - 1 : year;
    chooseMonth =
      monthNumberKeyValuePairs[month] - 1 < 0
        ? monthKeyValuePairs[11]
        : monthKeyValuePairs[monthNumberKeyValuePairs[month] - 1];
  }

  document.getElementById("currnet-month-year").textContent =
    chooseMonth + " " + year;
};

const compareEventsString = (date) => {
  var dateParts = date.split("/");
  if (user != undefined && user.events != undefined) {
    for (let i = 0; i < user.events.length; i++) {
      var datePicies = user.events[i].date.split("/");
      if (
        datePicies[0] == dateParts[0] &&
        datePicies[1] == dateParts[1] &&
        datePicies[2] == dateParts[2]
      ) {
        return true;
      }
    }
  }

  return false;
};

const loadEventsForCurrentMonth = () => {
  let currentDate = new Date();
  let date = document
    .getElementById("currnet-month-year")
    .textContent.split(" ");
  let countDays = countDaysInMonthKeyValuePairs[date[0]];
  let firstDayOfWeekInMonth = new Date(
    parseInt(date[1]),
    monthNumberKeyValuePairs[date[0]]
  );
  let firstDay = (firstDayOfWeekInMonth.getDay() + 6) % 7;
  for (let i = firstDay + 1; i <= firstDay + countDays; i++) {
    document.getElementById(i).textContent = i - firstDay;
    document.getElementById(i).classList.remove("event");
    document.getElementById(i).classList.remove("active");
    document.getElementById(i).classList.remove("last-month");
  } // days of this month

  let prevMonthCountDays = 0;
  if (monthNumberKeyValuePairs[date[0]] == 0) {
    prevMonthCountDays = countDaysInMonthKeyValuePairs[monthKeyValuePairs[11]];
  } else {
    let monthNumber = monthNumberKeyValuePairs[date[0]] - 1;
    prevMonthCountDays =
      countDaysInMonthKeyValuePairs[monthKeyValuePairs[monthNumber]];
  }
  for (let i = firstDay; i > 0; i--) {
    document.getElementById(i).textContent = prevMonthCountDays + i - firstDay;
    document.getElementById(i).classList.remove("event");
    document.getElementById(i).classList.remove("active");
    document.getElementById(i).classList.add("last-month");
  }

  for (let i = firstDay + 1 + countDays; i < 43; i++) {
    document.getElementById(i).textContent = i - countDays - firstDay;
    document.getElementById(i).classList.remove("event");
    document.getElementById(i).classList.remove("active");
    document.getElementById(i).classList.add("last-month");
  }

  for (let i = 1; i < 43; i++) {
    if (document.getElementById(i).textContent < 10) {
      document.getElementById(i).textContent =
        "0" + document.getElementById(i).textContent;
    }
    let dateMonth = monthNumberKeyValuePairs[date[0]] + 1;
    if (dateMonth < 10) {
      dateMonth = "0" + dateMonth;
    }
    let dateEvent =
      document.getElementById(i).textContent + "/" + dateMonth + "/" + date[1];
    if (
      user != null &&
      user.events != null &&
      compareEventsString(dateEvent) &&
      !document.getElementById(i).classList.contains("last-month")
    ) {
      document.getElementById(i).classList.add("event");
      document.getElementById(i).classList.remove("last-month");
      document.getElementById(i).classList.remove("active");
    }
    if (
      (document.getElementById(i).textContent == currentDate.getDate() ||
        document.getElementById(i).textContent ==
          "0" + currentDate.getDate()) &&
      document.getElementById("currnet-month-year").textContent ==
        monthKeyValuePairs[currentDate.getMonth()] +
          " " +
          currentDate.getFullYear() &&
      !document.getElementById(i).classList.contains("last-month")
    ) {
      document.getElementById(i).classList.remove("event");
      document.getElementById(i).classList.remove("last-month");
      document.getElementById(i).classList.add("active");
    }
  }
};

const registerEventListeners = async (path) => {
  switch (path) {
    case "/event":
      document.getElementById("event-create").addEventListener("click", () => {
        const event = {
          description: document.getElementById("members").value,
          date: document.getElementById("date").value,
        };
        let regex = new RegExp(
          /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/
        );

        if (event.description != "" && regex.test(event.date)) {
          user.events.push(event);
          backUpData(user.id, user.events);
        }

        window.history.pushState({}, "", "/calendar");
        route();
      });
      document.getElementById("calendar-back").addEventListener("click", () => {
        window.history.pushState({}, "", "/calendar");
        route();
      });
      break;
    case "/login":
      document.getElementById("login-logout-id").textContent = "Login";
      document.getElementById("login-button").addEventListener("click", () => {
        let username = document.getElementById("username").value;
        let password = document.getElementById("password").value;
        window.history.pushState({}, "", "/calendar");
        route();
        signInWithEmail(username, password);

        if (document.getElementById("login-logout-id").textContent == "Login") {
          document.getElementById("login-logout-id").textContent = "Logout";
        } else {
          signOutFromApp();
        }
        handleNavigationLinks("calendar-id");
      });
      break;
    case "/register":
      document
        .getElementById("register-user-button")
        .addEventListener("click", () => {
          let email = document.getElementById("register-email").value;
          let username = document.getElementById("register-username").value;
          let password = document.getElementById("register-password").value;
          document.getElementById("main-page").innerHTML = calendarPage();
          signUpWithEmail(email, password);
          signInWithEmail(username, password);
        });
      break;
    case "":
    case "/":
    case "/calendar":
      if (document.getElementById("login-logout-id").textContent == "Login") {
        signOutFromApp();
        user = null;
      }

      let date = new Date();
      document.getElementById("current-day").textContent =
        dayKeyValuePairs[date.getDay()] + " " + date.getDate();
      document.getElementById("currnet-month-year").textContent =
        monthKeyValuePairs[date.getMonth()] + " " + date.getFullYear();
      loadEventsForCurrentMonth();
      for (let i = 1; i <= 42; i++) {
        document.getElementById(i).addEventListener("click", async () => {
          if (
            user != null &&
            user.events != null &&
            (document.getElementById(i).classList.contains("event") ||
              document.getElementById(i).classList.contains("active"))
          ) {
            // load
            // day-events
            let date = document
              .getElementById("currnet-month-year")
              .textContent.split(" ");
            let dateMonth = monthNumberKeyValuePairs[date[0]] + 1;
            if (dateMonth < 10) {
              dateMonth = "0" + dateMonth;
            }
            let dateEvent =
              document.getElementById(i).textContent +
              "/" +
              dateMonth +
              "/" +
              date[1];
            let events = user.events.filter((event) => event.date == dateEvent);
            const html = await fetch("/html/dayevent.html").then((data) =>
              data.text()
            );
            document.getElementById("main-page").innerHTML = html;
            window.history.pushState({}, "", "/dayevent");
            for (let i = 0; i < events.length; i++) {
              let node = document.createElement("dt");
              let textNode = document.createTextNode(
                i + 1 + ". " + " " + events[i].description
              );
              node.appendChild(textNode);
              document.getElementById("day-events").appendChild(node);
            }
            document
              .getElementById("calendar-back-dayevent")
              .addEventListener("click", () => {
                window.history.pushState({}, "", "/calendar");
                route();
              });
          }
        });
      }

      document.getElementById("arrow").addEventListener("click", async () => {
        let date = document
          .getElementById("currnet-month-year")
          .textContent.split(" ");
        calculateChoosenMonth(date[0], date[1], false);
        loadEventsForCurrentMonth();
      });
      document
        .getElementById("arrow-reverse")
        .addEventListener("click", async () => {
          let date = document
            .getElementById("currnet-month-year")
            .textContent.split(" ");
          calculateChoosenMonth(date[0], date[1], true);
          loadEventsForCurrentMonth();
        });
      break;
    case "/dayevent":
      document
        .getElementById("calendar-back-dayevent")
        .addEventListener("click", () => {
          window.history.pushState({}, "", "/calendar");
          route();
        });
      for (let i = 1; i <= 31; i++) {
        document.getElementById(i).addEventListener("click", async () => {
          let data = "info"; //get data about current user and events on this date
          const html = await fetch("/html/dayevent.html").then((data) =>
            data.text()
          );
          document.getElementById("main-page").innerHTML = html;
          window.history.pushState({}, "", "/dayevent");
          document
            .getElementById("calendar-back-dayevent")
            .addEventListener("click", () => {
              window.history.pushState({}, "", "/calendar");
              route();
            });
        });
      }
      break;
  }
};

window.onpopstate = handleLocation;
window.route = route;

handleLocation();
monitorAuthState(setUser);
