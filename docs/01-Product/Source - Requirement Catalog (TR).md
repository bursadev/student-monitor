---
title: Source - Requirement Catalog (TR)
type: source-document
language: tr
status: frozen
received: 2026-09-12
updated: 2026-09-12
---

> [!danger] Do not edit this note
> This is the client's requirement catalog in their own words. It is the traceability anchor for
> every `FR-xx` and `BR-xxx` note. Corrections, clarifications and disagreements go into the
> corresponding requirement note and [[Open Questions]] — never into this text.
>
> Section `§n` here maps to requirements via [[Requirements Index]]; `İK-xxx` maps to `BR-xxx` via
> [[Business Rules Index]].

# ÖĞRENCİ KOÇLUĞU UYGULAMASI — ÜRÜN VE FONKSİYONEL GEREKSİNİMLER

## 1. Dokümanın Amacı

Bu doküman öğrenci koçluğu sisteminin ürün, iş ve fonksiyonel gereksinimlerini tanımlar.
Doküman herhangi bir ekran tasarımını, navigasyon yapısını, buton yerleşimini, renk kullanımını veya başka bir UI/UX çözümünü zorunlu kılmaz.
Amaç sistemin ne yapması gerektiğini tanımlamak ve bu gereksinimlerden hareketle farklı tasarım ve teknik çözümler üretilebilmesini sağlamaktır.
Mevcut prototipler gereksinim kaynağı değil, keşif ve tasarım çalışmaları olarak değerlendirilmelidir.

## 2. Sistem Kullanıcıları

Sistemde üç temel kullanıcı rolü bulunacaktır:

- Öğrenci
- Koç
- Veli

Her kullanıcının erişebildiği veriler ve gerçekleştirebildiği işlemler rolüne ve diğer kullanıcılarla olan ilişkisine göre sınırlandırılmalıdır.

## 3. Kullanıcı ve Hesap Yönetimi

### 3.1. Hesap Oluşturma

Öğrenci, koç ve veli kendi kullanıcı hesaplarını oluşturabilmelidir.
Kullanıcı hesabı ile koç–öğrenci ve veli–öğrenci ilişkileri birbirinden bağımsız kavramlar olarak ele alınmalıdır.
Bir kullanıcının sisteme kayıt olması, otomatik olarak başka bir kullanıcıyla ilişkilendirildiği anlamına gelmemelidir.

### 3.2. Oturum Yönetimi

Kullanıcı:

- sisteme giriş yapabilmeli,
- sistemden çıkış yapabilmeli,
- kendi hesabına erişebilmelidir.

### 3.3. Rol Bazlı Yetkilendirme

Sistem kullanıcının rolüne göre işlem ve veri erişim yetkilerini kontrol etmelidir.
Yetkilendirme yalnızca kullanıcı arayüzünde değil backend seviyesinde de uygulanmalıdır.

### 3.4. Öğrenci Eğitim Bilgileri

Öğrencinin sınıf bilgisi sistemde tutulmalıdır.
Öğrencinin sınıf seviyesi:

- öğrencinin kendi profiliyle ilişkilendirilmeli,
- ilişkili olduğu koç tarafından görüntülenebilmelidir,
- gerektiğinde güncellenebilmelidir.

Sınıf bilgisi öğrencinin akademik planlama, görev, ödev, ders, kaynak ve deneme süreçlerinde kullanılabilecek temel öğrenci bilgilerinden biri olarak değerlendirilmelidir.

## 4. Koç – Öğrenci İlişkisi

### 4.1. Çoklu Koç Desteği

Bir öğrenci aynı anda birden fazla koçla çalışabilmelidir.
Koç–öğrenci ilişkisi kullanıcı hesabından bağımsız olarak saklanmalıdır.

### 4.2. Koça Bağlanma

Öğrenci ile koç arasında kontrollü bir ilişkilendirme mekanizması bulunmalıdır.
Bu ilişkilendirme:

- davet kodu,
- davet bağlantısı,
- QR kod

veya benzeri güvenli bir yöntemle gerçekleştirilebilir.
Kesin kullanıcı deneyimi tasarım aşamasında belirlenebilir.

### 4.3. Koç Tarafından Davet

Koç bir öğrenciyi çalışma ilişkisi kurmak üzere davet edebilmelidir.
Öğrenci daveti kabul ettiğinde koç–öğrenci ilişkisi aktif hale gelmelidir.

