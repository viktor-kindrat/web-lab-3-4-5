const sortBySpeedCheckbox = document.getElementById("sort-by-speed-btn")
const insectContainer = document.getElementById("insect-data-container");
const searchInsectInput = document.getElementById("search-insect-input")
const calculateSummaryWeightBtn = document.getElementById("calculate-summary-weight-btn")
const deletionModal = new bootstrap.Modal('#deletion-modal', {
    backdrop: true, keyboard: false
})
const deletionActionButton = document.getElementById("delete-action-button");
const deletionDiscardButton = document.getElementById("delete-discard-button");

deletionModal.hide()

let insects = []
let current = []
let insectInModal = null;

let showAlert = (message, type = 'warning') => {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show fixed-bottom w-75`;
    alertDiv.style.bottom = '0';
    alertDiv.style.left = '50%';
    alertDiv.style.transform = "translateX(-50%)"
    alertDiv.style.zIndex = '1050';

    alertDiv.innerHTML = `
        <div class="container">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;

    document.body.appendChild(alertDiv);

    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}


let fetchData = async () => {
    let insectResponse = await fetch("/api/insect");
    let data = await insectResponse.json()
    insects = data;
    current = JSON.parse(JSON.stringify(data));
}


let drawCards = (data) => {
    insectContainer.innerHTML = "";

    for (let insect of data) {
        insectContainer.insertAdjacentHTML("beforeend", `
<div class="card" style="width: 18rem;">
    <img src="${insect.imageLink}"
         class="card-img-top object-fit-cover"
         height="180"
         width="235"
         alt="${insect.name}">
    <div class="card-body">
        <h5 class="card-title">${insect.name}</h5>
        <p class="card-text text-truncate">${insect.description}</p>
        <p class="card-text"><b class="fw-bold">Швидкість</b>: ${insect.speedInMetersPerHour} м/год</p>
        <p class="card-text"><b class="fw-bold">Маса</b>: ${insect.weightInGram} г</p>
        <button class="btn btn-primary" id="edit-insect-${insect._id}">Редагувати</button>
        <button class="btn btn-danger" id="delete-insect-${insect._id}">Видалити</button>
    </div>
</div>        
        `)

        let editButton = document.getElementById(`edit-insect-${insect._id}`);
        editButton.addEventListener("click", (e) => {
            let link = document.createElement("a");
            link.href = `/update/${insect._id}`
            link.click()
        })
        let deleteButton = document.getElementById(`delete-insect-${insect._id}`);
        deleteButton.addEventListener("click", (e) => {
            deletionModal.toggle();
            insectInModal = insect._id;
        })
    }
}


let sortBySpeed = (insects) => insects.sort((a, b) => b.speedInMetersPerHour - a.speedInMetersPerHour)
let searchResult = (data, query) => data.filter(item => new RegExp(query, "gi").test(item.name))
let calculateSummaryWeight = (data) => data.reduce((acc, val) => acc + val.weightInGram, 0)


sortBySpeedCheckbox.addEventListener("input", () => {
    searchInsectInput.value = "";

    if (sortBySpeedCheckbox.checked) {
        current = sortBySpeed(current)
    } else {
        current = JSON.parse(JSON.stringify(insects))
    }
    drawCards(current)
})


searchInsectInput.addEventListener("input", (e) => {
    let data = JSON.parse(JSON.stringify(insects))
    data = searchResult(data, e.target.value.trim());
    current = data

    drawCards(current);
})


calculateSummaryWeightBtn.addEventListener("click", (e) => {
    document.getElementById("insectsWeight").innerHTML = calculateSummaryWeight(current)
})


deletionDiscardButton.addEventListener("click", () => insectInModal = null)
deletionActionButton.addEventListener("click", () => {
    fetch(`/api/insect/${insectInModal}`, {method: "DELETE"})
        .then(res => res.json())
        .then(data => {
            deletionModal.hide();

            setTimeout(() => {
                if (data.status === 200) {
                    showAlert("Комаху успішно видалено", "success");

                    (async function() {
                        await fetchData()
                        drawCards(current)
                    })()
                } else {
                    showAlert("Помилка при видаленні комахи. Спробуйте ще раз!", "warning")
                }
            }, 300)
        })
        .catch(e => {
            console.error(e)
            showAlert("Помилка при видаленні комахи. Спробуйте ще раз!", "error")
        })
})


document.addEventListener("DOMContentLoaded", async () => {
    await fetchData()
    drawCards(current)
})

