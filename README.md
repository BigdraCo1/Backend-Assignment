# Backend Assignment

โจทย์สำหรับฝั่ง Backend จะเป็นการประเมินพื้นฐานความเข้าใจในการพัฒนา Backend API , ความสามารถในการสืบค้นข้อมูล และ ความเป็นระเบียบของโค้ดที่เขียน

## Getting Started

สำหรับโจทย์ของฝั่ง Backend จะให้สร้าง Rest API สำหรับเก็บข้อมูลของ Rider โดยมีข้อกำหนดดังนี้

- พัฒนาด้วย [NestJS](https://nestjs.com/) Framework โดยใช้ภาษา Typescript ในการเขียน **เท่านั้น**
- ใช้ Library [Prisma](https://docs.nestjs.com/recipes/prisma) ในการเชื่อมต่อ Database โดยใช้ Database เป็น SQLite
- ในการทำงานจริงเราจำเป็นที่จะต้องทำงานร่วมกับคนอื่นดังนั้นเราจึงควรทำ API Documentation ให้มีรายละเอียดที่เพียงพอต่อการใช้งาน โดยให้ใช้ [Swagger](https://docs.nestjs.com/openapi/introduction) ในการสร้าง API Documentation

## ข้อกำหนดของ API

1. สร้าง Entity สำหรับเก็บข้อมูลของ Rider โดยมีข้อมูลดังนี้

```
- id: number (Primary Key)
- firstName: string
- lastName: string
- email: string
- licensePlate: string
- phoneNumber: string
- createdAt: Date
- updatedAt: Date
```

2. สร้าง API โดยมี Route CRUD สำหรับข้อมูลของ Rider ดังนี้

```
GET /riders
GET /riders/:id
POST /riders
PATCH /riders/:id
DELETE /riders/:id
```

3. สร้้าง Entity สำหรับเก็บตำแหน่งของ Rider โดยมีข้อมูลดังนี้

```
- id: number (Primary Key)
- riderId: number (Foreign Key)
- latitude: number
- longitude: number
- createdAt: Date
- updatedAt: Date
```

4. สร้าง API โดยมี Route สำหรับข้อมูลตำแหน่งของ Rider ดังนี้

```
GET /riders/:riderId/locations
POST /riders/:riderId/locations
```

5. สร้ง API สำหรับการค้นหา Rider ทั้งหมด โดยให้ตำแหน่งของ Rider อยู่ในรัศมี 5 กิโลเมตร จากตำแหน่งที่กำหนด (Optional คะแนนพิเศษ)

```
GET /riders/search?latitude={ค่า latitude}&longitude={ค่า longitude}
```

## เกณฑ์การประเมิน

- [ ] API สามารถใช้งานได้ตาม Requirement
- [ ] ความเป็นระเบียบของโค้ด (Clean Code)
- [ ] การจัดวางโครงสร้างโปรเจค (Project Structure)
- [ ] ความระเอียดของ API Documentation

## คะแนนพิเศษ

- [ ] เน่ืองด้วยการพัฒนาในปปัจุบันจำเป็นต้องรองรับการใช้งานด้วย Container ดังนั้นหากสามารถใช้ Docker ในการสร้าง Container ของ API ของเราได้จะได้คะแนนพิเศษ
- [ ] การทำ Unit Test สำหรับ API [Jest](https://docs.nestjs.com/fundamentals/testing)

## ส่งงาน

- Upload โค้ดของคุณลงใน Github และส่งลิ้งค์มายังฟอร์มที่ส่งให้

## Reference

- [NestJS](https://nestjs.com/)
- [Prisma](https://docs.nestjs.com/recipes/prisma)
- [Swagger](https://docs.nestjs.com/openapi/introduction)
- [Jest](https://docs.nestjs.com/fundamentals/testing)
