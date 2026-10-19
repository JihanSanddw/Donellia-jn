
# Denollia API Documentation

Dokumentasi REST API untuk aplikasi Denollia, aplikasi pengelola todo, wishlist, goals, dan gift planner.

## 1. Base URL

### Local Development

```text
http://localhost:2660
```

Ganti port jika konfigurasi server menggunakan port yang berbeda.

## 2. Authentication

Endpoint yang membutuhkan autentikasi menggunakan JWT Bearer Token.

Tambahkan header berikut pada request yang membutuhkan login:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

Token diperoleh dari endpoint login.

## 3. Response Format

Sebagian besar endpoint menggunakan format JSON.

Contoh response berhasil:

```json
{
  "success": true,
  "message": "Operasi berhasil"
}
```

Response error dapat berisi `success: false` dan `message` yang menjelaskan penyebabnya. Endpoint autentikasi tertentu hanya mengembalikan `message`.

## 4. Endpoint List

| Method | Endpoint | Access |
|---|---|---|
| GET | `/` | Public |
| GET | `/api/health/db` | Public |
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| GET | `/api/auth/me` | Authenticated |
| PATCH | `/api/auth/avatar` | Authenticated |
| GET | `/api/wishlists` | Authenticated |
| GET | `/api/wishlists/:id` | Authenticated |
| POST | `/api/wishlists` | Authenticated |
| PUT | `/api/wishlists/:id` | Authenticated |
| DELETE | `/api/wishlists/:id` | Authenticated |
| GET | `/api/gifts` | Authenticated |
| GET | `/api/gifts/:id` | Authenticated |
| POST | `/api/gifts` | Authenticated |
| PUT | `/api/gifts/:id` | Authenticated |
| DELETE | `/api/gifts/:id` | Authenticated |
| GET | `/api/admin/members` | Admin |
| GET | `/api/admin/members/:id` | Admin |
| PATCH | `/api/admin/members/:id/status` | Admin |

Catatan: endpoint Admin juga membutuhkan JWT. Pengguna dengan role `user` tidak memiliki akses ke endpoint tersebut.

---

## 5. General & Database Health

### GET `/`

Memeriksa apakah API sedang berjalan.

**Authentication:** Tidak diperlukan.

Contoh response `200 OK`:

```json
{
  "success": true,
  "message": "Denollia API is running!"
}
```

### GET `/api/health/db`

Memeriksa koneksi API ke database.

**Authentication:** Tidak diperlukan.

Contoh response `200 OK`:

```json
{
  "success": true,
  "message": "Database connection successful",
  "data": [
    {
      "connected": 1
    }
  ]
}
```

Response `500 Internal Server Error` menunjukkan koneksi database gagal.

---

## 6. Authentication & Profile

### POST `/api/auth/register`

Mendaftarkan akun baru.

**Authentication:** Tidak diperlukan.

**Body:** `multipart/form-data`

| Field | Type | Required | Rules |
|---|---|---|---|
| `username` | Text | Yes | 2–50 karakter setelah spasi awal/akhir dibuang |
| `email` | Text | Yes | Format email valid |
| `password` | Text | Yes | 8–72 karakter |
| `avatar` | File | Yes | Foto profil; lihat batas upload di bawah |

File foto dikirim melalui field bernama `avatar`.

Batas upload yang diterapkan middleware: maksimal 2 MB, satu file, dengan tipe MIME JPEG, PNG, atau WebP.

Contoh response `201 Created`:

```json
{
  "message": "Registrasi berhasil",
  "user": {
    "id": 1,
    "username": "jihan",
    "email": "jihan@example.com",
    "avatar_url": "https://res.cloudinary.com/example/image/upload/avatar.jpg"
  }
}
```

Kemungkinan error:
- `400 Bad Request`: input wajib belum lengkap, format email salah, password atau username tidak memenuhi aturan, atau foto tidak diunggah.
- `409 Conflict`: email sudah terdaftar.
- `500 Internal Server Error`: registrasi gagal.

### POST `/api/auth/login`

Login menggunakan email dan password.

**Authentication:** Tidak diperlukan.

**Body:** `application/json`

```json
{
  "email": "jihan@example.com",
  "password": "password123"
}
```

Contoh response `200 OK`:

