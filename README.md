# Sağlıkta Yapay Zeka Uygulamaları · Prof. Dr. Ahmet Altun

Sivas Cumhuriyet Üniversitesi × Erciyes Üniversitesi ortaklığında hazırlanan **Klinik Beceri Eğitiminde Yapay Zeka Kullanımı** interaktif sunum projesi.

## 🚀 Canlı Önizleme / Yerel Çalıştırma

Projeyi yerel ortamınızda çalıştırmak için:

```bash
# Web dizinini yerel HTTP sunucusuyla başlatın:
python3 -m http.server 8000 --directory web
```

Tarayıcınızdan `http://localhost:8000/#1` adresini açarak sunuma erişebilirsiniz.

## ⌨️ Sunum Kısayolları

- **İleri / Geri:** `→` / `←` veya `Boşluk` / `Fare Tekerleği`
- **Genel Bakış (Overview):** `O` veya `Esc` (Tüm slayt evrenini harita görünümünde gösterir)
- **Ses Aç / Kapat:** `M` (Sessiz mod / Doğal UI akustiği)
- **Tam Ekran:** `F`

## 📁 Proje Yapısı

- `web/`: HTML, CSS, animasyon motoru (GSAP, MorphSVG, SplitText), ses sentezleyicisi (Web Audio API) ve yüksek çözünürlüklü (Real-ESRGAN ile 4x yeniden ölçeklenmiş) tıbbi görseller.
- `Hemşirelikte Yapay Zeka Uygulamaları.pdf`: Sunumun PDF kopyası.
- `Hemşirelikte Yapay Zeka Uygulamaları.pptx`: Sunumun orijinal PowerPoint slayt seti.

## Sürümler

- `yedek/orijinal-surum` dalı: ilk teslim edilen hali (değişmemiş).
- `yedek/deneme-1-svg` dalı: vektörel illüstrasyon denemesi.

Geri dönmek için: `git checkout yedek/orijinal-surum`
