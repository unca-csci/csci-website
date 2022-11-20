let storedHash;
let currentPanelIndex = 0;
const pages = ['course-schedule'];
// const pageMap = {
//     'courses.html': `#panel-4`
// };

const showSection = (fileName, idx) => {
    const slideEl = document.querySelector(`#panel-${idx}`);
    const containerEl = document.querySelector('.slides-container');
    fetch(`./templates/${fileName}`)
        .then(response => response.text())
        .then(html => {
            slideEl.innerHTML = "";
            slideEl.insertAdjacentHTML('beforeend', html);
            //window.scrollTo(0, 0);
            containerEl.scrollLeft = slideEl.clientWidth * idx;
            document.querySelector('nav').classList.remove('show');

            injectScriptIfExists(html, slideEl);
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

const initNavigation = () => {
    const containerEl = document.querySelector('.slides-container');
    const links = document.querySelectorAll('ul a');
    links.forEach((link, idx) => {
        pages.push(link.href.split('#')[1]);
        link.dataset.index = idx;
        const template = `
            <section class='slide' id="panel-${idx}"></section>
        `;
        containerEl.insertAdjacentHTML('beforeend', template);
        // link.addEventListener('click', showSection);
    })
    containerEl.scrollLeft = 0;
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
    const currentSlide = document.querySelector(`#panel-${currentPanelIndex}`);
    currentSlide.innerHTML = "";
    
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
};

const toggleMenu = ev => {
    ev.preventDefault();
    document.querySelector('nav').classList.toggle('show');
}

initPage();

// trigger page load:
// document.querySelector(`#panel-0`).click();

window.setInterval(function () {
    if (window.location.hash != storedHash) {
        storedHash = window.location.hash;
        console.log('UPDATE!!');
        showPage();
    }
}, 100);

window.onresize = showPage;