### 4.4. Öğrenci Tarafından Bağlantı Talebi

Öğrenci mevcut bir koçla çalışma ilişkisi kurmak için bağlantı talebinde bulunabilmelidir.
Koç talebi kabul ettiğinde ilişki aktif hale gelmelidir.
Bu özellik ders talebi değildir. Öğrenci yalnızca koç–öğrenci çalışma ilişkisi kurmak için talep gönderebilir.

### 4.5. İlişkinin Sonlandırılması

Aktif bir koç–öğrenci ilişkisini hem koç hem de öğrenci sonlandırabilmelidir.
İlişkinin sonlandırılması geçmiş verileri fiziksel olarak silmemelidir.
İlişki sona erdikten sonraki veri erişim kuralları geçmiş kayıtların bütünlüğünü bozmayacak şekilde uygulanmalıdır.

### 4.6. Veri Sahipliği

Öğrencinin birden fazla koçu olması durumunda koç tarafından oluşturulan içerikler ilgili koçla ilişkilendirilmelidir.
Sistem hangi:

- görevin,
- ödevin,
- dersin,
- dosyanın,
- bildirimin,
- kaynak önerisinin

hangi koç tarafından oluşturulduğunu ayırt edebilmelidir.

## 5. Veli – Öğrenci İlişkisi

### 5.1. Veli Hesabı

Veli kendi kullanıcı hesabını oluşturabilmelidir.
Ancak veli hesabının oluşturulması, veliye herhangi bir öğrencinin verilerine otomatik erişim sağlamamalıdır.

### 5.2. Öğrenciyle İlişkilendirme

Veli bir öğrenciyle ilişkilendirilmek için bağlantı sürecini başlatabilmelidir.
Veli–öğrenci ilişkisini yalnızca öğrencinin koçu onaylayabilmelidir.
Koç onayı gerçekleşmeden veli öğrencinin korumalı verilerine erişememelidir.

### 5.3. Maksimum Veli Sayısı

Bir öğrenci aynı anda maksimum 2 aktif veli ile ilişkilendirilebilmelidir.
Sistem üçüncü bir aktif veli ilişkisinin oluşturulmasını engellemelidir.

### 5.4. Veli Veri Erişimi

Veli yalnızca:

- ilişkilendirildiği öğrenciye,
- koç tarafından veliye açılması uygun görülen bilgilere

erişebilmelidir.
Veli öğrencinin veya koçun yönetim yetkilerine sahip olmamalıdır.

## 6. Görev Yönetimi

### 6.1. Görev Oluşturma

Koç ilişkili olduğu öğrencilerine görev atayabilmelidir.
Bir görev en az:

- öğrenci,
- görevi atayan koç,
- görev içeriği,
- son tarih,
- oluşturulma bilgisi,
- mevcut durum

ile ilişkilendirilebilmelidir.

### 6.2. Görev Görüntüleme

Öğrenci kendisine atanmış görevleri görüntüleyebilmelidir.
Her görevde atamayı yapan koç bilgisi korunmalıdır.

### 6.3. Görev Durumları

Sistem en az aşağıdaki durumları birbirinden ayırt edebilmelidir:

- Henüz tamamlanmamış
- Onay bekleyen
- Zamanında tamamlanmış
- Geç tamamlanmış
- Son tarihi geçmiş ve tamamlanmamış

Kullanıcı arayüzündeki kesin durum isimleri tasarım aşamasında değiştirilebilir.

### 6.4. Tamamlama Talebi

Öğrenci bir görevi tamamladığını sisteme bildirebilmelidir.
Bu işlem görevi doğrudan kapatmamalıdır.
Tamamlama talebi görevi atayan koça gönderilmelidir.

### 6.5. Koç Onayı

Koç tamamlanma talebini:

- onaylayabilmeli,
- geri gönderebilmelidir.

Görev yalnızca ilgili koçun onayından sonra kesin olarak tamamlanmış kabul edilmelidir.

### 6.6. Geri Gönderme

Koç görevi geri gönderirken isteğe bağlı açıklama yazabilmelidir.
Açıklama zorunlu olmamalıdır.
Açıklama girilmişse öğrenci bunu görüntüleyebilmelidir.

### 6.7. Bildirim

