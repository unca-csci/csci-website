let storedHash;
let currentPanelIndex = 1;
let scrollPosition = 0;
let clearSlides;
const pageConfig = {
    "home": {
        "title": "Welcome to the UNCA Computer Science Department",
        "main": "home.tpl",
        "layout": "landing-page.tpl",
        "aside": "news-snippet.tpl",
        "slideNum": 1
    },
    "news": {
        "title": "News",
        "main": "news.tpl",
        "slideNum": 2
    },
    "people": {
        "title": "People",
        "main": "people.tpl",
        "slideNum": 3
    },
    "areas": {
        "title": "CS Areas",
        "main": "areas.tpl",
        "aside": "areas-snippet.tpl",
        "layout": "two-column.tpl",
        "slideNum": 4 
    },
    "curriculum": {
        "title": "Our Programs",
        "main": "curriculum.tpl",
        "aside": "curriculum-menu.tpl",
        "layout": "two-column.tpl",
        "slideNum": 5 
    },
    "course-schedule": {
        "title": "Course Schedule",
        "main": "course-schedule.tpl",
        "aside": "curriculum-menu.tpl",
        "layout": "two-column.tpl",
        "slideNum": 5
    },
    "course-map": {
        "title": "Course Offerings",
        "main": "course-map.tpl",
        "aside": "curriculum-menu.tpl",
        "layout": "two-column.tpl",
        "slideNum": 5
    },
    "student-projects": {
        "title": "Student Projects",
        "main": "student-projects.tpl",
        "aside": "curriculum-menu.tpl",
        "layout": "two-column.tpl",
        "slideNum": 5
    }
}

const showSection = async (page) => {
    let prevIndex = currentPanelIndex;
    currentPanelIndex = page.slideNum;
    const slideEl = document.querySelector(`#panel-${currentPanelIndex}`);
    
    // insert layout:
    const layoutTemplateFile = page.layout || 'one-column.tpl';
    const layoutHtml = await fetch(`./layouts/${layoutTemplateFile}`).then(response => response.text());
    const layoutTemplate = eval('`' + layoutHtml + '`');
    console.log(layoutTemplate);
    slideEl.innerHTML = layoutTemplate;

    // append main content:
    const mainTemplateFile = page.main;
    const contentArea = slideEl.querySelector('.content');
    const contentHtml = await fetch(`./templates/${mainTemplateFile}`).then(response => response.text());
    const contentTemplate = eval('`' + contentHtml + '`');
    console.log(contentTemplate);
    contentArea.insertAdjacentHTML('beforeend', contentTemplate);

    // append aside content (if applicable):
    const asideTemplateFile = page.aside;
    const asideArea = slideEl.querySelector('aside');
    if (page.aside && asideArea) {
        const asideHTML = await fetch(`./templates/${asideTemplateFile}`).then(response => response.text());
        const asideTemplate = eval('`' + asideHTML + '`');
        asideArea.insertAdjacentHTML('beforeend', asideTemplate);
    }

    document.querySelector('nav').classList.remove('show');
    injectScriptIfExists(contentHtml, slideEl);
    setPosition();
     
    clearOldSlide(prevIndex);
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
};

const showLightbox = fileName => {
    const lightboxEl = document.querySelector('#lightbox');
    fetch(`./templates/${fileName}`)
        .then(response => response.text())
        .then(html => {
            lightboxEl.querySelector('.content').innerHTML = html;
            lightboxEl.classList.add('show');
            document.body.style.overflowY = 'hidden';
        })
};

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
};

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
    document.querySelector('html').style.scrollBehavior = "smooth";
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
        link.dataset.index = (idx+1);
        const template = `
            <section class='slide' id="panel-${idx+1}"></section>
        `;
        containerEl.insertAdjacentHTML('beforeend', template);
    })
};

const loadFirstPage = () => {
    storedHash = window.location.hash;
    const key = storedHash.replace('#', '');
    showSection(pageConfig[key] || pageConfig['home']);
};

const showPage = () => {
    if (storedHash === '') { return; }
    const key = storedHash.replace('#', '');
    const page = pageConfig[key];
    if (page) {
        showSection(page);
    } else {
        console.log("Treat as a regular hashtag!");
    }
};

const toggleMenu = ev => {
    ev.preventDefault();
    document.querySelector('.main-nav').classList.toggle('show');
}

initPage();

window.setInterval(function () {
    if (window.location.hash != storedHash) {
        // temporarily disable scroll behavior:
        document.querySelector('html').style.scrollBehavior = "auto";
        storedHash = window.location.hash;
        showPage();
    }
}, 100);

window.onresize = setPosition;