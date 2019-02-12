//////////////////////// DO NOT CHANGE ////////////////////////
import {
    getAuth,
    getUser,
    callService,
    createConnection,
    subscribeEntities,
    ERR_HASS_HOST_REQUIRED,
} from './dist/haws.es.js';

(async () => {
    let auth;
    try {
        auth = await getAuth();
    } catch (err) {
        if (err === ERR_HASS_HOST_REQUIRED) {
            const hassUrl = prompt("What host to connect to?", "http://192.168.1.148:8123");
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
    getUser(connection).then(user => console.log("Logged in as", user));
})();


function reRender(root) {
    while (root.lastChild) root.removeChild(root.lastChild);
}

function show(root) {
    root.classList.remove('hide')
}

function hide(root) {
    root.classList.add('hide')
}

function getCookie(cname) {
    var name = cname + "=";
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
    return "";
}

function renderEntities(connection, entities) {
    const rootList = document.querySelector('tbody');
    while (rootList.lastChild) rootList.removeChild(rootList.lastChild);

    // This gets the specified entity based on the entityId
    // Then it prints the current state of the device
    // console.log(Object.keys(entities))
    //////////////////////// Editable functions below ////////////////////////

    Object.keys(entities).sort().forEach((entId) => {

        if (entId == 'sensor.buss_mot_stan' || entId == 'sensor.buss_mot_torslanda' || entId == 'sensor.mot_backaplan') {
            let target = entId.split('_')
            target = '.' + target[target.length - 1]
            target += " > .state"
            var root = document.querySelector(target)
            reRender(root)
            const tr = document.createElement('span');
            let state = entities[entId].state;
            if (state[5] === ' ') {
                state = state.split('  ')
                state[1] = '&nbsp &nbsp &nbsp &nbsp'
                state = state.join('&nbsp')
            }
            tr.innerHTML = state;
            let icon = document.createElement('img');
            let path = getCookie('hassUrl');
            icon.src = path + entities[entId].attributes['entity_picture'];
            if (entId == 'sensor.mot_backaplan') {
                var heading = 'Hjalmar Brantingsplatsen'
            } else {
                let temp = entId.split('_')
                var heading = entities['sensor.' + temp[1] + '_' + temp[2]].attributes['direction'];
            }
            let title = document.createElement('p')
            title.innerHTML = heading;
            root.append(icon);
            root.append(title);
            root.append(tr);

        } else if (entId == 'media_player.my_room_speaker' || entId == 'media_player.home') {
            if (entities[entId].state == 'playing') {
                var root = document.querySelector('.multi_media > .state')
                show(document.querySelector('.multi_media'))
                reRender(root)
                let icon = getCookie('hassUrl') + entities[entId].attributes['entity_picture']
                if (entities[entId].attributes['entity_picture'] == null) {
                    icon = getCookie('hassUrl') + '/local/icons/bluetooth.svg'
                }
                let image = document.createElement('img')
                image.src = icon
                let title = entities[entId].attributes['media_title']
                let artist = entities[entId].attributes['media_artist']
                let album = entities[entId].attributes['media_album_name']
                let titleDisplay = document.createElement('h4')
                titleDisplay.innerHTML = '<b>' + title + '<b>'
                let artistAlbum = document.createElement('p')
                if (album == null) {
                    album = ''
                } else {
                    if ((artist != null)) {
                        album = ' - ' + album
                    }
                }
                if (artist == null) {
                    artist = ''
                }
                artistAlbum.innerHTML = artist + album
                root.append(image)
                root.append(titleDisplay)
                root.append(artistAlbum)
            } else if (entities['media_player.my_room_speaker'].state != 'playing' && entities['media_player.home'].state != 'playing') {
                hide(document.querySelector('.multi_media'))
            }
        } else if (entId == 'weather.smhi_home') {
            var root = document.querySelector('.weather > .state')
            reRender(root)
            let url = getCookie('hassUrl')
            if (entities[entId].state == 'cloudy') {
                var icon = url + '/local/icons/weather_icons/animated/cloudy.svg'
            } else if (entities[entId].state == 'lightning') {
                var icon = url + '/local/icons/weather_icons/animated/thunder.svg'
            } else if (entities[entId].state == 'pouring') {
                var icon = url + '/local/icons/weather_icons/animated/rainy-6.svg'
            } else if (entities[entId].state == 'rainy') {
                var icon = url + '/local/icons/weather_icons/animated/rainy-5.svg'
            } else if (entities[entId].state == 'snowy') {
                var icon = url + '/local/icons/weather_icons/animated/snowy-5.svg'
            } else if (entities[entId].state == 'sunny') {
                var icon = url + '/local/icons/weather_icons/animated/day.svg'
            } else if (entities[entId].state == 'partlycloudy') {
                var icon = url + '/local/icons/weather_icons/animated/cloudy-day-3.svg'
            }
            // THIS LIST HAS TO BE EXPANDED TO MORE WEATHER CONDITIONS TODO: FIXME:
            //  else if (entities[entId].state == '') {
            // } 
            else {
                var icon = url + '/local/icons/weather_icons/animated/cloudy-day-1.svg'
            }
            let image = document.createElement('img')
            image.src = icon
            root.append(image)
            let humidity = entities[entId].attributes['humidity']
            let windspeed = (entities[entId].attributes['wind_speed'] / 3.6) // Converting to m/s
            let visibility = entities[entId].attributes['visibility']
            let temp = entities['input_number.temperature_home'].state
            let airPressure = entities[entId].attributes['pressure']


            // Icons 
            let windIconPub = document.createElement('img')
            windIconPub.src = getCookie('hassUrl') + '/local/icons/windsock.svg'
            windIconPub.id = 'wind_icon'
            let visibilityIconPub = document.createElement('img')
            visibilityIconPub.src = getCookie('hassUrl') + '/local/icons/cloudy.svg'
            visibilityIconPub.id = 'visibility_icon'
            let humidityIconPub = document.createElement('img')
            humidityIconPub.src = getCookie('hassUrl') + '/local/icons/humidity.svg'
            humidityIconPub.id = 'humidity_icon'

            // Content
            let humidityPub = document.createElement('p')
            humidityPub.innerHTML = humidity + ' %'
            humidityPub.id = 'humidity'
            let windSpeedPub = document.createElement('p')
            windSpeedPub.innerHTML = windspeed.toFixed(2) + ' m/s'
            windSpeedPub.id = 'windspeed'
            let visibilityPub = document.createElement('p')
            visibilityPub.innerHTML = visibility + ' km'
            visibilityPub.id = 'visibility'
            let tempPub = document.createElement('p')
            tempPub.innerHTML = temp + ' °C'
            tempPub.id = 'temp'
            let airPressurePub = document.createElement('p')
            airPressurePub.innerHTML = Math.round(airPressure * 100) / 100 + ' hPa'
            airPressurePub.id = 'pressure'

            // render
            root.append(humidityIconPub)
            root.append(humidityPub)
            root.append(windIconPub)
            root.append(windSpeedPub)
            root.append(visibilityIconPub)
            root.append(visibilityPub)
            root.append(tempPub)
            root.append(airPressurePub)
        }

        // console.log(entities[entId].attributes)





        //////////////////////// BELOW HERE IS ALL FOR THE LIST OF ENTITIES ////////////////////////

        // console.log(entities[entId].attributes)
        // entities[entId].state returns current state for the given entity
        // entities[entId].attributes returns the attributes fot the given entity.
        const tr = document.createElement('tr');
        const tdName = document.createElement('td');
        tdName.innerHTML = entId;
        tr.appendChild(tdName);

        const tdState = document.createElement('td');
        const text = document.createTextNode(entities[entId].state);
        tdState.appendChild(text);

        if (['switch', 'light', 'input_boolean'].includes(entId.split('.', 1)[0])) {
            const button = document.createElement('button');
            button.innerHTML = 'toggle';
            button.onclick = () => callService(connection, 'homeassistant', 'toggle', {
                entity_id: entId
            });
            tdState.appendChild(button);
        }
        tr.appendChild(tdState);

        rootList.appendChild(tr);
    });
}

//////////////////////// Non HASS ITEMS BELOW ////////////////////////
function time() {
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    if (month == 0) {
        month = 'Januari'
    } else if (month == 1) {
        month = 'Februari'
    } else if (month == 2) {
        month = 'Mars'
    } else if (month == 3) {
        month = 'April'
    } else if (month == 4) {
        month = 'Maj'
    } else if (month == 5) {
        month = 'Juni'
    } else if (month == 6) {
        month = 'Juli'
    } else if (month == 7) {
        month = 'Augusi'
    } else if (month == 8) {
        month = 'September'
    } else if (month == 9) {
        month = 'Oktober'
    } else if (month == 10) {
        month = 'November'
    } else if (month == 11) {
        month = 'December'
    }
    var day = now.getDate();
    var hour = now.getHours();
    if (hour.toString().length == 1) {
        hour = '0' + hour
    }
    var minute = now.getMinutes();
    if (minute.toString().length == 1) {
        minute = '0' + minute
    }
    var second = now.getSeconds();
    if (second.toString().length == 1) {
        second = '0' + second
    }
    let tr = document.querySelector('.current_time > h2')
    tr.innerHTML = day + ' ' + month + ' ' + year
    tr = document.querySelector('.current_time > h1')
    tr.innerHTML = hour + ':' + minute + ':' + second

    if (minute == '00' && second == '00' || minute == '30' && second == '00') {
        news()
    }

}
text()

function text() {
    let text = ['Vilken fantastisk dag!', 'Njut av dagen!', 'Det finns inget dåligit väder bara dåliga kläder.', ]
    var root = document.querySelector('.main_message > .state')
    let message = document.createElement('h2')
    message.innerHTML = text[Math.floor(Math.random() * text.length)];

    root.append(message)
}
window.setInterval(function () {
    text()
}, 28800000);
// Every 8h run.

window.setInterval(function () {
    time()
}, 1000);
// Every 1s run

window.setInterval(function () {
    scrollNews()
}, 30000);
// Every 30s run
//////////////////////// newsapi.org ////////////////////////
// NOTHING BELOW HERE WORKS. THIS HAS TO BE SOLVED IN ONE WAY OR ANOTHER. THROWING IT AWAY IS ALSO A POSSIBILITY
function news() {
    let i = 0
    var news = []
    while (i != 1) {
        if (i == 0) {
            var url = 'https://newsapi.org/v2/top-headlines?' +
                'country=se&' + apiKey;
                
        } else {
            var url = 'https://newsapi.org/v2/top-headlines?' +
                'sources=bbc-news&' + apiKey;
                
        }

        var req = new Request(url);
        fetch(req).then(function (response) {
                console.log('This is the response')
                console.log(response)
                console.log(response.totalResults)
                let final = response.json()
                console.log('This is the final answer')
                console.log(final)


                // console.log(Object.getOwnPropertyNames(final));
                // let json = JSON.parse(final)
                // console.log(json.status)
                // console.log(json)
                // console.log('json.status')
                // console.log(json['[[PromiseValue]]'])
                // // console.log(response.json());
            }

        )
     
        i += 1
    }
    document.cookie = 'news=' + news
}
// THIS HAS YET TO BE IMPLEMENTED. IT IS BASED UPON THE NEWS FUNCTION
function scrollNews() {
    let news = getCookie('news')
}




news()
// Run on boot