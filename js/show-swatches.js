
const colors = [
    "--bulldog-blue",
    "--evening-blue",
    "--sky-blue",
    "--bright-blue",
    "--morning-blue",
    "--daybreak-blue",
    "--light-blue",
    "--forest",
    "--river",
    "--night-sky",
    "--frost-gray",
    "--steel-gray",
    "--stone-gray",
    "--honeybee",
    "--autumn",
    "--clay",
    "--gold",
    "--chestnut",
    "--maple"
];

const changeColor = (idx) => {
    const colorProp = colors[idx];
    document.querySelector('.main-header').style.backgroundColor = `var(${colorProp})`; 
    document.querySelector('.main-header nav ul').style.backgroundColor = `var(${colorProp})`; 
    
    // change color of text:
    let colorVal = getComputedStyle(document.documentElement).getPropertyValue(colorProp).trim();
    const levels = [
        colorVal[1] + colorVal[2],
        colorVal[3] + colorVal[4],
        colorVal[5] + colorVal[6] 
    ];
    const sum = levels.reduce((a, b) => {
        return a + parseInt(b, 16);
    }, 0);
    console.log(sum);
    if (sum < 450) {
        document.documentElement.style.setProperty('--banner-text-color', 'white');
    } else {
        document.documentElement.style.setProperty('--banner-text-color', 'black');
    }
}

const showSwatches = () => {
    const html = colors
    .map((color, idx) => {
        return `<div 
            style="background: var(${color});"
            data-idx="${idx}"
            onclick="changeColor(${idx});"></div>`;
    }).join('\n');
    document.body.insertAdjacentHTML('beforeend', `<div class="colors">${html}</div>`);
};

document.body.onkeydown = function(e) {
    if (e.key === " " || e.code === "Space" || e.keyCode === 32) {
        const i = Math.floor(Math.random() * colors.length);
        changeColor(i);
    }
    e.preventDefault();
}

showSwatches();