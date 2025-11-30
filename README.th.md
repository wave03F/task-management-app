# Workshop Todo List (ภาษาไทย)

## คำอธิบายโปรเจกต์
โปรเจกต์ตัวอย่างด้วยเฟรมเวิร์ก NestJS เชื่อมต่อฐานข้อมูล PostgreSQL ผ่าน TypeORM สำหรับระบบจัดการรายการงาน (Todo List).

## สิ่งที่พัฒนา (What We Implemented)
- Entity `Task` ประกอบด้วยฟิลด์สำคัญ:
  - `title` (หัวข้อ)
  - `description` (รายละเอียด)
  - `status` (สถานะ: `OPEN | IN_PROGRESS | DONE`)
- ชุด API ภายใต้เส้นทาง `/tasks` (CRUD):
  - สร้างงาน: `POST /tasks`
  - แก้ไขงาน: `PATCH /tasks/:id`
  - ลบงาน: `DELETE /tasks/:id`
  - แสดงรายการงาน (ไม่มี description): `GET /tasks` จะคืนเฉพาะ `id, title, status`
  - ดูรายละเอียดงาน: `GET /tasks/:id` จะคืนข้อมูลครบทุกฟิลด์
- Validation (ตรวจสอบข้อมูลเข้า) ด้วย `class-validator` และ `class-transformer`:
  - `CreateTaskDto` กำหนดให้ `title` และ `description` เป็นสตริงและห้ามว่าง
  - `UpdateTaskDto` อนุญาตให้ส่ง `title`/`description` แบบ optional แต่ถ้าส่งมาต้องเป็นสตริงที่ไม่ว่าง และตรวจสอบ `status` ให้ตรงกับ enum
- เชื่อมต่อ PostgreSQL ผ่าน TypeORM โดยใช้ `autoLoadEntities: true` และ `synchronize: true` (เพื่อความสะดวกในช่วงพัฒนา)

## วิธีรันโปรเจกต์

### ทางเลือก A: รันด้วย Docker Compose (แนะนำ)
1) สร้างไฟล์ `.env` ไว้ที่โฟลเดอร์โปรเจกต์ โดยมีค่าตัวอย่าง:
```
POSTGRES_HOST=db
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=tasks
```
2) สตาร์ทบริการด้วยคำสั่ง:
```
docker compose up -d
```
3) แอปจะพร้อมใช้งานที่: http://localhost:3000

ตรวจสอบสถานะ/ดูล็อก:
```
docker compose ps
docker compose logs --tail=100 app
```

หยุดบริการ:
```
docker compose down
```

### ทางเลือก B: รันแบบโลคัล (ไม่ใช้ Docker)
1) ติดตั้งและรัน PostgreSQL บนเครื่อง และสร้างฐานข้อมูลตามค่าที่ใช้ใน `.env`
2) สร้างไฟล์ `.env` ที่โฟลเดอร์โปรเจกต์ เช่น:
```
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=tasks
```
3) ติดตั้งแพ็กเกจและรันแอป:
```
npm install
npm run start:dev
```
แอปจะอยู่ที่: http://localhost:3000

## จุดบริการ (Endpoints) และคำสั่งทดสอบอย่างเร็ว (PowerShell)

- List (ไม่มี description):
```
iwr http://localhost:3000/tasks -UseBasicParsing
```

- Create:
```
$b = @{ title = "Buy milk"; description = "2 liters" } | ConvertTo-Json
irm http://localhost:3000/tasks -Method POST -ContentType "application/json" -Body $b
```

- Detail:
```
irm http://localhost:3000/tasks/1
```

- Update (ตัวอย่างเปลี่ยนสถานะ):
```
$u = @{ status = "IN_PROGRESS" } | ConvertTo-Json
irm http://localhost:3000/tasks/1 -Method PATCH -ContentType "application/json" -Body $u
```

- Delete:
```
iwr http://localhost:3000/tasks/1 -Method DELETE -UseBasicParsing
```

## หมายเหตุ/ปัญหาที่พบบ่อย
- พอร์ต 3000 ถูกใช้งาน: ปิดโปรเซสที่ใช้พอร์ต 3000 ก่อน หรือแก้แมปพอร์ตใน `docker-compose.yml`
- ข้อผิดพลาดเชื่อมต่อฐานข้อมูล (auth_failed): ตรวจสอบค่าในไฟล์ `.env` ให้ตรงกับฐานข้อมูลที่กำลังรันอยู่
- โหมด `synchronize: true` ใน TypeORM เหมาะสำหรับใช้ในช่วงพัฒนาเท่านั้น ไม่ควรใช้ใน Production
