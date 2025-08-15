document.addEventListener("DOMContentLoaded", function() {
    const header = document.querySelector("header"); // 
    const mainContent = document.querySelector("body"); 

    function adjustPadding() {
        const headerHeight = header.offsetHeight;
        mainContent.style.paddingTop = headerHeight + "px";
    }

    adjustPadding();
    window.addEventListener("resize", adjustPadding); 
});

fetch('Picture/world.svg')
  .then(res => res.text())
  .then(svg => {
    document.getElementById('map').innerHTML = svg;
  });

let scale = 1;
const map = document.getElementById("map");

document.querySelector(".zoom-in").addEventListener("click", () => {
    scale += 0.1;
    map.style.transform = `scale(${scale})`;
    map.style.transformOrigin = "center";
});

document.querySelector(".zoom-out").addEventListener("click", () => {
    scale -= 0.1;
    if (scale < 0.1) scale = 0.1;
    map.style.transform = `scale(${scale})`;
    map.style.transformOrigin = "center";
});