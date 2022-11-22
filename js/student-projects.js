/**
 * Note: using window.____ global variables b/c this website
 * dynamically injects new JavaScript scripts into the DOM
 * Each time this script is run, it removes and re-initializes
 * the class and corresponding object.
 */

delete window.StudentProjects;
delete window.studentProjects;

window.StudentProjects = class {

    constructor () {
        document.querySelector('#term').addEventListener('change', this.fetchProjects.bind(this));
    }

    async fetchProjects() {
        const url = './data/senior-capstone.json';
        const data = await fetch(url).then(response => response.json());
        this.displayProjects(data);
    }  


    async displayProjects(projects) {
        const term = document.querySelector('#term').value;
        document.querySelector('#student-projects').innerHTML = (
            projects
                .filter(project => project.term === term)
                .map(project => this.displayProject(project))
                .join("\n")
        );
    }


    displayProject(project) {
        return `<section class="course">
            <h2>${project.title}</h2>
            <p>
                <strong>${project.student_name}</strong>
                &bull; <a href="${project.symposium_url}" target="_blank">Symposium</a>
                &bull; <a href="${project.report_url}" target="_blank">Final Report</a>
                &bull; ${project.term}
            </p>
            <p> ${project.abstract} </p>
            <p>Advised by: 
                <strong>${ project.advisors.join(", ") }</strong>
            </p>
        </section>`;
    }

}

window.studentProjects = new StudentProjects();
window.studentProjects.fetchProjects();