function kelvinToCelsius(kelvin) {
    return (kelvin - 273.15).toFixed(0) + "° C";
}

function getLocalStorageItems() {
    return JSON.parse(window.localStorage.getItem("clima-e-temperatura") || "[]");
}

function deleteLocalStorageItem() {
    console.log("clicou")
}

function loadLocalStorageItems() {
    const items = getLocalStorageItems();
    const itemsHtml = [];
    items.forEach(function (item, index) {
        itemsHtml.push(
            `
            <div class="item" id="item-${index}">
                <div>${formatDate(new Date(item.date))}</div>
                <div>${formatTime(new Date(item.date))}</div>
                <img src="http://openweathermap.org/img/wn/${item.icon}@2x.png"/>
                <div>${kelvinToCelsius(item.temp)}</div>
                <div>${item.description}</div>
            </div>
            `
        )

    })
    const itemsDiv = document.querySelector("#items")
    itemsDiv.innerHTML = ""
    itemsDiv.insertAdjacentHTML("beforeend", itemsHtml.join(""))
}

function addToLocalStorage(item) {
    const items = getLocalStorageItems();
    items.push(item);
    window.localStorage.setItem("clima-e-temperatura", JSON.stringify(items));
    loadLocalStorageItems();
}

function formatDate(date) {
    const dayName = new Array("Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado");
    const monthName = new Array("janeiro", "feveiro", "março", "abril", "maio", "Junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro");
    return dayName[date.getDay()] + ", " + date.getDate() + " de " + monthName[date.getMonth()] + " de " + date.getFullYear();
}

function formatTime(date) {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return "Horário " + hours + ":" + minutes;

}

async function main() {
    navigator.geolocation.getCurrentPosition(async function (position) {
        const response = await fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=c3df25cb8ec0260863cc173d3e6aa169`).then(response => { return response.json() });

        const date = new Date();
        const timerData = response;
        const loading = document.getElementById("loading");
        loading.remove();

        const buttonSave = document.querySelector("#button-save");
        buttonSave.style.display = "block";
        buttonSave.onclick = () => addToLocalStorage({
            date: date,
            temp: timerData.main.temp,
            description: timerData.weather[0].description,
            icon: timerData.weather[0].icon
        });

        // atribuindo valor para div week-day
        const weekday = document.querySelector("#week-day");
        weekday.innerHTML = formatDate(date);

        // atribuindo valor para div horario
        const horario = document.querySelector("#horario");
        horario.innerHTML = formatTime(date);

        // atribuindo valor para div temp, convertendo de kelvin para celsius
        const tempDiv = document.querySelector("#temp");
        tempDiv.innerHTML = kelvinToCelsius(timerData.main.temp);

        // atribuindo valor para div description, descricao da temperatura
        const descriptionDiv = document.querySelector("#description");
        descriptionDiv.innerHTML = timerData.weather[0].description;

        // atribuindo valor ao icon da temperatura
        const iconImage = document.querySelector("#icon");
        iconImage.src = `http://openweathermap.org/img/wn/${timerData.weather[0].icon}@2x.png`;
        
        loadLocalStorageItems();

    });
}

main();
