let storedHash;
let currentPanelIndex = 1;
let scrollPosition = 0;
let clearSlides;
let pageConfig;

const initPage = async () => {
    await loadPageConfig();
    initNavigation();
    loadFirstPage();

    // add event handlers:
    window.setInterval(function () {
        if (window.location.hash != storedHash) {
            // temporarily disable scroll behavior:
            document.querySelector('html').style.scrollBehavior = "auto";
            storedHash = window.location.hash;
            showPage();
        }
    }, 100);
    
    // window.onresize = setPosition;
};

const showSection = async (page) => {
    let prevIndex = currentPanelIndex;
    currentPanelIndex = page.slideNum;
    const slideId = `#panel-${currentPanelIndex}`;
    document.querySelector(slideId).innerHTML = "";
    
    // insert layout:
    const layoutTemplateFile = page.layout || 'one-column.tpl';
    await renderTemplate(slideId, `./layouts/${layoutTemplateFile}`, page);


    // append main content:
    await renderTemplate(`${slideId} .content`, `./templates/${page.main}`, page);

    // append aside content (if applicable):
    if (page.aside) {
        await renderTemplate(`${slideId} aside`, `./templates/${page.aside}`, page);
    }

    injectScriptIfExists(slideId);
    setPosition();
    clearOldSlide(prevIndex);
    document.querySelector('.main-nav').classList.remove('show');
};

const renderTemplate = async (selector, templateFile, page) => {
    // const mainTemplateFile = page.main;
    const el = document.querySelector(selector);
    if (!el) {
        console.error("Target", selector, "not found.");
        return;
    }
    console.log(templateFile);
    const html = await fetch(templateFile).then(response => response.text());
    console.log(el, html);
    const template = eval('`' + html + '`');
    el.insertAdjacentHTML('beforeend', template);
}

// const injectScriptIfExists = (html, containerEl) => {
const injectScriptIfExists = (selector) => {
    const el = document.querySelector(selector);
    const html = el.innerHTML;
    const regex =  /<script[\s\S]*?>[\s\S]*?<\/script>/gi;
    const matches = html.match(regex);
    if (matches && matches.length > 0) {
        matches.forEach(match => {
            let path = match.split("\"")[1];
            var script = document.createElement('script');
            script.setAttribute('src',path);
            el.appendChild(script);
        })
    }
};

const loadPageConfig = async () => {
    pageConfig = await fetch('data/pages.json').then(response => response.json());
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