Tamamlanma talebi yalnızca görevi atayan koça iletilmelidir.
Öğrencinin diğer koçlarına aynı görev için onay talebi gönderilmemelidir.

## 7. Görevlerde Gecikme Yönetimi

Gecikme hesabında koçun onay tarihi değil, öğrencinin tamamlanma talebini gönderdiği tarih esas alınmalıdır.

### 7.1. Zamanında Tamamlama

Öğrenci son tarihte veya daha önce tamamlanma talebi göndermişse çalışma zamanında gönderilmiş kabul edilmelidir.
Koçun daha sonra onaylaması bu sonucu değiştirmemelidir.

### 7.2. Geç Tamamlama

Öğrenci son tarihten sonra tamamlanma talebi gönderir ve koç onaylarsa çalışma:
Geç tamamlandı
olarak değerlendirilmelidir.

### 7.3. Gecikmiş ve Tamamlanmamış

Son tarihi geçmiş fakat öğrenci tarafından tamamlanmamış çalışma:
Gecikmiş / tamamlanmadı
olarak değerlendirilmelidir.
Geç tamamlanan çalışma ile hiç tamamlanmayan çalışma aynı istatistik altında değerlendirilmemelidir.

## 8. Görev İşlem Geçmişi

Sistem görev yaşam döngüsündeki önemli olayları saklayabilmelidir.
En az:

- oluşturulma zamanı,
- son tarih,
- öğrencinin gönderim zamanı,
- koç onay zamanı,
- geri gönderme zamanı,
- varsa geri gönderme açıklaması,
- yeniden gönderim bilgileri,
- nihai durum

korunmalıdır.
Öğrencinin gönderim zamanı ile koçun onay zamanı birbirinin yerine kullanılmamalıdır.

## 9. Ödev Yönetimi

Görev ve ödev sistemde birbirinden bağımsız içerik türleri olarak yönetilmelidir.
Koç öğrencisine ödev atayabilmelidir.
Görev için tanımlanan:

- atayan koç,
- son tarih,
- tamamlanma talebi,
- koç onayı,
- geri gönderme,
- isteğe bağlı geri gönderme açıklaması,
- zamanında tamamlama,
- geç tamamlama,
- gecikmiş/tamamlanmamış olma,
- işlem geçmişi,
- bildirim,
- çoklu koç desteği

kuralları ödevler için de geçerli olmalıdır.
Görev ve ödev ilerlemeleri birbirinden bağımsız hesaplanabilmelidir.

## 10. Filiz / İlerleme Sistemi

Sistem öğrencinin günlük ilerlemesini görsel bir karakter veya animasyon aracılığıyla temsil edebilmelidir.
Bu karakter şu an için Filiz olarak adlandırılmaktadır.
Filiz'in dört farklı ilerleme durumu bulunacaktır.
Görev ve ödev için ilerleme ayrı hesaplanmalıdır.
Görev ilerlemesi ödev Filiz'ini, ödev ilerlemesi görev Filiz'ini etkilememelidir.
Dört durumun kesin matematiksel eşikleri henüz sabitlenmemiştir.
Bu nedenle ilerleme hesabı değiştirilebilir bir iş kuralı olarak ele alınmalıdır.

## 11. Ders / Koçluk Görüşmesi Yönetimi

### 11.1. Ders Talebi Oluşturma

Ders talebini yalnızca koç oluşturabilmelidir.
Öğrenci koça ders talebi gönderememelidir.
Koç öğrencisine belirli tarih ve zaman için ders/görüşme talebi gönderebilmelidir.
Talep en az:

- öğrenci,
- koç,
- tarih,
- zaman,
- ders/görüşme bilgisi,
- durum

ile ilişkilendirilmelidir.

### 11.2. Öğrenci Onayı

Öğrenci kendisine gönderilen ders talebini:

- kabul edebilmeli,
- reddedebilmelidir.

Öğrenci kabul etmeden ders kesinleşmiş olarak değerlendirilmemelidir.
Kabul edilen ders öğrencinin programına dahil edilmelidir.

### 11.3. Ders Talebini Reddetme

Öğrenci ders talebini reddederken isterse açıklama yazabilmelidir.
Açıklama zorunlu olmamalıdır.
Red bilgisi ve varsa açıklama ilgili koça iletilmelidir.

## 12. Kesinleşmiş Dersin İptali

