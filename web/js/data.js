/* İçerik: Hemşirelikte Yapay Zeka Uygulamaları (Prof. Dr. Ahmet Altun) */
const SECTIONS = [
  { no: '00', name: 'Açılış', icon: 'circle' },
  { no: '01', name: 'Yapay Zekayı Anlamak', icon: 'hex' },
  { no: '02', name: 'Sağlıkta Temel Rol', icon: 'cross' },
  { no: '03', name: 'Hemşirelikte Uygulamalar', icon: 'heart' },
  { no: '04', name: 'Hemşireliğin Dönüşümü', icon: 'spark' },
  { no: '05', name: 'Sorumlu Kullanım', icon: 'shield' },
  { no: '06', name: 'Teşekkürler', icon: 'circle' }
];

const ICONS = {
  circle: 'M50 6 C74.3 6 94 25.7 94 50 C94 74.3 74.3 94 50 94 C25.7 94 6 74.3 6 50 C6 25.7 25.7 6 50 6 Z',
  hex: 'M50 6 L88 28 L88 72 L50 94 L12 72 L12 28 Z',
  cross: 'M38 8 H62 V38 H92 V62 H62 V92 H38 V62 H8 V38 H38 Z',
  heart: 'M50 88 C20 66 8 48 8 32 C8 18 19 8 32 8 C41 8 47 13 50 19 C53 13 59 8 68 8 C81 8 92 18 92 32 C92 48 80 66 50 88 Z',
  spark: 'M50 4 C54 32 68 46 96 50 C68 54 54 68 50 96 C46 68 32 54 4 50 C32 46 46 32 50 4 Z',
  shield: 'M50 6 L88 20 V50 C88 72 72 86 50 94 C28 86 12 72 12 50 V20 Z'
};

const GHOSTS = ['VERİ', 'ALGORİTMA', 'ÖĞRENME', 'BAKIM', 'TAHMİN', 'GÜVEN', 'HEMŞİRE', 'SİNİR AĞI', 'İÇGÖRÜ', 'ŞİFA', 'KARAR', 'İNSAN', 'ZEKÂ', 'ÖRÜNTÜ', 'DİJİTAL', 'EMPATİ'];

