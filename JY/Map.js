// Load SVG map
fetch('Picture/world.svg')
  .then(res => res.text())
  .then(svgContent => {
    const mapDiv = document.getElementById('map');
    mapDiv.innerHTML = svgContent;

    const svg = mapDiv.querySelector("svg");
    if (!svg) return;

    const svgWidth = 2000;
    const svgHeight = 1000;

    // Initial viewBox
    let viewBox = { x: 0, y: 0, w: svgWidth, h: svgHeight };
    svg.setAttribute("viewBox", `${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`);

    let isPanning = false;
    let startPoint = { x: 0, y: 0 };

    // Drag Events 
    svg.addEventListener("mousedown", e => {
        isPanning = true;
        startPoint = { x: e.clientX, y: e.clientY };
        svg.style.cursor = "grabbing";
    });

    svg.addEventListener("mousemove", e => {
        if (!isPanning) return;
        const dx = (startPoint.x - e.clientX) * (viewBox.w / svg.clientWidth);
        const dy = (startPoint.y - e.clientY) * (viewBox.h / svg.clientHeight);
        viewBox.x += dx;
        viewBox.y += dy;
        svg.setAttribute("viewBox", `${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`);
        startPoint = { x: e.clientX, y: e.clientY };
    });

    svg.addEventListener("mouseup", () => {
        isPanning = false;
        svg.style.cursor = "grab";
    });

    svg.addEventListener("mouseleave", () => {
        isPanning = false;
        svg.style.cursor = "grab";
    });

    // Zoom Settings 
    const minZoom = 0.2;
    const maxZoom = 2;

    function zoomAtPoint(factor, centerX, centerY) {
        let newW = viewBox.w * factor;
        let newH = viewBox.h * factor;

        if (newW < svgWidth * minZoom || newW > svgWidth * maxZoom) return;

        viewBox.x = centerX - (centerX - viewBox.x) * factor;
        viewBox.y = centerY - (centerY - viewBox.y) * factor;
        viewBox.w = newW;
        viewBox.h = newH;

        svg.setAttribute("viewBox", `${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`);
    }

    // Wheel Zoom
    svg.addEventListener("wheel", e => {
        e.preventDefault();
        const rect = svg.getBoundingClientRect();
        const mouseX = ((e.clientX - rect.left) / rect.width) * viewBox.w + viewBox.x;
        const mouseY = ((e.clientY - rect.top) / rect.height) * viewBox.h + viewBox.y;
        const scaleAmount = 1.1;
        const factor = e.deltaY < 0 ? 1 / scaleAmount : scaleAmount;
        zoomAtPoint(factor, mouseX, mouseY);
    });

    // Button Zoom
    document.querySelector(".zoom-in").addEventListener("click", () => {
        const centerX = viewBox.x + viewBox.w / 2;
        const centerY = viewBox.y + viewBox.h / 2;
        zoomAtPoint(1 / 1.1, centerX, centerY);
    });

    document.querySelector(".zoom-out").addEventListener("click", () => {
        const centerX = viewBox.x + viewBox.w / 2;
        const centerY = viewBox.y + viewBox.h / 2;
        zoomAtPoint(1.1, centerX, centerY);
    });

    // Countries
    const markers = [
        {name: "Americas", x: 550, y: 400, link: "#"},
        {name: "Europe", x: 1050, y: 165, link: "#"},
        {name: "Africa", x: 1110, y: 450, link: "#"},
        {name: "Asia", x: 1450, y: 200, link: "#"},
        {name: "Malaysia", x: 1560, y: 460, link: "#"},
        {name: "Oceania", x: 1725, y: 650, link: "#"}
        ];

        markers.forEach(marker => {
        const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
        group.setAttribute("class", "marker-group");

        const img = document.createElementNS("http://www.w3.org/2000/svg", "image");
        img.setAttributeNS(null, "href", "Picture/pointer.png"); 
        img.setAttribute("x", marker.x - 14); 
        img.setAttribute("y", marker.y - 14);
        img.setAttribute("width", 50); 
        img.setAttribute("height", 50); 

        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute("x", marker.x);
        text.setAttribute("y", marker.y - 20);
        text.setAttribute("class", "marker-text");
        text.textContent = marker.name;

        group.appendChild(img);
        group.appendChild(text);

        group.addEventListener("click", () => window.open(marker.link, "_blank"));

        svg.appendChild(group);
        });
});

// Load Compass 
fetch('Picture/compass.svg')
  .then(res=>res.text())
  .then(svgContent=>{
    const compassDiv = document.createElement("div");
    compassDiv.id = "compass";
    compassDiv.classList.add("compass");
    document.body.appendChild(compassDiv);
    compassDiv.innerHTML = svgContent;
});