Öğrenci tarafından kabul edilmiş/kesinleşmiş bir ders için hem koç hem de öğrenci iptal talebi oluşturabilmelidir.
İptal işlemi sırasında açıklama yazılabilmeli ancak açıklama zorunlu olmamalıdır.
Sistem en az:

- iptali başlatan kullanıcı,
- iptal zamanı,
- varsa açıklama

bilgilerini saklayabilmelidir.
İptal edilen ders gerçekleşmiş ders olarak değerlendirilmemeli ve puantaj/hakediş hesaplamasında uygulanacak kural ayrıca dikkate alınmalıdır.

## 13. Öğrenci Program Yönetimi

Öğrenci kendi kişisel programını oluşturabilmeli ve düzenleyebilmelidir.
Program sistemi en az 06:00–24:00 aralığını desteklemelidir.
Öğrenci programında:

- okul,
- görev,
- ödev,
- deneme,
- kişisel etkinlikler

gibi farklı etkinlik türleri tanımlayabilmelidir.
Kayıt bulunmayan zaman aralıkları otomatik olarak boş kabul edilmelidir.
Kullanıcının ayrıca "Boş" etkinliği oluşturması gerekmemelidir.
Öğrenci birden fazla zaman aralığını tek işlemde seçerek aynı etkinliği uygulayabilmelidir.
Bu özellikle okul programı gibi tekrar eden zamanların hızlı girilebilmesini sağlamalıdır.

## 14. Öğrenci Programının Gizliliği

Koç öğrencinin kişisel takviminin tamamını görüntüleyememelidir.
Koç öğrencinin:

- okul programını,
- kişisel etkinliklerini,
- boş zamanlarını

otomatik olarak görememelidir.
Koç yalnızca kendi oluşturduğu veya kendi koçluk ilişkisi kapsamında gerekli olan ders/görüşme kayıtlarına erişebilmelidir.

## 15. Ders Devamlılığı

Gerçekleşen dersler için devam durumu takip edilebilmelidir.
En az:

- Katıldı
- Katılmadı
- İptal

durumları desteklenmelidir.
Devam kaydı ilgili:

- öğrenci,
- koç,
- ders,
- tarih

ile ilişkilendirilmelidir.
Bu kayıtlar aynı zamanda puantaj/hakediş sisteminin veri kaynaklarından biri olabilmelidir.

## 16. Öğrenci Kaynak Havuzu

Her öğrencinin kendisine ait bir kaynak havuzu bulunmalıdır.
Kaynak havuzu öğrencinin kullandığı veya takip ettiği eğitim kaynaklarının kayıt altına alınmasını sağlamalıdır.
Kaynaklar örneğin:

- kitap,
- soru bankası,
- deneme kaynağı,
- doküman,
- dijital kaynak,
- diğer eğitim materyalleri

olabilir.
Kesin kaynak türleri genişletilebilir olmalıdır.

### 16.1. Koç Erişimi

Öğrencinin aktif koçu öğrencinin kaynak havuzunu görüntüleyebilmelidir.
Bu, kişisel takvim gizliliği kuralından ayrı bir yetkidir.

### 16.2. Kaynak Önerisi

Koç öğrencisine kaynak önerebilmelidir.
Kaynak önerisi en az:

- önerilen öğrenci,
- öneren koç,
- kaynak,
- öneri zamanı

ile ilişkilendirilebilmelidir.
Öğrenci kendisine yapılan kaynak önerilerini görüntüleyebilmelidir.
Bir öğrencinin birden fazla koçu olması durumunda hangi kaynağı hangi koçun önerdiği korunmalıdır.

## 17. Dosya Paylaşımı

Koç ilişkili olduğu öğrencilere dosya paylaşabilmelidir.
Koç dosyanın hangi öğrenci veya öğrencilerle paylaşılacağını belirleyebilmelidir.
Öğrenci yalnızca kendisiyle paylaşılmış dosyalara erişebilmelidir.
Dosya formatı, maksimum boyut ve saklama politikası ayrıca belirlenmelidir.
Dosya paylaşımı ile kaynak havuzu aynı kavram olmak zorunda değildir.

## 18. Geçmiş ve İlerleme Takibi

Geçmiş görev ve ödev kayıtları tamamlandıktan veya son tarihleri geçtikten sonra silinmemelidir.
Öğrenci kendi çalışma geçmişini en az:

