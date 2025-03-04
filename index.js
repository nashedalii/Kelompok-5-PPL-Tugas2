const fs = require('fs');
const readline = require('readline');

const FILE_PATH = 'database.json';

// Membaca database dari file JSON
function loadDatabase() {
    if (!fs.existsSync(FILE_PATH)) {
        fs.writeFileSync(FILE_PATH, JSON.stringify([]));
    }
    return JSON.parse(fs.readFileSync(FILE_PATH, 'utf8'));
}

// Menyimpan database ke file JSON
function saveDatabase(data) {
    fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function showMenu() {
    console.log("\nHalo, selamat datang di Database Pembalap F1");
    console.log("Pilih aksi:");
    console.log("1. Lihat daftar pembalap");
    console.log("2. Tambah pembalap");
    console.log("3. Update pembalap");
    console.log("4. Hapus pembalap");
    console.log("5. Keluar");
    rl.question("Masukkan nomor: ", (answer) => {
        handleMenu(answer);
    });
}

function handleMenu(choice) {
    const database = loadDatabase();
    switch (choice) {
        case '1':
            console.log("\nDaftar Pembalap F1:");
            database.forEach((item, index) => {
                console.log(`${index + 1}. ${JSON.stringify(item)}`);
            });
            showMenu();
            break;
        case '2':
            rl.question("Masukkan nama pembalap: ", (name) => {
                rl.question("Masukkan kebangsaan: ", (nationality) => {
                    rl.question("Masukkan nomor mobil: ", (carNumber) => {
                        rl.question("Masukkan merk mobil: ", (carBrand) => {
                            database.push({ name, nationality, carNumber: parseInt(carNumber), carBrand });
                            saveDatabase(database);
                            console.log("Pembalap berhasil ditambahkan!");
                            showMenu();
                        });
                    });
                });
            });
            break;
        case '3':
            rl.question("Masukkan nomor mobil pembalap yang ingin diupdate: ", (carNumber) => {
                const carNum = parseInt(carNumber); 
                const index = database.findIndex(i => i.carNumber === carNum);
                if (index === -1) {
                    console.log("Pembalap tidak ditemukan!");
                    return showMenu();
                }
                rl.question("Masukkan nama baru: ", (name) => {
                    rl.question("Masukkan kebangsaan baru: ", (nationality) => {
                        rl.question("Masukkan nomor mobil baru: ", (newCarNumber) => {
                            rl.question("Masukkan merk mobil baru: ", (carBrand) => {
                                database[index] = {
                                    name,
                                    nationality,
                                    carNumber: parseInt(newCarNumber), 
                                    carBrand
                                };
                                saveDatabase(database);
                                console.log("Pembalap berhasil diperbarui!");
                                showMenu();
                            });
                        });
                    });
                });
            });
            break;
        case '4':
            rl.question("Masukkan nomor mobil pembalap yang ingin dihapus: ", (carNumber) => {
                const carNum = parseInt(carNumber); 
                const index = database.findIndex(i => i.carNumber === carNum);
                if (index === -1) {
                    console.log("Pembalap tidak ditemukan!");
                } else {
                    database.splice(index, 1);
                    saveDatabase(database);
                    console.log("Pembalap berhasil dihapus!");
                }
                showMenu();
            });
            break;
        case '5':
            console.log("Terima kasih telah menggunakan program ini!");
            rl.close();
            break;
        default:
            console.log("Pilihan tidak valid, coba lagi.");
            showMenu();
            break;
    }
}

showMenu();
