---
title: Glossary
updated: 2026-09-12
---

# Glossary — Turkish ↔ English ↔ Code

The canonical naming source. Code uses the **Code** column, exactly.

## Roles and relationships

| Turkish | English | Code | Notes |
| --- | --- | --- | --- |
| Koç | Coach | `Coach` | the paying customer |
| Öğrenci | Student | `Student` | primary daily user |
| Veli | Parent / guardian | `Parent` | max 2 active per student ([[BR-004]]) |
| Koç–Öğrenci İlişkisi | Coach–student relationship | `CoachStudentLink` | many-to-many, endable |
| Veli–Öğrenci İlişkisi | Parent–student relationship | `ParentStudentLink` | needs coach approval ([[BR-003]]) |
| Davet kodu | Invite code | `InviteCode` | also link / QR |
| Sınıf seviyesi | Grade level | `gradeLevel` | e.g. 12 |

## Work

| Turkish | English | Code | Notes |
| --- | --- | --- | --- |
| Görev | Task | `WorkItem(type=TASK)` | |
| Ödev | Assignment / homework | `WorkItem(type=ASSIGNMENT)` | tracked separately from tasks ([[BR-005]]) |
| Son tarih | Due date | `dueAt` | |
| Tamamlama talebi | Completion request | `submittedAt` | does **not** close the item ([[BR-006]]) |
| Onay | Approval | `approvedAt`, `approvedBy` | |
| Geri gönderme | Return / send back | `RETURNED`, `returnNote` | note optional ([[BR-008]]) |
| Zamanında tamamlandı | Completed on time | `COMPLETED_ON_TIME` | |
| Geç tamamlandı | Completed late | `COMPLETED_LATE` | |
| Gecikmiş / tamamlanmadı | Overdue, not completed | `OVERDUE` | distinct from late ([[BR-010]]) |
| Onay bekliyor | Pending approval | `PENDING_APPROVAL` | |

## Lessons and schedule

| Turkish | English | Code | Notes |
| --- | --- | --- | --- |
| Ders / Görüşme | Lesson / coaching session | `Lesson` | |
| Ders talebi | Lesson request | `LessonRequest` | coach-only ([[BR-011]]) |
| Ders iptali | Lesson cancellation | `CANCELLED`, `cancelledBy` | either side ([[BR-012]]) |
| Devam kaydı | Attendance record | `Attendance` | `ATTENDED` / `NO_SHOW` / `CANCELLED` |
| Program | Schedule | `ScheduleEntry` | student-private ([[BR-014]]) |
| Okul | School | `SCHOOL` | schedule entry kind |
| Boş | Free / empty | — | absence of an entry, never stored |

## Study material

| Turkish | English | Code | Notes |
| --- | --- | --- | --- |
| Kaynak | Resource | `Resource` | book, question bank, document, digital |
| Soru bankası | Question bank | `QUESTION_BANK` | resource type |
| Kaynak havuzu | Resource pool | `ResourcePool` | one per student |
| Kaynak önerisi | Resource recommendation | `ResourceRecommendation` | keeps the recommending coach |
| Dosya paylaşımı | File share | `FileShare` | coach → selected students |
| Ders (okul dersi) | Subject | `Subject` | e.g. Matematik — **not** `Lesson` |
| Konu | Topic | `Topic` | subject subdivision |

## Exams

| Turkish | English | Code | Notes |
| --- | --- | --- | --- |
| Deneme | Mock exam / practice exam | `MockExam` | |
| Deneme sonucu | Mock exam result | `MockExamResult` | approval required ([[BR-016]]) |
| Sınav türü | Exam type | `examType` | TYT, AYT, YDT, LGS, other |
| Net | Net score | `net` | correct − wrong/k, k varies by exam type |
| Puan | Points / scaled score | `score` | manual in v1 ([[BR-018]]) |
| Doğru / Yanlış / Boş | Correct / wrong / blank | `correct`, `wrong`, `blank` | |

## Money

| Turkish | English | Code | Notes |
| --- | --- | --- | --- |
| Fiyat | Rate / price | `CoachStudentRate` | per coach–student pair ([[BR-020]]) |
| Fiyat geçmişi | Rate history | `effectiveFrom` / `effectiveTo` | never rewrite the past ([[BR-023]]) |
| Puantaj | Timesheet | `TimesheetEntry` | which lessons count |
| Hakediş | Earnings / accrual | `Earning` | amount + frozen rate snapshot |
| Abonelik | Subscription | `Subscription` | coach pays the platform |

## Progress

| Turkish | English | Code | Notes |
| --- | --- | --- | --- |
| Filiz | Filiz (sprout mascot) | `Filiz`, `ProgressStage` | brand name, keep Turkish |
| İlerleme | Progress | `progress` | tasks and assignments computed separately |
| Günlük / Haftalık / Aylık | Daily / weekly / monthly | `DAILY` / `WEEKLY` / `MONTHLY` | |
| Bildirim | Notification | `Notification` | |
| Bildirim şablonu | Notification template | `NotificationTemplate` | reusable coach text, not AI |

## Turkish exam context (for non-Turkish contributors)

- **YKS** — university entrance exam, taken in the final year of high school. Two stages:
  **TYT** (basic proficiency, all subjects) and **AYT** (field-specific), plus **YDT** for languages.
- **LGS** — high-school entrance exam, taken at the end of grade 8.
- **Deneme** — a full-length timed practice exam; students take them weekly. Tracking deneme
  progression over time is the heart of exam prep coaching.
- **Net** — the scoring unit: wrong answers cancel out a fraction of correct ones, so "net" is what
  everyone actually talks about, not raw correct count.