- günlük,
- haftalık,
- aylık

düzeyde inceleyebilmelidir.
Sistem zamanında tamamlanan, geç tamamlanan ve tamamlanmamış çalışmaları birbirinden ayırabilmelidir.

## 19. Günlük İlerleme

Belirli bir gün için görev ve ödev sonuçları görüntülenebilir ve hesaplanabilir olmalıdır.
Sistem en az:

- zamanında tamamlanan,
- geç tamamlanan,
- tamamlanmamış/gecikmiş,
- onay bekleyen

çalışmaları birbirinden ayırabilmelidir.
Görev ve ödev istatistikleri ayrı hesaplanabilmelidir.

## 20. Haftalık İlerleme

Sistem öğrencinin haftalık çalışma performansını hesaplayabilmelidir.
Görev ve ödev sonuçları birbirinden ayrıştırılabilmelidir.
Koç onayı gereken çalışmalarda onay durumu hesaplamalarda dikkate alınmalıdır.

## 21. Aylık İlerleme

Aylık raporlama en az:

- zamanında tamamlanan görev,
- geç tamamlanan görev,
- gecikmiş/tamamlanmamış görev,
- zamanında tamamlanan ödev,
- geç tamamlanan ödev,
- gecikmiş/tamamlanmamış ödev

bilgilerini ayrı hesaplayabilmelidir.
Genel aylık ilerleme değeri üretilebilmelidir.
Kesin ilerleme formülü ayrıca tanımlanmalıdır.

## 22. Deneme Sınavı Takibi

Öğrenci yaptığı deneme sınavlarının sonuçlarını sisteme kaydedebilmelidir.
Deneme kaydı en az:

- deneme adı,
- sınav türü,
- tarih,
- ders bazındaki sonuçlar,
- toplam sonuç/puan

bilgilerini desteklemelidir.

### 22.1. İlk Versiyonda Manuel Veri Girişi

İlk versiyonda deneme sonucu hesaplamaları otomatik formüllere bağımlı olmamalıdır.
Gerekli sonuç değerleri manuel olarak girilebilmelidir.
Buna puan bilgisi de dahildir.
Sistem ilk versiyonda kullanıcının girdiği sonucu saklayabilmelidir.

### 22.2. Gelecekte Formül Desteği

Sistem ileride sınav türüne göre:

- net,
- puan,
- diğer hesaplanan değerleri

otomatik hesaplayabilecek şekilde genişletilebilir olmalıdır.
Net hesaplama kuralları sınav türüne göre farklılık gösterebilmelidir.
Dolayısıyla veri modeli tek bir sabit net/puan formülüne bağımlı tasarlanmamalıdır.

## 23. Deneme Sonucu Koç Onayı

Deneme sonuçları koç onayına tabi olacaktır.
Öğrencinin girdiği deneme sonucu doğrudan kesinleşmiş sonuç olarak değerlendirilmemelidir.
Deneme sonucu en az:

- Onay bekliyor
- Onaylandı

durumlarını desteklemelidir.
Gerekirse ileride ek durumlar tanımlanabilmelidir.

### 23.1. İstatistik Kuralı

Koç tarafından onaylanmamış deneme sonuçları hiçbir performans istatistiğine dahil edilmemelidir.
Yalnızca koç tarafından onaylanmış sonuçlar:

- ortalama,
- en iyi sonuç,
- gelişim,
- geçmiş performans,
- ders bazlı performans

gibi hesaplamalarda kullanılmalıdır.

## 24. Deneme İlerlemesi

Sistem öğrencinin onaylanmış geçmiş deneme sonuçlarını kullanarak zaman içerisindeki performansını takip edebilmelidir.
Sistem en az:

- son onaylanmış sonuç,
- geçmiş onaylanmış sonuçlar,
- en iyi sonuç,
- ortalama,
- önceki denemelere göre değişim,
- ders bazlı değişim

hesaplamalarını destekleyecek veriyi saklamalıdır.
İlk versiyonda otomatik formüle dayalı olmayan değerler manuel sonuçlardan üretilebilmelidir.

## 25. Bildirim Sistemi

Sistem önemli olaylarda ilgili kullanıcıları bilgilendirebilmelidir.
Örneğin:

