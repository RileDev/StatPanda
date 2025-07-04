const html = document.documentElement;
const userTheme = localStorage.getItem("theme");
const lightBtn = document.getElementById("light-link");
const darkBtn = document.getElementById("dark-link");

if(userTheme){
    html.setAttribute("data-bs-theme", userTheme);
}

darkBtn.addEventListener("click", () => {
    html.setAttribute("data-bs-theme", "dark");
    localStorage.setItem("theme", "dark");
})

lightBtn.addEventListener("click", () => {
    html.setAttribute("data-bs-theme", "light");
    localStorage.setItem("theme", "light");
})