/* Her öğe tepe-seviye bir "durak"tır. hub: çocuk kartlar içinde yaşar (Prezi tarzı iç içe zoom). */
const DECK = [
  { type: 'hero', id: 'hero', sec: 0 },
  { type: 'poster', id: 'poster', sec: 0 },

  { type: 'chap', id: 'c1', sec: 1, title: 'Yapay Zekayı Anlamak', sub: 'Tanım, teknikler ve işleyiş: kavramları sağlam bir zemine oturtalım.' },
  { type: 'hub', id: 'h-nedir', sec: 1, title: 'Yapay Zeka Nedir?', sub: 'İki temel fikir: ne olduğu ve nasıl öğrendiği.', bg: 'neural',
    kids: [
      { id: 'k-tanim', title: 'Yapay Zekanın Tanımı', img: 'brain',
        body: 'Yapay Zeka (AI), insan zekası süreçlerinin makineler, özellikle bilgisayar sistemleri tarafından simülasyonu olarak tanımlanır. Bu, insan yeteneklerine rakip olabilen veya <b>onları aşabilen</b> <em>öğrenme, akıl yürütme, algılama ve karar verme</em> gibi yetenekleri içerir.' },
      { id: 'k-ogrenen', title: 'Öğrenen Sistemler: Teknikler ve Kendini Geliştirme', img: 'neural', sm: true,
        body: 'Yapay Zeka; verileri işlemek ve tahmin yapmak için <em>makine öğrenimi, derin öğrenme, doğal dil işleme ve sinir ağları</em> gibi tekniklerden yararlanır. Bu sistemler veri girişlerinden öğrenerek zamanla gelişecek biçimde tasarlanmıştır: <em>kendini geliştirme kapasitesi</em> yeni zorluklara uyum sağlamasına olanak tanır.' }
    ] },
  { type: 'mccarthy', id: 'mc', sec: 1 },
  { type: 'map', id: 'map', sec: 1 },
  { type: 'venn', id: 'venn', sec: 1 },
  { type: 'hub', id: 'h-calisir', sec: 1, title: 'AI Nasıl Çalışır?', sub: 'Veri → örüntü → tahmin. Üç adımda döngü.', bg: 'server', pipe: true,
    kids: [
      { id: 'k-veri', title: 'Büyük Miktarda Veriyi İşler', img: 'warehouse', sm: true,
        body: 'Yapay Zeka, öğrenmek ve gelişmek için <em>büyük miktarda veri setine</em> dayanır. Eğitim verileri çoğunlukla etiketlenmiştir; yani örüntüleri ve ilişkileri anlamasına yardımcı olmak için kategorize edilmiş ve düzenlenmiştir. Modern yöntemler etiketlenmemiş veriden de örüntü çıkarabilir.' },
      { id: 'k-desen', title: 'Verilerdeki Korelasyonları ve Desenleri Analiz Eder', img: 'analytics', sm: true,
        body: 'Yutulan verileri analiz ederek Yapay Zeka sistemleri, insanlar için hemen belirgin olmayabilecek <em>korelasyonları ve desenleri tespit eder.</em> Bu analitik süreç, verilerden öğrenmesine ve yanıtlarını buna göre uyarlamasına olanak tanır.' },
      { id: 'k-tahmin', title: 'Gelecekteki Durumlara İlişkin Tahminler Yapar', img: 'server', sm: true,
        body: 'Analiz sırasında tespit edilen desenleri kullanarak Yapay Zeka, gelecekteki olaylar veya durumlar hakkında <em>tahminlerde bulunabilir.</em> Sonuçlar gerçekle karşılaştırıldıkça model kendini günceller; bu tahmin yeteneği sağlık gibi alanlarda hayati önem taşır.' }
    ] },

  { type: 'chap', id: 'c2', sec: 2, title: 'Sağlık Hizmetlerinde Yapay Zekanın Temel Rolü', sub: 'Tanıdan tedaviye, yönetimden cerrahiye: ana kapılar.', small: true },
  { type: 'role', id: 'role', sec: 2 },
  { type: 'hub', id: 'h-kapsam', sec: 2, title: 'Sağlık Hizmetlerinde Yapay Zekanın Kapsamı', sub: 'Tanı, tedavi ve yönetim: daha iyi sonuç, daha yüksek verimlilik.', bg: 'hosp_b',
    kids: [
      { id: 'k-tani', title: 'Tanısal Araçlar', img: 'xray',
        body: 'Yapay Zeka teknolojileri, tıbbi görüntüleri, laboratuvar sonuçlarını ve hasta verilerini analiz ederek hastalıkların teşhisine yardımcı olur ve bu da <em>daha hızlı ve doğru teşhisler</em> sağlar.' },
      { id: 'k-tedaviplan', title: 'Tedavi Planlama', img: 'lab',
        body: 'Yapay Zeka, hasta verileri ve tahmine dayalı analizlere dayanarak <em>kişiselleştirilmiş tedavi planları</em> oluşturulmasında sağlık hizmeti sağlayıcılarına yardımcı olur ve terapötik sonuçları optimize eder.' },
      { id: 'k-yonet', title: 'Yönetsel Görevler', img: 'clinic',
        body: 'Yapay Zeka, planlama, faturalandırma ve kaynak tahsisi gibi idari süreçleri optimize ederek sağlık kuruluşlarında <em>operasyonel verimliliğin</em> artmasını sağlar.' }
    ] },
  { type: 'surgery', id: 'surg', sec: 2 },

  { type: 'chap', id: 'c3', sec: 3, title: 'Hemşirelikte Yapay Zeka Uygulamaları', sub: 'Yatak başından yönetim masasına: hemşirenin gününde YZ nerede?', small: true },
  { type: 'hub', id: 'h-hems', sec: 3, title: 'Hemşirenin Gününde Beş YZ Alanı', sub: 'Önce harita, sonra ayrıntı: her alan bir sonraki bölümde derinleşir.', bg: 'robotcorr',
    kids: [
      { id: 'k-akis', title: 'İş Akışı Optimizasyonu', img: 'workflow',
        body: 'Dokümantasyon, planlama ve envanter gibi rutin işleri otomatikleştirir; <em>zaman hasta başına döner.</em>' },
      { id: 'k-ilac', title: 'Tedavi Yönetimi', img: 'pharmacy', viz: 'alert',
        body: 'Otomatik ilaç yönetim sistemleri dağıtımın <em>doğruluğunu</em> artırır, insan hatası riskini azaltır ve hasta güvenliğini güçlendirir.' },
      { id: 'k-tahminanaliz', title: 'Tahmine Dayalı Analizler', img: 'learn',
        body: 'Hasta ihtiyaçlarını ve sonuçlarını <em>önceden öngörerek</em> proaktif müdahaleye olanak tanır.' },
      { id: 'k-uzak', title: 'Uzaktan Hasta Monitörizasyonu', img: 'wearable', viz: 'ecg',
        body: 'Giyilebilir cihazlar ve <em>sürekli glikoz izleme</em> gibi sistemler sağlık metriklerini gerçek zamanlı izler; zamanında müdahaleyi kolaylaştırır ve hastane yeniden yatışlarını azaltır.' },
      { id: 'k-asist', title: 'Hasta Bakım Asistanlığı', img: 'nursepatient',
        body: 'Sohbet robotları ve sanal asistanlar sorulara anında yanıt vererek <em>hasta katılımını</em> artırır.' }
    ] },

  { type: 'chap', id: 'c4', sec: 4, title: 'Yapay Zeka ile Hemşirelik Uygulamalarının Dönüşümü', sub: 'Rutin görevler otomasyona, zaman hasta başına döner.', small: true },
  { type: 'hub', id: 'h-kkds', sec: 4, title: 'Hemşirelikte Klinik Karar Destek Sistemlerinin Rolü', sub: 'KKDS: bilgiyi karara, kararı güvenli bakıma çevirir.', bg: 'ckds1',
    kids: [
      { id: 'k-karar', title: 'Klinik Karar Verme Sürecini Geliştirir', img: 'ckds1',
        body: 'Klinik karar destek sistemleri (KKDS), yapay zekâ kullanarak hasta verilerini analiz eder ve <em>sağlık profesyonellerine kanıta dayalı öneriler sunar.</em> Hasta bilgilerini klinik bilgiyle entegre eder; yeni verilerden sürekli öğrenerek <em>zamanla daha isabetli hale gelir.</em>' },
      { id: 'k-guven', title: 'Hasta Güvenliğini Artırır', img: 'safety', viz: 'alert',
        body: 'KKDS, <em>olası ilaç etkileşimlerini belirleyebilir,</em> alternatif tedaviler önerebilir ve <em>anormal laboratuvar sonuçlarını işaretleyerek</em> hata riskini en aza indirir; böylece güvenli hasta bakımını sağlar.' }
    ] },
  { type: 'analytics', id: 'an', sec: 4 },
  { type: 'chat', id: 'chat', sec: 4 },
  { type: 'hub', id: 'h-akis', sec: 4, title: 'Hemşirelikte Yapay Zeka Destekli İş Akışı Optimizasyonu', sub: 'Evrak, nöbet, stok: üç zaman hırsızı.', bg: 'clinic',
    kids: [
      { id: 'k-dok', title: 'Dokümantasyonda Verimliliği Artırır', long: true, big: '01',
        body: 'Yapay zekâ, <em>rutin görevlerin otomasyonu</em> sayesinde hemşirelik iş akışlarını daha verimli kılar. Dokümantasyon süreçlerini optimize ederek <em>evrak işlerine harcanan zamanı azaltır</em>; hemşireler hasta bakımına daha fazla odaklanır. Randevu planlama ve envanter uyarıları, sonraki iki başlıkta ayrıntılanır.' },
      { id: 'k-nobet', title: 'Personel ve Çalışma Planlamasını Optimize Eder', long: true, big: '02', viz: 'shift',
        body: 'Yapay zeka destekli programlama araçları, <em>hem hemşirelik personelinin müsaitliği hem de hasta bakım ihtiyaçlarıyla uyumlu nöbet çizelgeleri oluşturmaya yardımcı</em> olur. Bu optimizasyon, fazla veya eksik personel sorunlarını azaltarak personel memnuniyetinin artmasına ve daha iyi hasta sonuçlarına yol açar. Tarihsel verileri analiz ederek <em>yoğun zamanları tahmin eder</em> ve randevu planlamasını bakım ihtiyacıyla hizalar.' },
      { id: 'k-stok', title: 'Stok Yönetimini İyileştirir', long: true, big: '03', viz: 'stock',
        body: 'Akıllı sistemler aracılığıyla yapay zeka, <em>stok seviyelerini gerçek zamanlı olarak izleyerek envanter yönetimini geliştirir.</em> Bu yetenek, hemşirelik personelinin hasta bakımına odaklanmasını sağlarken gerekli malzemelerin aşırı stoklanmadan mevcut olmasını garanti eder. Kullanım modellerini analiz ederek malzemelerin ne zaman yenilenmesi gerekeceğini tahmin edebilir; <em>böylece bütçe yönetimi ve kaynak tahsisine yardımcı olur.</em>' }
    ] },
  { type: 'hub', id: 'h-tekno', sec: 4, title: 'Hemşireliği Dönüştüren Yenilikçi Teknolojiler', sub: 'Kayıttan cihaza: veriyi birleştiren ve bakımı güvenli kılan araçlar.', bg: 'ehr',
    kids: [
      { id: 'k-ehr', title: 'Gelişmiş Elektronik Sağlık Kayıtları', img: 'ehr', sm: true,
        body: 'Çeşitli kaynaklardan gelen veriler tek kayıtta birleşir; <em>gerçek zamanlı güncellemeler ve kapsamlı hasta geçmişi</em> daha iyi sonuçları kolaylaştırır.' },
      { id: 'k-infuzyon', title: 'Akıllı İnfüzyon Pompaları', viz: 'drip', sm: true,
        body: 'Akıllı infüzyon pompaları; sıvı, ilaç ve besin maddelerini <em>yüksek doğruluk ve güvenlikle</em> ulaştırır, dozaj hatalarını ve ilaç hatası riskini azaltır.' },
      { id: 'k-sandalye', title: 'Akıllı Tekerlekli Sandalyeler', viz: 'wheel', sm: true,
        body: 'Akıllı tekerlekli sandalyeler, hastaların hareket kabiliyetine yardımcı olan ve bağımsızlık sağlayan gelişmiş navigasyon sistemleriyle donatılmıştır ve aynı zamanda <em>gerçek zamanlı sağlık izleme</em> imkânı sunar.' },
      { id: 'k-yatak', title: 'Akıllı Yataklar', viz: 'bed', sm: true,
        body: 'Akıllı yataklar, hastaların <em>hayati belirtilerini izler</em> ve optimum konfor için otomatik olarak ayarlanır; böylece hasta güvenliğini artırır ve daha iyi sağlık sonuçlarına katkıda bulunur.' }
    ] },
  { type: 'robots', id: 'rob', sec: 4 },
  { type: 'hub', id: 'h-perf', sec: 4, title: 'Performans İzlemi', sub: 'Ölç, iyileştir, kıyasla.', bg: 'handwash',
    kids: [
      { id: 'k-kpi', title: 'KPI ve Standartlarla Kıyaslama', img: 'kpi', sm: true,
        body: 'Yapay zeka destekli izleme, <em>temel performans göstergelerini</em> değerlendirir ve kuruluşların performansını sektör standartlarıyla karşılaştırarak açıkları ve en iyi uygulamaları görünür kılar.' },
      { id: 'k-kalite', title: 'Sürekli Kalite İyileştirmesi', img: 'quality',
        body: 'İyileştirme gereken alanları belirleyerek <em>sürekli kalite iyileştirme</em> döngüsünü kolaylaştırır; sonuçta daha iyi hasta çıktıları ve optimize edilmiş hemşirelik uygulamaları elde edilir.' }
    ] },

  { type: 'chap', id: 'c5', sec: 5, title: 'Gücü Sorumlulukla Kullanmak', sub: 'Teknoloji öneri sunar; sorumluluk hemşirede kalır.', small: false },
  { type: 'ethics', id: 'eth', sec: 5 },
  { type: 'steps', id: 'steps', sec: 5 },
  { type: 'end', id: 'end', sec: 6 }
];