```json
{
  "message": "Login berhasil",
  "token": "YOUR_JWT_TOKEN",
  "user": {
    "id": 1,
    "username": "jihan",
    "email": "jihan@example.com",
    "role": "user",
    "avatar_url": "https://res.cloudinary.com/example/image/upload/avatar.jpg"
  }
}
```

Simpan nilai `token` untuk digunakan pada endpoint yang memerlukan autentikasi.

Kemungkinan error:
- `400 Bad Request`: email atau password belum diisi.
- `401 Unauthorized`: email atau password salah.
- `403 Forbidden`: akun dinonaktifkan.
- `500 Internal Server Error`: login gagal.

### GET `/api/auth/me`

Mengambil profil pengguna yang sedang login.

**Authentication:** Bearer Token.

Contoh response `200 OK`:

```json
{
  "success": true,
  "message": "Profil berhasil diambil",
  "user": {
    "id": 1,
    "username": "jihan",
    "email": "jihan@example.com",
    "role": "user",
    "avatar_url": "https://res.cloudinary.com/example/image/upload/avatar.jpg",
    "created_at": "2026-10-19T10:00:00.000Z"
  }
}
```

Kemungkinan error:
- `401 Unauthorized`: token tidak valid, kedaluwarsa, atau tidak dikirim.
- `403 Forbidden`: akun dinonaktifkan.
- `404 Not Found`: pengguna tidak ditemukan.
- `500 Internal Server Error`: gagal mengambil profil.

### PATCH `/api/auth/avatar`

Mengganti foto profil pengguna yang sedang login.

**Authentication:** Bearer Token.

**Body:** `multipart/form-data`

| Field | Type | Required |
|---|---|---|
| `avatar` | File | Yes |

Gunakan batas upload foto yang sama dengan endpoint registrasi.

Contoh response `200 OK`:

```json
{
  "success": true,
  "message": "Foto profil berhasil diperbarui",
  "user": {
    "id": 1,
    "avatar_url": "https://res.cloudinary.com/example/image/upload/new-avatar.jpg"
  }
}
```

Kemungkinan error:
- `400 Bad Request`: foto tidak diunggah atau file tidak memenuhi aturan upload.
- `401 Unauthorized`: token tidak valid.
- `403 Forbidden`: akun dinonaktifkan.
- `404 Not Found`: pengguna tidak ditemukan.
- `500 Internal Server Error`: gagal memperbarui foto profil.

Foto baru disimpan di Cloudinary. Sistem juga berusaha menghapus foto lama setelah foto baru berhasil disimpan.

---

## 7. Wishlist, Todo & Goals

Semua endpoint di bagian ini membutuhkan Bearer Token.

Data hanya dapat diakses dan dikelola oleh pengguna pemiliknya.

### Field Wishlist

| Field | Type | Required on create/update | Rules |
|---|---|---|---|
| `title` | String | Yes | 1–150 karakter setelah trim |
| `description` | String atau `null` | No | Deskripsi teks |
| `category` | String | Yes | `todo`, `wishlist`, atau `goal` |
| `priority` | String | No | `low`, `medium`, atau `high`; default `medium` |
| `status` | String | No | `planned`, `in_progress`, atau `completed`; default `planned` |
| `target_date` | String tanggal atau `null` | No | Format `YYYY-MM-DD` |

`PUT` digunakan untuk memperbarui seluruh input item. Kirim kembali field wajib `title` dan `category`.

### GET `/api/wishlists`

Mengambil semua item milik pengguna yang login.

