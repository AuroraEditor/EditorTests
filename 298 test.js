/**
 * Appsterdam API
 */


/**
 * @namespace Appsterdam
 * @description Appsterdam API
 */
var AppsterdamAPI = {
    // Regeular expression for the API Block.
    API_BLOCK_REGEX: '\\\[APPSTERDAM_API_BLOCK\\\:([a-zA-Z0-9_-])+(\\\sOPTIONS\\\:\\\{(.*)\\\})?\\\]',

    // The Appsterdam APP Api.
    API_APP: {},

    // The Appsterdam People.
    API_PEOPLE: {},

    // The Appsterdam Meetups.
    API_EVENTS: {},

    regex: function () {
        return new RegExp(this.API_BLOCK_REGEX, 'g');
    },

    parse: function (match) {
        // For some weird reason this doesn't work in this function.
        // Use: window.AppsterdamAPI
        // console.log('MATCH: ' + match);

        var func = match.split(':')[1].split(']')[0].split(' ')[0];
        // console.log(func);

        // var opts = match.split(' ')[1].split(']')[0];

        if (func === 'team') {
            // if has hashtag, then show user profile?
            if (window.location.hash.length > 1) {
                window.setTimeout(window.AppsterdamAPI.openStaffCard, 100, window.location.hash.substr(1))
            }

            return window.AppsterdamAPI.generateStaffPage();
        }

        if (func === 'Organizers_WeekendFun') {
            return window.AppsterdamAPI.generateStaffGrid('Weekend Fun');
        }

        if (func === 'Organizers_CoffeeCoding') {
            return window.AppsterdamAPI.generateStaffGrid('Coffee Coding');
        }

        // Get the API name.
        // console.log("REPLACE " + match);

        // For now hide all API blocks.
        return '';
    },

    generateGrid: function (withItems, width) {
        var counter = 0;

        // Max width is 5 (looks better)
        width = (width || 5);

        // Generate the grid.
        var code = '<div class="wp-block-columns">';

        for (var item in withItems) {
            code += '<div class="wp-block-column">';
            code += withItems[item];
            code += '</div>';
            // Some extra padding.
            code += '<div class="wp-block-column">&nbsp;</div>';

            counter++;

            if (counter === width) {
                code += '</div><div class="wp-block-columns">';
                counter = 0;
            }
        }

        // Fill up grid with empty items.
        for (var i = counter; i < width; i++) {
            code += '<div class="wp-block-column">&nbsp;</div>';
            // Some extra padding.
            code += '<div class="wp-block-column">&nbsp;</div>';
        }

        // Close the grid.
        code += '</div>';

        return code;
    },

    generateStaffGrid: function (forEvent) {
        var generate = [];
        for (var tTeam in this.API_PEOPLE) {
            var team = this.API_PEOPLE[tTeam];

            console.log('Team: ' + tTeam);

            if (team.team == forEvent) {
                for (var member in team.members) {
                    generate.push(
                        this.generateStaffCard(team.members[member])
                    );
                }
            }
        }

        return this.generateGrid(generate);
    },

    generateStaffPage: function () {
        var code = '';

        for (var tTeam in this.API_PEOPLE) {
            var team = this.API_PEOPLE[tTeam];

            var generate = [];
            // Team name.
            code += '<h2>' + team.team + '</h2>';

            for (var member in team.members) {
                generate.push(
                    this.generateStaffCard(team.members[member])
                );
            }

            code += this.generateGrid(generate);
        }

        // walk trough each member to create their profiles.
        for (var tTeam in this.API_PEOPLE) {
            var team = this.API_PEOPLE[tTeam];

            for (var staffMember in team.members) {
                code += '<a name=\'' + this.safename(team.members[staffMember].name) + '\'></a>';
                code += '<div class=\'staffCard\' style="display:none" id=\'' + this.safename(team.members[staffMember].name) + '\'>';
                code += this.generateUserPage(team.members[staffMember]);
                code += '</div>';
            }
        }

        return code;
    },

    onHashChange: function () {
        window.setTimeout(window.AppsterdamAPI.openStaffCard, 10, window.location.hash.substr(1))
    },

    openStaffCard: function (personName) {
        document.querySelectorAll('.staffCard').forEach(function (card) {
            if (card.id != personName) {
                card.style.display = 'none';
            } else {
                card.style.display = 'block';
                card.scrollIntoView();
            }
        })
    },

    goToStaffPage: function () {
        if (window.history) {
            window.history.pushState('', document.title, window.location.href.replace(window.location.hash, ''));
        } else {
            window.location.hash = '';
        }
        window.scrollTo(0, 0);
    },

    generateStaffCard: function (staff) {
        var code = '';

        var staffURL = this.safename(staff.name);

        var staffPicture = staff.picture || 'https://i0.wp.com/appsterdam.rs/wp-content/uploads/2021/12/819613.png?resize=250%2C250&ssl=1';

        code += `<figure class="wp-block-image size-medium is-resized is-style-rounded">
            <img style="cursor:pointer;" onClick="location.href='#${staffURL}'" loading="lazy" src="${staffPicture}">
            <figcaption><a href='#${staffURL}'>${staff.name}</a><br />${staff.function}</figcaption>
        </figure>`;

        code += '<div class="wp-block-columns">';

        if (staff.twitter !== '') {
            code += `<div class="wp-block-column centered"><p><a href="https://twitter.com/${staff.twitter}" target="_blank" rel="noopener"><i class="fab fa-twitter"></i></a></p></div>`;
        } else {
            code += '<div class="wp-block-column"></div>';
        }

        if (staff.linkedin !== '') {
            code += `<div class="wp-block-column centered"><p><a href="https://www.linkedin.com/in/${staff.linkedin}/" target="_blank" rel="noopener"><i class="fab fa-linkedin"></i></a></p></div>`;
        } else {
            code += '<div class="wp-block-column"></div>';
        }

        if (staff.website !== '') {
            code += `<div class="wp-block-column centered"><p><a href="${staff.website}" target="_blank" rel="noopener"><i class="fas fa-globe"></i></a></p></div>`;
        } else {
            code += '<div class="wp-block-column"></div>';
        }

        code += '</div>';

        return code;
    },

    generateUserPage: function (member) {
        var memberPicture = member.picture || 'https://i0.wp.com/appsterdam.rs/wp-content/uploads/2021/12/819613.png?resize=250%2C250&ssl=1';

        var code = `<h1>${member.name}</h1>`;
        code += `<div class="wp-block-columns"><div class="wp-block-column"></div><div class="wp-block-column">`;
        code += `<figure style="height:250px;width:250px;" class="wp-block-image size-medium is-resized is-style-rounded"><img src="${memberPicture}"></figure>`;

        code += '<div class="wp-block-columns">';

        if (member.twitter !== '') {
            code += `<div class="wp-block-column centered"><p><a href="https://twitter.com/${member.twitter}" target="_blank" rel="noopener"><i class="fab fa-twitter"></i></a></p></div>`;
        } else {
            code += '<div class="wp-block-column"></div>';
        }

        if (member.linkedin !== '') {
            code += `<div class="wp-block-column centered"><p><a href="https://www.linkedin.com/in/${member.linkedin}/" target="_blank" rel="noopener"><i class="fab fa-linkedin"></i></a></p></div>`;
        } else {
            code += '<div class="wp-block-column"></div>';
        }

        if (member.website !== '') {
            code += `<div class="wp-block-column centered"><p><a href="${member.website}" target="_blank" rel="noopener"><i class="fas fa-globe"></i></a></p></div>`;
        } else {
            code += '<div class="wp-block-column"></div>';
        }

        code += '</div>';

        code += `</div><div class="wp-block-column"></div></div>`;

        code += '<div class="wp-block-custom" style="background:rgba(0,0,0,0.05);padding:25px;border-radius:25px;">';
        if (typeof window.Markdown !== 'undefined') {
            code += `<p>` + window.Markdown.parse(member.bio) + `</p>`;
        } else {
            code += `<p>${member.bio}</p>`;
        }
        code += '</div><br /><a onclick="window.AppsterdamAPI.goToStaffPage()">Back</a>';

        return code;
    },

    safename: function (name) {
        return name.replace(/\s/g, '-').toLowerCase()
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    },

    fetchPeople: function () {
        try {
            var request = new XMLHttpRequest();
            request.open('GET', '/api/app.json', false);
            request.send(null);
            this.API_APP = JSON.parse(request.responseText);
            this.API_PEOPLE = this.API_APP['people'];
        }
        catch (e) {
            console.error(e);
        }
    },

    fetchEvents: function () {
        try {
            var request = new XMLHttpRequest();
            request.open('GET', '/api/events.json', false);
            request.send(null);
            this.API_EVENTS = JSON.parse(request.responseText);
        }
        catch (e) {
            console.error(e);
        }
    },

    construct: function () {
        this.fetchPeople();
        this.fetchEvents();

        document.querySelector('.entry-content').innerHTML = document.querySelector('.entry-content').innerHTML.replace(
            this.regex(),
            this.parse
        );
    }
};

window.AppsterdamAPI = AppsterdamAPI;
window.AppsterdamAPI.construct();

addEventListener('hashchange', window.AppsterdamAPI.onHashChange);