
let devotions = JSON.parse(
    localStorage.getItem("devotions")
) || [];

// Get current local date
function getLocalDate() {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

// Format date for display
function formatDate(dateString) {
    if (!dateString) {
        return "Date not recorded";
    }

    const [year, month, day] = dateString.split("-");

    const date = new Date(
        Number(year),
        Number(month) - 1,
        Number(day)
    );

    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
    });
}

// Display Today's Date
function displayTodayDate() {
    const todayDate = document.getElementById("todayDate");

    if (todayDate) {
        todayDate.textContent = formatDate(getLocalDate());
    }
}

// Save devotions
function saveDevotions() {
    localStorage.setItem(
        "devotions",
        JSON.stringify(devotions)
    );
}

// Show or hide devotion form
function toggleForm() {
    const form = document.getElementById("devotionForm");
    const arrow = document.getElementById("formArrow");

    if (form.style.display === "block") {
        form.style.display = "none";
        arrow.innerHTML = "⬇";
    } else {
        form.style.display = "block";
        arrow.innerHTML = "⬆";
    }
}

// Add new devotion
function addDevotion() {
    const book = document.getElementById("book").value.trim();
    const chapter = document.getElementById("chapter").value.trim();
    const verse = document.getElementById("verse").value.trim();
    const devotion = document.getElementById("devotion").value.trim();

    if (!book || !chapter || !verse || !devotion) {
        alert("Please complete all fields!");
        return;
    }

    devotions.push({
        book,
        chapter,
        verse,
        devotion,
        dateCreated: getLocalDate()
    });

    saveDevotions();

    document.getElementById("book").value = "";
    document.getElementById("chapter").value = "";
    document.getElementById("verse").value = "";
    document.getElementById("devotion").value = "";

    document.getElementById("devotionForm").style.display = "none";
    document.getElementById("formArrow").innerHTML = "⬇";

    displayDevotions();
}

// Display saved devotions
function displayDevotions() {
    const list = document.getElementById("devotionList");

    list.innerHTML = "";

    devotions.forEach((item, index) => {
        list.innerHTML += `
            <div class="devotion-card">

                <div class="devotion-title">

                    <strong>
                        ${escapeHTML(item.book)}
                        ${escapeHTML(item.chapter)}:
                        ${escapeHTML(item.verse)}
                    </strong>

                    <div class="devotion-actions">

                        <button class="toggle-btn"
                            onclick="toggleDevotion(${index})">
                            ⬇
                        </button>

                        <button class="delete-btn"
                            onclick="deleteDevotion(${index})">
                            Delete
                        </button>

                    </div>

                </div>

                <div class="devotion-date">
                    Date Created: ${escapeHTML(
                        item.dateCreated
                            ? formatDate(item.dateCreated)
                            : "Date not recorded"
                    )}
                </div>

                <div class="devotion-content" id="content-${index}">
                    ${escapeHTML(item.devotion)}
                </div>

            </div>
        `;
    });
}

// Show or hide individual devotion
function toggleDevotion(index) {
    const content = document.getElementById("content-" + index);

    const button = content.previousElementSibling
        .previousElementSibling.querySelector(".toggle-btn");

    if (content.style.display === "block") {
        content.style.display = "none";
        button.innerHTML = "⬇";
    } else {
        content.style.display = "block";
        button.innerHTML = "⬆";
    }
}

// Delete devotion
function deleteDevotion(index) {
    const confirmDelete = confirm(
        "Are you sure you want to delete this devotion?"
    );

    if (confirmDelete) {
        devotions.splice(index, 1);

        saveDevotions();

        displayDevotions();
    }
}

// Protect displayed text
function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, function(char) {
        return {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        }[char];
    });
}

// Load date and saved devotions
displayTodayDate();
displayDevotions();
