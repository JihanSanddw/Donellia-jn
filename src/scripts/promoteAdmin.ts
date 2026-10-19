import "dotenv/config";
import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";
import connection from "../config/database";

async function main() {
  const readline = createInterface({ input: stdin, output: stdout });

  try {
    const email = (
      await readline.question("Masukkan email akun yang akan dijadikan admin: ")
    ).trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      console.log("Format email tidak valid.");
      return;
    }

    const db = await connection;

    const [result] = await db.query(
      `UPDATE users
       SET role = 'admin'
       WHERE email = ? AND role = 'user'`,
      [email]
    );

    const affectedRows = (result as { affectedRows: number }).affectedRows;

    if (affectedRows === 0) {
      console.log(
        "Tidak ada akun member yang diubah. Periksa email atau role akun."
      );
      return;
    }

    console.log("Role akun berhasil diubah menjadi admin.");
    console.log("Silakan login kembali untuk memperoleh token admin yang baru.");
  } catch (error) {
    console.error("Gagal menetapkan admin:", error);
    process.exitCode = 1;
  } finally {
    readline.close();
    const db = await connection;
    await db.end();
  }
}

main();
