// ignore this function for now. We'll go over it
// on Wednesday: 
async function fetchCourses() {
    const baseScheduleUrl = 'https://meteor.unca.edu/registrar/class-schedules/api/v1/courses/';
    document.querySelector('#course-list').innerHTML = "Searching...";
    const termUrl = document.querySelector('#term').value;
    const url = baseScheduleUrl + termUrl;
    data = await fetch(url).then(response => response.json());
    displayResults(data);
} 

async function displayResults(courseList) {
    document.querySelector('#course-list').innerHTML = "";
    // access the #results section and put the course title into it. 
    for (let i = 0; i < courseList.length; i++) {
        const course = courseList[i];
        if (course.Department == "CSCI") {
            const termUrl = document.querySelector('#term').value;
            const descUrl = 'https://meteor.unca.edu/registrar/class-schedules/api/v1/courses/description/';
            let desc = await fetch(descUrl + termUrl + course.CRN + '/').then(response => response.text());
            desc = desc.replaceAll("\"", "");
            desc = desc.replaceAll("\\n", "");
            desc = desc.replaceAll("\\r", "");
            course.Description = desc;
            
            displayCourse(course);
        }
    }
}


function displayCourse(course) {
    console.log(course);
    // don't access the first instructor if no instructors are present:
    let instructor = 'Unknown';
    if (course.Instructors.length > 0) {
        instructor = course.Instructors[0].Name;
    }
    const spaceLeft = Math.max(course.EnrollmentMax - course.EnrollmentCurrent, 0);
    const closed = spaceLeft === 0 ? true : false;
    const numOnWaitlist = course.WaitlistMax - course.WaitlistAvailable;
    const startTime = new Date(course.StartTime).toLocaleTimeString([], {timeStyle: 'short'});
    const endTime = new Date(course.EndTime).toLocaleTimeString([], {timeStyle: 'short'});
    const meets = course.Days ? course.Days : "";
    const template = `
        <section class="course">
            <h2>${course.Code}: ${course.Title}</h2>
            <p>
                ${closed ? '<i class="fa-solid fa-circle-xmark"></i> Closed' : '<i class="fa-solid fa-circle-check"></i> Open'} 
                &bull; ${course.CRN}
                &bull;  
                ${!closed ? "Seats Available: " + spaceLeft : "Number on Waitlist " + numOnWaitlist}
            </p>
            <p>
                ${meets} ${startTime} - ${endTime} &bull; 
                ${course.Location.FullLocation} &bull; 
                ${course.Hours} credit hour(s)
            </p>
            <p><strong>${instructor}</strong></p>

            <p>${course.Description}</p>
        </section>`;
    document.querySelector('#course-list').insertAdjacentHTML('beforeend', template);
}

document.querySelector('#term').addEventListener('change', fetchCourses);


fetchCourses();