const showSection = (fileName, idx) => {
    console.log(`#panel-${idx}`);
    const slideEl = document.querySelector(`#panel-${idx}`);
    const mainEl = document.querySelector('.slides-container');
    fetch(`./templates/${fileName}`)
        .then(response => response.text())
        .then(html => {
            slideEl.innerHTML = html;
            mainEl.scrollLeft = slideEl.clientWidth * idx;
        })
};

const initPanels = () => {
    const n = document.querySelectorAll('ul li').length;
    const containerEl = document.querySelector('.slides-container');
    for (let i = 0; i < n; i++ ) {
        const template = `
            <section class='slide' id="panel-${i}"></section>
        `;
        containerEl.insertAdjacentHTML('beforeend', template);
    }
}

initPanels();
showSection('main.html', 1);
