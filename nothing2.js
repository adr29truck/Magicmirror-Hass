import {

getAuth,
getUser,
callService,
createConnection,
subscribeEntities,
ERR_HASS_HOST_REQUIRED,
}
from './dist/haws.es.js';

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
                        if (document.querySelector('.publictransit') == null){ 
                                let temp = document.createElement('div'); temp.classList.add('publictransit');
                                let line;
                                line = document.createElement('div');
                                    line.id = 'svartStan'; temp.appendChild(line); rootList.appendChild(temp);
                                    line = document.createElement('div');
                                    line.id = 'svartTorslanda'; temp.appendChild(line); rootList.appendChild(temp);
                                    }}function reRender(root) {
                        while (root.lastChild) root.removeChild(root.lastChild);
                        }
                        
                        function renderEntities(connection, entities) {
                            let rootList = document.querySelector('.wrapper');
                            reRender(rootList);
                            Object.keys(entities).sort().forEach((entId) => {
                                initialize();
                                let entity = entities[entId];
                                if (entity['entity_id'] == 'sensor.mot_stan') {
                                    let rootList = document.getElementById('svartStan');
                                        let first = document.createElement('span'); 
                                        first.innerHTML = entity.state; 
                                        rootList.appendChild(first);
                                    }
                                    else if (entity['entity_id'] == 'sensor.mot_stan_efter') {
                                        let rootList = document.getElementById('svartStan');
                                            let temp = document.createElement('span');
                                            temp.innerHTML = entity.state;
                                            rootList.appendChild(temp);
                                        }
                                        if (entity['entity_id'] == 'sensor.mot_torslanda') {
                                    let rootList = document.getElementById('svartTorslanda');
                                        let first = document.createElement('span'); 
                                        first.innerHTML = entity.state; 
                                        rootList.appendChild(first);
                                    }
                                    else if (entity['entity_id'] == 'sensor.mot_torslanda_efter') {
                                        let rootList = document.getElementById('svartTorslanda');
                                            let temp = document.createElement('span');
                                            temp.innerHTML = entity.state;
                                            rootList.appendChild(temp);
                                        }
                                         });
                            }
                            