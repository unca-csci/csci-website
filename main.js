let storedHash;
const pages = [];

const showSection = (fileName, idx) => {
    console.log(fileName);
    const slideEl = document.querySelector(`#panel-${idx}`);
    const containerEl = document.querySelector('.slides-container');
    fetch(`./templates/${fileName}`)
        .then(response => response.text())
        .then(html => {
            slideEl.innerHTML = html;
            window.scrollTo(0, 0);
            containerEl.scrollLeft = slideEl.clientWidth * idx;
            document.querySelector('nav').classList.remove('show');
        })
};

const showLightbox = fileName => {
    const lightboxEl = document.querySelector('#lightbox');
    fetch(`./templates/${fileName}`)
        .then(response => response.text())
        .then(html => {
            lightboxEl.querySelector('.content').innerHTML = html;
            lightboxEl.classList.add('show');
        })
}

const hideLightbox = () => {
    const lightboxEl = document.querySelector('#lightbox');
    lightboxEl.classList.remove('show');
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
    const fileName = storedHash.replace('#', '') + '.html';
    document.querySelectorAll('ul a').forEach((el, idx) => {
        if (el.href == window.location.href) {
            showSection(fileName, idx);
        }
    })
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

