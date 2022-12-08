delete window.showLightbox;
delete window.showLightboxFaculty;
delete window.hideLightbox;


window.showLightbox = async fileName => {
    const lightboxEl = document.querySelector('#lightbox');
    const html = await fetch(`./templates/${fileName}`)
        .then(response => response.text());
    lightboxEl.querySelector('.content').innerHTML = html;
    lightboxEl.classList.add('show');
    document.body.style.overflowY = 'hidden';
    lightboxEl.classList.remove('people-detail');
};

window.showLightboxPeople = async fileName => {
    await window.showLightbox(fileName);
    const lightboxEl = document.querySelector('#lightbox');
    lightboxEl.classList.add('people-detail');
};

window.hideLightbox = ev => {
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