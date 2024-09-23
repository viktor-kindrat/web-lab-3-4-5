const sortBySpeedCheckbox = document.getElementById("sort-by-speed-btn")
const insectContainer = document.getElementById("insect-data-container");
const searchInsectInput = document.getElementById("search-insect-input")

let insects = []
let current = []


let fetchData = async (params) => {
    let insectResponse = await fetch("./data.json");
    let data = await insectResponse.json()
    insects = data;
    current = JSON.parse(JSON.stringify(data));
}

let drawCards = (data) => {
    insectContainer.innerHTML = "";

    for (let insect of data) {
        insectContainer.insertAdjacentHTML("beforeend", `
<div class="card" style="width: 18rem;">
    <img src="${insect.image}"
         class="card-img-top object-fit-cover"
         height="180"
         width="235"
         alt="${insect.name}">
    <div class="card-body">
        <h5 class="card-title">${insect.name}</h5>
        <p class="card-text">${insect.description}</p>
        <p class="card-text"><b class="fw-bold">Швидкість</b>: ${insect.speedInMetersPerHour} м/год</p>
        <p class="card-text"><b class="fw-bold">Маса</b>: ${insect.weightInGram} г</p>
        <button class="btn btn-primary" id="edit-insect-${insect.id}">Редагувати</button>
        <button class="btn btn-danger" id="delete-insect-${insect.id}">Видалити</button>
    </div>
</div>        
        `)

        let editButton = document.getElementById(`edit-insect-${insect.id}`);
        let deleteButton = document.getElementById(`delete-insect-${insect.id}`);
    }
}

let sortBySpeed = (insects) => insects.sort((a, b) => b.speedInMetersPerHour - a.speedInMetersPerHour)

sortBySpeedCheckbox.addEventListener("input", () => {
    searchInsectInput.value = "";

    if (sortBySpeedCheckbox.checked) {
        current = sortBySpeed(current)
    } else {
        current = JSON.parse(JSON.stringify(insects))
    }
    drawCards(current)
})

let searchResult = (data, query) => data.filter(item => new RegExp(query, "gi").test(item.name))

searchInsectInput.addEventListener("input", (e) => {
    let data = JSON.parse(JSON.stringify(current))
    data = searchResult(data, e.target.value.trim());

    drawCards(data);
})

document.addEventListener("DOMContentLoaded", async () => {
    await fetchData()
    drawCards(current)
})