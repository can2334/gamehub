# 🎓 Dijital Öğrenme Laboratuvarı: Eğitimde Oyunlaştırma

![Next.js](https://img.shields.io/badge/Next.js-14-blue?style=for-the-badge\&logo=nextdotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue?style=for-the-badge\&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/Tailwind-Styled-38B2AC?style=for-the-badge\&logo=tailwind-css)
![Edge Computing](https://img.shields.io/badge/Cloudflare-Workers-F38020?style=for-the-badge\&logo=cloudflare\&logoColor=white)

Bu proje, geleneksel eğitim metotlarını modern **oyunlaştırma (gamification)** teknikleriyle birleştirerek, öğrencilerin ders ünitelerini, terimleri ve kavramları kalıcı bir şekilde öğrenmesini sağlayan interaktif bir web platformudur.

## 🎯 Projenin Amacı ve Vizyonu

Klasik ezberci eğitim anlayışının dışına çıkarak; **Bilişim Teknolojileri**, **Fizik** ve diğer teknik derslerdeki ünitelerin öğrenciler için daha akılda kalıcı olmasını hedefler. Platform, okul müfredatına destekleyici bir dijital materyal olarak tasarlanmıştır.

* **Dinamik Öğrenme:** Ders ünitelerinin interaktif sorularla pekiştirilmesi.
* **Eğitimde Oyunlaştırma:** Puan, süre ve seviye sistemleriyle öğrenme motivasyonunun artırılması.
* **Kalıcı Bilgi:** Görsel geri bildirimler ve stratejik joker kullanımıyla analitik düşünmenin geliştirilmesi.

## 🚀 Öne Çıkan Özellikler

* **Dinamik Kategori Sistemi:** URL parametreleri ile farklı ders branşlarına erişim.
* **Modern Eğitim Arayüzü:** Karanlık mod odaklı, teknoloji temalı tasarım.
* **Eğitsel Jokerler:** 50/50, Seyirci ve Soru Paslama gibi mekanikler.
* **Zaman Yönetimi:** Her soru için süre sınırlaması.
* **Tam Uyumluluk:** Akıllı tahta, tablet ve mobil cihaz desteği.

## 🛠️ Teknik Yığın (Tech Stack)

| Katman          | Teknoloji            | Açıklama                                   |
| :-------------- | :------------------- | :----------------------------------------- |
| **Frontend**    | `Next.js 14`         | App Router mimarisi ile yüksek performans. |
| **Dil**         | `TypeScript`         | Tip güvenli ve ölçeklenebilir yapı.        |
| **Stil**        | `Tailwind CSS`       | Modern ve hızlı arayüz tasarımı.           |
| **Backend/API** | `Cloudflare Workers` | Edge Computing tabanlı servis.             |
| **İkonlar**     | `Lucide React`       | Minimalist ikon seti.                      |

## 🏗️ Kurulum ve Çalıştırma

Projeyi yerel makinenizde çalıştırmak için aşağıdaki adımları izleyin.

### 1️⃣ Projeyi klonlayın

```bash
git clone https://github.com/can2334/gamehub.git
```

### 2️⃣ Proje klasörüne gidin

```bash
cd gamehub
```

### 3️⃣ Bağımlılıkları yükleyin

```bash
npm install
# veya
yarn install
# veya
pnpm install
```

### 4️⃣ Geliştirme sunucusunu başlatın

```bash
npm run dev
# veya
yarn dev
# veya
pnpm dev
```

Tarayıcıda aşağıdaki adresi açın:

```
http://localhost:3000
```

## ☁️ Cloudflare Workers (API)

Backend servisleri Cloudflare Workers üzerinde çalışır. API adresi frontend tarafında tanımlıdır.

Gerekirse Worker'ı yerelde çalıştırmak için:

```bash
npm install -g wrangler
wrangler dev
```

## 📁 Proje Yapısı (Özet)

```
app/            # Next.js App Router
components/     # UI bileşenleri
lib/            # Yardımcı fonksiyonlar
styles/         # Global stiller
public/         # Statik dosyalar
```

## 📌 Notlar

* Proje eğitim amaçlıdır.
* Soru içerikleri kolayca genişletilebilir.
* Edge mimarisi sayesinde düşük gecikme hedeflenmiştir.

## 📄 Lisans

Bu proje MIT lisansı ile lisanslanmıştır.
