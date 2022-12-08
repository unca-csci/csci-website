// This works:
// https://stackoverflow.com/questions/46583052/http-google-sheets-api-v4-how-to-access-without-oauth-2-
// Note: ensure that your Google Sheets "Share" setting is Public Read-only.

delete window.People;
delete window.peopleDisplay;

window.People = class {
    constructor () {
        this.key = 'AIzaSyDsr4u1uupvnmDSfJdfgHZN2IWROiihlP8';
        this.spreadsheetId = '1Q11Q_uJxCsnwMSpjMn3kCQTzRIXB0NkGBeQQL5CO6y4';
        this.people = [];
        this.fetchDataFromSheets();
    }

    async fetchDataFromSheets () {
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${this.spreadsheetId}/values/faculty?key=${this.key}`;
        const data = await fetch(url, {
                referrer: "https://unca-csci.github.io/csci-website"
            }).then(response => response.json());
        const keys = data.values.shift();
        this.people = data.values.map(row => {
            const item = {};
            row.forEach((cell, i) => {
                item[keys[i]] = cell;
            }) 
            return item;
        });
        this.display();
    }

    display() {
        document.querySelector(".people")
            .insertAdjacentHTML('beforeend', 
                this.people.map((person, i) => this.toHTML(person, i)).join('\n')
            );
    }

    onKeyUp(e, template) {
        if (e.key === "Enter") {
            showLightboxPeople(template);
        }
    }

    toHTML (person, i) {
        // tabindex and onkeyup for accessibility:
        return `
            <section tabindex="${i+10}" class="person" 
                onclick="showLightboxPeople('${person.detail_url}')"
                onkeyup="peopleDisplay.onKeyUp(event, '${person.detail_url}')">
                <h2>${person.name}</h2>
                ${ this.getPic(person) }
                <div class="info">
                    <p class="title">${person.title}</p>
                    <p class="contact-info"><i class="fa-regular fa-envelope"></i> ${person.email}</p>
                    ${ this.getAddress(person) }
                    ${ this.getPhone(person) }    
                </div>            
                <p class="interests">${person.interests || ""}</p>
            </section>
        `;
    }

    getPic(person) {
        return person.image_url ? `<img src="${person.image_url}" />` : "<p></p>";
    } 

    getAddress(person) {
        return person.address ? `<p class="contact-info"><i class="fa-solid fa-location-dot"></i> ${person.address}</p>` : "<p></p>";
    } 
    
    getPhone(person) {
        return person.phone ? `<p class="contact-info"><i class="fa-solid fa-phone"></i> ${person.phone}</p>` : "<p></p>";
    }
}

window.peopleDisplay = new window.People();