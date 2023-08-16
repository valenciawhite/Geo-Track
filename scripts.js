// <--- IP BASED GEOLOCATIONING --->
const IPINFO_TOKEN = '14f8a76fa7dc1a';

let geoData;

async function getIPAddress(){
    try{
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const { ip } = await ipResponse.json();
        return ip;
    }catch(error){
        console.error('Error fetching IP address:', error);
        return null;
    }
}

async function fetchGeoData(ip){
    try{
        const geoResponse = await fetch(`https://ipinfo.io/${ip}?token=${IPINFO_TOKEN}`);
        if (!geoResponse.ok) {
            throw new Error('Error fetching geolocation data: Response not OK');
        }
        geoData = await geoResponse.json();
        console.log('GeoData:', geoData);
    }catch(error){
        console.error('Error fetching geolocation data:', error);
        return null;
    }
}

function renderMap(coordinates){
    const map = L.map('map').setView(coordinates, 13);

    const tileUrl = `https://tile.openstreetmap.org/{z}/{x}/{y}.png`
    const tileLayer = L.tileLayer(tileUrl, {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
    }).addTo(map);

    L.marker(coordinates).addTo(map);
}

async function getLocalTime() {
    const ip = await getIPAddress();
    if (ip) {
        await fetchGeoData(ip);
        if (geoData) {
            if (geoData.loc) {
                const coordinates = geoData.loc.split(',').map(parseFloat);
                renderMap(coordinates);
            } else {
                console.error('Geo location coordinates not available.');
            }

            updateLocalTimeDisplay();
            setInterval(updateLocalTimeDisplay, 60000);
            
        } else {
            document.getElementById('local-time').textContent = 'Unable to determine your local time.';
        }
    } else {
        document.getElementById('local-time').textContent = 'Unable to fetch IP address.';
    }
}

function updateLocalTimeDisplay(){
    const localTime = new Date().toLocaleString('en-US', { timeZone: geoData.timeZone });
    const localTimeDisplay = `Local Time in ${geoData.city}, ${geoData.region}: ${localTime}`; 
    document.getElementById('local-time').textContent = localTimeDisplay;
}

getLocalTime();

// function getUserData(){
//     fetch('http://localhost:3000/users')
//     .then(res => res.json())
//     .then(data => {
//         userData = data;
//         console.log(userData)
//     })
// }

// getUserData();