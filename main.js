const showSection = (fileName, idx, doAnimation=true) => {
    console.log(`#panel-${idx}`);
    const slideEl = document.querySelector(`#panel-${idx}`);
    const containerEl = document.querySelector('.slides-container');
    fetch(`./templates/${fileName}`)
        .then(response => response.text())
        .then(html => {
            slideEl.innerHTML = html;
            if (doAnimation) {
                containerEl.scrollLeft = slideEl.clientWidth * idx;
            }
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
    containerEl.scrollLeft = 0;
}

initPanels();
showSection('main.html', 0, false);
