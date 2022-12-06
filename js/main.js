let storedHash;
let currentPanelIndex = 1;
let scrollPosition = 0;
let clearSlides;
pageConfig = {
    "home": {
        "main": "home.tpl",
        "slideNum": 1
    },
    "news": {
        "main": "news.tpl",
        "slideNum": 2
    },
    "people": {
        "main": "people.tpl",
        "slideNum": 2
    },
    "areas": {
        "main": "areas.tpl",
        "slideNum": 4 
    },
    "course-schedule": {
        "main": "course-schedule.tpl",
        "aside": "curriculum-menu.tpl",
        "slideNum": 5
    },
    "course-map": {
        "main": "course-map.tpl",
        "aside": "curriculum-menu.tpl",
        "slideNum": 5
    },
}
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
    const matches = html.match(regex);
    if (matches && matches.length > 0) {
        matches.forEach(match => {
            let path = match.split("\"")[1];
            var script = document.createElement('script');
            script.setAttribute('src',path);
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
    scrollPosition = slideEl.clientWidth * (currentPanelIndex - 1);
    containerEl.scrollTo(scrollPosition, 0);
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
        link.dataset.index = (idx+1);
        const template = `
            <section class='slide' id="panel-${idx+1}"></section>
        `;
        containerEl.insertAdjacentHTML('beforeend', template);
    })
};

const loadFirstPage = () => {
    storedHash = window.location.hash;
    const tokens = storedHash.split('#');
    console.log(tokens, pages);
    if (tokens.length < 2 || tokens[1].length === 0 || !pages.includes(tokens[1])) {
        window.location.href = '#home';
    } else {
        showPage();
    }
}

const showPage = () => {
    if (storedHash === '') {
        return;
    }
    let prevIndex = currentPanelIndex;
    
    const fileName = storedHash.replace('#', '') + '.tpl';
    let found = false;
    document.querySelectorAll('.main-nav ul a').forEach((el, idx) => {
        if (el.href == window.location.href) {
            found = true;
            currentPanelIndex = idx+1;
            console.log('in list', fileName, idx+1);
            showSection(fileName, idx+1);
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
    document.querySelector('.main-nav').classList.toggle('show');
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

