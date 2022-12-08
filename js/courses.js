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
        this.key = 'AIzaSyDsr4u1uupvnmDSfJdfgHZN2IWROiihlP8';
        this.spreadsheetId = '1Q11Q_uJxCsnwMSpjMn3kCQTzRIXB0NkGBeQQL5CO6y4';
        this.courses = {};
        this.areas = {};
        this.courses1 = {};
    }

    async fetchCourses() {
        const url = 'data/courses.json';
        document.querySelector('#course-list').innerHTML = "Searching...";
        const data = await fetch(url).then(response => response.json());
        this.courses = data.courses;
        console.log(this.courses);
        this.areas = data.areas;
        console.log(this.areas);

        // await this.fetchDataFromSheets();
        this.displayResults();
    }
    
    async fetchDataFromSheets () {
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${this.spreadsheetId}/values/courses?key=${this.key}`;
        const data = await fetch(url, {
                referrer: "https://unca-csci.github.io/csci-website"
            }).then(response => response.json());
        const keys = data.values.shift();
        const spreadsheetCourses = {};
        data.values.forEach(row => {
            const item = {};
            row.forEach((cell, i) => {
                cell = cell === 'TRUE' ? true : cell;
                cell = cell === 'FALSE' ? false : cell;
                item[keys[i]] = cell;
            }) 
            spreadsheetCourses[item.id] = item;
            item.areas = item.areas.split(",").map(tag => tag.trim()).filter(tag => tag !== '');
            // return course;
        });
        console.log(spreadsheetCourses);
        // this.display();
    }


    async displayResults() {
        document.querySelector('#course-list').innerHTML = "";
        for (const key in this.courses) {
            const course = this.courses[key];
            course.id = key;
            this.displayCourse(course);
            // if (course.display) {
            //     this.displayCourse(course);
            // }
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