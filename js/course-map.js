/**
 * Note: using window.____ global variables b/c this website
 * dynamically injects new JavaScript scripts into the DOM
 * Each time this script is run, it removes and re-initializes
 * the class and corresponding object.
 */

delete window.CourseBrowser;
delete window.browser;

window.CourseBrowser = class {
    courses = { };
    
    constructor() {
        this.courses = {};
        this.areas = {};
    }

    async fetchCourses() {
        const url = '../data/courses.json';
        document.querySelector('#course-list').innerHTML = "Searching...";
        const data = await fetch(url).then(response => response.json());
        this.courses = data.courses;
        this.areas = data.areas;
        this.displayResults();
    }  


    async displayResults() {
        document.querySelector('#course-list').innerHTML = "";
        for (const key in this.courses) {
            const course = this.courses[key];
            course.id = key;
            this.displayCourse(course);
        }
    }

    displayCourse(course) {
       const template = `
            <section class="course">
                <h2>${course.id}: ${course.title}</h2>
                <p>${course.description}</p>
                <div class="course-areas">
                    ${course.areas ? course.areas.map(area => this.displayArea(area)).join('') : ''}
                </div>
            </section>`;
        try {
            document.querySelector('#course-list').insertAdjacentHTML('beforeend', template);
        } catch(e) {
            console.log(e);
        }
    }

    displayArea(key) {
        return `<div class="tag">${this.areas[key]}</div>`;
    }
}

window.browser = new CourseBrowser();
browser.fetchCourses();