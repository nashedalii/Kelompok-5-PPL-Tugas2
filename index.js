const fs = require('fs');
const readline = require('readline');
const chalk = require('chalk');
const figlet = require('figlet');

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
    console.log(chalk.cyan(figlet.textSync('F1 Database', { horizontalLayout: 'full' })));
    console.log(chalk.yellow("\nHalo, selamat datang di Database Pembalap F1"));
    console.log(chalk.green("Pilih aksi:"));
    console.log(chalk.blue("1. Lihat daftar pembalap"));
    console.log(chalk.blue("2. Tambah pembalap"));
    console.log(chalk.blue("3. Update pembalap"));
    console.log(chalk.blue("4. Hapus pembalap"));
    console.log(chalk.red("5. Keluar"));
    rl.question(chalk.magenta("Masukkan nomor: "), (answer) => {
        handleMenu(answer);
    });
}

function handleMenu(choice) {
    const database = loadDatabase();
    switch (choice) {
        case '1':
            console.log(chalk.yellow("\nDaftar Pembalap F1:"));
            database.forEach((item, index) => {
                console.log(chalk.cyan(`${index + 1}. ${JSON.stringify(item, null, 2)}`));
            });
            showMenu();
            break;
        case '2':
            rl.question(chalk.green("Masukkan nama pembalap: "), (name) => {
                rl.question(chalk.green("Masukkan kebangsaan: "), (nationality) => {
                    rl.question(chalk.green("Masukkan nomor mobil: "), (carNumber) => {
                        rl.question(chalk.green("Masukkan merk mobil: "), (carBrand) => {
                            database.push({ name, nationality, carNumber: parseInt(carNumber), carBrand });
                            saveDatabase(database);
                            console.log(chalk.blue("Pembalap berhasil ditambahkan!"));
                            showMenu();
                        });
                    });
                });
            });
            break;
        case '3':
            rl.question(chalk.green("Masukkan nomor mobil pembalap yang ingin diupdate: "), (carNumber) => {
                const carNum = parseInt(carNumber);
                const index = database.findIndex(i => i.carNumber === carNum);
                if (index === -1) {
                    console.log(chalk.red("Pembalap tidak ditemukan!"));
                    return showMenu();
                }
                rl.question(chalk.green("Masukkan nama baru: "), (name) => {
                    rl.question(chalk.green("Masukkan kebangsaan baru: "), (nationality) => {
                        rl.question(chalk.green("Masukkan nomor mobil baru: "), (newCarNumber) => {
                            rl.question(chalk.green("Masukkan merk mobil baru: "), (carBrand) => {
                                database[index] = {
                                    name,
                                    nationality,
                                    carNumber: parseInt(newCarNumber),
                                    carBrand
                                };
                                saveDatabase(database);
                                console.log(chalk.blue("Pembalap berhasil diperbarui!"));
                                showMenu();
                            });
                        });
                    });
                });
            });
            break;
        case '4':
            rl.question(chalk.green("Masukkan nomor mobil pembalap yang ingin dihapus: "), (carNumber) => {
                const carNum = parseInt(carNumber);
                const index = database.findIndex(i => i.carNumber === carNum);
                if (index === -1) {
                    console.log(chalk.red("Pembalap tidak ditemukan!"));
                } else {
                    database.splice(index, 1);
                    saveDatabase(database);
                    console.log(chalk.blue("Pembalap berhasil dihapus!"));
                }
                showMenu();
            });
            break;
        case '5':
            console.log(chalk.yellow("Terima kasih telah menggunakan aplikasi sederhana ini!"));
            rl.close();
            break;
        default:
            console.log(chalk.red("Pilihan tidak valid, coba lagi."));
            showMenu();
            break;
    }
}

showMenu();
