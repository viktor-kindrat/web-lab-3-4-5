let form = document.forms.createForm;

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
            console.log(data)
        })
        .catch(e => {
            console.error(e)
        })
}

function showAlert(message, type = 'warning') {
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

function validateForm({ imageLink, name, description, weightInGram, speedInMetersPerHour }) {
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

form.addEventListener("submit", (e) => {
    e.preventDefault();

    let formData = new FormData(e.target);

    const errors = validateForm({
        ...Object.fromEntries(formData.entries())
    });

    if (errors.length > 0) {
        errors.forEach(error => showAlert(error, 'warning'));
    } else {
        create(Object.fromEntries(formData.entries()));

        showAlert('Form submitted successfully!', 'success');
    }
});
