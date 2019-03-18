import {

    getAuth,
    getUser,
    callService,
    createConnection,
    subscribeEntities,
    ERR_HASS_HOST_REQUIRED,
}
from '../dist/haws.es.js';

(async () => {
    let auth;
    try {
        auth = await getAuth();
    } catch (err) {
        if (err === ERR_HASS_HOST_REQUIRED) {
            const hassUrl = prompt('What host to connect to?', 'https://192.168.1.132:8123');
            document.cookie = 'hassUrl=' + hassUrl
            if (!hassUrl) return;
            auth = await getAuth({
                hassUrl
            });
        } else {
            alert(`Unknown error: ${err}`);
            return;
        }
    }
    const connection = await createConnection({
        auth
    });
    subscribeEntities(connection, entities => renderEntities(connection, entities));

    // To play from the console
    window.auth = auth;
    window.connection = connection;
    getUser(connection).then(user => console.log('Logged in as', user));
})();

function show(root) {
    root.classList.remove('hide')
}

function hide(root) {
    root.classList.add('hide')
}

function getCookie(cname) {
    var name = cname + '=';
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return '';
}

function initialize() {
    let rootList = document.querySelector('.wrapper');
    var now = new Date();
    // let clock = document.createElement('span');
    // clock.innerHTML = now.getHours().toString() + now.getMinutes().toString() + now.getSeconds().toString()
    // rootList.appendChild(clock); TODO: FIXME:
    if (document.querySelector('.publictransit') == null) {
        let temp = document.createElement('div');
        temp.classList.add('publictransit');
        let line;
        let name;
        let destination = document.createElement('span');
        destination.innerHTML = 'Heading';
        let next = document.createElement('span');
        next.innerHTML = 'Next';
        let thereafter = document.createElement('span');
        thereafter.innerHTML = 'There After';
        temp.appendChild(destination);
        temp.appendChild(next);
        temp.appendChild(thereafter);
        line = document.createElement('div');
        line.id = 'svartStan';
        name = document.createElement('span');
        name.innerHTML = 'Svart Express mot Valhamra';
        line.appendChild(name)
        temp.appendChild(line);
        rootList.appendChild(temp);
        line = document.createElement('div');
        line.id = 'svartTorslanda';
        name = document.createElement('span');
        name.innerHTML = 'Svart Express mot Amhult';
        line.appendChild(name)
        temp.appendChild(line);
        rootList.appendChild(temp);
    }
}

function reRender(root) {
    while (root.lastChild) root.removeChild(root.lastChild);
}

function renderEntities(connection, entities) {
    let rootList = document.querySelector('.wrapper');
    reRender(rootList);
    Object.keys(entities).sort().forEach((entId) => {
        initialize();
        let entity = entities[entId];
        let value;

        value = document.querySelectorAll('#svartStan > span')
        if (entity['entity_id'] == 'sensor.mot_stan') {
            let rootList = document.getElementById('svartStan');
            let first = document.createElement('span');
            first.innerHTML = entity.state;
            value = first.innerHTML
            rootList.appendChild(first);
        } else if (entity['entity_id'] == 'sensor.mot_stan_efter' && entity.state != value[value.length - 1]) {
            let rootList = document.getElementById('svartStan');
            let temp = document.createElement('span');
            temp.innerHTML = entity.state;
            rootList.appendChild(temp);
        }

        value = document.querySelectorAll('#svartTorslanda > span')
        if (entity['entity_id'] == 'sensor.mot_torslanda') {
            let rootList = document.getElementById('svartTorslanda');
            let first = document.createElement('span');
            first.innerHTML = entity.state;
            value = first.innerHTML
            rootList.appendChild(first);
        } else if (entity['entity_id'] == 'sensor.mot_torslanda_efter' && entity.state != value[value.length - 1]) {
            let rootList = document.getElementById('svartTorslanda');
            let temp = document.createElement('span');
            temp.innerHTML = entity.state;
            rootList.appendChild(temp);
        }
    });
}