- yeni görev/ödev,
- tamamlanma talebi,
- görev/ödev onayı,
- geri gönderme,
- ders talebi,
- ders kabulü,
- ders reddi,
- ders iptali,
- deneme sonucu onay talebi,
- deneme sonucu onayı,
- kaynak önerisi

ilgili kullanıcıya bildirim oluşturabilmelidir.
Bildirimler yalnızca olayla ilişkili kullanıcılara gönderilmelidir.

## 26. Koç Tarafından Bildirim Gönderme

Koç ilişkili olduğu öğrencilerine manuel bildirim gönderebilmelidir.
Koç gerektiğinde birden fazla öğrenciyi seçebilmelidir.
Koç yeniden kullanılabilir bildirim şablonları:

- oluşturabilmeli,
- düzenleyebilmeli,
- tekrar kullanabilmelidir.

Bu sistem yapay zekâ prompt sistemi olarak değerlendirilmemelidir.

## 27. Koçun Öğrenci Takibi

Koç ilişkili öğrencilerinin çalışma durumlarını takip edebilmelidir.
Koç en az:

- tamamlayan,
- eksik çalışması bulunan,
- onay bekleyen

öğrencileri ayırt edebilecek bilgiye erişebilmelidir.
Koç gerektiğinde öğrenci veya öğrenci gruplarına hızlı bildirim gönderebilmelidir.
Bu gereksinim belirli bir dashboard tasarımını zorunlu kılmaz.

## 28. Öğrenciye Özel Fiyatlandırma

Koç her öğrenci için ayrı bir ders/çalışma fiyatı tanımlayabilmelidir.
Fiyat koç–öğrenci ilişkisine ait olmalıdır.
Bu nedenle aynı öğrenci birden fazla koçla çalışıyorsa her koç öğrenci için farklı fiyat belirleyebilmelidir.
Fiyat bilgisi öğrenci tarafından görüntülenmemelidir.
Fiyat bilgisine yalnızca:

- ilgili koç,
- ilgili öğrencinin yetkili velisi/velileri

erişebilmelidir.
Fiyat değişikliklerinin geçmiş hakedişleri yanlış şekilde değiştirmemesi için sistem fiyatın hangi dönemden itibaren geçerli olduğunu takip edebilecek şekilde tasarlanmalıdır.

## 29. Puantaj / Hakediş Sistemi

Sistem takvimdeki gerçekleşen derslerden hareketle koçun öğrenci bazındaki hakedişini otomatik hesaplayabilmelidir.
Hesaplama öğrenciye tanımlanan fiyat ile gerçekleşmiş ders kayıtlarını ilişkilendirmelidir.
Puantaj/hakediş en az:

- öğrenci,
- koç,
- ilgili ders/dersler,
- ders tarihi,
- geçerli fiyat,
- hesaplanan tutar

bilgileriyle izlenebilir olmalıdır.

### 29.1. Görünürlük

Puantaj ve hakediş bilgilerini yalnızca:

- ilgili koç,
- ilgili öğrencinin yetkili velisi/velileri

görüntüleyebilmelidir.
Öğrenci hakediş ve fiyat bilgilerini görüntüleyememelidir.

### 29.2. Takvim Entegrasyonu

Hakediş hesabının temel kaynağı ders/takvim kayıtları olmalıdır.
Gerçekleşen, iptal edilen ve öğrencinin katılmadığı derslerin hakedişe nasıl etki edeceği açık iş kurallarıyla yönetilebilmelidir.

### 29.3. Geçmiş Fiyatların Korunması

Koçun öğrencinin fiyatını daha sonra değiştirmesi geçmiş derslerin hesaplanan tutarlarını geriye dönük olarak değiştirmemelidir.
Örneğin geçmiş bir ders 500 TL üzerinden gerçekleşmiş ve öğrencinin güncel fiyatı daha sonra 600 TL yapılmışsa geçmiş ders 500 TL olarak korunmalıdır.

Ek olarak, koç her öğrencinin puantajını (hakedişini) ayrı ayrı görebileceği gibi öğrenci havuzundaki toplam hakedişini de görebilmeli ki kendi muhasebesini kolaylıkla yapabilsin.

## 30. Veli Bilgilendirmesi

