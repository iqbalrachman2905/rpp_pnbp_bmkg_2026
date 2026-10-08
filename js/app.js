// app.js
const GAS_URL = "https://script.google.com/macros/s/AKfycbyOHapS36FiuKilvEIq1msRQQ2wrBoTLoo-H1S-Q6IpMKpcSVj3yRyZDvCSNnS1cNqR/exec";
let globalData = [];

document.addEventListener("DOMContentLoaded", () => {
    fetchData();
    document.getElementById('searchInput').addEventListener('input', renderTable);
    document.getElementById('kategoriFilter').addEventListener('change', renderTable);
    document.getElementById('sortFilter').addEventListener('change', renderTable);
});

async function fetchData() {
    try {
        const response = await fetch(GAS_URL);
        const data = await response.json();
        globalData = data.data || [];
        document.getElementById('loader').classList.add('hidden');
        document.getElementById('dataTable').classList.remove('hidden');
        renderTable();
    } catch (error) {
        document.getElementById('loader').innerText = "Gagal memuat data. Periksa URL GAS.";
        console.error(error);
    }
}

function renderTable() {
    const search = document.getElementById('searchInput').value.toLowerCase();
    const kategori = document.getElementById('kategoriFilter').value;
    const sort = document.getElementById('sortFilter').value;
    const tbody = document.getElementById('tableBody');

    let filteredData = globalData.filter(item => {
        const matchSearch = item.nama_layanan.toLowerCase().includes(search) || item.id_baru.toString().includes(search);
        const matchKategori = kategori === "" || item.kategori === kategori;
        return matchSearch && matchKategori;
    });

    if (sort === "hargaAsc") {
        filteredData.sort((a, b) => a.tarif_baru - b.tarif_baru);
    } else if (sort === "hargaDesc") {
        filteredData.sort((a, b) => b.tarif_baru - a.tarif_baru);
    } else if (sort === "persenDesc") {
        filteredData.sort((a, b) => Math.abs(b.persentase_perubahan) - Math.abs(a.persentase_perubahan));
    }

    tbody.innerHTML = "";
    filteredData.forEach(item => {
        let persenHtml = `<span class="persen neutral">-</span>`;
        if (item.kategori === "UBAH") {
            const isUp = item.persentase_perubahan > 0;
            const icon = isUp ? '<i class="fas fa-arrow-up"></i>' : '<i class="fas fa-arrow-down"></i>';
            const cls = isUp ? 'up' : 'down';
            persenHtml = `<span class="persen ${cls}">${icon} ${Math.abs(item.persentase_perubahan).toFixed(2)}%</span>`;
        }

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${item.id_baru}</td>
            <td>
                <div style="font-weight:600;">${item.nama_layanan}</div>
                <div style="font-size:11px; color:#64748b;">${item.jenis_layanan}</div>
            </td>
            <td><span class="badge ${item.kategori.toLowerCase()}">${item.kategori}</span></td>
            <td>${item.tarif_lama ? '<span class="tarif-lama">Rp ' + item.tarif_lama.toLocaleString('id-ID') + '</span>' : '-'}</td>
            <td class="tarif-baru">Rp ${item.tarif_baru ? item.tarif_baru.toLocaleString('id-ID') : 0}</td>
            <td>${persenHtml}</td>
            <td>
                <button class="btn-detail" onclick="showDetail('${item.id_baru}')">
                    <i class="fas fa-eye"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function showDetail(id) {
    alert("Dropdown/Modal Detail untuk ID: " + id + "\nFitur hover/dropdown bisa dikembangkan di sini untuk menampilkan detail dari sheet DATA_DUKUNG");
}
