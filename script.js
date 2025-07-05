// Ambil data dari localStorage atau buat array kosong
let responses = JSON.parse(localStorage.getItem("responses")) || [];

const questions = [
    "Saya merasa nyaman ketika orang lain mengamati saya.",
    "Saya merasa baik-baik saja ketika menerima kritik dari orang lain.",
    "Saya merasa tenang ketika berbicara di depan umum, meskipun orang lain mungkin menilai saya.",
    "Saya merasa nyaman berinteraksi dengan orang yang baru saya temui.",
    "Saya senang menghadiri acara sosial di mana saya dapat bertemu dengan orang baru.",
    "Saya mudah beradaptasi dalam situasi sosial yang baru.",
    "Berbicara dengan orang yang tidak saya kenal bukan masalah bagi saya",
    "Saya merasa tenang ketika berada di lingkungan sosial yang belum pernah saya temui.",
    "Saya merasa percaya diri dalam berbagai situasi sosial.",
    " Saya merasa bahagia dengan kehidupan sosial saya.",
];

const answerDescriptions = {
    "5": "Sangat Setuju",
    "4": "Setuju",
    "3": "Netral",
    "2": "Tidak Setuju",
    "1": "Sangat Tidak Setuju"
};

// Fungsi untuk menentukan hasil kepribadian berdasarkan skor
function getPersonalityResult(score) {
    if (score >= 0 && score <= 26) {
        return "Kecemasan sosial tinggi, sulit berinteraksi di dating app.";
    } else if (score >= 27 && score <= 30) {
        return "Sering tidak nyaman, cenderung menghindari interaksi di dating app.";
    } else if (score >= 31 && score <= 36) {
        return "Kadang canggung, sesekali menghindari interaksi di dating app.";
    } else if (score >= 36 && score <= 40) {
        return "Cukup nyaman, tapi ada situasi yang bikin gugup di dating app.";
    } else if (score >= 41 && score <= 100) {
        return "Sangat percaya diri, jarang canggung di dating app.";
}

}

// Menampilkan pertanyaan di halaman quiz
const questionContainer = document.getElementById("questions");
if (questionContainer) {
    questions.forEach((q, index) => {
        let div = document.createElement("div");
        div.classList.add("question");
        div.innerHTML = `
            <p>${index + 1}. ${q}</p>
            <label><input type="radio" name="q${index}" value="5"> Sangat Setuju</label>
            <label><input type="radio" name="q${index}" value="4"> Setuju</label>
            <label><input type="radio" name="q${index}" value="3"> Netral</label>
            <label><input type="radio" name="q${index}" value="2"> Tidak Setuju</label>
            <label><input type="radio" name="q${index}" value="1"> Sangat Tidak Setuju</label>
        `;
        questionContainer.appendChild(div);
    });
}

// Memulai Quiz setelah isi biodata
function startQuiz() {
    let nama = document.getElementById("nama").value;
    let umur = document.getElementById("umur").value;
    let pekerjaan = document.getElementById("pekerjaan").value;
    let gender = document.getElementById("gender").value;

    if (nama === "" || umur === "") {
        alert("Harap isi semua data terlebih dahulu!");
        return;
    }

    document.getElementById("biodataForm").classList.add("hidden");
    document.getElementById("quizForm").classList.remove("hidden");

    window.userData = { nama, umur, pekerjaan, gender };
}

// Menghitung hasil quiz dan menyimpan data
function submitQuiz() {
    let score = 0;
    let userAnswers = [];

    questions.forEach((q, index) => {
        const selected = document.querySelector(`input[name="q${index}"]:checked`);
        if (selected) {
            score += parseInt(selected.value);
            userAnswers.push(selected.value);
        }
    });

    let resultText = getPersonalityResult(score);

    document.getElementById("userName").innerText = window.userData.nama;
    document.getElementById("userAge").innerText = window.userData.umur;
    document.getElementById("userJob").innerText = window.userData.pekerjaan;
    document.getElementById("userGender").innerText = window.userData.gender;
    document.getElementById("resultText").innerText = resultText;

    responses.push({ ...window.userData, answers: userAnswers, score });
    localStorage.setItem("responses", JSON.stringify(responses));

    document.getElementById("quizForm").classList.add("hidden");
    document.getElementById("result").classList.remove("hidden");
}

// Memulai ulang quiz
function restartQuiz() {
    location.reload();
}

// Menampilkan hasil di halaman results.html
function renderTable() {
    let table = document.getElementById("resultsTable");
    if (!table) return;

    table.innerHTML = ""; // Hapus isi sebelumnya agar tidak duplikat

    responses.forEach((user, index) => {
        let answersHTML = "<ul>";
        let totalScore = 0;

        user.answers.forEach((ans, i) => {
            totalScore += parseInt(ans);
            answersHTML += `<li><strong>${questions[i]}</strong>: ${answerDescriptions[ans]}</li>`;
        });

        answersHTML += "</ul>";
        let personalityResult = getPersonalityResult(totalScore);

        let row = `<tr>
            <td>${user.nama}</td>
            <td>${user.umur}</td>
            <td>${user.pekerjaan}</td>
            <td>${user.gender}</td>
            <td>${answersHTML}</td>
            <td>${personalityResult}</td>
            <td>
                <button class="action-btn edit-btn" onclick="editEntry(${index})">Edit</button>
                <button class="action-btn delete-btn" onclick="deleteEntry(${index})">Hapus</button>
            </td>
        </tr>`;
        table.innerHTML += row;
    });

    localStorage.setItem("responses", JSON.stringify(responses));
}

// Fungsi Edit Data
function editEntry(index) {
    let newName = prompt("Masukkan nama baru:", responses[index].nama);
    let newAge = prompt("Masukkan umur baru:", responses[index].umur);
    let newJob = prompt("Masukkan pekerjaan baru:", responses[index].pekerjaan);
    let newGender = prompt("Masukkan gender baru:", responses[index].gender);

    if (newName && newAge && newJob && newGender) {
        responses[index].nama = newName;
        responses[index].umur = newAge;
        responses[index].pekerjaan = newJob;
        responses[index].gender = newGender;
        renderTable();
    } else {
        alert("Edit dibatalkan. Semua data harus diisi!");
    }
}

// Fungsi Hapus Data
function deleteEntry(index) {
    if (confirm("Apakah Anda yakin ingin menghapus data ini?")) {
        responses.splice(index, 1);
        renderTable();
    }
}

// Menampilkan hasil jika berada di halaman results.html
if (document.getElementById("resultsTable")) {
    renderTable();
}