Veli ilişkilendirildiği öğrencinin koç tarafından kendisine açılmış ilerleme bilgilerini görüntüleyebilmelidir.
Veli tarafındaki amaç öğrenci yönetimi değil genel takip ve bilgilendirmedir.
Veliye sunulabilecek veriler:

- genel çalışma ilerlemesi,
- tamamlanan/eksik çalışmalar,
- ders devamlılığı,
- deneme gelişimi,
- koç tarafından paylaşılan bilgiler,
- fiyat,
- puantaj/hakediş

gibi bilgileri destekleyebilmelidir.
Fiyat ve hakediş bilgileri öğrenciye değil veliye yönelik finansal bilgilerdir.

## 31. Koç – Veli Bildirim Desteği

Koç ilişkili öğrencinin velisine bildirim gönderebilmelidir.
Koç veli için yeniden kullanılabilir bildirim şablonları oluşturabilmelidir.
Öğrenciye gönderilen her bildirim otomatik olarak veliye gönderilmemelidir.

## 32. Veri Yetkilendirmesi

**Öğrenci**

Öğrenci kendi:

- görevlerine,
- ödevlerine,
- programına,
- ders taleplerine,
- ilerleme geçmişine,
- deneme sonuçlarına,
- kaynak havuzuna,
- kaynak önerilerine,
- kendisiyle paylaşılan dosyalara

erişebilmelidir.
Öğrenci fiyat ve hakediş bilgilerine erişememelidir.

**Koç**

Koç ilişkili öğrenciler için yetkili olduğu:

- görev,
- ödev,
- ders,
- deneme,
- kaynak havuzu,
- kaynak önerisi,
- dosya,
- ilerleme,
- fiyat,
- puantaj/hakediş

verilerine erişebilmelidir.

**Veli**

Veli yalnızca:

- koç tarafından onaylanmış şekilde ilişkilendirildiği öğrenciye,
- kendisine açılmış ilerleme verilerine,
- ilgili öğrencinin fiyat ve hakediş bilgilerine

erişebilmelidir.

## 33. Çoklu Koç Veri İzolasyonu

Bir öğrenci birden fazla koçla çalıştığında veri sahipliği korunmalıdır.
Koç A tarafından oluşturulan içerik Koç B'ye otomatik yönetim yetkisi vermemelidir.
Bu prensip:

- görev,
- ödev,
- ders,
- bildirim,
- dosya,
- kaynak önerisi,
- fiyat,
- hakediş

verilerinde uygulanmalıdır.

## 34. Durum ve İşlem Geçmişi

Sistemde önemli durum değişiklikleri izlenebilir olmalıdır.
Özellikle:

- görev/ödev oluşturma,
- tamamlanma talebi,
- geri gönderme,
- onay,
- ders talebi,
- ders kabulü/reddi,
- ders iptali,
- deneme sonucu gönderimi/onayı,
- kaynak önerisi,
- fiyat değişikliği,
- puantaj/hakediş oluşumu

gibi işlemlerin zaman ve kullanıcı bilgileri korunmalıdır.

## 35. Abonelik ve Ticari Model

Sistemin ücretli tarafının temel müşterisi koç olacaktır.
Öğrenci ve veli uygulamayı ücret ödemeden kullanabilecek şekilde planlanmaktadır.
Koçların kullanım hakkı abonelik modeliyle sınırlandırılabilmelidir.
Abonelik ileride:

- aktif öğrenci sayısı,
- paket,
- kullanım seviyesi

gibi kriterlere göre farklılaştırılabilir olmalıdır.
Kesin paketler ve fiyatlandırma henüz belirlenmemiştir.
Bu abonelik sistemi, koçun kendi öğrencilerine belirlediği ders fiyatı ve hakediş sisteminden ayrı bir kavramdır.

## 36. Temel Domain Kavramları

Teknik tasarım sırasında en az aşağıdaki iş kavramları dikkate alınmalıdır:

- Kullanıcı
- Rol
- Koç
- Öğrenci
- Öğrenci Eğitim Profili / Sınıf Seviyesi
- Veli
- Koç–Öğrenci İlişkisi
- Veli–Öğrenci İlişkisi
- Veli İlişki Onayı
- Görev
- Ödev
- Tamamlama Talebi
- Onay
- Geri Gönderme
- Ders / Görüşme
- Ders Talebi
- Ders İptali
- Devam Kaydı
- Program Etkinliği
- Ders
- Konu
- Kaynak
- Öğrenci Kaynak Havuzu
- Kaynak Önerisi
- Deneme
- Deneme Sonucu
- Deneme Onayı
- Bildirim
- Bildirim Şablonu
- Dosya
- Dosya Paylaşımı
- Öğrenci Fiyatlandırması
- Fiyat Geçmişi
- Puantaj
- Hakediş
- Abonelik

