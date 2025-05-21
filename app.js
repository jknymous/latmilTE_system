// Data latihan sample
const latihanData = [
    {
        nama: "Penyelesaian 1-on-1",
        modul: ["Tekel", "Keluar Sarang", "Giringan", "Penyelesaian", "Antisipasi"],
        tingkatKesulitan: "Mudah",
        kategori: "Menyerang",
    },
    {
        nama: "Oper, Lari, Tembak!",
        modul: ["Tembakan", "Umpan", "Antisipasi", "Kecepatan"],
        tingkatKesulitan: "Mudah",
        kategori: "Menyerang",
    },
    {
        nama: "Umpan Bola Mati",
        modul: ["Sundulan", "Umpan Silang", "Penjagaan", "Keluar Sarang", "Tembakan"],
        tingkatKesulitan: "Mudah",
        kategori: "Menyerang",
    },
    {
        nama: "Teknik Menembak",
        modul: ["Kekuatan", "Kelincahan", "Penyelesaian", "Tembakan", "Refleks"],
        tingkatKesulitan: "Medium",
        kategori: "Menyerang",
    },
    {
        nama: "Giring Bola ZigZag",
        modul: ["Umpan", "Giringan", "Kebugaran", "Kecepatan"],
        tingkatKesulitan: "Sulit",
        kategori: "Menyerang",
    },
    {
        nama: "Permainan Sayap",
        modul: ["Sundulan", "Umpan Silang", "Tinjuan", "Penyelesaian", "Tembakan"],
        tingkatKesulitan: "Sulit",
        kategori: "Menyerang",
    },
    {
        nama: "Serangan Balik Cepat",
        modul: ["Umpan Silang", "Umpan", "Penyelesaian", "Kreativitas", "Komunikasi"],
        tingkatKesulitan: "Extreme",
        kategori: "Menyerang",
    },
];

// Mapping kategori ke warna kiri
const categoryColors = {
    Menyerang: "bg-red-500",
    Bertahan: "bg-green-500",
    Penguasaan: "bg-yellow-400",
    Fisik: "bg-purple-600",
};

// Tingkat kesulitan ke warna label
const difficultyColors = {
    Mudah: "bg-green-300 text-green-800",
    Medium: "bg-yellow-300 text-yellow-800",
    Sulit: "bg-orange-300 text-orange-800",
    Extreme: "bg-red-300 text-red-800",
};

// Reference ke elemen form container
const formContainer = document.getElementById("latihan-form");

// Membuat form input baru
function createInputForm(value = "") {
    const formItem = document.createElement("div");
    formItem.className =
        "relative flex items-center border rounded-md bg-white shadow-sm pr-10";

    // Color bar category default transparent
    const colorBar = document.createElement("div");
    colorBar.className = "w-1 h-full rounded-l-md bg-transparent";

    // Input field
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Masukkan nama latihan";
    input.value = value;
    input.className =
        "flex-grow border-none focus:ring-0 px-3 py-2 rounded-l-md outline-none text-gray-700";
    input.autocomplete = "off";

    // Button hapus form
    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.setAttribute("aria-label", "Hapus form latihan");
    removeBtn.innerHTML = "&minus;";
    removeBtn.className =
        "absolute right-1 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-600 text-lg font-bold px-2 py-0";
    removeBtn.onclick = () => {
        formContainer.removeChild(formItem);
        updateRemoveButtons();
    };

    formItem.appendChild(colorBar);
    formItem.appendChild(input);

    // Tambah tombol hapus hanya jika ada lebih dari satu form
    if (formContainer.children.length > 0) {
        formItem.appendChild(removeBtn);
    }

    return formItem;
}

// Menambahkan form baru
function addForm(value = "") {
    const newForm = createInputForm(value);
    formContainer.appendChild(newForm);
    updateRemoveButtons();
}

