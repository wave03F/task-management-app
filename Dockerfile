# Dockerfile

# Stage 1: ใช้ node:alpine เป็น base image
FROM node:20-alpine AS development

# กำหนด working directory ภายใน container
WORKDIR /app

# คัดลอก package.json และ package-lock.json (หรือ yarn.lock)
COPY package*.json ./

# ติดตั้ง dependencies
RUN npm install

# คัดลอก source code ที่เหลือ
COPY . .

# Build โปรเจกต์ (สร้างไฟล์ใน dist/)
RUN npm run build

# Stage 2: สำหรับ Production Environment (ใช้ base image ที่เล็กลง)
FROM node:20-alpine AS production

WORKDIR /app

# คัดลอก dependencies จาก development stage
COPY --from=development /app/node_modules ./node_modules
COPY --from=development /app/package.json ./package.json

# คัดลอก build output (dist/)
COPY --from=development /app/dist ./dist

# กำหนด Port ที่ใช้
EXPOSE 3000

# คำสั่งรัน Production
CMD [ "node", "dist/main" ]