Bu liste doğrudan veritabanı tablolarını tanımlamaz. Domain tasarımında ayrıştırılması gereken iş kavramlarını belirtir.

## 37. Temel İş Kuralları

**İK-001 — Çoklu Koç**
Bir öğrenci aynı anda birden fazla koçla çalışabilir.

**İK-002 — Koç–Öğrenci Sonlandırma**
Koç–öğrenci ilişkisini hem öğrenci hem koç sonlandırabilir.

**İK-003 — Veli Onayı**
Veli kendi hesabını oluşturabilir ancak veli–öğrenci ilişkisi yalnızca koç onayından sonra aktif olur.

**İK-004 — Maksimum Veli**
Bir öğrencinin maksimum iki aktif velisi olabilir.

**İK-005 — Görev/Ödev Ayrımı**
Görev ve ödev birbirinden bağımsız takip edilir.

**İK-006 — Koç Onayı**
Öğrencinin tamamlandı bildirimi görev veya ödevi doğrudan kapatmaz.

**İK-007 — İlgili Koç**
Tamamlanma talebini içeriği atayan koç değerlendirir.

**İK-008 — Opsiyonel Geri Gönderme Açıklaması**
Koç görev veya ödevi geri gönderirken açıklama yazabilir ancak zorunlu değildir.

**İK-009 — Gönderim Tarihi**
Gecikme hesabında öğrencinin gönderim tarihi esas alınır.

**İK-010 — Geç Tamamlama**
Geç tamamlanan çalışma, gecikmiş ve hiç tamamlanmamış çalışmadan farklıdır.

**İK-011 — Ders Talebi Yetkisi**
Ders talebini yalnızca koç oluşturabilir.

**İK-012 — Ders İptali**
Kesinleşmiş dersin iptalini hem öğrenci hem koç başlatabilir.

**İK-013 — Opsiyonel İptal Açıklaması**
Ders iptalinde açıklama girilebilir ancak zorunlu değildir.

**İK-014 — Kişisel Program Gizliliği**
Koç öğrencinin kişisel programının tamamını göremez.

**İK-015 — Kaynak Havuzu**
Koç ilişkili öğrencisinin kaynak havuzunu görüntüleyebilir ve kaynak önerebilir.

**İK-016 — Deneme Koç Onayı**
Deneme sonuçları koç tarafından onaylanmadan kesinleşmez.

**İK-017 — İstatistik Onayı**
Onaylanmamış deneme sonuçları performans istatistiklerine dahil edilmez.

**İK-018 — Manuel Deneme Sonuçları**
İlk versiyonda deneme sonucu ve puan dahil gerekli sonuç değerleri manuel girilebilir.

**İK-019 — Değişken Formül**
İleride net ve puan hesaplama kuralları sınav türüne göre değiştirilebilir olmalıdır.

**İK-020 — Öğrenciye Özel Fiyat**
Koç her öğrenci için ayrı fiyat belirleyebilir.

**İK-021 — Hakediş**
Hakediş takvim/ders kayıtları ve öğrenciye uygulanabilir fiyat üzerinden hesaplanır.

**İK-022 — Finansal Gizlilik**
Fiyat ve hakediş bilgilerini yalnızca ilgili koç ve yetkili veli/veliler görebilir.

**İK-023 — Geçmiş Fiyat Koruması**
Güncel fiyat değişikliği geçmiş derslerin hakediş tutarını değiştirmemelidir.

**İK-024 — Çoklu Koç İzolasyonu**
Bir koç diğer koçun öğrenciye ait özel içeriğini yönetemez.

**İK-025 — Geçmiş Kayıtlar**
Geçmiş çalışma ve işlem kayıtları raporlama amacıyla korunmalıdır.

**İK-026 — Öğrenci Sınıf Bilgisi**
Her öğrencinin güncel sınıf seviyesi sistemde tutulmalı ve ilişkili koçlar tarafından görüntülenebilmelidir.