// Update tombol hapus: hanya tampil jika form > 1
function updateRemoveButtons() {
    const forms = formContainer.children;
    if (forms.length === 1) {
        // Hapus semua tombol minus
        for (const f of forms) {
            const btn = f.querySelector("button");
            if (btn) btn.remove();
        }
    } else {
        // Pastikan semua form punya tombol minus
        for (const f of forms) {
            if (!f.querySelector("button")) {
                const removeBtn = document.createElement("button");
                removeBtn.type = "button";
                removeBtn.setAttribute("aria-label", "Hapus form latihan");
                removeBtn.innerHTML = "&minus;";
                removeBtn.className =
                    "absolute right-1 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-600 text-lg font-bold px-2 py-0";
                removeBtn.onclick = () => {
                    formContainer.removeChild(f);
                    updateRemoveButtons();
                };
                f.appendChild(removeBtn);
            }
        }
    }
}

// Fungsi pencarian latihan
function searchLatihan() {
    const inputs = Array.from(formContainer.querySelectorAll("input"));
    const queryList = inputs
        .map((input) => input.value.trim().toLowerCase())
        .filter((v) => v.length > 0);

    const results = [];

    // Reset color bars pada form
    Array.from(formContainer.children).forEach((formItem) => {
        const bar = formItem.firstChild;
        bar.className = "w-1 h-full rounded-l-md bg-transparent";
    });

    if (queryList.length === 0) {
        alert("Masukkan minimal satu nama latihan untuk mencari.");
        return;
    }

    // Cari latihan yang modulnya cocok
    for (const latihan of latihanData) {
        const modulStr = latihan.modul.map((m) => m.toLowerCase());
        const matchedModules = queryList.filter((q) => modulStr.includes(q));

        if (matchedModules.length > 0) {
            results.push({
                latihan,
                matchedModules,
            });
        }
    }

    // Warnai bar kiri form input sesuai hasil pencarian
    for (const [i, input] of inputs.entries()) {
        const val = input.value.trim().toLowerCase();
        const formItem = formContainer.children[i];
        const bar = formItem.firstChild;
        if (results.some((r) => r.matchedModules.includes(val))) {
            const r = results.find((r) => r.matchedModules.includes(val));
            bar.className = "w-1 h-full rounded-l-md " + (categoryColors[r.latihan.kategori] || "bg-gray-300");
        } else {
            bar.className = "w-1 h-full rounded-l-md bg-gray-200";
        }
    }

    renderResults(results);
}

// Render hasil pencarian ke UI
function renderResults(results) {
    const resultsEl = document.getElementById("results");
    resultsEl.innerHTML = "";

    if (results.length === 0) {
        resultsEl.innerHTML =
            '<p class="text-center text-gray-500 italic">Tidak ada latihan yang cocok ditemukan.</p>';
        return;
    }

    for (const { latihan, matchedModules } of results) {
        // Highlight modul yang cocok
        const modulHighlights = latihan.modul
            .map((modul) => {
                if (matchedModules.includes(modul.toLowerCase())) {
                    return `<span class="font-semibold text-white bg-blue-600 px-1 rounded">${modul}</span>`;
                }
                return modul;
            })
            .join(", ");

        const difficultyClass = difficultyColors[latihan.tingkatKesulitan] || "bg-gray-300 text-gray-800";
        const categoryClass = categoryColors[latihan.kategori] || "bg-gray-300";

        const card = document.createElement("div");
        card.className = "flex items-center space-x-4 border rounded p-4 mb-3 bg-white shadow-sm";

        const colorBar = document.createElement("div");
        colorBar.className = `w-2 h-16 rounded ${categoryClass}`;
        card.appendChild(colorBar);

        const content = document.createElement("div");
        content.innerHTML = `
        <h3 class="text-lg font-bold text-gray-800">${latihan.nama}</h3>
        <p class="text-gray-700">Modul latihan: ${modulHighlights}</p>
        <p class="mt-1"><span class="inline-block ${difficultyClass} text-xs font-semibold px-2 py-0.5 rounded">${latihan.tingkatKesulitan}</span></p>
        `;

        card.appendChild(content);
        resultsEl.appendChild(card);
    }
}

// Event listeners
document.getElementById("add-form-btn").addEventListener("click", () => addForm());
document.getElementById("search-btn").addEventListener("click", searchLatihan);

// Inisialisasi dengan satu form
addForm();

