// Code.gs (Google Apps Script)
// Copy paste kode ini ke Extensions > Apps Script pada Spreadsheet Anda

const SPREADSHEET_ID = "1WkxCayIVb0I4AjCscD2ICFQDWh2eBiDwnroi4usIsLs"; // Ganti dengan ID Spreadsheet Anda

function doGet(e) {
  // CORS Handling for Fetch API
  const output = ContentService.createTextOutput(JSON.stringify(getCombinedData()));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}

function getCombinedData() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  
  // Baca Sheet DATA_DUKUNG
  const sheetDaduk = ss.getSheetByName("DATA_DUKUNG");
  const dataDaduk = sheetDaduk.getDataRange().getValues();
  const headersDaduk = dataDaduk[0];
  
  // Baca Sheet LINK_SHEET (Semula - Menjadi)
  const sheetLink = ss.getSheetByName("LINK_SHEET");
  const dataLink = sheetLink.getDataRange().getValues();
  // Asumsi LINK_SHEET memiliki mapping id_baru, tarif_lama, tarif_baru, dan kategori (BARU/UBAH/TETAP)
  
  // Proses Data: Anda bisa melakukan join array berdasarkan ID (misal kolom B di Daduk = id_baru)
  let result = [];
  
  // Simulasi parsing (Karena struktur kolom pasti bervariasi, sesuaikan index kolomnya)
  // Index contoh: id_baru(2), jenis(3), nama(6), tarif(9) di DADUK
  
  for(let i = 1; i < dataDaduk.length; i++) {
    let row = dataDaduk[i];
    let id_baru = row[2]; // sesuaikan
    let nama = row[6]; // sesuaikan
    
    // Logika lookup ke dataLink untuk mendapat tarif lama & kategori
    // (Di sini kami simulasikan datanya untuk contoh struktur kembalian)
    let tarif_baru = parseFloat(row[9]) || 0; // kolom tarif
    
    // Asumsi didapat dari proses lookup ke sheet LINK_SHEET:
    let kategori = "TETAP"; 
    let tarif_lama = tarif_baru;
    let persentase = 0;
    
    // Contoh Random logic untuk mendemonstrasikan UBAH/BARU
    if (i % 3 === 0) {
      kategori = "UBAH";
      tarif_lama = tarif_baru * 0.8; // tarif lama lebih murah
      persentase = ((tarif_baru - tarif_lama) / tarif_lama) * 100;
    } else if (i % 5 === 0) {
      kategori = "BARU";
      tarif_lama = null;
    }

    result.push({
      id_baru: id_baru,
      nama_layanan: nama,
      jenis_layanan: row[4] || "-",
      tarif_lama: tarif_lama,
      tarif_baru: tarif_baru,
      kategori: kategori,
      persentase_perubahan: persentase
    });
  }
  
  return {
    status: "success",
    data: result
  };
}