Contoh response `200 OK`:

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Belajar TypeScript",
      "description": "Menyelesaikan latihan",
      "category": "todo",
      "priority": "high",
      "status": "in_progress",
      "target_date": "2026-10-25"
    }
  ]
}
```

Bentuk item mengikuti kolom yang dikembalikan oleh model database.

### GET `/api/wishlists/:id`

Mengambil detail item berdasarkan ID.

Contoh: `GET /api/wishlists/1`

Response berhasil:

```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Belajar TypeScript",
    "description": "Menyelesaikan latihan",
    "category": "todo",
    "priority": "high",
    "status": "in_progress",
    "target_date": "2026-10-25"
  }
}
```

`400 Bad Request` jika ID tidak valid, atau `404 Not Found` jika item tidak ditemukan atau bukan milik pengguna tersebut.

### POST `/api/wishlists`

Membuat item baru.

**Body:** `application/json`

```json
{
  "title": "Membeli buku",
  "description": "Buku untuk belajar pemrograman",
  "category": "wishlist",
  "priority": "medium",
  "status": "planned",
  "target_date": "2026-11-01"
}
```

Response `201 Created`:

```json
{
  "success": true,
  "message": "Item berhasil ditambahkan",
  "data": {
    "id": 2,
    "title": "Membeli buku",
    "description": "Buku untuk belajar pemrograman",
    "category": "wishlist",
    "priority": "medium",
    "status": "planned",
    "target_date": "2026-11-01"
  }
}
```

Field opsional yang tidak dikirim akan menggunakan nilai default yang ditentukan controller atau `null`, sesuai field-nya.

### PUT `/api/wishlists/:id`

Memperbarui item milik pengguna.

**Body:** Gunakan format JSON yang sama dengan endpoint POST, termasuk field `title` dan `category`.

Response `200 OK`:

```json
{
  "success": true,
  "message": "Item berhasil diperbarui",
  "data": {}
}
```

Objek `data` berisi item yang sudah diperbarui. Contoh di atas hanya menunjukkan struktur umum; gunakan response aktual dari server untuk detail field.

### DELETE `/api/wishlists/:id`

Menghapus item milik pengguna.

Contoh: `DELETE /api/wishlists/1`

Response `200 OK`:

```json
{
  "success": true,
  "message": "Item berhasil dihapus"
}
```

Untuk endpoint detail, update, dan delete, ID harus berupa bilangan bulat positif. Item yang tidak ditemukan atau bukan milik pengguna akan menghasilkan `404 Not Found`.

---

## 8. Gift Planner

Semua endpoint Gift Planner membutuhkan Bearer Token. Setiap pengguna hanya dapat mengakses hadiah miliknya sendiri.

### Field Gift

| Field | Type | Required on create/update | Rules |
|---|---|---|---|
| `recipient_name` | String | Yes | 1–100 karakter setelah trim |
| `gift_name` | String | Yes | 1–150 karakter setelah trim |
| `occasion` | String atau `null` | No | Maksimal 100 karakter |
| `budget` | Number, string angka, atau `null` | No | Tidak negatif, maksimal 2 angka desimal |
| `event_date` | String tanggal atau `null` | No | Format `YYYY-MM-DD` |
| `status` | String | No | `planned`, `purchased`, atau `given`; default `planned` |

### GET `/api/gifts`

Mengambil semua hadiah milik pengguna yang login.

Response `200 OK`:

```json
{
  "success": true,
  "data": []
}
```

`data` berisi daftar hadiah dari database.

### GET `/api/gifts/:id`

Mengambil detail hadiah berdasarkan ID.

Contoh: `GET /api/gifts/1`

Response berhasil:

```json
{
  "success": true,
  "data": {}
}
```

Objek `data` berisi hadiah yang ditemukan. ID tidak valid menghasilkan `400 Bad Request`; hadiah yang tidak ditemukan atau bukan milik pengguna menghasilkan `404 Not Found`.

### POST `/api/gifts`

Membuat rencana hadiah baru.

**Body:** `application/json`

```json
{
  "recipient_name": "Ibu",
  "gift_name": "Tas",
  "occasion": "Ulang tahun",
  "budget": 250000,
  "event_date": "2026-11-10",
  "status": "planned"
}
```

Response `201 Created`:

```json
{
  "success": true,
  "message": "Hadiah berhasil ditambahkan",
  "data": {}
}
```

`data` berisi hadiah yang dibuat.

### PUT `/api/gifts/:id`

Memperbarui rencana hadiah milik pengguna.

**Body:** Gunakan format JSON yang sama dengan POST, termasuk `recipient_name` dan `gift_name`.

Response `200 OK`:

```json
{
  "success": true,
  "message": "Hadiah berhasil diperbarui",
  "data": {}
}
```

### DELETE `/api/gifts/:id`

Menghapus rencana hadiah milik pengguna.

Contoh: `DELETE /api/gifts/1`

Response `200 OK`:

```json
{
  "success": true,
  "message": "Hadiah berhasil dihapus"
}
```

Validasi ID dan aturan kepemilikan data sama seperti endpoint wishlist.

---

## 9. Admin Member Management

Semua endpoint admin memerlukan:
1. Bearer Token yang valid.
2. Pengguna dengan role `admin`.

Admin dapat melihat data member serta mengaktifkan atau menonaktifkan akun. Endpoint ini tidak digunakan untuk mengubah isi wishlist atau gift milik member.

### GET `/api/admin/members`

Mengambil daftar member.

Contoh response `200 OK`:

```json
{
  "success": true,
  "message": "Daftar member berhasil diambil",
  "data": []
}
```

`data` berisi daftar member sesuai field yang dipilih oleh model.

### GET `/api/admin/members/:id`

Mengambil detail member berdasarkan ID.

Contoh: `GET /api/admin/members/2`

Response berhasil:

```json
{
  "success": true,
  "message": "Detail member berhasil diambil",
  "data": {}
}
```

`data` berisi detail member yang ditemukan.

Kemungkinan error:
- `400 Bad Request`: ID tidak valid.
- `401 Unauthorized`: token tidak valid.
- `403 Forbidden`: bukan admin atau akun dinonaktifkan.
- `404 Not Found`: member tidak ditemukan.

### PATCH `/api/admin/members/:id/status`

Mengaktifkan atau menonaktifkan akun member.

**Body:** `application/json`

Mengaktifkan akun:

```json
{
  "is_active": true
}
```

Menonaktifkan akun:

```json
{
  "is_active": false
}
```

Response `200 OK` untuk aktivasi:

```json
{
  "success": true,
  "message": "Akun member berhasil diaktifkan",
  "data": {
    "id": 2,
    "username": "member",
    "is_active": true
  }
}
```

Untuk penonaktifan, pesan menjadi `Akun member berhasil dinonaktifkan` dan `is_active` bernilai `false`.

Kemungkinan error:
- `400 Bad Request`: ID tidak valid atau `is_active` bukan boolean.
- `401 Unauthorized`: token tidak valid.
- `403 Forbidden`: bukan admin atau admin mencoba mengubah status akunnya sendiri.
- `404 Not Found`: member tidak ditemukan.
- `500 Internal Server Error`: gagal mengubah status member.

Akun yang dinonaktifkan tidak dapat login. Middleware autentikasi juga memeriksa status akun pada request terproteksi.

---

## 10. Common HTTP Status Codes

| Status | Meaning |
|---|---|
| `200 OK` | Request berhasil |
| `201 Created` | Data berhasil dibuat |
| `400 Bad Request` | Input tidak valid |
| `401 Unauthorized` | Token tidak valid atau kredensial login salah |
| `403 Forbidden` | Akses ditolak atau akun dinonaktifkan |
| `404 Not Found` | Resource tidak ditemukan atau bukan milik pengguna |
| `409 Conflict` | Email sudah terdaftar |
| `500 Internal Server Error` | Terjadi kesalahan pada server |

## 11. Testing with Postman

1. Jalankan server dengan `npm run dev`.
2. Tes `GET /` untuk memastikan API berjalan.
3. Tes `GET /api/health/db` untuk memeriksa koneksi database.
4. Registrasi menggunakan `POST /api/auth/register` dan `multipart/form-data`.
5. Login menggunakan `POST /api/auth/login`.
6. Salin token dari response login.
7. Pada Postman, buka tab **Authorization**, pilih **Bearer Token**, lalu tempel token.
8. Tes `GET /api/auth/me`.
9. Tes CRUD `/api/wishlists` dan `/api/gifts`.
10. Login menggunakan akun admin untuk mengetes endpoint `/api/admin/members`.

Untuk mengetes akses admin, gunakan token admin yang dibuat melalui proses promosi admin yang tersedia di project. Jangan menaruh password atau token asli ke dokumentasi publik.

## 12. Security Notes

- Password disimpan sebagai hash menggunakan bcrypt, bukan sebagai teks biasa.
- Endpoint privat menggunakan JWT.
- Endpoint admin membutuhkan role `admin`.
- Data wishlist dan gift dibatasi berdasarkan ID pengguna yang login.
- Foto profil disimpan di Cloudinary.
- Jangan commit file `.env`, JWT secret, atau kredensial database ke GitHub.
