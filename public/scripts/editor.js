let form = document.forms.createForm;
let submitButton = document.getElementById("submit-button");

submitButton.innerHTML = /update\//gi.test(location.pathname) ? 'Оновити' : 'Створити'

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

let create = (data) => {
    fetch("/api/insect", {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(data)
    })
        .then(res => res.json())
        .then(data => {
            if (data.status === 200) {
                showAlert("Комаху створено успішно", "success")
                form.reset()
            } else {
                showAlert(`Виникла помилка при створенні комахи: ${data.message}`, "warning")
            }
        })
        .catch(e => {
            console.error(e)
            showAlert(`Виникла помилка при створенні комахи: ${String(e)}`, "error")
        })
}

let update = (data, id) => {
    fetch(`/api/insect/${id}`, {
        method: "PUT",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(data)
    })
        .then(res => res.json())
        .then(data => {
            if (data.status === 200) {
                showAlert("Комаху оновлено успішно!", "success")
            } else {
                showAlert(`Виникла помилка при створенні комахи: ${data.message}`, "warning")
            }
        })
        .catch(e => {
            console.error(e)
            showAlert(`Виникла помилка при створенні комахи: ${String(e)}`, "error")
        })
}

let validateForm = ({imageLink, name, description, weightInGram, speedInMetersPerHour}) => {
    let errors = [];

    if (!imageLink) {
        errors.push("Заповніть поле \"Посилання на фото комахи\"");
    } else if (!/^https?:\/\/.*\.(jpg|jpeg|png|gif)$/.test(imageLink)) {
        errors.push("Поле \"Посилання на фото комахи\" повинне містити валідне посилання, яке закінчуєтсья на .jpg, .jpeg, .png, або .gif.");
    }

    if (!name || name.trim().length === 0) {
        errors.push("Заповніть назву комахи");
    }

    if (!description || description.trim().length === 0) {
        errors.push("Заповніть опис");
    }

    if (!weightInGram || isNaN(weightInGram) || Number(weightInGram) <= 0) {
        errors.push("Вага повинна бути додатнім валідним числом");
    }

    if (!speedInMetersPerHour || isNaN(speedInMetersPerHour) || Number(speedInMetersPerHour) <= 0) {
        errors.push("Швидксть повинна бути додатнім валідним числом");
    }

    return errors;
}

let setInputDisabledState = (form, state = true) => {
    let inputs = form.getElementsByTagName("input");
    for (let el of inputs) {
        el.disabled = state
    }
}

let setFormData = (data, form) => {
    for (let [key, value] of Object.entries(data)) {
        form.querySelector(`input[name="${key}"]`).value = value
    }
}

form.addEventListener("submit", (e) => {
    e.preventDefault();

    let formData = new FormData(e.target);

    const errors = validateForm({
        ...Object.fromEntries(formData.entries())
    });

    if (errors.length > 0) {
        errors.forEach(error => showAlert(error, 'warning'));
    } else {
        if (/update\//gi.test(location.pathname)) {
            update(Object.fromEntries(formData.entries()), location.pathname.split("/").at(-1))
        } else {
            create(Object.fromEntries(formData.entries()));
        }
    }
});


if (/update\//gi.test(location.pathname)) {
    let id = location.pathname.split("/").at(-1);

    setInputDisabledState(form, true)

    fetch(`/api/insect/${id}`)
        .then(res => res.json())
        .then(data => {
            if (data.status === 200) {
                setInputDisabledState(form, false)
                setFormData({
                    name: data.name,
                    description: data.description,
                    imageLink: data.imageLink,
                    weightInGram: data.weightInGram,
                    speedInMetersPerHour: data.speedInMetersPerHour
                }, form)
            } else {
                showAlert(`Виникла помилка при отриманні даних: ${data.message}`, "warning")
            }
        })
        .catch(e => {
            console.error(e)
            showAlert(`Виникла помилка при отриманні даних: ${String(e)}`, "error")
        })
}
