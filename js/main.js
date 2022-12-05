let storedHash;
let currentPanelIndex = 0;
let scrollPosition = 0;
let clearSlides;
const pages = ['course-schedule', 'student-projects', 'course-map'];

const showSection = (fileName, idx) => {
    const slideEl = document.querySelector(`#panel-${idx}`);
    fetch(`./templates/${fileName}`)
        .then(response => response.text())
        .then(html => {
            slideEl.innerHTML = html;
            document.querySelector('nav').classList.remove('show');

            injectScriptIfExists(html, slideEl);
            setPosition();
        })
};

const injectScriptIfExists = (html, containerEl) => {
    const regex =  /<script[\s\S]*?>[\s\S]*?<\/script>/gi;
    // const regex =  /"[\s\S]*?"\.js/gi;
    const matches = html.match(regex);
    if (matches && matches.length > 0) {
        matches.forEach(match => {
            let path = match.split("\"")[1];
            var script = document.createElement('script');
            script.setAttribute('src',path);
            // script.setAttribute('defer', true);
            containerEl.appendChild(script);
        })
    }
}

const showLightbox = fileName => {
    const lightboxEl = document.querySelector('#lightbox');
    fetch(`./templates/${fileName}`)
        .then(response => response.text())
        .then(html => {
            lightboxEl.querySelector('.content').innerHTML = html;
            lightboxEl.classList.add('show');
            document.body.style.overflowY = 'hidden';
        })
}

const hideLightbox = ev => {
    const classList = ev.target.classList;
    let doClose = false;
    classList.forEach(className => {
        if (['fa-times', 'close', 'close-icon', 'show'].includes(className)) {
            doClose = true;
            return;
        }
    })
    if (!doClose) {return};
    const lightboxEl = document.querySelector('#lightbox');
    lightboxEl.classList.remove('show');
    document.body.style.overflowY = 'scroll';
}

const initPage = () => {
    initNavigation();
    loadFirstPage();
};

const setPosition = () => {
    const containerEl = document.querySelector('.slides-container');
    const slideEl = document.querySelector(`#panel-${currentPanelIndex}`);
    
    // temporarily disable animation:
    window.scrollTo(0, 0);
    containerEl.style.scrollBehavior = 'auto';
    containerEl.scrollTo(scrollPosition, 0);
    containerEl.style.scrollBehavior = 'smooth';

    // scroll:
    containerEl.scrollTo(slideEl.clientWidth * currentPanelIndex, 0);
    scrollPosition = slideEl.clientWidth * currentPanelIndex;
};

const clearOldSlide = (prevIndex) => {
    // ensures smooth transition
    if (prevIndex == currentPanelIndex) {
        return;
    }
    const oldSlide = document.querySelector(`#panel-${prevIndex}`);
    oldSlide.querySelectorAll('*').forEach(elem => elem.id = '');
    if (clearSlides) {
        clearTimeout(clearSlides);
        clearSlides = null;
    }
    clearSlides = setTimeout(() => {
        oldSlide.innerHTML = "";
    }, 1500);
}

const initNavigation = () => {
    console.log("initNavigation");
    const containerEl = document.querySelector('.slides-container');
    const links = document.querySelectorAll('ul a');
    links.forEach((link, idx) => {
        pages.push(link.href.split('#')[1]);
        link.dataset.index = idx;
        const template = `
            <section class='slide' id="panel-${idx}"></section>
        `;
        containerEl.insertAdjacentHTML('beforeend', template);
    })
};

const loadFirstPage = () => {
    storedHash = window.location.hash;
    const tokens = storedHash.split('#');
    console.log(tokens, pages);
    if (tokens.length < 2 || tokens[1].length === 0 || !pages.includes(tokens[1])) {
        window.location.href = '#main';
    } else {
        showPage();
    }
}

const showPage = () => {
    if (storedHash === '') {
        return;
    }
    let prevIndex = currentPanelIndex;
    
    const fileName = storedHash.replace('#', '') + '.html';
    let found = false;
    document.querySelectorAll('.main-nav ul a').forEach((el, idx) => {
        if (el.href == window.location.href) {
            found = true;
            currentPanelIndex = idx;
            console.log('in list', fileName, idx);
            showSection(fileName, idx);
        }
    })
    if (!found) {
        console.log('not in list', fileName, currentPanelIndex);
        showSection(fileName, currentPanelIndex);
    }

    clearOldSlide(prevIndex);
};

const toggleMenu = ev => {
    ev.preventDefault();
    document.querySelector('nav').classList.toggle('show');
}

initPage();

window.setInterval(function () {
    if (window.location.hash != storedHash) {
        storedHash = window.location.hash;
        console.log('UPDATE!!');
        showPage();
    }
}, 100);

window.onresize = setPosition;

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

