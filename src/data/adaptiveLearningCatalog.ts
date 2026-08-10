export type TopicDomain =
  | "architecture"
  | "backend"
  | "data"
  | "frontend"
  | "security"
  | "reliability"
  | "delivery"
  | "ai";

export type TopicDifficulty = "foundation" | "intermediate" | "advanced";

export type CareerWeight = 1 | 2 | 3 | 4 | 5;

export type PatternWeight = 0 | 1 | 2 | 3 | 4 | 5;

export type TopicDiagramEdge = {
  from: number;
  to: number;
  label: string;
};

export type TopicDiagram = {
  title: string;
  nodes: string[];
  edges: TopicDiagramEdge[];
};

export type TopicSeed = {
  openingCase: string;
  predictionPrompt: string;
  mentalModel: string;
  workedExample: string;
  labTask: string;
  doneWhen: string;
  transferPrompt: string;
  reflectionPrompt: string;
  diagram: TopicDiagram;
  reviewQuestions: [string, string, string, ...string[]];
};

export type TopicDefinition = {
  slug: string;
  title: string;
  domain: TopicDomain;
  category: string;
  difficulty: TopicDifficulty;
  summary: string;
  whyItMatters: string;
  objectives: string[];
  prerequisites: string[];
  related: string[];
  misconceptions: string[];
  projectContexts: string[];
  careerWeight: CareerWeight;
  patternWeight: PatternWeight;
  freshnessQueries: string[];
  sourceKeys: string[];
  seed: TopicSeed;
};

export const adaptiveLearningCatalog: TopicDefinition[] = [
  {
    slug: "http-request-lifecycle",
    title: "HTTP İsteğinin Uçtan Uca Yaşam Döngüsü",
    domain: "backend",
    category: "Web Protokolleri",
    difficulty: "foundation",
    summary:
      "Bir HTTP isteğini tarayıcıdan DNS, TLS, reverse proxy ve uygulama katmanlarına; oradan veritabanına ve tekrar istemciye kadar izler. Method, status, header, cache ve timeout kararlarının tek bir sözleşmenin parçaları olduğunu gösterir.",
    whyItMatters:
      "Full-stack hata ayıklamada 'backend çalışmıyor' teşhisi yetersizdir. VTrade isteği CDN'de cache'lenmiş, proxy'de body limitiyle reddedilmiş veya sunucu commit ettikten sonra istemci timeout yaşamış olabilir; her durum farklı düzeltme gerektirir.",
    objectives: [
      "İsteğin geçtiği ağ ve uygulama sınırlarını sırasıyla açıklamak.",
      "Safe, idempotent ve cacheable HTTP davranışlarını birbirinden ayırmak.",
      "4xx, 5xx ve ağ hatalarının istemci açısından farklı anlamlarını modellemek.",
    ],
    prerequisites: [],
    related: [
      "runtime-boundary-validation",
      "authentication-session-lifecycle",
      "observability-traces-and-context",
      "nextjs-server-client-boundaries",
    ],
    misconceptions: [
      "Sunucunun 200 döndürmesi iş kuralının doğru uygulandığını kanıtlar.",
      "POST her zaman yeniden denenemez; idempotency sözleşmesi varsa kontrollü retry mümkündür.",
    ],
    projectContexts: ["VTrade API", "converter upload servisi", "TaskManagment web uygulaması"],
    careerWeight: 5,
    patternWeight: 1,
    freshnessQueries: [
      "MDN HTTP semantics current safe idempotent methods",
      "HTTP caching current browser revalidation guidance",
    ],
    sourceKeys: ["mdn-http", "web-dev"],
    seed: {
      openingCase:
        "VTrade'de kullanıcı buy düğmesine basar, tarayıcı timeout gösterir; ancak trade veritabanına yazılmıştır. Kullanıcı tekrar basınca ikinci alım oluşur. Sorun yalnız UI'da değil, uçtan uca sözleşmededir.",
      predictionPrompt:
        "Response istemciye ulaşmadan bağlantı koparsa sunucu işlemi geri alır mı? Cevabını request yaşam döngüsündeki commit noktasıyla gerekçelendir.",
      mentalModel:
        "HTTP'yi fonksiyon çağrısı değil, sonucu belirsiz kalabilen bir mesaj alışverişi olarak düşün. İstemcinin cevabı görmemesi, sunucunun komutu işlemediği anlamına gelmez.",
      workedExample:
        "POST /trades isteği proxy'den geçer, API transaction'ı commit eder ve response dönerken ağ kesilir. Aynı idempotency key ile tekrar gelen istek yeni trade açmak yerine önceki sonucu okur.",
      labTask:
        "VTrade buy akışının sequence diyagramını çiz; TLS sonlandırma, auth, validation, transaction commit ve response noktalarını işaretle. Commit sonrasında bağlantıyı kesen bir integration testi tasarla.",
      doneWhen:
        "Aynı komut tekrarlandığında tek trade oluştuğunu ve istemcinin önceki sonuca ulaşabildiğini kalıcı durum üzerinden gösterebildiğinde.",
      transferPrompt:
        "Aynı belirsiz sonuç problemi converter'da uzun süren dosya yükleme ve job oluşturma akışında nasıl görünür?",
      reflectionPrompt:
        "Bugüne kadar status code ile domain sonucu arasında hangi varsayımı sessizce yapıyordun?",
      diagram: {
        title: "Bir isteğin kritik durakları",
        nodes: ["İstemci", "Proxy", "API", "Veritabanı", "Response"],
        edges: [
          { from: 0, to: 1, label: "TLS + HTTP" },
          { from: 1, to: 2, label: "yönlendir" },
          { from: 2, to: 3, label: "transaction" },
          { from: 3, to: 2, label: "commit" },
          { from: 2, to: 4, label: "status + body" },
        ],
      },
      reviewQuestions: [
        "Safe method ile idempotent method arasındaki fark nedir?",
        "İstemci timeout yaşadığında hangi üç sunucu durumu mümkün olabilir?",
        "Bir reverse proxy uygulamaya ulaşmadan isteği hangi nedenlerle reddedebilir?",
      ],
    },
  },
  {
    slug: "runtime-boundary-validation",
    title: "Çalışma Zamanı Sınır Doğrulaması",
    domain: "backend",
    category: "API Tasarımı",
    difficulty: "foundation",
    summary:
      "TypeScript tiplerinin ağdan, dosyadan, environment'tan veya modelden gelen veriyi doğrulamadığını; güven sınırında parse, normalize ve anlamlı hata üretme zorunluluğunu ele alır.",
    whyItMatters:
      "converter route'u yalnız dosya adının uzantısına güvenirse sahte MIME ve path traversal girdileri worker'a ulaşır. Kodun içeride tip güvenli görünmesi, dış girdinin o tipe gerçekten uyduğu anlamına gelmez.",
    objectives: [
      "Compile-time type ile runtime şema arasındaki sınırı göstermek.",
      "Parse etme, normalize etme ve domain doğrulamasını doğru katmanlara ayırmak.",
      "Geçersiz girdinin active execution path üzerinde reddedildiğini test etmek.",
    ],
    prerequisites: ["http-request-lifecycle"],
    related: [
      "api-contract-evolution",
      "file-upload-sandboxing",
      "structured-llm-output",
      "specification-pattern",
    ],
    misconceptions: [
      "Request body'yi TypeScript interface'e cast etmek doğrulamadır.",
      "Bir validation helper'ının repoda bulunması, gerçek route tarafından kullanıldığını kanıtlar.",
    ],
    projectContexts: ["converter", "VTrade", "code-review provider cevapları"],
    careerWeight: 5,
    patternWeight: 2,
    freshnessQueries: [
      "TypeScript runtime schema validation current best practices",
      "OWASP input validation allowlist canonicalization current",
    ],
    sourceKeys: ["owasp-api", "mdn-http"],
    seed: {
      openingCase:
        "converter'da UploadInput tipi yalnızca PDF kabul ediyor görünür; saldırgan Content-Type değerini değiştirip dev bir arşiv yollar. TypeScript derlemesi geçer, worker bellek sınırını aşar.",
      predictionPrompt:
        "Aynı alan hem trim edilip hem uzunluk açısından doğrulanacaksa sıra sonucu değiştirebilir mi? İki örnek üret.",
      mentalModel:
        "Her dış veri önce unknown'dur. Parser, güvenilmeyen baytları ya geçerli bir iç modele dönüştüren ya da reddeden tek yönlü bir kapıdır; type assertion ise kapının resmini duvara çizmektir.",
      workedExample:
        "Trade komutunda symbol trim edilip büyük harfe çevrilir, quantity pozitif decimal olarak parse edilir; mevcut bakiye kontrolü ise şemada değil domain servisinde yapılır.",
      labTask:
        "converter'ın gerçek upload endpoint'ine bozuk MIME, çift uzantı, boş ad ve limit üstü stream gönder. Doğrulamanın helper unit testinde değil HTTP sınırında çalıştığını kanıtla.",
      doneWhen:
        "Geçersiz veri worker veya veritabanına ulaşmadan tutarlı 4xx problem cevabıyla reddediliyor ve negatif integration testleri geçiyorsa.",
      transferPrompt:
        "DeepSeek'ten gelen JSON neden kendi servisinden geliyor olsa bile aynı unknown yaklaşımıyla ele alınmalıdır?",
      reflectionPrompt:
        "Kod tabanında en riskli `as SomeType` kullanımı hangi güven sınırını görünmez yapıyor?",
      diagram: {
        title: "Güvenilmeyen girdiden domain komutuna",
        nodes: ["unknown veri", "şema parser", "normalize model", "domain kuralı", "işlem"],
        edges: [
          { from: 0, to: 1, label: "parse" },
          { from: 1, to: 2, label: "başarılı" },
          { from: 2, to: 3, label: "anlam kontrolü" },
          { from: 3, to: 4, label: "izin ver" },
        ],
      },
      reviewQuestions: [
        "TypeScript tipi neden JSON payload için güvenlik sınırı değildir?",
        "Şema doğrulaması ile domain invariant kontrolü nasıl ayrılır?",
        "Canonicalization neden allowlist kontrolünden önce gerekebilir?",
      ],
    },
  },
  {
    slug: "relational-modeling-and-constraints",
    title: "İlişkisel Modelleme ve Veritabanı Kısıtları",
    domain: "data",
    category: "Veri Bütünlüğü",
    difficulty: "foundation",
    summary:
      "Tabloyu nesne deposu gibi değil, anahtarlar ve kısıtlarla korunan ilişkiler sistemi olarak tasarlar. NOT NULL, CHECK, UNIQUE ve FOREIGN KEY kurallarını son savunma hattı olarak konumlandırır.",
    whyItMatters:
      "TaskManagment servisindeki `if (!exists)` kontrolü iki eşzamanlı istekte iki aktif üyelik oluşturabilir. Uygulama kontrolü iyi hata mesajı verir; veritabanı constraint'i tüm kod yollarında invariant'ı gerçekten korur.",
    objectives: [
      "Varlık kimliği, doğal anahtar ve ilişki kardinalitesini ayırmak.",
      "İş invariant'larını uygun constraint türüne çevirmek.",
      "Constraint ihlalini yarış koşulu dahil integration testiyle doğrulamak.",
    ],
    prerequisites: [],
    related: [
      "database-transactions",
      "transaction-isolation-and-concurrency",
      "repository-pattern",
      "money-and-ledger-modeling",
    ],
    misconceptions: [
      "ORM modeli doğruysa veritabanı constraint'lerine ihtiyaç yoktur.",
      "UUID kullanmak duplicate iş kaydını önler; yalnız satır kimliğini benzersiz yapar.",
    ],
    projectContexts: ["TaskManagment", "VTrade wallet ve portfolio", "converter job tablosu"],
    careerWeight: 5,
    patternWeight: 2,
    freshnessQueries: [
      "PostgreSQL current constraints documentation unique nulls not distinct",
      "PostgreSQL current foreign key indexing guidance",
    ],
    sourceKeys: ["postgres-constraints"],
    seed: {
      openingCase:
        "VTrade'de iki ilk-giriş isteği aynı kullanıcı için wallet olmadığını görüp iki wallet ekler. Her request tek başına doğru görünür; veri modeli kullanıcı başına tek wallet kuralını ifade etmediği için sistem yanlıştır.",
      predictionPrompt:
        "`SELECT` ile varlık kontrolü ardından `INSERT` yapmak neden UNIQUE constraint ile eşdeğer değildir? İki transaction zaman çizelgesi çiz.",
      mentalModel:
        "Veritabanı şemasını pasif saklama biçimi değil, kabul edilebilir tüm sistem durumlarının sınırı olarak düşün. Constraint dışındaki durumlar temsil edilememelidir.",
      workedExample:
        "Portfolio tablosunda `(user_id, asset_id)` UNIQUE, `quantity >= 0` CHECK ve user/asset foreign key'leri kullanılır. Servis yine erken kontrol yapar, fakat yarışın hakemi constraint'tir.",
      labTask:
        "TaskManagment için kullanıcı-proje üyeliğini modelle; owner dahil rol kümesini, silme davranışını ve aynı üyeliğin iki kez yazılmasını engelleyen migration ile paralel test tasarla.",
      doneWhen:
        "Doğrudan SQL dahil hiçbir yazma yolu geçersiz durumu kalıcılaştıramıyor ve constraint hatası domain hatasına kontrollü çevriliyorsa.",
      transferPrompt:
        "converter job'ında aynı upload'ın iki kez kuyruğa girmemesi için hangi doğal iş anahtarı kullanılabilir?",
      reflectionPrompt:
        "Şu an yalnız application-level `if` ile korunan en pahalı invariant hangisi?",
      diagram: {
        title: "Invariant'ın katmanlı korunması",
        nodes: ["API kontrolü", "Domain kuralı", "DB constraint", "Geçerli durum"],
        edges: [
          { from: 0, to: 1, label: "erken hata" },
          { from: 1, to: 2, label: "yazma" },
          { from: 2, to: 3, label: "kabul" },
        ],
      },
      reviewQuestions: [
        "UNIQUE constraint hangi yarış koşulunu uygulama kontrolünden daha güçlü önler?",
        "Foreign key için silme davranışı neden bilinçli seçilmelidir?",
        "CHECK constraint hangi tür çapraz-satır kuralları için yetersiz kalır?",
      ],
    },
  },
  {
    slug: "database-transactions",
    title: "Transaction Sınırı ve Atomiklik",
    domain: "data",
    category: "Transaction Yönetimi",
    difficulty: "foundation",
    summary:
      "Bir iş komutunun birden çok veri değişikliğini tek atomik commit altında toplar. Transaction sınırının repository metodu değil, iş açısından birlikte başarılı olması gereken use case tarafından belirlendiğini öğretir.",
    whyItMatters:
      "VTrade buy akışında wallet düşüp holding yazılamazsa para kaybolur; converter'da job yazılıp dosya metadata'sı yazılmazsa iş çalışamaz. Yarım başarı log mesajıyla değil transaction tasarımıyla önlenir.",
    objectives: [
      "Begin, commit ve rollback davranışını failure noktalarıyla açıklamak.",
      "Transaction sınırını tek bir iş komutuna göre seçmek.",
      "Rollback'i gerçek veritabanıyla hata enjeksiyonu yaparak kanıtlamak.",
    ],
    prerequisites: ["relational-modeling-and-constraints"],
    related: [
      "unit-of-work-pattern",
      "transaction-isolation-and-concurrency",
      "transactional-outbox-pattern",
      "saga-pattern",
    ],
    misconceptions: [
      "Ardışık iki `save` çağrısı otomatik olarak aynı transaction'dadır.",
      "Transaction yalnız exception yakalamak demektir; asıl güvence commit'in atomikliğidir.",
    ],
    projectContexts: ["VTrade alım-satım", "TaskManagment görev taşıma", "converter job oluşturma"],
    careerWeight: 5,
    patternWeight: 4,
    freshnessQueries: [
      "PostgreSQL current transaction tutorial savepoints",
      "database transaction boundary application service current guidance",
    ],
    sourceKeys: ["postgres-transactions", "patterns-of-eaa"],
    seed: {
      openingCase:
        "VTrade buy işlemi bakiyeyi 500 azaltır; portfolio insert'i constraint hatası verir. İlk update autocommit olduğu için kullanıcı parasını kaybeder, retry ise durumu daha da belirsizleştirir.",
      predictionPrompt:
        "Üç yazmanın ikincisinde hata olduğunda hangi satırlar görünür kalır? Autocommit ve açık transaction için ayrı cevap ver.",
      mentalModel:
        "Transaction bir alışveriş poşetidir: içindeki değişikliklerin tamamı kasadan birlikte geçer veya hiçbiri sahiplik değiştirmez. Poşetin sınırını tablo değil iş niyeti belirler.",
      workedExample:
        "Buy use case'i wallet için koşullu update, holding upsert ve ledger insert'i aynı transaction'da yapar. Ledger constraint'i hata verirse ilk iki değişiklik de rollback olur.",
      labTask:
        "VTrade trade servisinde her yazma adımından sonra kontrollü exception fırlat; Test PostgreSQL üzerinde transaction sonrasında wallet, holding ve ledger durumlarını sorgula.",
      doneWhen:
        "Her hata noktasında ya üç değişiklik de görünür ya hiçbiri görünmez ve aynı connection/transaction'ın kullanıldığı izlenebiliyorsa.",
      transferPrompt:
        "TaskManagment'ta görevi başka kolona taşırken sıra numaraları ve audit kaydı hangi transaction sınırında olmalı?",
      reflectionPrompt:
        "Servisindeki transaction sınırı teknik repository çağrılarını mı, kullanıcı niyetini mi takip ediyor?",
      diagram: {
        title: "Tek commit altında trade",
        nodes: ["Buy komutu", "Wallet update", "Holding upsert", "Ledger insert", "Commit"],
        edges: [
          { from: 0, to: 1, label: "begin" },
          { from: 1, to: 2, label: "aynı tx" },
          { from: 2, to: 3, label: "aynı tx" },
          { from: 3, to: 4, label: "atomik" },
        ],
      },
      reviewQuestions: [
        "Transaction sınırı neden repository başına seçilmemelidir?",
        "Rollback davranışını mock repository ile neden tam kanıtlayamazsın?",
        "Uzun süren harici API çağrısını açık transaction içinde tutmanın bedeli nedir?",
      ],
    },
  },
  {
    slug: "transaction-isolation-and-concurrency",
    title: "Transaction Isolation ve Eşzamanlılık",
    domain: "data",
    category: "Concurrency",
    difficulty: "advanced",
    summary:
      "Ayrı ayrı doğru transaction'ların aynı anda çalışınca lost update, write skew veya phantom gibi anomaliler üretmesini inceler. Isolation seviyesi, row lock ve atomik koşullu update seçeneklerini invariant bazında değerlendirir.",
    whyItMatters:
      "VTrade'de iki buy isteği aynı 100 TL bakiyeyi okuyup 80 TL harcayabilir. Her request içinde transaction olması tek başına yeterli değildir; transaction'ların birbirini nasıl gördüğü de tanımlanmalıdır.",
    objectives: [
      "Read committed, repeatable read ve serializable seviyelerini observable davranışla karşılaştırmak.",
      "Lost update ile write skew arasındaki farkı zaman çizelgesinde göstermek.",
      "Invariant için lock, conditional update veya retry stratejisi seçmek.",
    ],
    prerequisites: ["database-transactions"],
    related: [
      "idempotent-api-commands",
      "unit-of-work-pattern",
      "money-and-ledger-modeling",
      "retries-timeouts-and-backoff",
    ],
    misconceptions: [
      "Transaction kullanmak bütün race condition'ları otomatik önler.",
      "Serializable sihirli bir global kilittir; çoğu sistemde serialization failure için retry gerekir.",
    ],
    projectContexts: ["VTrade wallet", "TaskManagment sıralama", "converter worker claim"],
    careerWeight: 5,
    patternWeight: 4,
    freshnessQueries: [
      "PostgreSQL current transaction isolation serialization failure",
      "PostgreSQL skip locked worker queue current guidance",
    ],
    sourceKeys: ["postgres-isolation", "postgres-transactions"],
    seed: {
      openingCase:
        "İki VTrade request'i aynı anda balance=100 okur, ikisi de 70 maliyetini uygun bulur ve 30 yazar. İki başarılı trade karşılığında yalnız 70 düşmüştür: lost update finansal kayıp üretir.",
      predictionPrompt:
        "İki transaction'ın read ve write adımlarını sırala; hangi interleaving negatif bakiye yerine kayıp güncelleme üretir?",
      mentalModel:
        "Isolation, transaction çevresindeki görünmez duvarın kalınlığıdır. Duvarın adı değil, korumak istediğin invariant altında izin verdiği zaman çizelgeleri önemlidir.",
      workedExample:
        "`UPDATE wallets SET balance = balance - 70 WHERE id = ? AND balance >= 70` tek statement'ta kontrol ve yazmayı birleştirir. Etkilenen satır sıfırsa ikinci alım reddedilir.",
      labTask:
        "Bir barrier ile yüz paralel VTrade buy isteğini aynı anda başlat; farklı isolation/locking stratejilerinde başarılı trade toplamı, balance ve ledger toplamını karşılaştır.",
      doneWhen:
        "Kalıcı son durum invariant'ları her koşuda sağlanıyor, serialization/lock hataları kontrollü ele alınıyor ve seçimin throughput bedeli ölçülüyorsa.",
      transferPrompt:
        "İki converter worker'ın aynı queued job'ı claim etmesini önlemek için conditional update ile `FOR UPDATE SKIP LOCKED` nasıl karşılaştırılır?",
      reflectionPrompt:
        "Concurrency testlerin yalnız HTTP cevaplarını mı, işlem sonrası ortak veriyi de mi doğruluyor?",
      diagram: {
        title: "Lost update zaman çizelgesi",
        nodes: ["Tx A: read 100", "Tx B: read 100", "Tx A: write 30", "Tx B: write 30", "Yanlış final 30"],
        edges: [
          { from: 0, to: 1, label: "aynı eski değer" },
          { from: 1, to: 2, label: "A ilerler" },
          { from: 2, to: 3, label: "B üzerine yazar" },
          { from: 3, to: 4, label: "bir düşüm kayıp" },
        ],
      },
      reviewQuestions: [
        "Read committed altında lost update nasıl oluşabilir?",
        "Koşullu update neden read-check-write penceresini kapatır?",
        "Serializable transaction başarısız olduğunda neden tüm transaction yeniden denenmelidir?",
      ],
    },
  },
  {
    slug: "indexes-and-query-plans",
    title: "İndeksler ve Query Plan Okuma",
    domain: "data",
    category: "Veri Erişim Performansı",
    difficulty: "intermediate",
    summary:
      "İndeksi 'sorguyu hızlandır' düğmesi değil, belirli erişim desenini daha ucuz hale getirirken yazma, alan ve bakım maliyeti ekleyen fiziksel veri yapısı olarak öğretir.",
    whyItMatters:
      "TaskManagment'ta küçük test verisiyle hızlı olan `project_id + status + position` sorgusu üretimde sequential scan yapabilir. Rastgele indeks eklemek ise VTrade write latency'sini ve bloat'ı büyütür.",
    objectives: [
      "Sorgu şekliyle composite index kolon sırasını ilişkilendirmek.",
      "EXPLAIN ANALYZE planında tahmin, gerçek satır ve scan türlerini okumak.",
      "İndeksin read kazancı ile write amplification maliyetini ölçmek.",
    ],
    prerequisites: ["relational-modeling-and-constraints"],
    related: ["repository-pattern", "cqrs-pattern", "caching-and-staleness"],
    misconceptions: [
      "WHERE bölümündeki her kolon için ayrı indeks eklemek en iyi plandır.",
      "Planner'ın sequential scan seçmesi her zaman hatadır; küçük veya düşük seçicilikli tabloda doğru olabilir.",
    ],
    projectContexts: ["TaskManagment board sorguları", "VTrade trade geçmişi", "converter job listesi"],
    careerWeight: 5,
    patternWeight: 2,
    freshnessQueries: [
      "PostgreSQL current multicolumn index column order",
      "PostgreSQL current explain analyze buffers documentation",
    ],
    sourceKeys: ["postgres-indexes"],
    seed: {
      openingCase:
        "TaskManagment dashboard'u 50 satır döndürür ama 2 milyon task tarar. Endpoint'e cache eklemek semptomu gizler; filtre ve sıralamayı taşıyan erişim yolu yoktur.",
      predictionPrompt:
        "`WHERE project_id=? AND status=? ORDER BY position LIMIT 50` sorgusunda `(position, project_id, status)` indeksi neden beklenen kadar yardımcı olmayabilir?",
      mentalModel:
        "İndeks kitabın alfabetik dizinidir: hangi soruya göre sıralandığı, aradığın ön ekle başlayıp başlamadığı ve kitaba her eklemede dizinin de güncellendiği önemlidir.",
      workedExample:
        "`(project_id, status, position)` B-tree indeksi eşitlik filtrelerinin ardından sıralı ilk 50 satırı sunabilir; `EXPLAIN (ANALYZE, BUFFERS)` heap erişimini ve gerçek kazancı gösterir.",
      labTask:
        "TaskManagment benzeri veri hacmi üret; indeks öncesi ve sonrası plan, p95 süre, buffer hit ve insert maliyetini kaydet. Yalnız ölçümle desteklenen indeksi bırak.",
      doneWhen:
        "Seçilen indeks gerçek production sorgu şeklini destekliyor, plan değişimi açıklanabiliyor ve yazma maliyeti kabul kriterine dahil ediliyorsa.",
      transferPrompt:
        "VTrade'de kullanıcı ve zaman aralığına göre trade geçmişi için keyset pagination indeksini nasıl kurarsın?",
      reflectionPrompt:
        "Son eklediğin indeks hangi sorguyu hedefliyor ve kullanılmadığını nasıl fark edersin?",
      diagram: {
        title: "Sorgudan fiziksel erişim yoluna",
        nodes: ["Sorgu şekli", "Planner", "İndeks scan", "Heap satırları", "Ölçüm"],
        edges: [
          { from: 0, to: 1, label: "istatistiklerle planla" },
          { from: 1, to: 2, label: "erişim yolu" },
          { from: 2, to: 3, label: "gerekirse oku" },
          { from: 3, to: 4, label: "buffers + süre" },
        ],
      },
      reviewQuestions: [
        "Composite index'te sol ön ek neden önemlidir?",
        "EXPLAIN ile EXPLAIN ANALYZE arasındaki operasyonel fark nedir?",
        "Bir indeks hangi yazma ve bakım maliyetlerini doğurur?",
      ],
    },
  },
  {
    slug: "authentication-session-lifecycle",
    title: "Authentication ve Oturum Yaşam Döngüsü",
    domain: "security",
    category: "Kimlik ve Oturum",
    difficulty: "foundation",
    summary:
      "Kimlik doğrulamayı token üretimine indirgemeden login, saklama, doğrulama, rotation, revocation, logout ve hesap kurtarma yaşam döngüsü boyunca ele alır.",
    whyItMatters:
      "VTrade web cookie'si ile mobil bearer token aynı tehditlere sahip değildir. Süresiz token, logout sonrası geçerli session veya loglara düşen credential, güçlü parola hash'ini etkisiz bırakabilir.",
    objectives: [
      "Authentication ile authorization sorumluluklarını ayırmak.",
      "Web ve mobil istemci için token saklama tehditlerini karşılaştırmak.",
      "Session fixation, theft ve revocation failure mode'larını test etmek.",
    ],
    prerequisites: ["http-request-lifecycle"],
    related: [
      "object-level-authorization",
      "csrf-xss-and-browser-security",
      "threat-modeling-and-trust-boundaries",
    ],
    misconceptions: [
      "JWT imzalıysa her zaman güvenli ve anında iptal edilebilir.",
      "Logout yalnız istemcide token'ı silmektir; çalınmış kopyanın sunucu tarafı geçerliliği ayrıca düşünülmelidir.",
    ],
    projectContexts: ["VTrade web ve mobil", "TaskManagment", "code-review provider oturumu"],
    careerWeight: 5,
    patternWeight: 1,
    freshnessQueries: [
      "OWASP authentication cheat sheet current session rotation",
      "OWASP session management current cookie attributes",
    ],
    sourceKeys: ["owasp-auth", "owasp-session"],
    seed: {
      openingCase:
        "Kullanıcı VTrade'den logout olur ama daha önce kopyalanmış refresh token yeni access token üretmeye devam eder. UI doğru görünürken hesap hâlâ ele geçirilebilir durumdadır.",
      predictionPrompt:
        "Parola değiştirildiğinde mevcut tüm oturumlar ne olmalı? Kullanılabilirlik ve saldırı senaryosu açısından karar ver.",
      mentalModel:
        "Session, kimliğin zaman sınırlı ve iptal edilebilir kiralamasıdır. Token yalnız kira belgesidir; yaşam döngüsü politikası olmadan belgenin formatı güvenlik sağlamaz.",
      workedExample:
        "Web access token'ı HttpOnly, Secure ve uygun SameSite cookie'de; refresh token ailesi hash'lenmiş kayıt ve rotation ile tutulur. Eski refresh token yeniden kullanılırsa aile iptal edilir.",
      labTask:
        "VTrade için login, refresh, password change, logout ve stolen-refresh reuse senaryolarını sequence testleri olarak yaz; token değerlerinin loglarda olmadığını denetle.",
      doneWhen:
        "Logout/parola değişimi politikası testlerle görünür, refresh reuse algılanıyor ve browser cookie ayarları deployment ortamında doğrulanıyorsa.",
      transferPrompt:
        "VS Code içindeki code-review uzantısı provider token'ını browser uygulamasından neden farklı saklamalıdır?",
      reflectionPrompt:
        "Sistemin hangi olayı aktif oturumları iptal ediyor ve bu davranış gerçekten sunucuda mı uygulanıyor?",
      diagram: {
        title: "Oturumun güvenli yaşam döngüsü",
        nodes: ["Login", "Session ver", "Rotate", "Revoke", "Yeniden doğrula"],
        edges: [
          { from: 0, to: 1, label: "kimlik doğrulandı" },
          { from: 1, to: 2, label: "süre dolmadan" },
          { from: 2, to: 3, label: "logout/risk" },
          { from: 3, to: 4, label: "yeni login" },
        ],
      },
      reviewQuestions: [
        "Authentication ile authorization neden ayrı kontrollerdir?",
        "Refresh token rotation hangi replay sinyalini görünür yapar?",
        "HttpOnly cookie XSS ve CSRF risklerini nasıl farklı etkiler?",
      ],
    },
  },
  {
    slug: "object-level-authorization",
    title: "Nesne Seviyesinde Authorization",
    domain: "security",
    category: "Erişim Kontrolü",
    difficulty: "intermediate",
    summary:
      "Geçerli kimliği olan kullanıcının belirli tenant, proje, trade veya dosya üzerinde hangi eylemi yapabildiğini her server-side erişim yolunda doğrular; BOLA/IDOR açıklarını sahiplik filtresiyle önler.",
    whyItMatters:
      "TaskManagment endpoint'i yalnız `taskId` ile update yaparsa giriş yapmış kullanıcı başka tenant'ın görevini değiştirebilir. Tahmin edilmesi zor UUID erişim kontrolü değil, yalnız keşif maliyetidir.",
    objectives: [
      "Subject, action, resource ve context öğeleriyle authorization kararı kurmak.",
      "Tenant/owner filtresini veri sorgusuna kadar taşımak.",
      "Başka kullanıcı senaryolarını negatif integration testine dönüştürmek.",
    ],
    prerequisites: ["authentication-session-lifecycle"],
    related: [
      "specification-pattern",
      "repository-pattern",
      "threat-modeling-and-trust-boundaries",
      "api-contract-evolution",
    ],
    misconceptions: [
      "Kullanıcı login olduysa gönderdiği resource ID üzerinde işlem yapabilir.",
      "UI'da butonu gizlemek authorization kontrolüdür.",
    ],
    projectContexts: ["TaskManagment multi-tenant board", "VTrade portfolio", "converter download"],
    careerWeight: 5,
    patternWeight: 3,
    freshnessQueries: [
      "OWASP API Security current BOLA object level authorization",
      "OWASP authorization cheat sheet deny by default current",
    ],
    sourceKeys: ["owasp-api", "owasp-auth"],
    seed: {
      openingCase:
        "Alice `/tasks/42` isteğini kendi hesabında görür. Bob URL'deki 42'yi deneyip aynı görevi update eder; middleware yalnız token'ın geçerliliğini kontrol etmiştir.",
      predictionPrompt:
        "Önce task'ı ID ile yükleyip sonra owner kontrol etmek ile `WHERE id=? AND tenant_id=?` sorgusu yapmak arasında hangi sızıntı ve yarış farkları vardır?",
      mentalModel:
        "Authentication binaya giriş kartıdır; authorization her odanın kilididir. İçeri girmiş olmak bütün kapıların açıldığı anlamına gelmez.",
      workedExample:
        "Task update sorgusu taskId yanında principal'ın tenantId değerini de şart koşar. Satır bulunmamasında başka tenant kaynağının varlığını açığa çıkarmayan tutarlı cevap döner.",
      labTask:
        "İki tenant ve üç rol ile TaskManagment integration fixture'ı kur; read/update/delete/export için izin matrisi ve çapraz-tenant negatif testleri yaz.",
      doneWhen:
        "Her mutation resource bağlamında server-side kontrol ediliyor, varsayılan red uygulanıyor ve ID değiştirerek başka tenant verisine erişilemiyorsa.",
      transferPrompt:
        "converter'da job sahibi dışındaki kişinin tahmin ettiği download URL'si için kontrol hangi katmanda yapılmalı?",
      reflectionPrompt:
        "Kodda kimlik doğrulanmış kullanıcıyı otomatik olarak kaynak sahibi varsayan bir sorgu var mı?",
      diagram: {
        title: "Kaynak bağlamlı erişim kararı",
        nodes: ["Principal", "Eylem", "Kaynak", "Policy", "İzin/Red"],
        edges: [
          { from: 0, to: 3, label: "rol + tenant" },
          { from: 1, to: 3, label: "istenen işlem" },
          { from: 2, to: 3, label: "owner + durum" },
          { from: 3, to: 4, label: "deny by default" },
        ],
      },
      reviewQuestions: [
        "UUID neden object-level authorization yerine geçmez?",
        "Authorization filtresini sorguya taşımak hangi riski azaltır?",
        "404 ile 403 seçimi kaynak keşfi açısından nasıl değerlendirilir?",
      ],
    },
  },
  {
    slug: "browser-rendering-and-state",
    title: "Tarayıcı Render Döngüsü ve UI Durumu",
    domain: "frontend",
    category: "Web Platformu",
    difficulty: "foundation",
    summary:
      "DOM, CSSOM, layout, paint ve compositing adımlarını UI state ile ilişkilendirir. Network, server state ve geçici etkileşim state'ini ayırarak jank ve stale görünümün kök nedenini buldurur.",
    whyItMatters:
      "VTrade fiyat tablosu her tick'te bütün sayfayı render edip layout tetiklerse güçlü cihazda görünmeyen sorun mobilde input gecikmesine dönüşür. Daha fazla state eklemek veri sahipliğini ve repaint maliyetini gizleyebilir.",
    objectives: [
      "Render pipeline aşamalarının kullanıcı gecikmesine etkisini açıklamak.",
      "Server, URL, form ve ephemeral UI state sahipliğini ayırmak.",
      "DevTools ölçümüyle layout thrashing ve gereksiz render'ı teşhis etmek.",
    ],
    prerequisites: ["http-request-lifecycle"],
    related: [
      "react-state-ownership",
      "optimistic-ui-and-reconciliation",
      "web-performance-budgets",
      "observer-pattern",
    ],
    misconceptions: [
      "Her state değişikliği doğrudan tüm DOM'u yeniden oluşturur.",
      "React render sayısı tek başına performans hatasıdır; maliyet ve kullanıcı etkisi ölçülmelidir.",
    ],
    projectContexts: ["VTrade canlı fiyat ekranı", "TaskManagment board", "converter progress UI"],
    careerWeight: 4,
    patternWeight: 2,
    freshnessQueries: [
      "web.dev current rendering performance layout paint INP",
      "MDN browser rendering pipeline current guidance",
    ],
    sourceKeys: ["web-dev", "mdn-http"],
    seed: {
      openingCase:
        "VTrade WebSocket mesajı her 100 ms'de fiyatları günceller. Liste akıcı görünürken trade formuna yazmak gecikir; profiler tüm dashboard'un yeniden hesaplandığını gösterir.",
      predictionPrompt:
        "Bir elementin `top` değerini değiştirmek ile `transform` kullanmak render pipeline'ın hangi aşamalarını farklı tetikleyebilir?",
      mentalModel:
        "UI'ı tek resim değil, farklı maliyetlerde çalışan bir üretim hattı olarak düşün: hesapla, yerleştir, boya, katmanları birleştir. State kararı bu hattın ne kadarını tekrar çalıştırdığını belirler.",
      workedExample:
        "Canlı quote server cache'inde tutulur, seçili asset URL'dedir, input form state'indedir. Progress animasyonu transform ile compositor'da ilerler; fiyat güncellemesi input ağacını sahiplenmez.",
      labTask:
        "VTrade benzeri 200 satırlık canlı tablo kur; Performance ve React Profiler ile baseline al, state sahipliğini daralt ve INP/commit süresini önce-sonra karşılaştır.",
      doneWhen:
        "Optimizasyon ölçülen darboğazı azaltıyor, input state'i quote güncellemelerinden korunuyor ve veri doğruluğu bozulmuyorsa.",
      transferPrompt:
        "TaskManagment drag sırasında geçici konum ile server'da onaylanmış sıra nasıl ayrı tutulmalıdır?",
      reflectionPrompt:
        "Frontend state'lerinden hangisi aslında URL'nin veya server cache'inin kopyası?",
      diagram: {
        title: "State değişiminden piksele",
        nodes: ["State", "Render", "Layout", "Paint", "Composite"],
        edges: [
          { from: 0, to: 1, label: "UI hesapla" },
          { from: 1, to: 2, label: "geometri" },
          { from: 2, to: 3, label: "pikseller" },
          { from: 3, to: 4, label: "katmanlar" },
        ],
      },
      reviewQuestions: [
        "Layout ile paint arasındaki fark nedir?",
        "Server state'i yerel component state'ine kopyalamak hangi stale veri riskini yaratır?",
        "Performans optimizasyonundan önce hangi kullanıcı metriğini baseline almalısın?",
      ],
    },
  },
  {
    slug: "accessible-semantic-ui",
    title: "Semantik ve Erişilebilir Etkileşim Tasarımı",
    domain: "frontend",
    category: "Erişilebilirlik",
    difficulty: "foundation",
    summary:
      "Erişilebilirliği sonradan ARIA eklemek yerine doğru HTML semantiği, klavye akışı, focus yönetimi, isimlendirme ve durum geri bildirimiyle etkileşim sözleşmesinin parçası yapar.",
    whyItMatters:
      "TaskManagment kartı yalnız `div onClick` ise klavyeyle açılamaz; converter modalı focus'u arka sayfaya kaçırırsa ekran okuyucu kullanıcısı işlemi tamamlayamaz. Bunlar kozmetik değil işlev kaybıdır.",
    objectives: [
      "Native element ile özel widget arasındaki davranış farkını açıklamak.",
      "Klavye, focus ve accessible name akışını test etmek.",
      "Async başarı/hata durumlarını görsel olmayan kanallarda duyurmak.",
    ],
    prerequisites: ["browser-rendering-and-state"],
    related: [
      "react-state-ownership",
      "nextjs-server-client-boundaries",
      "web-performance-budgets",
      "state-pattern",
    ],
    misconceptions: [
      "ARIA eklemek yanlış HTML elementini otomatik olarak erişilebilir yapar.",
      "Erişilebilirlik yalnız ekran okuyucu içindir; klavye, motor ve bilişsel ihtiyaçları da kapsar.",
    ],
    projectContexts: ["TaskManagment board", "converter upload modalı", "VTrade emir formu"],
    careerWeight: 4,
    patternWeight: 1,
    freshnessQueries: [
      "web.dev current accessibility focus management dialogs",
      "MDN ARIA current first rule of ARIA",
    ],
    sourceKeys: ["web-dev", "react-docs"],
    seed: {
      openingCase:
        "Converter modalı açıldığında focus arkadaki upload düğmesinde kalır. Kullanıcı Tab ile görünmeyen sayfada dolaşır ve Escape hiçbir şey yapmaz; mouse testleri ise tamamen geçmiştir.",
      predictionPrompt:
        "Bir `div` elementine role=button vermek native `button` davranışlarından hangilerini kendiliğinden sağlamaz?",
      mentalModel:
        "Semantik HTML, tarayıcıyla kullanıcı arasındaki yerleşik protokoldür. Özel widget yazdığında yalnız görünümü değil klavye ve yardımcı teknoloji state machine'ini de yeniden uygulamayı üstlenirsin.",
      workedExample:
        "Upload modalı native dialog davranışına yakın kurulur: anlamlı başlık, açılışta kontrollü focus, içeride focus sırası, Escape ile kapanma ve kapanınca tetikleyiciye dönüş sağlanır.",
      labTask:
        "TaskManagment'ta kart açma ve kolonlar arası taşıma akışını yalnız klavyeyle tamamla; accessible tree, focus sırası ve async durum duyurusunu otomatik ve manuel test et.",
      doneWhen:
        "Mouse olmadan ana akış tamamlanıyor, focus kaybolmuyor, kontrollerin ad/rol/durumu okunuyor ve hata yalnız renkle anlatılmıyorsa.",
      transferPrompt:
        "VTrade fiyat düşüşünü yalnız kırmızı renkle göstermek yerine hangi semantik ve metinsel sinyalleri eklersin?",
      reflectionPrompt:
        "UI'daki hangi özel component native elementin ücretsiz sağladığı davranışları eksik taklit ediyor?",
      diagram: {
        title: "Erişilebilir kontrol sözleşmesi",
        nodes: ["Semantik element", "Accessible tree", "Klavye/focus", "Durum bildirimi", "Kullanıcı eylemi"],
        edges: [
          { from: 0, to: 1, label: "ad + rol" },
          { from: 1, to: 2, label: "gezilebilir" },
          { from: 2, to: 4, label: "etkileşim" },
          { from: 3, to: 4, label: "geri bildirim" },
        ],
      },
      reviewQuestions: [
        "Native button hangi klavye davranışlarını varsayılan sağlar?",
        "Modal kapanınca focus neden tetikleyiciye dönmelidir?",
        "Accessible name ile görünen label hangi durumlarda ayrışabilir?",
      ],
    },
  },
  {
    slug: "dependency-inversion-and-injection",
    title: "Dependency Inversion ve Dependency Injection",
    domain: "architecture",
    category: "SOLID ve Bağımlılık Yönetimi",
    difficulty: "foundation",
    summary:
      "Yüksek seviyeli iş politikasının veritabanı, HTTP istemcisi veya framework detayına bağımlı olmamasını sağlar. Dependency Inversion Principle yönü belirler; Dependency Injection ise bağımlılığı dışarıdan verme tekniğidir.",
    whyItMatters:
      "VTrade servisinin içinde doğrudan CoinGecko client ve ORM oluşturulursa fiyat politikası altyapı hatalarıyla iç içe geçer. Test doubles kolaylığı yan faydadır; ana kazanç iş kararının değişken detaylardan korunmasıdır.",
    objectives: [
      "DIP ile DI arasındaki ilke-teknik farkını açıklamak.",
      "Port'u tüketen iş ihtiyacına göre küçük bir interface olarak tasarlamak.",
      "Scope ve lifetime uyuşmazlığından doğan paylaşım hatalarını tanımak.",
    ],
    prerequisites: [],
    related: [
      "composition-root",
      "hexagonal-architecture",
      "adapter-pattern",
      "factory-pattern",
    ],
    misconceptions: [
      "Her sınıfa interface eklemek Dependency Inversion uygulamaktır.",
      "DI container kullanmak bağımlılık yönünü otomatik olarak doğru yapar.",
    ],
    projectContexts: ["VTrade fiyat ve emir servisleri", "code-review model provider'ları", "converter storage"],
    careerWeight: 5,
    patternWeight: 5,
    freshnessQueries: [
      "Microsoft dependency inversion dependency injection current architecture guidance",
      "TypeScript dependency injection composition root current patterns",
    ],
    sourceKeys: ["microsoft-architecture", "refactoring-guru"],
    seed: {
      openingCase:
        "Code-review use case'i constructor içinde DeepSeek SDK'sını oluşturur. Provider rate limit verdiğinde fallback eklemek için domain akışının her yerine SDK koşulları yayılır ve unit testler gerçek ağa bağlanır.",
      predictionPrompt:
        "`ReviewService -> DeepSeekClient` okunu ters çevirmek yalnız interface eklemekle mümkün mü? Interface'in hangi modülde tanımlanması gerektiğini söyle.",
      mentalModel:
        "Priz mental modelini kullan: cihaz duvardaki elektrik santralini bilmez, ihtiyacı olan sözleşmeyi bilir. Prizin şekline cihaz karar verir; adaptör altyapıda bu şekle uyar.",
      workedExample:
        "`ReviewGenerator` yalnız `generateReview(input): Promise<Review>` port'una bağımlıdır. DeepSeek ve fixture adapter'ları bu port'u uygular; seçim composition root'ta konfigürasyona göre yapılır.",
      labTask:
        "Code-review'da provider SDK import'larını use case katmanından çıkar; tüketici odaklı bir port tanımla, gerçek adapter ve deterministik fake ile timeout/başarı testleri yaz.",
      doneWhen:
        "İş akışı provider paketini import etmiyor, provider değişimi use case kodunu değiştirmiyor ve lifetime seçimi composition root'ta görünüyorsa.",
      transferPrompt:
        "converter'da LibreOffice process runner için port sınırı hangi veriyi almalı, hangi OS detayını sızdırmamalıdır?",
      reflectionPrompt:
        "Interface'lerin gerçekten iş politikasını mı koruyor, yoksa somut sınıfların birebir kopyası mı?",
      diagram: {
        title: "Bağımlılığın politikaya dönmesi",
        nodes: ["Use case", "İş port'u", "HTTP adapter", "SDK", "Composition root"],
        edges: [
          { from: 0, to: 1, label: "ihtiyacı tanımlar" },
          { from: 2, to: 1, label: "uygular" },
          { from: 2, to: 3, label: "detayı kullanır" },
          { from: 4, to: 0, label: "bağlar" },
        ],
      },
      reviewQuestions: [
        "Dependency Inversion ile Dependency Injection arasındaki fark nedir?",
        "Port interface'i neden altyapı paketinde değil tüketen politika tarafında olmalıdır?",
        "Singleton adapter'a request-scoped bağımlılık vermek hangi hatayı doğurabilir?",
      ],
    },
  },
  {
    slug: "composition-root",
    title: "Composition Root ve Uygulama Kablolaması",
    domain: "architecture",
    category: "Nesne Kompozisyonu",
    difficulty: "intermediate",
    summary:
      "Uygulamanın somut bağımlılıklarının seçildiği, konfigürasyonun doğrulandığı ve object graph'in kurulduğu tek, görünür başlangıç sınırını tasarlar.",
    whyItMatters:
      "converter'da güvenli validator yazılmış olsa bile production router eski validator'ı bağlıyorsa koruma çalışmaz. Dağınık `new` ve service locator kullanımı active execution path'i izlemeyi zorlaştırır.",
    objectives: [
      "Object graph kurulumunu iş akışından ayırmak.",
      "Startup sırasında eksik configuration için fail-closed davranış kurmak.",
      "Aynı port için production ve test adapter seçimlerini görünür yapmak.",
    ],
    prerequisites: ["dependency-inversion-and-injection"],
    related: ["factory-pattern", "hexagonal-architecture", "container-build-security"],
    misconceptions: [
      "DI container'a her yerden erişmek composition root'tur.",
      "Kablolama kodu test edilmeye değmez; oysa güvenlik kontrolünün aktif olup olmadığını belirler.",
    ],
    projectContexts: ["converter route-worker wiring", "VTrade API başlangıcı", "code-review CLI"],
    careerWeight: 4,
    patternWeight: 5,
    freshnessQueries: [
      "composition root dependency injection current architecture",
      "Microsoft options startup validation current guidance",
    ],
    sourceKeys: ["microsoft-architecture", "refactoring-guru"],
    seed: {
      openingCase:
        "Converter'da yeni malware scanner adapter'ı yazılır ve unit testleri geçer; fakat production entrypoint eski router'ı kurduğu için hiçbir upload taranmaz. Dosyanın varlığı çalışan koruma değildir.",
      predictionPrompt:
        "Aynı interface için iki implementation register edilirse hangi adapter'ın çalıştığını kod okumadan kanıtlayabileceğin bir test nasıl olur?",
      mentalModel:
        "Composition root tiyatronun kulisidir: oyuncular rollerini sahnede seçmez; kadro, dekor ve bağlantılar perde açılmadan burada kurulur. Sahne iş davranışına odaklanır.",
      workedExample:
        "API başlangıcında environment şeması parse edilir, PostgreSQL repository, scanner ve queue adapter'ı oluşturulur; upload use case'e constructor üzerinden verilir. Eksik scanner key uygulamayı başlatmaz.",
      labTask:
        "Converter'ın entrypoint'inden gerçek upload route'una kadar object graph'i çıkar; duplicate router'ı kaldırmadan önce hangi yolun production'da aktif olduğunu HTTP smoke testiyle belirle.",
      doneWhen:
        "Somut adapter seçimi tek yerde, startup config doğrulaması fail-closed ve kritik wiring gerçek entrypoint üzerinden test ediliyorsa.",
      transferPrompt:
        "Code-review CLI ve VS Code uzantısı aynı use case'i farklı UI adapter'larıyla nasıl compose edebilir?",
      reflectionPrompt:
        "Repoda oluşturulduğu yeri bulmak için global arama gerektiren hangi bağımlılık composition root dışına kaçmış?",
      diagram: {
        title: "Tek kompozisyon sınırı",
        nodes: ["Config", "Composition root", "Adapter'lar", "Use case", "Entrypoint"],
        edges: [
          { from: 0, to: 1, label: "validate" },
          { from: 1, to: 2, label: "oluştur" },
          { from: 2, to: 3, label: "inject" },
          { from: 1, to: 4, label: "başlat" },
        ],
      },
      reviewQuestions: [
        "Service locator neden bağımlılıkları tekrar gizler?",
        "Startup validation hangi güvenlik konfigürasyonlarında fail closed olmalıdır?",
        "Wiring testini helper yerine gerçek entrypoint'ten geçirmek neden önemlidir?",
      ],
    },
  },
  {
    slug: "strategy-pattern",
    title: "Strategy Pattern: Değişen Politikayı Ayırmak",
    domain: "architecture",
    category: "Behavioral Pattern",
    difficulty: "foundation",
    summary:
      "Aynı amaca ulaşan değiştirilebilir algoritmaları ortak bir davranış sözleşmesinin arkasına alır. Koşullu dallanmayı yok etmekten çok, değişimin eksenini isimlendirmeyi hedefler.",
    whyItMatters:
      "VTrade fee hesabı asset, kullanıcı planı ve kampanyaya göre büyüyen switch'e dönüşürse her yeni politika mevcut akışı riske atar. Strategy doğru sınırda kurulduğunda seçim ile hesaplama ayrı test edilir.",
    objectives: [
      "Gerçek bir algoritma ailesini tesadüfi benzerlikten ayırmak.",
      "Strategy sözleşmesinin precondition ve sonucunu tanımlamak.",
      "Seçim mantığı ile strateji davranışını bağımsız test etmek.",
    ],
    prerequisites: ["dependency-inversion-and-injection"],
    related: ["state-pattern", "factory-pattern", "specification-pattern"],
    misconceptions: [
      "Her if/else bloğu Strategy ile değiştirilmelidir.",
      "Strategy seçiminin kendisi yok olur; yalnız ayrı bir policy/factory sınırına taşınır.",
    ],
    projectContexts: ["VTrade fee ve order execution", "code-review provider seçimi", "converter format politikası"],
    careerWeight: 5,
    patternWeight: 5,
    freshnessQueries: [
      "Refactoring Guru strategy TypeScript current example",
      "strategy pattern policy selection architecture current",
    ],
    sourceKeys: ["refactoring-guru"],
    seed: {
      openingCase:
        "VTrade fee fonksiyonuna VIP, kampanya, market order ve yeni asset türleri eklendikçe tek switch yirmi dala çıkar. Bir dal düzeltilirken başka bir müşteri grubunun rounding politikası bozulur.",
      predictionPrompt:
        "Fee hesabında hangi bilgi algoritmanın girdisi, hangisi doğru Strategy'yi seçen context bilgisidir? Sınırı çiz.",
      mentalModel:
        "Strategy aynı aracın değiştirilebilir rotasıdır: hedef ve kontrol paneli sabit, yolu hesaplayan politika değişir. Her rota aynı güvenlik sözleşmesine uymalıdır.",
      workedExample:
        "`FeePolicy.calculate(TradeQuote)` decimal para döndürür. `StandardFee`, `VipFee` ve `PromotionFee` ayrı hesaplar; `FeePolicySelector` yalnız doğrulanmış hesap planına göre seçer.",
      labTask:
        "VTrade'de iki gerçek fee politikası ve bir seçim policy'si çıkar; mevcut örnekler yanında boundary quantity ve rounding contract testleri ekle.",
      doneWhen:
        "Yeni fee algoritması ana trade use case'ini değiştirmeden ekleniyor, tüm stratejiler ortak invariant testlerinden geçiyor ve seçim tek yerdeyse.",
      transferPrompt:
        "Code-review'da hızlı ve derin inceleme modları Strategy midir, yoksa yalnız farklı konfigürasyon mudur? Karar ölçütünü uygula.",
      reflectionPrompt:
        "Ayırdığın davranış gerçekten bağımsız değişiyor mu, yoksa pattern eklemek için mi interface oluşturdun?",
      diagram: {
        title: "Politika seçimi ve yürütme",
        nodes: ["Context", "Selector", "Strategy port", "Policy A", "Policy B"],
        edges: [
          { from: 0, to: 1, label: "seçim verisi" },
          { from: 1, to: 3, label: "A'yı seç" },
          { from: 1, to: 4, label: "B'yi seç" },
          { from: 3, to: 2, label: "sözleşme" },
          { from: 4, to: 2, label: "sözleşme" },
        ],
      },
      reviewQuestions: [
        "Strategy için uygun değişim ekseni nasıl anlaşılır?",
        "Strategy ile basit parameterization ne zaman ayrışır?",
        "Tüm stratejilerin uyması gereken ortak invariant'lar nasıl test edilir?",
      ],
    },
  },
  {
    slug: "adapter-pattern",
    title: "Adapter Pattern: Sınırdaki Dili Çevirmek",
    domain: "architecture",
    category: "Structural Pattern",
    difficulty: "foundation",
    summary:
      "Harici veya eski bir sözleşmeyi uygulamanın ihtiyaç duyduğu porta çevirir. Adapter yalnız method adını değil birim, hata, zaman ve güvenilirlik semantiğini de dönüştürür.",
    whyItMatters:
      "CoinGecko fiyatı string USD ve epoch saniye döndürürken VTrade decimal TRY ve freshness bilgisi bekleyebilir. SDK tipini domain'e taşımak provider değişimini ve yanlış birim kullanımını tüm sisteme yayar.",
    objectives: [
      "Provider modeli ile domain modeli arasındaki semantik farkı haritalamak.",
      "Harici hata ve timeout'ları kontrollü iç hata taksonomisine çevirmek.",
      "Adapter contract testini kaydedilmiş sınır örnekleriyle kurmak.",
    ],
    prerequisites: ["dependency-inversion-and-injection", "runtime-boundary-validation"],
    related: ["anti-corruption-layer", "hexagonal-architecture", "strategy-pattern"],
    misconceptions: [
      "Adapter yalnız property isimlerini yeniden adlandıran mapper'dır.",
      "Harici SDK nesnesini doğrudan döndürmek daha az kod olduğu için daha iyi soyutlamadır.",
    ],
    projectContexts: ["VTrade market provider", "code-review DeepSeek adapter'ı", "converter LibreOffice runner"],
    careerWeight: 5,
    patternWeight: 5,
    freshnessQueries: [
      "Refactoring Guru adapter TypeScript current example",
      "DeepSeek API current error response rate limits",
    ],
    sourceKeys: ["refactoring-guru", "deepseek-docs"],
    seed: {
      openingCase:
        "VTrade ikinci fiyat provider'ına geçer. Eski provider timestamp'i saniye, yenisi milisaniye döndürür; doğrudan DTO kullanan freshness kontrolü yeni fiyatları günlerce eski sanır.",
      predictionPrompt:
        "Adapter yalnız shape dönüştürüp provider'ın rate-limit hatasını generic exception yaparsa hangi önemli karar bilgisi kaybolur?",
      mentalModel:
        "Adapter sınır kapısındaki tercümandır: kelimeleri değil anlamı ve yerel kuralları çevirir. İçeride yabancı provider lehçesi duyulmamalıdır.",
      workedExample:
        "`MarketQuotePort.getQuote(symbol)` domain `Quote` döndürür. Adapter string fiyatı kontrollü decimal'e, epoch'u Instant'a çevirir; 429'u retryable ve bozuk payload'ı permanent upstream error yapar.",
      labTask:
        "VTrade için iki farklı fixture payload'ı destekleyen provider adapter'ları yaz; birim, timestamp, eksik alan, 429 ve timeout contract testlerini ortak suite'te çalıştır.",
      doneWhen:
        "Use case provider DTO/SDK import etmiyor, semantik dönüşümler tek sınırda ve bozuk upstream verisi domain'e ulaşmadan reddediliyorsa.",
      transferPrompt:
        "LibreOffice exit code ve stderr çıktısını converter domain'inde hangi küçük sonuç modeline çevirirsin?",
      reflectionPrompt:
        "Hangi harici tip şu anda uygulamanın iç katmanlarında gereğinden fazla dolaşıyor?",
      diagram: {
        title: "Yabancı sözleşmeden iç porta",
        nodes: ["Use case", "Domain port", "Adapter", "Provider SDK", "Harici API"],
        edges: [
          { from: 0, to: 1, label: "ihtiyaç" },
          { from: 2, to: 1, label: "uygular" },
          { from: 2, to: 3, label: "çevirir" },
          { from: 3, to: 4, label: "çağırır" },
        ],
      },
      reviewQuestions: [
        "Adapter ile basit mapper arasındaki semantik fark nedir?",
        "Provider hata taksonomisi neden doğrudan domain'e sızmamalıdır?",
        "Timestamp ve para birimi dönüşümü hangi testlerle korunur?",
      ],
    },
  },
  {
    slug: "factory-pattern",
    title: "Factory Pattern: Geçerli Nesne Üretimini Merkezileştirmek",
    domain: "architecture",
    category: "Creational Pattern",
    difficulty: "intermediate",
    summary:
      "Nesne oluşturma kararı invariant, alt tip veya environment politikasına bağlı olduğunda geçerli ve tam kurulmuş örnek üretimini tek noktada toplar.",
    whyItMatters:
      "VTrade order'ı farklı controller ve worker'larda doğrudan oluşturulursa fee snapshot, idempotency key veya başlangıç state'i unutulabilir. Factory geçersiz ara nesnenin temsil edilmesini engeller.",
    objectives: [
      "Constructor'ın yeterli olduğu durumla factory gerektiren durumu ayırmak.",
      "Creation invariant'larını tek atomik üretim işleminde korumak.",
      "Simple factory, factory method ve abstract factory niyetlerini ayırt etmek.",
    ],
    prerequisites: ["dependency-inversion-and-injection"],
    related: ["composition-root", "strategy-pattern", "state-pattern"],
    misconceptions: [
      "Her `new` ifadesi factory arkasına alınmalıdır.",
      "Factory global service locator gibi bütün bağımlılıkları gizlemelidir.",
    ],
    projectContexts: ["VTrade order üretimi", "code-review provider kurulumu", "converter job oluşturma"],
    careerWeight: 4,
    patternWeight: 5,
    freshnessQueries: [
      "Refactoring Guru factory method TypeScript current example",
      "factory pattern domain invariant creation guidance",
    ],
    sourceKeys: ["refactoring-guru", "microsoft-architecture"],
    seed: {
      openingCase:
        "Converter HTTP route'u job'ı `queued` ve attempt=0 ile kurar; retry endpoint'i status alanını unutunca undefined job worker tarafından sonsuza kadar yeniden alınır.",
      predictionPrompt:
        "Bir constructor on parametre istiyorsa sorun mutlaka Factory eksikliği midir, yoksa nesnenin fazla sorumluluğu olduğuna mı işaret eder?",
      mentalModel:
        "Factory kalite kontrol kapısıdır: parçaları seçip yalnız çalışmaya hazır ürünü banttan çıkarır. Bozuk yarı ürün dışarı sızmamalıdır.",
      workedExample:
        "`Order.createBuy(user, quote, quantity, idempotencyKey)` toplamı trusted quote'tan hesaplar, expiry kontrol eder ve yalnız `Pending` state'li geçerli Order veya domain error döndürür.",
      labTask:
        "VTrade'de order oluşturulan tüm yolları bul; creation invariant'larını bir factory'ye taşı ve eksik quote, expired quote, invalid quantity için test yaz.",
      doneWhen:
        "Geçersiz veya eksik başlangıç state'li Order doğrudan üretilemiyor ve persistence rehydration ile yeni creation yolu açıkça ayrılmışsa.",
      transferPrompt:
        "Code-review'da provider adapter ailesini environment'a göre kurmak domain factory mi, composition root factory'si mi olmalıdır?",
      reflectionPrompt:
        "Factory eklemek nesne üretim kuralını mı görünür yaptı, yoksa yalnız `new` kelimesini başka dosyaya mı taşıdı?",
      diagram: {
        title: "Girdiden geçerli aggregate'e",
        nodes: ["Ham creation input", "Factory", "Invariant kontrolü", "Geçerli nesne", "Domain error"],
        edges: [
          { from: 0, to: 1, label: "oluştur isteği" },
          { from: 1, to: 2, label: "normalize + doğrula" },
          { from: 2, to: 3, label: "başarılı" },
          { from: 2, to: 4, label: "reddet" },
        ],
      },
      reviewQuestions: [
        "Constructor yerine factory kullanmayı hangi creation invariant'ı gerekçelendirir?",
        "Rehydration ile yeni nesne oluşturma neden farklı yollar olabilir?",
        "Factory'nin service locator'a dönüşmesini nasıl önlersin?",
      ],
    },
  },
  {
    slug: "decorator-pattern",
    title: "Decorator Pattern: Davranışı Katmanlamak",
    domain: "architecture",
    category: "Structural Pattern",
    difficulty: "intermediate",
    summary:
      "Aynı sözleşmeyi koruyarak bir nesnenin çevresine cache, metric, authorization veya retry gibi çapraz davranışlar ekler. Katman sırasının observable semantiği değiştirdiğini özellikle vurgular.",
    whyItMatters:
      "Code-review provider'ına retry, telemetry ve cache ayrı ayrı eklendiğinde yanlış sıra timeout bütçesini katlayabilir veya cache hit'lerini metric dışında bırakabilir. Kompozisyon sırası mimari karardır.",
    objectives: [
      "Decorator'ın wrapped port ile aynı sözleşmeyi korumasını sağlamak.",
      "Katman sırasının timeout, cache ve telemetry sonuçlarını analiz etmek.",
      "Decorator ile middleware/proxy kullanım bağlamlarını ayırmak.",
    ],
    prerequisites: ["dependency-inversion-and-injection"],
    related: ["retries-timeouts-and-backoff", "observability-traces-and-context", "strategy-pattern"],
    misconceptions: [
      "Decorator sırası sonucu değiştirmez.",
      "Her cross-cutting concern global middleware olmalıdır; domain port'una özgü semantik orada kaybolabilir.",
    ],
    projectContexts: ["code-review provider zinciri", "VTrade quote cache", "TaskManagment repository metrics"],
    careerWeight: 4,
    patternWeight: 5,
    freshnessQueries: [
      "Refactoring Guru decorator TypeScript current example",
      "AWS timeout retry budget decorator ordering",
    ],
    sourceKeys: ["refactoring-guru", "aws-builders-library"],
    seed: {
      openingCase:
        "Code-review çağrısı üç retry'ın her birinde 30 saniyelik timeout kullanır. Dıştaki timeout decorator'ı yoksa kullanıcı 90 saniye bekler; metric yalnız son denemeyi ölçerse gerçek maliyet görünmez.",
      predictionPrompt:
        "`Cache(Metrics(Provider))` ile `Metrics(Cache(Provider))` hangi latency ve cache-hit gözlemlerini farklı üretir?",
      mentalModel:
        "Decorator iç içe kutulardır: çağrı dıştan içe, sonuç içten dışa geçer. Her kutu aynı etiketi taşır ama geçiş sırası davranışın parçasıdır.",
      workedExample:
        "`Tracing(Retry(Timeout(DeepSeekAdapter)))` zincirinde tek trace tüm operation'ı, retry child attempt'leri, her attempt ayrı timeout'u kapsar; toplam deadline ayrıca üst seviyede korunur.",
      labTask:
        "Code-review provider port'una fake clock ile timeout, iki retry ve metric decorator'ları ekle; iki farklı sıranın attempt sayısı ve ölçülen süre etkisini test et.",
      doneWhen:
        "Decorator'lar aynı port'u koruyor, sıralama composition root'ta okunuyor ve toplam süre/attempt metric'leri failure testleriyle doğrulanıyorsa.",
      transferPrompt:
        "VTrade quote cache'inde freshness kontrolü cache decorator'ının içinde mi dışında mı olmalı? Eski fiyat riskine göre savun.",
      reflectionPrompt:
        "Çapraz davranış katmanlarının sırası şu anda kasıtlı mı, framework registration sırasının tesadüfü mü?",
      diagram: {
        title: "Decorator çağrı zinciri",
        nodes: ["Use case", "Tracing", "Retry", "Timeout", "Provider"],
        edges: [
          { from: 0, to: 1, label: "operation" },
          { from: 1, to: 2, label: "izle" },
          { from: 2, to: 3, label: "attempt" },
          { from: 3, to: 4, label: "deadline" },
        ],
      },
      reviewQuestions: [
        "Decorator neden wrapped nesneyle aynı sözleşmeyi uygulamalıdır?",
        "Retry ile timeout sırası toplam bekleme süresini nasıl değiştirir?",
        "Cache metric'lerinin katman sırasından etkilenmesine bir örnek ver.",
      ],
    },
  },
  {
    slug: "observer-pattern",
    title: "Observer Pattern: Değişimi Abonelere Bildirmek",
    domain: "architecture",
    category: "Behavioral Pattern",
    difficulty: "intermediate",
    summary:
      "Bir kaynaktaki değişimi, onu dinleyen birden çok bağımlı davranışa doğrudan isimlerini bilmeden bildirir. Senkron in-process observer ile durable mesajlaşmayı aynı şey sanmamayı öğretir.",
    whyItMatters:
      "TaskManagment görevi tamamlanınca notification, audit ve metric tetiklenebilir. Observer coupling'i azaltır; fakat bir subscriber exception'ının ana işlemi bozup bozmayacağı ve event kaybı açıkça kararlaştırılmalıdır.",
    objectives: [
      "Publisher-subscriber yaşam döngüsünü ve abonelik temizliğini yönetmek.",
      "Senkron observer failure semantiğini açıkça belirlemek.",
      "In-process event ile broker mesajı arasındaki durability farkını açıklamak.",
    ],
    prerequisites: ["dependency-inversion-and-injection"],
    related: ["domain-events", "transactional-outbox-pattern", "messaging-delivery-semantics"],
    misconceptions: [
      "Observer kullanınca olaylar otomatik olarak kalıcı ve dağıtık olur.",
      "Subscriber sırası önemsizdir; paylaşılan mutable state varsa gizli coupling oluşur.",
    ],
    projectContexts: ["TaskManagment görev olayları", "VTrade fiyat UI'ı", "converter progress bildirimi"],
    careerWeight: 4,
    patternWeight: 5,
    freshnessQueries: [
      "Refactoring Guru observer TypeScript current example",
      "React external store subscription current guidance",
    ],
    sourceKeys: ["refactoring-guru", "react-docs"],
    seed: {
      openingCase:
        "Task tamamlanır, ilk observer audit yazar; ikinci observer email gönderirken exception fırlatır. API 500 döner ama task commit olmuştur. Kullanıcı retry yapınca ikinci completion olayı oluşur.",
      predictionPrompt:
        "Subscriber'lardan biri başarısız olduğunda publisher'ın transaction'ı rollback olmalı mı? Audit, email ve invariant güncellemesi için ayrı karar ver.",
      mentalModel:
        "Observer zil ve dinleyenlerdir: zil kimin duyduğunu bilmez. Ancak zil yalnız odadayken çalıyorsa sonradan gelen dinleyici olayı kaçırır; durability ayrı mekanizmadır.",
      workedExample:
        "UI store observer'ları senkron snapshot günceller ve unsubscribe olur. TaskCompleted domain event'i ise transaction sonrasında outbox'a taşınır; email hatası task commit'ini geri almaz.",
      labTask:
        "TaskManagment'ta completion için iki subscriber kur; birinin hata verdiği, iki kez subscribe olduğu ve unsubscribe edilmediği testlerde çağrı sayısı ve ana işlem sonucunu gözle.",
      doneWhen:
        "Abonelik yaşam döngüsü sızıntısız, subscriber hata politikası belgeli/testli ve durable gereken olaylar Observer ile karıştırılmıyorsa.",
      transferPrompt:
        "VTrade fiyat akışında yavaş bir subscriber publisher'ı bloke ederse backpressure nerede uygulanabilir?",
      reflectionPrompt:
        "Event kullandığın yerde gerçek gevşek bağlılık mı var, yoksa sadece görünmez kontrol akışı mı oluşturdun?",
      diagram: {
        title: "Publisher ve gözlemciler",
        nodes: ["Publisher", "Observer A", "Observer B", "Observer C", "Unsubscribe"],
        edges: [
          { from: 0, to: 1, label: "notify" },
          { from: 0, to: 2, label: "notify" },
          { from: 0, to: 3, label: "notify" },
          { from: 3, to: 4, label: "yaşam döngüsü" },
        ],
      },
      reviewQuestions: [
        "Observer ile message broker arasındaki durability farkı nedir?",
        "Subscriber exception'ı ana işlemi ne zaman etkilemelidir?",
        "Unsubscribe edilmemiş observer hangi işlevsel ve bellek sorunlarını doğurur?",
      ],
    },
  },
  {
    slug: "command-pattern",
    title: "Command Pattern: Niyeti Birinci Sınıf Nesne Yapmak",
    domain: "architecture",
    category: "Behavioral Pattern",
    difficulty: "intermediate",
    summary:
      "Bir değişiklik niyetini verisi, doğrulama sınırı ve yürütme politikasıyla temsil eder. Queue, audit, retry ve authorization için çağrıyı doğrudan method invocation'dan ayırır.",
    whyItMatters:
      "VTrade `Buy` isteğinin kullanıcı niyetini price snapshot, sonuç veya DB entity ile karıştırırsa replay ve audit güvenilmez olur. Command ne istendiğini söyler; server sonucu güvenilir veriden üretir.",
    objectives: [
      "Command, query ve event semantiğini ayırmak.",
      "Command payload'ını minimum kullanıcı niyetiyle sınırlandırmak.",
      "Handler çevresinde authorization, transaction ve idempotency sırasını tasarlamak.",
    ],
    prerequisites: ["runtime-boundary-validation", "dependency-inversion-and-injection"],
    related: ["cqrs-pattern", "state-pattern", "idempotent-api-commands", "saga-pattern"],
    misconceptions: [
      "Her DTO bir Command'dır.",
      "Command sonucu istemciden gelen türetilmiş alanları güvenilir hale getirir.",
    ],
    projectContexts: ["VTrade Buy/Sell", "TaskManagment MoveTask", "converter StartConversion"],
    careerWeight: 5,
    patternWeight: 5,
    freshnessQueries: [
      "Refactoring Guru command TypeScript current example",
      "Microsoft CQRS command validation current guidance",
    ],
    sourceKeys: ["refactoring-guru", "microsoft-architecture"],
    seed: {
      openingCase:
        "VTrade mobil istemcisi Buy payload'ında `newBalance` ve `pricePerUnit` yollar. Handler DTO'yu entity'ye map edip kaydeder; kullanıcı proxy ile fiyatı değiştirerek bedelsiz asset alır.",
      predictionPrompt:
        "Buy Command hangi alanları kullanıcının niyeti olarak taşımalı, hangi alanları server yeniden türetmelidir?",
      mentalModel:
        "Command mühürlü iş emridir: 'ne yapılması istendiğini' taşır, 'sonucun ne olduğunu' değil. Yetkili handler emri mevcut gerçekliğe göre kabul eder veya reddeder.",
      workedExample:
        "`BuyAsset { assetId, quantity, quoteId, idempotencyKey }` handler'a gelir. Handler principal'ı request context'ten, fiyatı trusted quote store'dan, toplamı money policy'den alır.",
      labTask:
        "VTrade Buy endpoint sözleşmesini server-authoritative command'a indir; handler pipeline'ında parse, authz, idempotency, transaction ve event üretim sırasını test et.",
      doneWhen:
        "İstemci finansal sonucu belirleyen alan gönderemiyor, command loglanabilir/replay edilebilir ama secret içermiyor ve tek handler net transaction sınırına sahipse.",
      transferPrompt:
        "TaskManagment `MoveTask` command'ı yalnız hedef index mi, beklenen board version'ını da mı taşımalıdır? Concurrency açısından düşün.",
      reflectionPrompt:
        "Request modellerinden hangileri kullanıcı niyeti yerine server state'inin kopyasını kabul ediyor?",
      diagram: {
        title: "Command işleme hattı",
        nodes: ["İstemci niyeti", "Command", "Pipeline", "Handler", "Domain sonucu"],
        edges: [
          { from: 0, to: 1, label: "minimum payload" },
          { from: 1, to: 2, label: "validate + authorize" },
          { from: 2, to: 3, label: "execute" },
          { from: 3, to: 4, label: "server üretir" },
        ],
      },
      reviewQuestions: [
        "Command ile event arasındaki zaman ve niyet farkı nedir?",
        "Server-authoritative command hangi alanları kabul etmemelidir?",
        "Authorization ve idempotency handler pipeline'ında neden açık sıraya ihtiyaç duyar?",
      ],
    },
  },
  {
    slug: "state-pattern",
    title: "State Pattern: Duruma Bağlı Davranışı Modellemek",
    domain: "architecture",
    category: "Behavioral Pattern",
    difficulty: "intermediate",
    summary:
      "Bir nesnenin izin verilen davranışlarını mevcut yaşam döngüsü durumuna göre ayrı state nesnelerinde toplar; dağınık status kontrollerini açık geçiş grafiğine dönüştürür.",
    whyItMatters:
      "Converter job `Succeeded` olduktan sonra timeout yüzünden retry edilirse aynı output üzerine yazabilir. String enum durum adını tutar ama hangi geçişin yasal olduğunu ve yan etkisini kendiliğinden korumaz.",
    objectives: [
      "Durum, geçiş, guard ve yan etkiyi state machine olarak ifade etmek.",
      "State Pattern gerektiren davranış çeşitliliğini basit enum'dan ayırmak.",
      "Geçersiz ve eşzamanlı geçişleri test etmek.",
    ],
    prerequisites: ["strategy-pattern", "command-pattern"],
    related: ["factory-pattern", "saga-pattern", "durable-background-jobs"],
    misconceptions: [
      "Status enum tanımlamak State Pattern uygulamaktır.",
      "State nesneleri persistence state'ini otomatik olarak concurrency-safe yapar.",
    ],
    projectContexts: ["converter job yaşam döngüsü", "VTrade order", "TaskManagment task workflow"],
    careerWeight: 4,
    patternWeight: 5,
    freshnessQueries: [
      "Refactoring Guru state TypeScript current example",
      "state machine optimistic concurrency current patterns",
    ],
    sourceKeys: ["refactoring-guru", "microsoft-architecture"],
    seed: {
      openingCase:
        "İki converter worker aynı job'ı alır. Biri `Succeeded`, diğeri geç gelen hata ile `Failed` yazar; terminal durum geriye gitmiş ve doğru dosya silinmiştir.",
      predictionPrompt:
        "Queued -> Running -> Succeeded akışında cancel isteği her state'te aynı sonucu mu vermeli? Geçiş tablosunu doldur.",
      mentalModel:
        "State bir metro haritasıdır: bulunduğun istasyon hangi hatlara binebileceğini belirler. İstasyon adı tek başına yetmez; izinli yollar ve atomik bilet kontrolü gerekir.",
      workedExample:
        "`RunningJob.complete(output)` Succeeded üretir, `SucceededJob.retry()` reddeder. DB update `WHERE id=? AND version=? AND status='running'` ile geçişi concurrency altında atomik korur.",
      labTask:
        "Converter için geçiş tablosu yaz, terminal state ve retry/cancel kurallarını modele taşı; iki worker'ın yarıştığı integration testinde version kontrolü uygula.",
      doneWhen:
        "Her public işlem state'e göre açık davranıyor, geçersiz geçiş temsil/test ediliyor ve DB'de stale worker terminal state'i ezemiyorsa.",
      transferPrompt:
        "VTrade limit order için Pending, PartiallyFilled, Filled ve Cancelled geçişlerinde quantity invariant'ı nasıl değişir?",
      reflectionPrompt:
        "Kodundaki status kontrolleri gerçek davranış mı seçiyor, yoksa yalnız UI etiketi mi belirliyor?",
      diagram: {
        title: "Converter job geçişleri",
        nodes: ["Queued", "Running", "Succeeded", "Failed", "Cancelled"],
        edges: [
          { from: 0, to: 1, label: "claim" },
          { from: 1, to: 2, label: "complete" },
          { from: 1, to: 3, label: "fail" },
          { from: 0, to: 4, label: "cancel" },
          { from: 3, to: 0, label: "retry policy" },
        ],
      },
      reviewQuestions: [
        "State Pattern ile Strategy Pattern arasındaki seçim farkı nedir?",
        "Enum neden izinli geçişleri tek başına korumaz?",
        "Optimistic concurrency state transition'ı nasıl güvenceye alır?",
      ],
    },
  },
  {
    slug: "specification-pattern",
    title: "Specification Pattern: İş Kurallarını Birleştirmek",
    domain: "architecture",
    category: "Domain Pattern",
    difficulty: "intermediate",
    summary:
      "Bir adayın belirli iş ölçütünü karşılayıp karşılamadığını isimli, birleştirilebilir ve test edilebilir bir kural olarak ifade eder; aynı kuralın karar ve sorgu biçimleri arasındaki farkı görünür kılar.",
    whyItMatters:
      "TaskManagment filtreleri controller, repository ve UI'da farklı uygulanırsa kullanıcı ekranda gördüğü görevi update edemeyebilir. Specification ortak dili güçlendirir; fakat in-memory predicate ile SQL çevirisinin eşdeğerliği garanti edilmelidir.",
    objectives: [
      "İsimli iş kriterlerini AND, OR ve NOT ile güvenli birleştirmek.",
      "Selection specification ile validation/invariant kuralını ayırmak.",
      "In-memory ve persistence yorumlarının semantik sapmasını test etmek.",
    ],
    prerequisites: ["runtime-boundary-validation", "relational-modeling-and-constraints"],
    related: ["repository-pattern", "object-level-authorization", "strategy-pattern"],
    misconceptions: [
      "Her boolean helper Specification olmalıdır.",
      "JavaScript predicate'i SQL'e çevirmek her zaman aynı null, timezone ve collation semantiğini verir.",
    ],
    projectContexts: ["TaskManagment task filtreleri", "VTrade uygun order seçimi", "code-review finding policy"],
    careerWeight: 4,
    patternWeight: 5,
    freshnessQueries: [
      "Specification pattern domain driven design current guidance",
      "PostgreSQL null collation predicate semantics current",
    ],
    sourceKeys: ["patterns-of-eaa", "microsoft-architecture"],
    seed: {
      openingCase:
        "TaskManagment UI 'gecikmiş ve bana atanmış' görevleri yerel saatle filtreler; backend UTC ve farklı null kuralı kullanır. Sayı görünürken export sonucu başka çıkar.",
      predictionPrompt:
        "`Overdue AND AssignedToMe` kuralında dueDate null ise sonuç ne olmalı? Bu kararın JS ve SQL'de aynı olduğunu nasıl kanıtlarsın?",
      mentalModel:
        "Specification yeniden kullanılabilir bir elek gibidir: hangi tanenin geçtiğini iş diliyle tanımlar. Eleği farklı makinelerde çalıştırırsan delik ölçülerinin aynı kaldığını test etmelisin.",
      workedExample:
        "`VisibleTasksFor(principal).and(OverdueAt(now))` repository sorgusuna çevrilir. `now` dışarıdan sabit verilir; tenant filtresi her kombinasyonda zorunlu taban specification olarak kalır.",
      labTask:
        "TaskManagment için üç birleştirilebilir filtre çıkar; null due date, timezone sınırı ve tenant isolation örneklerini hem in-memory evaluator hem gerçek PostgreSQL sorgusunda çalıştır.",
      doneWhen:
        "Kural adları domain dilini taşıyor, birleşimler tenant filtresini düşüremiyor ve iki evaluation yolu aynı fixture sonuçlarını veriyorsa.",
      transferPrompt:
        "Code-review bulgularında 'yüksek güvenli ve security kategorili' seçim kuralı Specification için uygun mu? Değişim ihtiyacına göre değerlendir.",
      reflectionPrompt:
        "Birleştirilebilirlik gerçekten kullanılıyor mu, yoksa okunabilir bir fonksiyon yeterli olur muydu?",
      diagram: {
        title: "Specification kompozisyonu",
        nodes: ["Tenant görünürlüğü", "Gecikmiş", "Bana atanmış", "AND birleşimi", "Sorgu/adayı değerlendir"],
        edges: [
          { from: 0, to: 3, label: "zorunlu" },
          { from: 1, to: 3, label: "koşul" },
          { from: 2, to: 3, label: "koşul" },
          { from: 3, to: 4, label: "evaluate" },
        ],
      },
      reviewQuestions: [
        "Specification ile validation kuralı ne zaman ayrışır?",
        "In-memory ve SQL evaluation neden farklı sonuç verebilir?",
        "Authorization filtresinin specification kompozisyonunda kaybolmasını nasıl önlersin?",
      ],
    },
  },
  {
    slug: "repository-pattern",
    title: "Repository Pattern: Domain Odaklı Veri Erişimi",
    domain: "architecture",
    category: "Data Access Pattern",
    difficulty: "intermediate",
    summary:
      "Domain ile persistence arasında koleksiyon benzeri bir sınır kurar; sorgu ve kaydetme niyetini teknoloji ayrıntısından ayırırken aggregate sınırını ve performans gerçekliğini korur.",
    whyItMatters:
      "Generic CRUD repository her tabloyu aynı görüp VTrade aggregate invariant'larını bypass edebilir. Tersine ORM query nesnesini dışarı vermek de SQL semantiğini controller'a sızdırıp authorization filtresini unutulabilir kılar.",
    objectives: [
      "Repository operasyonlarını aggregate ve use case dilinde tasarlamak.",
      "Persistence query nesnesinin katman dışına sızmasını önlemek.",
      "N+1, over-fetching ve transaction katılımını integration testte gözlemek.",
    ],
    prerequisites: [
      "dependency-inversion-and-injection",
      "relational-modeling-and-constraints",
      "specification-pattern",
    ],
    related: ["unit-of-work-pattern", "hexagonal-architecture", "cqrs-pattern"],
    misconceptions: [
      "Repository, ORM'nin bütün methodlarını yeniden adlandıran generic CRUD wrapper'dır.",
      "Repository kullanınca veritabanı performansını artık düşünmek gerekmez.",
    ],
    projectContexts: ["VTrade portfolio aggregate", "TaskManagment board", "converter job store"],
    careerWeight: 5,
    patternWeight: 5,
    freshnessQueries: [
      "Patterns of Enterprise Application Architecture repository pattern",
      "repository pattern aggregate query performance current guidance",
    ],
    sourceKeys: ["patterns-of-eaa", "microsoft-architecture"],
    seed: {
      openingCase:
        "TaskManagment'ta `GenericRepository<Task>.GetAll()` controller'a IQueryable benzeri nesne döndürür. Controller tenant filtresini eklemeyi unutur ve serialization sırasında yüzlerce assignee sorgusu çalışır.",
      predictionPrompt:
        "`save(entity)` ve `findById(id)` dışında domain dilinde hangi repository operasyonları authorization ve performans niyetini daha görünür yapar?",
      mentalModel:
        "Repository domain'in depo görevlisidir: raf düzenini anlatmaz, işin istediği anlamlı koleksiyonu teslim eder. Ancak deponun kapasite ve erişim maliyetini de saklamaya çalışmaz.",
      workedExample:
        "`TaskRepository.findVisibleBoard(tenantId, boardId)` gerekli projection'ı tek sorguda getirir; `PortfolioRepository.getForUpdate(userId)` ise transaction içindeki locking niyetini açık eder.",
      labTask:
        "TaskManagment'taki bir generic repository kullanımını use case odaklı porta dönüştür; gerçek PostgreSQL testinde query sayısı, tenant filtresi ve transaction katılımını doğrula.",
      doneWhen:
        "Üst katman ORM tipi import etmiyor, repository methodları domain niyetini taşıyor ve beklenmeyen query sayısı regression testinde yakalanıyorsa.",
      transferPrompt:
        "Code-review local-first store için filesystem repository ile SQLite repository aynı port'u ne ölçüde paylaşabilir?",
      reflectionPrompt:
        "Repository soyutlaman değişken persistence detayını mı koruyor, yoksa sorgu kabiliyetini gereksiz yere mi kısıtlıyor?",
      diagram: {
        title: "Domain'den veri kaynağına repository sınırı",
        nodes: ["Use case", "Repository port", "DB adapter", "ORM/SQL", "PostgreSQL"],
        edges: [
          { from: 0, to: 1, label: "domain sorgusu" },
          { from: 2, to: 1, label: "uygular" },
          { from: 2, to: 3, label: "map + query" },
          { from: 3, to: 4, label: "execute" },
        ],
      },
      reviewQuestions: [
        "Generic CRUD repository hangi domain bilgisini kaybettirebilir?",
        "ORM query nesnesini dışarı vermek neden katman sınırını deler?",
        "Repository abstraction'ı N+1 problemini neden kendiliğinden çözmez?",
      ],
    },
  },
  {
    slug: "unit-of-work-pattern",
    title: "Unit of Work: Değişiklikleri Tek İş Biriminde Toplamak",
    domain: "architecture",
    category: "Data Access Pattern",
    difficulty: "advanced",
    summary:
      "Bir use case boyunca yüklenen ve değişen nesneleri izleyip persistence değişikliklerini tek transaction altında koordine eder; repository'lerin aynı commit sınırına katılmasını sağlar.",
    whyItMatters:
      "VTrade WalletRepository ve LedgerRepository ayrı connection açarsa application service transaction başlattığını sansa da yazmalar atomik değildir. Unit of Work ortak transaction sahipliğini görünür kılar.",
    objectives: [
      "Unit of Work ile database transaction kavramlarının ilişkisini açıklamak.",
      "Birden çok repository'nin aynı connection/transaction'ı paylaşmasını sağlamak.",
      "Commit, rollback ve dispose failure davranışlarını test etmek.",
    ],
    prerequisites: ["repository-pattern", "database-transactions"],
    related: ["transactional-outbox-pattern", "cqrs-pattern", "transaction-isolation-and-concurrency"],
    misconceptions: [
      "Her repository kendi `SaveChanges` çağrısını yaparsa Unit of Work oluşur.",
      "ORM context'i her zaman request boyunca açık tutulmalıdır; uzun yaşam stale tracking ve kaynak baskısı yaratır.",
    ],
    projectContexts: ["VTrade trade transaction'ı", "TaskManagment board update", "converter metadata"],
    careerWeight: 5,
    patternWeight: 5,
    freshnessQueries: [
      "Patterns of Enterprise Application Architecture unit of work",
      "unit of work transaction boundary current ORM guidance",
    ],
    sourceKeys: ["patterns-of-eaa", "postgres-transactions"],
    seed: {
      openingCase:
        "VTrade service transaction açar fakat injected iki repository kendi ORM context'ini oluşturur. Ledger insert başarısız olurken wallet başka connection'da çoktan commit edilmiştir.",
      predictionPrompt:
        "Unit of Work nesnesinin lifetime'ı singleton olursa iki kullanıcının değişiklikleri nasıl aynı identity map veya transaction'a karışabilir?",
      mentalModel:
        "Unit of Work tek sevkiyat manifestosudur: farklı depolardan gelen değişiklikler aynı mühürle çıkar. Her repository kendi kamyonunu gönderirse atomik teslimat yoktur.",
      workedExample:
        "`unitOfWork.execute(async tx => { walletRepo(tx).debit(); ledgerRepo(tx).append(); })` tek connection kullanır; callback başarısızsa outbox dahil tüm yazmalar rollback olur.",
      labTask:
        "VTrade repository adapter'larına transaction context aktarımını izle; connection id loglayarak aynı olduğunu kanıtla ve ikinci repository'de hata enjeksiyonuyla rollback testi yaz.",
      doneWhen:
        "Use case tek commit yetkisine sahip, repository'ler bağımsız commit edemiyor ve hata/iptal halinde tüm kaynaklar düzgün rollback/dispose oluyorsa.",
      transferPrompt:
        "TaskManagment'ta bulk task move işleminin Unit of Work sınırı request mi, her task mı olmalı? Lock süresiyle atomikliği tart.",
      reflectionPrompt:
        "Kodunda transaction'ı başlatan katmanla commit eden katman aynı iş niyetini görüyor mu?",
      diagram: {
        title: "Ortak Unit of Work",
        nodes: ["Use case", "Unit of Work", "Repository A", "Repository B", "Tek transaction"],
        edges: [
          { from: 0, to: 1, label: "iş sınırı" },
          { from: 1, to: 2, label: "tx context" },
          { from: 1, to: 3, label: "tx context" },
          { from: 2, to: 4, label: "yaz" },
          { from: 3, to: 4, label: "yaz" },
        ],
      },
      reviewQuestions: [
        "Unit of Work ile transaction aynı şey değilse aralarındaki ilişki nedir?",
        "Repository'nin kendi commit etmesi hangi atomiklik sorununu yaratır?",
        "Unit of Work lifetime'ı neden use case sınırıyla uyumlu olmalıdır?",
      ],
    },
  },
  {
    slug: "domain-events",
    title: "Domain Events: Gerçekleşen İş Gerçeğini İfade Etmek",
    domain: "architecture",
    category: "Domain Pattern",
    difficulty: "intermediate",
    summary:
      "Domain içinde gerçekleşmiş ve iş açısından anlamlı bir olayı geçmiş zamanlı, immutable bir kayıt olarak ifade eder. Aggregate kararını yan etkilerden ayırırken olayın ne zaman yayınlandığını netleştirir.",
    whyItMatters:
      "VTrade trade tamamlandığında portfolio, audit ve bildirim ihtiyaçları büyür. Doğrudan servis çağrıları aggregate'i şişirir; çok erken event yayınlamak ise transaction rollback olsa bile dış dünyanın olmayan trade'i görmesine yol açar.",
    objectives: [
      "Command ile domain event'in niyet-gerçek farkını açıklamak.",
      "Event payload'ına geçmiş gerçeği yeniden yorumlamaya yeten veriyi koymak.",
      "Event toplama, commit ve dispatch sırasını belirlemek.",
    ],
    prerequisites: ["command-pattern", "database-transactions"],
    related: ["observer-pattern", "transactional-outbox-pattern", "cqrs-pattern"],
    misconceptions: [
      "Her property değişikliği domain event olmalıdır.",
      "Domain event oluşturulunca otomatik olarak message broker'a güvenle yayınlanır.",
    ],
    projectContexts: ["VTrade TradeExecuted", "TaskManagment TaskCompleted", "converter ConversionFinished"],
    careerWeight: 5,
    patternWeight: 5,
    freshnessQueries: [
      "Microsoft domain events design implementation current",
      "domain event dispatch after transaction commit guidance",
    ],
    sourceKeys: ["microsoft-architecture", "microservices-patterns"],
    seed: {
      openingCase:
        "VTrade `TradeExecuted` event'ini wallet update'ten önce publish eder. Sonraki constraint hatası transaction'ı rollback eder, fakat notification ve analytics olmayan bir alımı kalıcı gerçek sanır.",
      predictionPrompt:
        "Event aggregate içinde üretildiği an ile dış subscriber'a teslim edildiği an neden aynı olmak zorunda değildir?",
      mentalModel:
        "Domain event noter kaydıdır: 'şu oldu' der, 'şunu yap' demez. Noter taslağı karar sırasında oluşabilir ama işlem kesinleşmeden dış dünyaya ilan edilmez.",
      workedExample:
        "Order aggregate'i `TradeExecuted` olayını id, user, quantity, money ve occurredAt ile toplar. Unit of Work entity ve outbox event'ini aynı transaction'da yazar.",
      labTask:
        "TaskManagment'ta TaskCompleted event'inin schema'sını tasarla; transaction rollback ve iki kez dispatch senaryolarında audit ve notification davranışını test et.",
      doneWhen:
        "Event yalnız gerçek iş gerçeğini ifade ediyor, rollback'te dışarı sızmıyor, version/id taşıyor ve tüketiciler idempotent ele alınabiliyorsa.",
      transferPrompt:
        "Converter `ConversionFailed` olayı permanent ve retryable hatayı payload'da nasıl ayırmalıdır?",
      reflectionPrompt:
        "Event adların geçmiş zamanlı domain dili mi, yoksa gizlenmiş imperative command mı kullanıyor?",
      diagram: {
        title: "Karardan güvenilir olaya",
        nodes: ["Command", "Aggregate", "Domain event", "Transaction", "Subscriber"],
        edges: [
          { from: 0, to: 1, label: "karar isteği" },
          { from: 1, to: 2, label: "gerçekleşti" },
          { from: 2, to: 3, label: "birlikte kaydet" },
          { from: 3, to: 4, label: "commit sonrası" },
        ],
      },
      reviewQuestions: [
        "Command ile domain event arasındaki temel zaman farkı nedir?",
        "Event neden transaction commit olmadan dış sisteme yayınlanmamalıdır?",
        "Event payload'ında entity'nin tamamını taşımak hangi coupling'i doğurur?",
      ],
    },
  },
  {
    slug: "bounded-contexts",
    title: "Bounded Context ve Model Sınırları",
    domain: "architecture",
    category: "Domain Architecture",
    difficulty: "advanced",
    summary:
      "Aynı kelimenin farklı iş alanlarında farklı anlam taşıyabileceğini kabul eder ve her modelin geçerli olduğu dil, veri sahipliği ve değişim sınırını belirler.",
    whyItMatters:
      "VTrade'de `Order` trading için fiyat ve execution, billing için ödeme, UI için görüntüleme modelidir. Tek evrensel Order nesnesi bu farklı invariant'ları birbirine kilitler ve her değişikliği riskli yapar.",
    objectives: [
      "Ubiquitous language çakışmalarından context sınırı çıkarmak.",
      "Veri sahipliği ile read projection paylaşımını ayırmak.",
      "Context map üzerinde upstream/downstream ilişkilerini göstermek.",
    ],
    prerequisites: ["domain-events"],
    related: ["anti-corruption-layer", "modular-monolith", "hexagonal-architecture"],
    misconceptions: [
      "Bounded Context her tablo veya her microservice demektir.",
      "Context'ler hiçbir veri paylaşamaz; asıl konu model sahipliği ve açık sözleşmedir.",
    ],
    projectContexts: ["VTrade Trading/Portfolio/Identity", "TaskManagment Work/Notification", "converter Jobs/Files"],
    careerWeight: 5,
    patternWeight: 5,
    freshnessQueries: [
      "Microsoft bounded context domain driven design current guidance",
      "bounded context context map modular monolith current",
    ],
    sourceKeys: ["microsoft-architecture", "microservices-patterns"],
    seed: {
      openingCase:
        "VTrade `User` entity'sine auth credential, wallet, portfolio, preferences ve notification token'ları eklenir. Basit profil değişikliği finansal migration ve geniş transaction gerektirir.",
      predictionPrompt:
        "Trading ve Identity aynı userId'yi kullanabilir mi? Kimliğin paylaşılmasıyla modelin paylaşılması arasındaki farkı açıkla.",
      mentalModel:
        "Bounded Context farklı ölçekli haritalardır: aynı şehir metro, tapu ve hava haritasında farklı sembollerle görünür. Bir haritanın lejantını diğerine zorlamak yanlış karar üretir.",
      workedExample:
        "Identity kullanıcı kimliğini ve session'ı sahiplenir; Trading `TraderId` referansını kullanır; Portfolio execution event'lerinden projection üretir. Her modül kendi terim ve invariant'ını korur.",
      labTask:
        "VTrade için event storming benzeri akış çıkar; komut, event, policy ve veri sahiplerini Trading, Portfolio, MarketData ve Identity context'lerine yerleştir.",
      doneWhen:
        "Her kritik kavramın tek sahibi, context'ler arası sözleşme ve aynı kelimenin farklı anlamları açıkça belgelenmişse.",
      transferPrompt:
        "Code-review'da Repository (source code) kelimesiyle Repository Pattern kelimesi hangi farklı context'lerde anlam kazanır?",
      reflectionPrompt:
        "Mevcut modül sınırların iş dilini mi, teknik controller/service/repository klasörlerini mi izliyor?",
      diagram: {
        title: "VTrade context haritası",
        nodes: ["Identity", "Trading", "Portfolio", "Market Data", "Notification"],
        edges: [
          { from: 0, to: 1, label: "TraderId" },
          { from: 3, to: 1, label: "Quote" },
          { from: 1, to: 2, label: "TradeExecuted" },
          { from: 1, to: 4, label: "event" },
        ],
      },
      reviewQuestions: [
        "Bounded Context ile deployment unit neden aynı olmak zorunda değildir?",
        "Aynı kimliği paylaşmak neden aynı modeli paylaşmak anlamına gelmez?",
        "Context sınırı belirlerken hangi dil çakışmaları güçlü sinyal verir?",
      ],
    },
  },
  {
    slug: "anti-corruption-layer",
    title: "Anti-Corruption Layer: Yabancı Modeli İzole Etmek",
    domain: "architecture",
    category: "Integration Pattern",
    difficulty: "advanced",
    summary:
      "Dış veya legacy bir sistemin modelinin iç domain dilini bozmasını önleyen çeviri ve politika katmanıdır. Tek bir Adapter'dan daha geniş olarak servis, facade ve model dönüşümlerini koordine edebilir.",
    whyItMatters:
      "VTrade provider'ının `availableBalance` tanımı reserved miktarı dışlıyorsa bunu doğrudan iç modele almak finansal invariant'ı değiştirir. Yabancı semantics tek sınırda açıkça uzlaştırılmalıdır.",
    objectives: [
      "Adapter ile Anti-Corruption Layer kapsamını ayırmak.",
      "Model ve iş semantiği dönüşümündeki bilgi kaybını görünür yapmak.",
      "Upstream değişikliklerine karşı contract ve characterization testleri kurmak.",
    ],
    prerequisites: ["adapter-pattern", "bounded-contexts"],
    related: ["hexagonal-architecture", "api-contract-evolution", "runtime-boundary-validation"],
    misconceptions: [
      "ACL yalnız DTO mapper klasörüdür.",
      "Dış model daha kapsamlıysa iç domain onu aynen kabul etmelidir.",
    ],
    projectContexts: ["VTrade market/broker entegrasyonu", "converter LibreOffice", "code-review provider API'leri"],
    careerWeight: 4,
    patternWeight: 5,
    freshnessQueries: [
      "anti corruption layer domain driven design current",
      "DeepSeek API current chat completion compatibility differences",
    ],
    sourceKeys: ["microsoft-architecture", "deepseek-docs"],
    seed: {
      openingCase:
        "Yeni broker API'si order status olarak `done` döndürür; bu hem tamamen filled hem kısmen filled-and-closed anlamına gelir. VTrade bunu doğrudan `Filled` map edince portfolio miktarı şişer.",
      predictionPrompt:
        "Upstream tek status ile iç modeldeki iki durumu birleştiriyorsa ACL kayıp bilgiyi nasıl ele almalı: tahmin, ek sorgu, unknown state veya red?",
      mentalModel:
        "ACL gemi karantina limanıdır: yabancı yük iç pazara kendi etiketleriyle dağılmaz; ölçülür, yeniden sınıflanır ve belirsizse içeri alınmaz.",
      workedExample:
        "Broker facade önce execution detayını çeker, quantity toplamını doğrular ve yalnız yeterli kanıtla Filled/PartiallyFilled üretir; tanınmayan status `UpstreamContractChanged` olur.",
      labTask:
        "Code-review için OpenAI-benzeri ve DeepSeek payload farklarını tek iç `ModelResult` sözleşmesine çevir; unknown finish reason ve eksik usage fixture'larını test et.",
      doneWhen:
        "Yabancı enum/DTO iç katmanlara sızmıyor, belirsiz dönüşüm fail-safe ve upstream fixture değişikliği contract testinde fark ediliyorsa.",
      transferPrompt:
        "Legacy TaskManagment priority değerleri 1-10, yeni domain Low/Normal/High ise kayıplı dönüşümü nasıl belgeler ve ölçersin?",
      reflectionPrompt:
        "Entegrasyon kodun kelimeleri mi çeviriyor, yoksa iş anlamındaki uyuşmazlığı da çözüyor mu?",
      diagram: {
        title: "Yabancı modelin karantinası",
        nodes: ["İç domain", "İç port", "ACL", "Yabancı model", "Upstream"],
        edges: [
          { from: 0, to: 1, label: "yerel dil" },
          { from: 2, to: 1, label: "uygular" },
          { from: 2, to: 3, label: "anlam çevirisi" },
          { from: 3, to: 4, label: "çağrı" },
        ],
      },
      reviewQuestions: [
        "Anti-Corruption Layer Adapter'dan hangi durumda daha geniştir?",
        "Kayıplı status dönüşümü neden sessiz yapılmamalıdır?",
        "Upstream sözleşme değişikliği hangi fixture/contract testiyle yakalanır?",
      ],
    },
  },
  {
    slug: "hexagonal-architecture",
    title: "Hexagonal Architecture: Portlar ve Adapter'lar",
    domain: "architecture",
    category: "Application Architecture",
    difficulty: "advanced",
    summary:
      "İş çekirdeğini giriş ve çıkış portlarıyla çevreleyerek HTTP, CLI, database ve provider detaylarını değiştirilebilir adapter'lara iter. Bağımlılık yönünü runtime veri akışından ayırır.",
    whyItMatters:
      "Code-review use case'i hem Go CLI hem VS Code uzantısında çalışacaksa UI ve provider ayrıntıları çekirdeğe gömülemez. Hexagonal sınır aynı davranışın farklı sürücülerle test edilmesini sağlar.",
    objectives: [
      "Driving ve driven adapter rollerini örneklerle ayırmak.",
      "Application port'larını use case ve domain ihtiyaçlarına göre tasarlamak.",
      "Bağımlılık yönünü import graph ve contract testleriyle doğrulamak.",
    ],
    prerequisites: [
      "dependency-inversion-and-injection",
      "adapter-pattern",
      "composition-root",
    ],
    related: ["modular-monolith", "anti-corruption-layer", "repository-pattern"],
    misconceptions: [
      "Hexagonal Architecture belirli klasör adlarını birebir uygulamaktır.",
      "Çekirdeğin hiçbir kütüphane kullanmaması gerekir; mesele iş politikasının değişken dış detaylara bağımlı olmamasıdır.",
    ],
    projectContexts: ["code-review CLI ve VS Code", "VTrade API", "converter HTTP/worker"],
    careerWeight: 5,
    patternWeight: 5,
    freshnessQueries: [
      "Microsoft clean architecture ports adapters current guidance",
      "hexagonal architecture TypeScript current practical examples",
    ],
    sourceKeys: ["microsoft-architecture", "patterns-of-eaa"],
    seed: {
      openingCase:
        "Code-review çekirdeği VS Code notification API'sini ve DeepSeek SDK'sını doğrudan import eder. CLI eklenince terminal davranışı için editor mock'ları gerekir ve provider değişimi iki UI'ı birden bozar.",
      predictionPrompt:
        "Review başlatan CLI bir driving adapter ise model provider neden driven adapter'dır? Kontrol ve bağımlılık oklarını ayrı çiz.",
      mentalModel:
        "Çekirdek bir oyun konsoludur: farklı kumandalar komut verir, farklı ekran ve storage adapter'ları sonuç taşır. Oyun kuralları cihaz markasını bilmez.",
      workedExample:
        "`RunReview` input port'unu CLI ve VS Code çağırır. Çekirdek `DiffSource`, `ModelGateway` ve `ReviewStore` output port'larını kullanır; Git, DeepSeek ve filesystem adapter'ları dışarıdadır.",
      labTask:
        "Code-review'ın bir akışını import graph ile çıkar; framework/SDK bağımlılıklarını adapter sınırına taşı ve aynı use case'i in-memory adapter'larla çalıştıran test yaz.",
      doneWhen:
        "Çekirdek UI/provider/storage paketlerini import etmiyor, entrypoint'ler aynı input port'u çağırıyor ve adapter sözleşmeleri ayrı test ediliyorsa.",
      transferPrompt:
        "Converter worker bir driving adapter mı, yoksa use case'in parçası mı? Job claim ve conversion kararlarını ayırarak cevapla.",
      reflectionPrompt:
        "Katman okların klasör düzenini mi, gerçek compile-time dependency yönünü mü gösteriyor?",
      diagram: {
        title: "Hexagon çevresindeki adapter'lar",
        nodes: ["HTTP/CLI adapter", "Input port", "Application core", "Output port", "DB/API adapter"],
        edges: [
          { from: 0, to: 1, label: "drive" },
          { from: 1, to: 2, label: "use case" },
          { from: 2, to: 3, label: "ihtiyaç" },
          { from: 4, to: 3, label: "implement" },
        ],
      },
      reviewQuestions: [
        "Driving ve driven adapter arasındaki fark nedir?",
        "Runtime çağrı yönü ile compile-time bağımlılık yönü neden farklı olabilir?",
        "Port sayısının gereksiz artması hangi soyutlama maliyetini doğurur?",
      ],
    },
  },
  {
    slug: "modular-monolith",
    title: "Modular Monolith: Tek Deploy, Güçlü Sınırlar",
    domain: "architecture",
    category: "System Architecture",
    difficulty: "advanced",
    summary:
      "Tek process ve deployment avantajlarını korurken iş modüllerinin sahiplik, public API ve veri erişim sınırlarını enforce eder. Microservice dağıtım maliyetine girmeden bağımsız değişim alanları kurar.",
    whyItMatters:
      "VTrade erken microservice'e bölünürse transaction, tracing ve deployment karmaşıklığı artar; katmansız monolith kalırsa her modül her tabloya yazabilir. Modular monolith iki uç arasında disiplinli sınır sunar.",
    objectives: [
      "Teknik katman yerine business capability modülleri tasarlamak.",
      "Modül public API'sini ve veri sahipliğini compile/test düzeyinde korumak.",
      "In-process çağrı ile event tabanlı iletişimi tutarlılık ihtiyacına göre seçmek.",
    ],
    prerequisites: ["bounded-contexts", "hexagonal-architecture"],
    related: ["cqrs-pattern", "transactional-outbox-pattern", "architecture-decision-records"],
    misconceptions: [
      "Modular monolith yalnız klasörleri modules altına taşımaktır.",
      "Aynı database kullanılıyorsa modül veri sahipliği uygulanamaz.",
    ],
    projectContexts: ["VTrade", "TaskManagment", "converter platformu"],
    careerWeight: 5,
    patternWeight: 5,
    freshnessQueries: [
      "Microsoft modular monolith current architecture guidance",
      "modular monolith database ownership current patterns",
    ],
    sourceKeys: ["microsoft-architecture", "microservices-patterns"],
    seed: {
      openingCase:
        "VTrade Portfolio modülü performans için Trading tablosunu doğrudan update eder. Trading migration'ı kolon adını değiştirince build geçer ama production'da portfolio sessizce güncellenmez.",
      predictionPrompt:
        "Aynı PostgreSQL instance'ında iki modülün birbirinin tablosuna yazmasını hangi teknik ve test kontrolleriyle engelleyebilirsin?",
      mentalModel:
        "Modular monolith aynı bina içindeki kilitli dairelerdir: ortak altyapı ve tek adres vardır, fakat herkes komşunun çekmecesini açamaz; iletişim kapıdan tanımlı sözleşmeyle olur.",
      workedExample:
        "Trading kendi schema ve repository'lerine sahiptir, `executeTrade` API'sini sunar ve `TradeExecuted` yayınlar. Portfolio yalnız event/API tüketir; doğrudan Trading tablosu import'u architecture testinde kırılır.",
      labTask:
        "VTrade kodunu Identity, MarketData, Trading ve Portfolio modüllerine haritala; public export listeleri, yasak import kuralları ve tablo sahiplik matrisi oluştur.",
      doneWhen:
        "Modüller business capability izliyor, iç tip/tablo erişimi otomatik kontrolde kırılıyor ve çapraz modül transaction ihtiyacı açıkça gerekçelendirilmişse.",
      transferPrompt:
        "TaskManagment Notification modülü Work modülünden synchronous API mi, domain event mi tüketmeli? Teslimat garantisine göre seç.",
      reflectionPrompt:
        "Monolith içindeki en yüksek coupling iş gereği mi, sınır uygulanmadığı için mi oluşmuş?",
      diagram: {
        title: "Tek deploy içindeki modüller",
        nodes: ["Identity", "Trading", "Portfolio", "Notification", "Tek deployment"],
        edges: [
          { from: 0, to: 1, label: "public API" },
          { from: 1, to: 2, label: "domain event" },
          { from: 1, to: 3, label: "domain event" },
          { from: 4, to: 0, label: "paketler" },
          { from: 4, to: 2, label: "paketler" },
        ],
      },
      reviewQuestions: [
        "Modular monolith ile katmanlı monolith arasındaki temel sınır farkı nedir?",
        "Ortak database içinde veri sahipliği nasıl enforce edilebilir?",
        "Bir modülü microservice'e ayırmadan önce hangi kanıtlar aranmalıdır?",
      ],
    },
  },
  {
    slug: "cqrs-pattern",
    title: "CQRS: Yazma ve Okuma Modellerini Ayırmak",
    domain: "architecture",
    category: "Application Pattern",
    difficulty: "advanced",
    summary:
      "State değiştiren command modelini kullanıcıya veri sunan query modelinden ayırır. Ayrımın aynı process/database içinde başlayabileceğini ve eventual consistency bedelini açıkça ele alır.",
    whyItMatters:
      "VTrade trade invariant'ları normalize aggregate isterken dashboard çoklu join ve projection ister. Tek model iki ihtiyacı da taşımaya zorlanırsa write güvenliği veya read performansı zayıflar.",
    objectives: [
      "Command ve query sorumluluklarını semantic olarak ayırmak.",
      "Read projection freshness ve rebuild stratejisini tasarlamak.",
      "CQRS'nin ek karmaşıklığını ölçülebilir ihtiyaçla gerekçelendirmek.",
    ],
    prerequisites: ["command-pattern", "repository-pattern", "indexes-and-query-plans"],
    related: ["domain-events", "transactional-outbox-pattern", "modular-monolith"],
    misconceptions: [
      "CQRS mutlaka ayrı database, broker ve microservice gerektirir.",
      "CQRS ile Event Sourcing aynı pattern'dir.",
    ],
    projectContexts: ["VTrade portfolio dashboard", "TaskManagment board projection", "converter job status"],
    careerWeight: 5,
    patternWeight: 5,
    freshnessQueries: [
      "Microsoft CQRS pattern current guidance tradeoffs",
      "CQRS read model rebuild current patterns",
    ],
    sourceKeys: ["microsoft-architecture", "microservices-patterns"],
    seed: {
      openingCase:
        "VTrade dashboard sorgusu her request'te ledger, trade, asset ve quote tablolarını birleştirir; aynı ORM entity'leri mutation endpoint'inde client'a açıldığı için over-posting riski de doğar.",
      predictionPrompt:
        "Dashboard projection trade commit'inden 500 ms sonra güncellenirse UI kullanıcıya hangi geçici durumu göstermelidir?",
      mentalModel:
        "Yazma modeli banka veznesi, okuma modeli hesap ekstresidir: vezne kuralları korur, ekstre hızlı okunacak biçimde hazırlanır. Ekstrenin baskısı gecikebilir; kasa gerçeği değişmez.",
      workedExample:
        "Buy command normalized Trading tablolarında invariant korur; `TradeExecuted` tüketicisi `portfolio_summary` projection'ını idempotent upsert eder. Query endpoint yalnız projection okur ve `asOf` döndürür.",
      labTask:
        "VTrade için tek bir dashboard projection'ı kur; duplicate event, sıra dışı teslimat ve projection rebuild senaryolarını fixture'larla test et.",
      doneWhen:
        "Read model silinip event/source data'dan yeniden kurulabiliyor, duplicate güncelleme toplamı bozmuyor ve UI freshness'i kullanıcıya açık ediyorsa.",
      transferPrompt:
        "TaskManagment küçük listesinde CQRS hangi noktada gereksiz karmaşıklık olur, hangi ölçüm ayrımı haklı çıkarır?",
      reflectionPrompt:
        "Ayırdığın read model gerçek bir farklı ihtiyaç mı çözüyor, yoksa yalnız mimari moda mı uyuyor?",
      diagram: {
        title: "CQRS veri yolları",
        nodes: ["Command", "Write model", "Domain event", "Read projection", "Query"],
        edges: [
          { from: 0, to: 1, label: "invariant" },
          { from: 1, to: 2, label: "gerçekleşti" },
          { from: 2, to: 3, label: "project" },
          { from: 4, to: 3, label: "hızlı oku" },
        ],
      },
      reviewQuestions: [
        "CQRS neden ayrı deployment gerektirmez?",
        "Read projection gecikmesi kullanıcı sözleşmesine nasıl yansıtılır?",
        "CQRS ile Event Sourcing arasındaki fark nedir?",
      ],
    },
  },
  {
    slug: "transactional-outbox-pattern",
    title: "Transactional Outbox: Dual Write Boşluğunu Kapatmak",
    domain: "architecture",
    category: "Messaging Pattern",
    difficulty: "advanced",
    summary:
      "Domain değişikliği ile yayınlanacak mesajı aynı yerel database transaction'ında kaydeder; commit ile broker publish arasındaki process crash penceresinde olay kaybını önler.",
    whyItMatters:
      "VTrade trade commit olur ama process event publish etmeden kapanırsa portfolio ve notification güncellenmez. Önce publish edilirse rollback olan trade dış dünyada var görünür; bu klasik dual-write problemidir.",
    objectives: [
      "Dual-write failure zaman çizelgelerini göstermek.",
      "Outbox claim, publish ve processed işaretleme akışını tasarlamak.",
      "At-least-once teslimat nedeniyle tüketici idempotency'sini sağlamak.",
    ],
    prerequisites: ["database-transactions", "domain-events", "unit-of-work-pattern"],
    related: ["saga-pattern", "messaging-delivery-semantics", "durable-background-jobs"],
    misconceptions: [
      "Outbox exactly-once uçtan uca teslimat sağlar.",
      "Mesaj publish edildikten sonra hemen delete etmek her crash senaryosunda güvenlidir.",
    ],
    projectContexts: ["VTrade TradeExecuted", "TaskManagment notification", "converter job eventleri"],
    careerWeight: 5,
    patternWeight: 5,
    freshnessQueries: [
      "transactional outbox pattern current microservices",
      "PostgreSQL outbox skip locked polling current",
    ],
    sourceKeys: ["microservices-patterns", "postgres-transactions"],
    seed: {
      openingCase:
        "Trade ve wallet commit edilir. API container'ı broker çağrısından bir milisaniye önce kapanır; kullanıcı bakiyesi değişmiştir ama portfolio projection sonsuza kadar eski kalır.",
      predictionPrompt:
        "Worker mesajı broker'a gönderdikten sonra `published_at` yazamadan çökerse restart sonrası ne olur?",
      mentalModel:
        "Outbox gönderilecek mektubu banka işlemiyle aynı kasaya koyar. Kurye sonra alır; kurye aynı mektubu iki kez götürebilir, fakat mektup kasada kaybolmaz.",
      workedExample:
        "Trade transaction'ı `trades` ve `outbox(id,type,payload,occurred_at)` yazar. Worker satırı claim eder, publish eder; consumer eventId UNIQUE ile duplicate'i etkisiz kılar.",
      labTask:
        "VTrade outbox worker'ında commit-before-publish, publish-before-mark ve iki worker claim crash noktalarını simüle et; event kaybı ve duplicate sayısını ölç.",
      doneWhen:
        "Hiçbir crash noktasında committed event kaybolmuyor, duplicate consumer state'ini bozmuyor ve poison message gözlenebilir bir terminal yola gidiyorsa.",
      transferPrompt:
        "TaskManagment email'i aynı transaction'da göndermek yerine outbox'a almak kullanıcıya gösterilen başarı anlamını nasıl değiştirir?",
      reflectionPrompt:
        "Sisteminde database ve başka bir kaynak arasında hâlâ korumasız dual write bulunan akış hangisi?",
      diagram: {
        title: "Outbox ile güvenilir yayın",
        nodes: ["Use case", "Domain tablo", "Outbox tablo", "Relay worker", "Broker/consumer"],
        edges: [
          { from: 0, to: 1, label: "aynı tx" },
          { from: 0, to: 2, label: "aynı tx" },
          { from: 2, to: 3, label: "claim" },
          { from: 3, to: 4, label: "at least once" },
        ],
      },
      reviewQuestions: [
        "Transactional Outbox hangi iki dual-write penceresini kapatır?",
        "Outbox neden consumer idempotency ihtiyacını ortadan kaldırmaz?",
        "Publish sonrası mark öncesi crash nasıl ele alınır?",
      ],
    },
  },
  {
    slug: "saga-pattern",
    title: "Saga Pattern: Dağıtık İş Akışında Telafi",
    domain: "architecture",
    category: "Distributed Transaction Pattern",
    difficulty: "advanced",
    summary:
      "Tek ACID transaction'a sığmayan uzun iş akışını yerel transaction'lar ve başarısızlıkta semantic compensation adımlarıyla koordine eder; orchestration ve choreography trade-off'larını inceler.",
    whyItMatters:
      "VTrade harici broker, wallet ve notification arasında işlem yürütürken iki-phase commit pratik olmayabilir. İlk adım başarılı, ikincisi başarısızsa 'rollback' zamanı geri almaz; iş açısından telafi gerekir.",
    objectives: [
      "Yerel transaction, command, event ve compensation adımlarını haritalamak.",
      "Orchestration ile choreography görünürlük/coupling farkını değerlendirmek.",
      "Telafisi olmayan yan etkiler için forward recovery ve manuel müdahale tasarlamak.",
    ],
    prerequisites: [
      "transactional-outbox-pattern",
      "idempotent-api-commands",
      "messaging-delivery-semantics",
    ],
    related: ["state-pattern", "domain-events", "graceful-degradation-and-recovery"],
    misconceptions: [
      "Compensation veritabanı rollback'i gibi geçmişi tamamen siler.",
      "Saga her birden fazla tablo yazımında gerekir; tek database transaction daha basit ve güçlüdür.",
    ],
    projectContexts: ["VTrade broker execution", "converter storage+conversion", "TaskManagment entegrasyon akışı"],
    careerWeight: 5,
    patternWeight: 5,
    freshnessQueries: [
      "microservices saga pattern orchestration choreography current",
      "saga compensation irreversible side effects current guidance",
    ],
    sourceKeys: ["microservices-patterns", "microsoft-architecture"],
    seed: {
      openingCase:
        "VTrade önce wallet'ta fon ayırır, broker emrini gönderir; response timeout olur. Fon bırakılırsa gerçekten gerçekleşen order teminatsız kalabilir, tutulursa kullanıcı parası süresiz kilitlenebilir.",
      predictionPrompt:
        "Broker sonucu unknown olduğunda doğrudan `ReleaseFunds` compensation'ı neden tehlikelidir? Önce hangi reconciliation adımı gerekir?",
      mentalModel:
        "Saga uzun bir yolculuktur: her durakta bilet kesilir. Geri dönüş aynı zamanı silmez; her durak için iş anlamlı dönüş bileti veya ileri kurtarma planı gerekir.",
      workedExample:
        "Orchestrator ReserveFunds -> SubmitOrder -> ConfirmExecution adımlarını ve correlationId'yi kalıcı tutar. Submit sonucu belirsizse broker sorgulanır; yalnız kesin redde reservation serbest bırakılır.",
      labTask:
        "VTrade order saga'sı için durum/komut/telafi tablosu çıkar; her network kesinti noktasını, duplicate mesajı ve manuel-recovery durumunu deterministic test et.",
      doneWhen:
        "Her adım idempotent, unknown sonuç ayrı state, compensation iş açısından geçerli ve stuck saga alarm/reconciliation ile görünürse.",
      transferPrompt:
        "Converter dosyayı object storage'a yükleyip conversion başarısız olduğunda silme her zaman doğru compensation mıdır? Audit ve retry politikasını düşün.",
      reflectionPrompt:
        "Tasarladığın telafi gerçek dünyadaki yan etkiyi geri alıyor mu, yoksa yalnız yerel kaydı mı siliyor?",
      diagram: {
        title: "Order saga ve telafi yolları",
        nodes: ["Reserve funds", "Submit order", "Confirm", "Reconcile unknown", "Release funds"],
        edges: [
          { from: 0, to: 1, label: "reserved" },
          { from: 1, to: 2, label: "accepted" },
          { from: 1, to: 3, label: "timeout" },
          { from: 3, to: 2, label: "executed" },
          { from: 3, to: 4, label: "rejected" },
        ],
      },
      reviewQuestions: [
        "Saga compensation neden ACID rollback ile aynı değildir?",
        "Unknown remote sonuç neden ayrı bir state olarak tutulmalıdır?",
        "Orchestration ve choreography hangi gözlenebilirlik trade-off'unu taşır?",
      ],
    },
  },
  {
    slug: "idempotent-api-commands",
    title: "Idempotent API Komutları ve Deduplication",
    domain: "backend",
    category: "API Güvenilirliği",
    difficulty: "intermediate",
    summary:
      "Aynı mantıksal komut ağ retry'ı, çift tıklama veya message redelivery nedeniyle tekrar geldiğinde tek iş etkisi ve tutarlı sonuç üretmek için idempotency key, request fingerprint ve kalıcı sonuç kaydı tasarlar.",
    whyItMatters:
      "VTrade'de response kaybolduğunda kullanıcı Buy isteğini tekrarlar. Yalnız duplicate trade'i engellemek yetmez; aynı key farklı payload ile kullanılırsa reddedilmeli ve ilk işlemin sonucu güvenli biçimde replay edilmelidir.",
    objectives: [
      "HTTP method idempotency'si ile domain command idempotency'sini ayırmak.",
      "Key scope, payload hash, sonuç saklama ve retention politikası kurmak.",
      "Eşzamanlı duplicate istekleri database constraint ve transaction ile serialize etmek.",
    ],
    prerequisites: [
      "http-request-lifecycle",
      "database-transactions",
      "relational-modeling-and-constraints",
      "command-pattern",
    ],
    related: [
      "retries-timeouts-and-backoff",
      "transactional-outbox-pattern",
      "messaging-delivery-semantics",
    ],
    misconceptions: [
      "Aynı endpoint'in iki kez çağrılmasını frontend'de düğmeyi disable ederek kesin önleyebilirsin.",
      "Idempotency key'i görmek duplicate isteğe her zaman 409 dönmek demektir; tamamlanmış ilk sonuç replay edilebilir.",
    ],
    projectContexts: ["VTrade Buy/Sell", "converter job creation", "TaskManagment bulk move"],
    careerWeight: 5,
    patternWeight: 4,
    freshnessQueries: [
      "idempotency key API current best practices request fingerprint",
      "AWS Builders Library idempotent APIs current",
    ],
    sourceKeys: ["aws-builders-library", "postgres-constraints", "mdn-http"],
    seed: {
      openingCase:
        "Mobil VTrade istemcisi metroda Buy response'unu alamaz ve aynı key ile tekrar gönderir. İki request aynı anda server'a ulaşır; ikisi de önce `key yok` okuyup iki trade oluşturur.",
      predictionPrompt:
        "Aynı kullanıcı aynı idempotency key'i bu kez farklı quantity ile gönderirse ilk cevap mı dönmeli, yeni işlem mi yapılmalı, yoksa hata mı verilmeli?",
      mentalModel:
        "Idempotency key bir işlem makbuzu numarasıdır: aynı makbuz aynı niyeti ve sonucu temsil eder. Numara tek başına değil, sahibi ve payload parmak iziyle anlamlıdır.",
      workedExample:
        "`(user_id, operation, key)` UNIQUE kayıt önce `processing` olarak transaction'da claim edilir. Request hash uyuşmazsa 422; completed ise saklı status/body; processing ise kontrollü bekleme veya 409 döner.",
      labTask:
        "VTrade Buy endpoint'ine kalıcı idempotency tablosu ekle; barrier ile aynı key'den 50 paralel request, farklı payload reuse ve commit sonrası response kesilmesi testlerini yaz.",
      doneWhen:
        "Her koşuda tek trade/ledger etkisi var, aynı niyet aynı sonucu alıyor, farklı niyet aynı key ile reddediliyor ve retention süresi belgeleniyorsa.",
      transferPrompt:
        "Converter upload byte'ları aynı fakat kullanıcı key göndermiyorsa content hash güvenli bir idempotency key olabilir mi? Tenant ve tekrar dönüşüm niyetini düşün.",
      reflectionPrompt:
        "Sisteminde retry edilebilen hangi mutation hâlâ yalnız UI davranışına güveniyor?",
      diagram: {
        title: "Idempotency karar yolu",
        nodes: ["Command + key", "Key kaydı", "Payload hash", "İşlem", "Saklı sonuç"],
        edges: [
          { from: 0, to: 1, label: "atomik claim" },
          { from: 1, to: 2, label: "aynı key" },
          { from: 2, to: 3, label: "yeni ve uyumlu" },
          { from: 3, to: 4, label: "persist" },
          { from: 1, to: 4, label: "duplicate replay" },
        ],
      },
      reviewQuestions: [
        "Idempotency key hangi scope içinde benzersiz olmalıdır?",
        "Aynı key farklı payload ile gelirse neden sessizce ilk sonuç dönülmemelidir?",
        "Paralel duplicate istekleri yalnız önce-read ile neden engellenemez?",
      ],
    },
  },
  {
    slug: "api-contract-evolution",
    title: "API Sözleşmesi, Uyumluluk ve Evrim",
    domain: "backend",
    category: "API Tasarımı",
    difficulty: "intermediate",
    summary:
      "Request/response şemasını server ile web, mobil ve entegrasyon tüketicileri arasındaki versiyonlu ürün sözleşmesi olarak ele alır; additive değişiklik, deprecation ve contract test stratejileri kurar.",
    whyItMatters:
      "VTrade backend'i `quantity` alanını `amount` yapınca aynı anda deploy edilmeyen mobil uygulama sessizce kırılır. TypeScript tip paylaşımı yalnız aynı build içindeki tüketiciyi korur; dağıtılmış eski client'ı korumaz.",
    objectives: [
      "Breaking ve backward-compatible değişiklikleri tüketici davranışına göre sınıflandırmak.",
      "Runtime schema, OpenAPI ve generated client rollerini ayırmak.",
      "Deprecation süresini telemetry ve contract testleriyle yönetmek.",
    ],
    prerequisites: ["http-request-lifecycle", "runtime-boundary-validation"],
    related: [
      "anti-corruption-layer",
      "nextjs-server-client-boundaries",
      "structured-llm-output",
      "object-level-authorization",
    ],
    misconceptions: [
      "Response'a alan eklemek her tüketici için daima non-breaking'dir; strict parser'lar kırılabilir.",
      "API versioning yalnız URL'ye `/v2` eklemektir.",
    ],
    projectContexts: ["VTrade web/mobil", "code-review CLI/extension", "converter public API"],
    careerWeight: 5,
    patternWeight: 3,
    freshnessQueries: [
      "Microsoft REST API versioning compatibility current guidance",
      "OpenAPI current backward compatibility contract testing",
    ],
    sourceKeys: ["microsoft-architecture", "mdn-http", "owasp-api"],
    seed: {
      openingCase:
        "VTrade API yeni sürümde price değerini number yerine decimal string döndürür. Web aynı gün güncellenir, mağazadaki eski mobil sürüm toplamı `NaN` gösterir ve kullanıcı yanlış karar verir.",
      predictionPrompt:
        "Nullable yeni alan eklemek hangi strict client davranışlarında yine breaking olabilir? En az iki tüketici varsayımı yaz.",
      mentalModel:
        "API sözleşmesi yayımlanmış bir elektrik standardıdır: server ve client aynı anda değişmek zorunda değildir. Evrim, eski fişleri ölçülen bir süre çalıştırma disiplinidir.",
      workedExample:
        "Money alanı yeni `total: { amount: string, currency: string }` biçiminde eklenir; eski alan deprecation header ve kullanım metric'iyle iki mobil release boyunca korunur, sonra major contract'ta kaldırılır.",
      labTask:
        "VTrade trade response'u için mevcut ve bir önceki client fixture'larını oluştur; provider contract doğrulaması, unknown-field toleransı ve deprecation kullanım sayacı ekle.",
      doneWhen:
        "CI en az iki desteklenen client sözleşmesini doğruluyor, breaking değişiklik bilinçli version/deprecation planına bağlı ve kullanım sıfırlanmadan alan kaldırılmıyorsa.",
      transferPrompt:
        "Code-review finding severity enum'una yeni değer eklemek eski VS Code uzantısını nasıl etkiler?",
      reflectionPrompt:
        "API değişikliklerinde yalnız server testlerine bakarak hangi bağımsız tüketiciyi görünmez varsayıyorsun?",
      diagram: {
        title: "Sözleşmenin kontrollü evrimi",
        nodes: ["Server schema", "Contract artifact", "Web client", "Mobil eski", "Telemetry/deprecation"],
        edges: [
          { from: 0, to: 1, label: "publish" },
          { from: 1, to: 2, label: "generate/test" },
          { from: 1, to: 3, label: "compat test" },
          { from: 3, to: 4, label: "kullanım ölç" },
        ],
      },
      reviewQuestions: [
        "Bir değişikliğin breaking olup olmadığını kim belirler?",
        "Generated TypeScript client runtime doğrulamayı neden tamamen ikame etmez?",
        "Deprecation telemetry olmadan kaldırma zamanı neden tahmine dönüşür?",
      ],
    },
  },
  {
    slug: "durable-background-jobs",
    title: "Kalıcı Background Job Tasarımı",
    domain: "backend",
    category: "Asenkron İşleme",
    difficulty: "intermediate",
    summary:
      "Uzun veya retry gerektiren işleri request process'inin belleğinden çıkarıp kalıcı state, atomik claim, lease, heartbeat ve terminal sonuçlarla yönetir.",
    whyItMatters:
      "Converter HTTP response sonrası `setTimeout` ile LibreOffice başlatırsa deploy anında job kaybolur. Kalıcılık yalnız queue'ya yazmak değildir; yarım kalan işin kime ait olduğu ve nasıl geri alınacağı da modellenmelidir.",
    objectives: [
      "Job state machine, attempt ve lease alanlarını tasarlamak.",
      "İşi atomik claim ederek iki worker'ın aynı anda çalışmasını önlemek.",
      "Crash, timeout, cancellation ve poison job davranışlarını sınamak.",
    ],
    prerequisites: [
      "database-transactions",
      "state-pattern",
      "idempotent-api-commands",
    ],
    related: [
      "messaging-delivery-semantics",
      "transactional-outbox-pattern",
      "observability-traces-and-context",
    ],
    misconceptions: [
      "Promise'i await etmeden başlatmak background job'ı kalıcı yapar.",
      "Queue bir mesajı bir worker'a verdiğinde worker'ın işi tamamladığı garantidir.",
    ],
    projectContexts: ["converter LibreOffice işleri", "code-review uzun analiz", "VTrade reconciliation"],
    careerWeight: 5,
    patternWeight: 4,
    freshnessQueries: [
      "PostgreSQL durable job queue skip locked current",
      "background job lease heartbeat retry current patterns",
    ],
    sourceKeys: ["postgres-transactions", "postgres-isolation", "aws-builders-library"],
    seed: {
      openingCase:
        "Converter worker job'ı Running yapar ve LibreOffice ortasında OOM nedeniyle ölür. Kalıcı lease yoktur; job sonsuza kadar Running kalır ve kullanıcı ne retry edebilir ne sonuç alabilir.",
      predictionPrompt:
        "Worker lease süresi işin normal süresinden kısa olursa hangi duplicate execution oluşur? Çok uzun olursa recovery nasıl gecikir?",
      mentalModel:
        "Job bir emanet fişidir: işçi işi sonsuza kadar sahiplenmez, süreli lease alır. Tamamladığını kanıtlamazsa emanet yeniden dağıtılır; bu yüzden iş tekrar çalışmaya dayanmalıdır.",
      workedExample:
        "Worker `UPDATE ... WHERE status='queued' OR lease_until < now()` ile version artırıp claim eder, heartbeat ile lease yeniler; output atomik isimle yazılır ve completion version koşuluyla commit edilir.",
      labTask:
        "Converter job tablosu ve fake-clock worker kur; claim sonrası crash, lease expiration, iki worker yarışı, permanent input hatası ve cancellation senaryolarını test et.",
      doneWhen:
        "Process kill sonrası job belirlenen sürede yeniden alınabiliyor, aynı output bozulmuyor, attempt bütçesi terminal state üretiyor ve queue yaşı ölçülüyorsa.",
      transferPrompt:
        "Code-review model çağrısı pahalıysa lease süresi ve cancellation token'ı maliyet israfını nasıl sınırlar?",
      reflectionPrompt:
        "Background işlerindeki başarı tanımın process'in dönmesi mi, kalıcı sonucun doğrulanması mı?",
      diagram: {
        title: "Lease tabanlı job yaşamı",
        nodes: ["Queued", "Claim + lease", "Running", "Heartbeat", "Succeeded/Retry"],
        edges: [
          { from: 0, to: 1, label: "atomik" },
          { from: 1, to: 2, label: "başlat" },
          { from: 2, to: 3, label: "lease yenile" },
          { from: 3, to: 4, label: "tamamla veya süre dol" },
        ],
      },
      reviewQuestions: [
        "Lease ile lock arasındaki operasyonel fark nedir?",
        "Job neden idempotent veya deduplicate edilebilir olmalıdır?",
        "Poison job sonsuz retry yerine nasıl terminal ve gözlenebilir hale gelir?",
      ],
    },
  },
  {
    slug: "caching-and-staleness",
    title: "Cache Tutarlılığı, Eskilik ve Invalidation",
    domain: "backend",
    category: "Performans ve Tutarlılık",
    difficulty: "intermediate",
    summary:
      "Cache'i hızlı kopya olarak değil, belirli bir süre eski olmasına izin verilen türetilmiş veri olarak modeller. Key, TTL, invalidation, stampede ve source-of-truth geri dönüşünü domain riskine göre seçer.",
    whyItMatters:
      "VTrade fiyatı dashboard için 15 saniye eski olabilir ama trade execution aynı cache değerini kullanırsa kullanıcı yanlış fiyattan işlem yapar. Veri türüne göre freshness bütçesi ayrılmalıdır.",
    objectives: [
      "Her veri türü için kabul edilebilir staleness ve source of truth tanımlamak.",
      "Cache-aside yarışlarını ve invalidation sırasını analiz etmek.",
      "Stampede, hot key ve provider outage davranışlarını test etmek.",
    ],
    prerequisites: ["http-request-lifecycle", "indexes-and-query-plans"],
    related: [
      "graceful-degradation-and-recovery",
      "cqrs-pattern",
      "web-performance-budgets",
    ],
    misconceptions: [
      "Kısa TTL tutarlılık problemini tamamen çözer.",
      "Cache miss yalnız performans olayıdır; source bağımlılığı çökmüşse availability kararına dönüşür.",
    ],
    projectContexts: ["VTrade fiyat ve portfolio", "TaskManagment board", "code-review model sonucu"],
    careerWeight: 5,
    patternWeight: 3,
    freshnessQueries: [
      "AWS Builders Library cache stampede current guidance",
      "HTTP stale while revalidate current MDN",
    ],
    sourceKeys: ["aws-builders-library", "mdn-http", "web-dev"],
    seed: {
      openingCase:
        "CoinGecko kısa süre çöker. VTrade dashboard cache'ten son fiyatı kaynak zamanı göstermeden sunar; buy handler da aynı değeri güncel sanıp finansal işlem gerçekleştirir.",
      predictionPrompt:
        "Cache TTL dolduğu anda bin request aynı upstream'e giderse ne olur? Single-flight veya jitter bu zaman çizelgesini nasıl değiştirir?",
      mentalModel:
        "Cache gerçeğin fotoğrafıdır; fotoğrafın çekildiği zamanı bilmeden karar verilmez. Bazı ekranlar eski fotoğrafı gösterebilir, kasada ise canlı kimlik kontrolü gerekir.",
      workedExample:
        "Market display `value + observedAt + source` cache'ler ve 30 saniyeye kadar stale gösterir. Execution yalnız server-signed, kısa ömürlü quoteId'yi kabul eder; cache miss'te trade fail closed olur.",
      labTask:
        "VTrade quote cache'ine fake clock ekle; fresh, stale-servable, expired, upstream timeout ve 100 eşzamanlı miss senaryolarında çağrı sayısı ve UI/API davranışını test et.",
      doneWhen:
        "Freshness metadata kullanıcı/handler kararında kullanılıyor, stampede sınırlandırılmış ve kritik işlem stale data ile sessizce devam etmiyorsa.",
      transferPrompt:
        "TaskManagment board cache invalidation'ında update sonrası delete başarısız olursa kullanıcı yazdığı veriyi nasıl geri eski görebilir?",
      reflectionPrompt:
        "Cache'lediğin hangi değer için maksimum kabul edilebilir eskilik hiç tanımlanmadı?",
      diagram: {
        title: "Freshness kontrollü cache-aside",
        nodes: ["İstek", "Cache", "Freshness policy", "Source of truth", "Stale/fresh cevap"],
        edges: [
          { from: 0, to: 1, label: "key" },
          { from: 1, to: 2, label: "value + time" },
          { from: 2, to: 3, label: "expired/miss" },
          { from: 2, to: 4, label: "izinli" },
          { from: 3, to: 4, label: "yenile" },
        ],
      },
      reviewQuestions: [
        "TTL neden tek başına doğruluk garantisi değildir?",
        "Cache stampede hangi eşzamanlılık koşulunda oluşur?",
        "Display cache ile execution quote'u neden farklı freshness politikası ister?",
      ],
    },
  },
  {
    slug: "money-and-ledger-modeling",
    title: "Para, Ledger ve Reconciliation Modeli",
    domain: "data",
    category: "Finansal Veri",
    difficulty: "advanced",
    summary:
      "Parayı binary floating point yerine açık currency, precision ve rounding politikasıyla modeller; mutable bakiye yanında açıklanabilir append-only ledger ve düzenli reconciliation kurar.",
    whyItMatters:
      "VTrade'de 0.1 benzeri floating point sapması binlerce işlemde büyür. Yalnız son balance'ı saklamak hangi trade'in hatalı olduğunu açıklamaz; ledger denetlenebilir değişim geçmişi sağlar.",
    objectives: [
      "Decimal veya minor-unit seçimini currency ve precision ihtiyacına göre yapmak.",
      "Double-entry veya dengeli ledger invariant'larını ifade etmek.",
      "Türetilmiş bakiye ile hızlı snapshot'ı reconciliation üzerinden uzlaştırmak.",
    ],
    prerequisites: [
      "relational-modeling-and-constraints",
      "database-transactions",
      "transaction-isolation-and-concurrency",
    ],
    related: ["idempotent-api-commands", "cqrs-pattern", "transactional-outbox-pattern"],
    misconceptions: [
      "İki ondalık basamak bütün varlık ve para birimleri için yeterlidir.",
      "Append-only ledger hatayı silmeyi imkânsızlaştırır; düzeltme ters kayıtla açıklanabilir yapılır.",
    ],
    projectContexts: ["VTrade wallet ve portfolio", "TaskManagment ücretli plan", "converter kullanım kredisi"],
    careerWeight: 5,
    patternWeight: 4,
    freshnessQueries: [
      "PostgreSQL current numeric precision scale documentation",
      "financial ledger reconciliation software architecture current",
    ],
    sourceKeys: ["postgres-constraints", "postgres-transactions", "patterns-of-eaa"],
    seed: {
      openingCase:
        "VTrade üç kez 0.1 miktarlı asset alır; JavaScript toplamı 0.30000000000000004 olur. UI round ederken DB başka scale kullanır ve sell-all sonrası küçük negatif holding kalır.",
      predictionPrompt:
        "Fiyat 8, quantity 12 ondalık basamak taşıyorsa total için hangi precision/scale gerekir? Rounding'in hangi adımda yapılacağını belirt.",
      mentalModel:
        "Bakiye bir fotoğraf, ledger muhasebe günlüğüdür. Fotoğraf hızlı bakış sağlar; günlük her değişimin nereden geldiğini ve toplamın neden öyle olduğunu kanıtlar.",
      workedExample:
        "Trade execution aynı transaction'da cash debit, asset credit ve fee kayıtlarını eventId ile append eder. Wallet snapshot ledger toplamıyla periyodik karşılaştırılır; fark alarm üretir, sessiz update yapılmaz.",
      labTask:
        "VTrade için currency-aware Money value object ve ledger şeması tasarla; rounding boundary, duplicate event, reversal ve snapshot sapması testleri yaz.",
      doneWhen:
        "Floating point finansal yolda yok, rounding policy tek kaynakta, her bakiye değişimi kaynak id'ye bağlı ve reconciliation farkı görünürse.",
      transferPrompt:
        "Converter kredi kullanımında başarısız job için debit geri yazmak mı, compensating credit eklemek mi daha denetlenebilir?",
      reflectionPrompt:
        "Mevcut finansal sayılarının birim, currency ve rounding anlamı tip düzeyinde mi, yorum satırında mı?",
      diagram: {
        title: "İşlemden dengeli ledger'a",
        nodes: ["Trade", "Cash debit", "Asset credit", "Fee entry", "Reconciliation"],
        edges: [
          { from: 0, to: 1, label: "aynı event" },
          { from: 0, to: 2, label: "aynı event" },
          { from: 0, to: 3, label: "policy" },
          { from: 1, to: 4, label: "topla" },
          { from: 2, to: 4, label: "topla" },
        ],
      },
      reviewQuestions: [
        "Binary floating point para hesabında neden risklidir?",
        "Ledger ile mutable balance snapshot hangi farklı amaçlara hizmet eder?",
        "Hatalı finansal kaydı delete etmek yerine reversal neden tercih edilir?",
      ],
    },
  },
  {
    slug: "react-state-ownership",
    title: "React'te State Sahipliği ve Türetilmiş Veri",
    domain: "frontend",
    category: "React Uygulama Tasarımı",
    difficulty: "intermediate",
    summary:
      "Her state parçası için tek otorite seçer; server state, URL state, form state ve türetilmiş görünümü ayırarak senkronizasyon effect'lerini ve stale kopyaları azaltır.",
    whyItMatters:
      "TaskManagment board verisi hem query cache'te hem component state'inde tutulursa mutation sonrası iki kopya ayrışır. Daha çok effect eklemek geçici olarak düzeltir, fakat yarış ve sonsuz render riskini büyütür.",
    objectives: [
      "State'in gerçek sahibini değişim ve yaşam süresine göre seçmek.",
      "Render sırasında türetilebilen değeri gereksiz state/effect'ten çıkarmak.",
      "Async effect cleanup ve stale response yarışlarını önlemek.",
    ],
    prerequisites: ["browser-rendering-and-state"],
    related: [
      "observer-pattern",
      "optimistic-ui-and-reconciliation",
      "nextjs-server-client-boundaries",
    ],
    misconceptions: [
      "Props'tan gelen her veri yerel state'e kopyalanmalıdır.",
      "Effect veri akışını düzenleyen genel araçtır; çoğu türetme render veya event içinde yapılabilir.",
    ],
    projectContexts: ["TaskManagment board", "VTrade filtre ve portfolio", "converter progress"],
    careerWeight: 5,
    patternWeight: 3,
    freshnessQueries: [
      "React docs current choosing state structure derived state",
      "React docs current synchronizing with effects race conditions",
    ],
    sourceKeys: ["react-docs"],
    seed: {
      openingCase:
        "TaskManagment component'i `tasks` prop'unu state'e kopyalar. WebSocket update prop'u yenilerken kullanıcının eski effect'i daha sonra çalışıp yeni görevi listeden siler.",
      predictionPrompt:
        "FilteredTasks değeri tasks ve filter'dan safça hesaplanabiliyorsa onu state'te tutmak hangi ek geçersiz durumları mümkün kılar?",
      mentalModel:
        "State sistemin muhasebe defteridir; aynı gerçeği iki deftere yazarsan reconciliation gerekir. Türetilmiş değer defter değil, mevcut kayıttan hesaplanan rapordur.",
      workedExample:
        "Tasks server cache'in sahibidir, selectedTaskId URL'dedir, draftTitle form state'indedir; selectedTask nesnesi her render'da id ile bulunur. Mutation sonrası tek cache güncellenir.",
      labTask:
        "TaskManagment ekranında tüm useState/effect çiftlerini envanterle; en az iki derived-state kopyasını kaldır ve yavaş iki fetch cevabının ters sırada geldiği testi yaz.",
      doneWhen:
        "Her veri için tek owner açıklanabiliyor, props/cache kopyası yok ve eski async response yeni seçimi ezemiyorsa.",
      transferPrompt:
        "VTrade seçili asset URL state'i mi, global store mu, component state'i mi olmalı? Shareability ve yaşam süresiyle karar ver.",
      reflectionPrompt:
        "Hangi effect aslında iki state kopyasını elle senkron tutmaya çalışıyor?",
      diagram: {
        title: "State sahipliği haritası",
        nodes: ["Server cache", "URL", "Form state", "Render türetimi", "UI"],
        edges: [
          { from: 0, to: 3, label: "tasks" },
          { from: 1, to: 3, label: "selection/filter" },
          { from: 2, to: 4, label: "draft" },
          { from: 3, to: 4, label: "view model" },
        ],
      },
      reviewQuestions: [
        "Türetilmiş veriyi state'te tutmak hangi invalid kombinasyonları üretir?",
        "URL state ne zaman component state'inden daha doğru sahibidir?",
        "Async effect'te stale response yarışı nasıl önlenir?",
      ],
    },
  },
  {
    slug: "nextjs-server-client-boundaries",
    title: "Next.js Server ve Client Sınırları",
    domain: "frontend",
    category: "Full-Stack Rendering",
    difficulty: "intermediate",
    summary:
      "Server Component, Client Component, Route Handler ve Server Action sınırlarını veri erişimi, secret, serialization, cache ve kullanıcı etkileşimi ihtiyaçlarına göre seçer.",
    whyItMatters:
      "VTrade market key'i client bundle'a taşınırsa secret sızar; kişiye özel response yanlış cache'lenirse başka kullanıcının portfolio'su gösterilebilir. `'use client'` yalnız performans etiketi değil güven ve execution sınırıdır.",
    objectives: [
      "Server ve client execution ortamlarının yetki ve kabiliyetlerini ayırmak.",
      "Serialization sınırından geçebilen minimum props sözleşmesi tasarlamak.",
      "Cache/revalidation politikasını kullanıcıya özel veriyle uyumlu kurmak.",
    ],
    prerequisites: [
      "http-request-lifecycle",
      "runtime-boundary-validation",
      "react-state-ownership",
    ],
    related: ["api-contract-evolution", "csrf-xss-and-browser-security", "web-performance-budgets"],
    misconceptions: [
      "Server Component'te render edilen her veri otomatik olarak authorization kontrolünden geçmiştir.",
      "Server Action yalnız server'da çalıştığı için input validation ve CSRF/authorization gerektirmez.",
    ],
    projectContexts: ["VTrade Next.js dashboard", "TaskManagment", "converter upload UI"],
    careerWeight: 5,
    patternWeight: 3,
    freshnessQueries: [
      "Next.js current server client components data security caching",
      "Next.js current server actions security authorization",
    ],
    sourceKeys: ["next-docs", "react-docs", "web-dev"],
    seed: {
      openingCase:
        "VTrade layout'ı userId ile portfolio fetch eder ve framework cache'i key'e user bilgisini katmaz. İkinci kullanıcı ilk kullanıcının render edilmiş bakiyesini görür.",
      predictionPrompt:
        "Bir Client Component'i import eden Server Component zincirinde hangi kod browser bundle'a girer, hangi veri yalnız serialized prop olarak geçer?",
      mentalModel:
        "Server-client sınırı havaalanı gümrüğüdür: kodun nerede çalıştığını, hangi verinin sınırı geçtiğini ve hangi secret'ın içeride kaldığını açıkça kontrol eder.",
      workedExample:
        "Server Component session'ı doğrular, user-scoped query çalıştırır ve yalnız display DTO gönderir. Trade form Client Component'tir; mutation server'da yeniden authz ve validation yapar.",
      labTask:
        "VTrade sayfasında server/client import graph'i ve cache ayarlarını çıkar; iki kullanıcıyla cache isolation testi, bundle secret taraması ve mutation negatif authz testi yaz.",
      doneWhen:
        "Secret/DB client browser bundle'ında yok, kişisel veri çapraz kullanıcı cache'lenmiyor ve her mutation kendi server-side kontrollerini yapıyorsa.",
      transferPrompt:
        "Converter progress polling component'inde job owner kontrolü ilk server render'ında yapıldı diye sonraki route çağrılarından kaldırılabilir mi?",
      reflectionPrompt:
        "`use client` sınırların etkileşim ihtiyacını mı izliyor, yoksa kolaylık için tüm ağacı mı client'a taşıyor?",
      diagram: {
        title: "Server-client veri geçişi",
        nodes: ["Server Component", "Auth + DB", "Serialized props", "Client Component", "Mutation endpoint"],
        edges: [
          { from: 0, to: 1, label: "server only" },
          { from: 1, to: 2, label: "minimum DTO" },
          { from: 2, to: 3, label: "boundary" },
          { from: 3, to: 4, label: "untrusted request" },
        ],
      },
      reviewQuestions: [
        "Server Component authorization'ı mutation için neden yeterli değildir?",
        "Kişiye özel veride cache key/policy hatası hangi sızıntıyı doğurur?",
        "Client boundary'den geçen props neden minimum ve serializable olmalıdır?",
      ],
    },
  },
  {
    slug: "optimistic-ui-and-reconciliation",
    title: "Optimistic UI ve Server ile Uzlaşma",
    domain: "frontend",
    category: "Etkileşim Tutarlılığı",
    difficulty: "advanced",
    summary:
      "Kullanıcı niyetini beklemeden arayüze geçici uygularken server-authoritative sonuç, ordering, rollback ve concurrent update kurallarını açıklar. Optimism'i doğruluk garantisi değil latency gizleme tekniği olarak konumlandırır.",
    whyItMatters:
      "TaskManagment kartı optimistic taşınırken başka kullanıcı aynı kolonu düzenleyebilir. Kör rollback yeni server verisini eski snapshot ile ezebilir; VTrade gibi finansal sonuçlarda optimism daha da sınırlı olmalıdır.",
    objectives: [
      "Optimistic patch'i base version ve mutation id ile ilişkilendirmek.",
      "Başarı, domain red, timeout ve out-of-order response yollarını uzlaştırmak.",
      "Optimism uygulanmaması gereken yüksek riskli işlemleri seçmek.",
    ],
    prerequisites: ["react-state-ownership", "idempotent-api-commands", "state-pattern"],
    related: ["transaction-isolation-and-concurrency", "api-contract-evolution", "caching-and-staleness"],
    misconceptions: [
      "Mutation başarısızsa önceki tüm liste snapshot'ını geri koymak her zaman güvenlidir.",
      "Optimistic UI server validation'ı azaltır; server hâlâ tek otoritedir.",
    ],
    projectContexts: ["TaskManagment drag-drop", "VTrade watchlist", "converter cancel"],
    careerWeight: 5,
    patternWeight: 4,
    freshnessQueries: [
      "React current optimistic UI useOptimistic guidance",
      "Next.js current server actions optimistic updates",
    ],
    sourceKeys: ["react-docs", "next-docs"],
    seed: {
      openingCase:
        "Kullanıcı TaskManagment kartını A'dan B'ye taşır; UI anında güncellenir. Bu sırada WebSocket yeni board version'ını getirir, eski mutation 409 olur ve rollback tüm yeni kartları siler.",
      predictionPrompt:
        "İki optimistic move response'u ters sırada gelirse mutation id ve base version olmadan hangi state doğru kabul edilir?",
      mentalModel:
        "Optimistic state kurşun kalemle yazılmış taslaktır; server cevabı mürekkepli kayıttır. Hata durumunda tüm sayfayı yırtmak yerine yalnız ilgili kalem darbesini geri alırsın.",
      workedExample:
        "Her move local patchId ve expectedBoardVersion taşır. 409'da son server snapshot alınır, pending patch'ler sırayla yeniden uygulanır; başarısız patch kullanıcıya görünür conflict olur.",
      labTask:
        "TaskManagment board reducer'ında pending patch listesi kur; success, validation error, 409, timeout, WebSocket update ve ters response sırasını deterministic test et.",
      doneWhen:
        "Rollback yalnız başarısız patch'i etkiliyor, yeni server verisini silmiyor, pending durumu erişilebilir biçimde görünür ve refresh sonrası aynı nihai state elde ediliyorsa.",
      transferPrompt:
        "VTrade Buy işleminde hangi küçük UI parçaları optimistic olabilir, hangileri server teyidi olmadan kesin gösterilmemelidir?",
      reflectionPrompt:
        "Optimistic akışında kullanıcıya hız kazandırırken hangi belirsizliği gizliyorsun?",
      diagram: {
        title: "Optimistic patch uzlaşması",
        nodes: ["Server base", "Local patch", "Pending UI", "Server response", "Reconciled state"],
        edges: [
          { from: 0, to: 1, label: "base version" },
          { from: 1, to: 2, label: "hemen göster" },
          { from: 2, to: 3, label: "bekle" },
          { from: 3, to: 4, label: "confirm/rebase/remove" },
        ],
      },
      reviewQuestions: [
        "Kör snapshot rollback hangi concurrent update'i kaybettirebilir?",
        "Base version optimistic mutation'da neyi kanıtlar?",
        "Finansal mutation'larda optimism neden sınırlı kullanılmalıdır?",
      ],
    },
  },
  {
    slug: "web-performance-budgets",
    title: "Web Performans Bütçeleri ve Ölçüm",
    domain: "frontend",
    category: "Kullanıcı Deneyimi Performansı",
    difficulty: "intermediate",
    summary:
      "Performansı tek Lighthouse puanı yerine gerçek kullanıcı LCP, INP, CLS, JavaScript, image ve network bütçeleriyle sürekli yönetir; regresyonu CI ve field telemetry ile yakalar.",
    whyItMatters:
      "VTrade dashboard'u hızlı laptopta iyi görünürken orta sınıf mobilde ağır chart bundle'ı ana thread'i kilitleyebilir. Kullanıcı trade fırsatını kaçırır; ortalama server latency bu deneyimi açıklamaz.",
    objectives: [
      "Lab ve field ölçümlerinin farklı sorularını ayırmak.",
      "Route bazlı performans bütçesi ve kritik kullanıcı metriği seçmek.",
      "Bundle, render ve network darboğazını ölçümle ilişkilendirmek.",
    ],
    prerequisites: ["browser-rendering-and-state", "nextjs-server-client-boundaries"],
    related: ["caching-and-staleness", "observability-traces-and-context", "ci-quality-gates"],
    misconceptions: [
      "Lighthouse 100 production kullanıcılarının hızlı deneyim yaşadığını kanıtlar.",
      "Bundle küçültmek her zaman LCP'yi düzeltir; image, server ve render path ayrı ölçülmelidir.",
    ],
    projectContexts: ["VTrade dashboard", "TaskManagment board", "portfolio ve converter"],
    careerWeight: 4,
    patternWeight: 1,
    freshnessQueries: [
      "web.dev current Core Web Vitals thresholds INP LCP CLS",
      "Next.js current bundle analyzer image performance guidance",
    ],
    sourceKeys: ["web-dev", "next-docs"],
    seed: {
      openingCase:
        "VTrade ana sayfa 900 KB chart JavaScript'i ilk render'da yükler. CI hızlı makinede geçer; mobil p75 INP 450 ms olur ve buy formu tıklamaya geç tepki verir.",
      predictionPrompt:
        "Chart'ı dynamic import etmek initial JavaScript'i azaltır; kullanıcı chart sekmesine hemen basarsa hangi yeni latency ve layout riski doğar?",
      mentalModel:
        "Performans bütçesi finans bütçesi gibidir: her feature süre, byte ve main-thread payı harcar. Ölçülmeyen küçük harcamalar birikerek kullanıcı borcuna dönüşür.",
      workedExample:
        "Dashboard için p75 LCP <2.5s, INP <200ms, CLS <0.1 ve initial route JS <180KB bütçesi belirlenir; chart interaction sonrası yüklenir, skeleton sabit alan ayırır.",
      labTask:
        "VTrade route'unu mobil throttle ile profile et; bundle treemap ve performance trace'ten en büyük darboğazı seç, tek değişiklik yap ve lab/field etkisi için ölçüm planı yaz.",
      doneWhen:
        "Bütçeler route ve percentile bazlı, CI regresyonu engelliyor, optimizasyon önce-sonra trace ile kanıtlı ve accessibility bozulmamışsa.",
      transferPrompt:
        "Converter upload sayfasında büyük client library yerine server-side processing seçimi hangi performans ve gizlilik trade-off'unu değiştirir?",
      reflectionPrompt:
        "Son performans kararın gerçek kullanıcı metriğine mi, kişisel cihaz hissine mi dayanıyordu?",
      diagram: {
        title: "Performans geri bildirim döngüsü",
        nodes: ["Bütçe", "Build ölçümü", "Lab trace", "Field RUM", "Regresyon kararı"],
        edges: [
          { from: 0, to: 1, label: "byte sınırı" },
          { from: 1, to: 2, label: "debug" },
          { from: 2, to: 3, label: "yayınla ve gözle" },
          { from: 3, to: 4, label: "p75" },
          { from: 4, to: 0, label: "güncelle" },
        ],
      },
      reviewQuestions: [
        "Lab ve field performans verisi hangi farklı soruları cevaplar?",
        "INP hangi kullanıcı deneyimini ölçer?",
        "Bir performans bütçesi CI'da nasıl enforce edilir?",
      ],
    },
  },
  {
    slug: "csrf-xss-and-browser-security",
    title: "CSRF, XSS ve Tarayıcı Güven Sınırı",
    domain: "security",
    category: "Web Uygulama Güvenliği",
    difficulty: "intermediate",
    summary:
      "Tarayıcının cookie'yi otomatik gönderme ve sayfa script'ine yetki verme davranışlarından doğan CSRF ile XSS'i ayırır; SameSite, anti-CSRF token, output encoding ve CSP kontrollerini katmanlı kullanır.",
    whyItMatters:
      "VTrade auth cookie'si güvenli saklansa bile saldırgan site cross-site Buy isteği gönderebilir; XSS ise kullanıcı adına API çağırabilir. HttpOnly token hırsızlığını azaltır ama script'in session'ı kullanmasını engellemez.",
    objectives: [
      "CSRF ve XSS saldırı önkoşullarını ayrı veri akışlarında göstermek.",
      "Cookie tabanlı mutation için origin/token/SameSite savunmasını tasarlamak.",
      "Untrusted HTML ve URL sink'lerini encoding/sanitization/CSP ile korumak.",
    ],
    prerequisites: [
      "authentication-session-lifecycle",
      "browser-rendering-and-state",
      "runtime-boundary-validation",
    ],
    related: ["nextjs-server-client-boundaries", "threat-modeling-and-trust-boundaries", "object-level-authorization"],
    misconceptions: [
      "CORS CSRF'i tek başına önler; bazı simple requests preflight olmadan gönderilebilir.",
      "React bütün XSS risklerini çözer; raw HTML, URL ve üçüncü parti script sink'leri kalır.",
    ],
    projectContexts: ["VTrade trade formu", "TaskManagment rich text", "portfolio contact formu"],
    careerWeight: 5,
    patternWeight: 2,
    freshnessQueries: [
      "OWASP session CSRF current SameSite guidance",
      "web.dev strict CSP trusted types current",
    ],
    sourceKeys: ["owasp-session", "owasp-auth", "web-dev"],
    seed: {
      openingCase:
        "Kullanıcı VTrade'e login iken saldırgan site gizli form ile `/api/trades` endpoint'ine POST eder. Browser session cookie'sini otomatik ekler; endpoint origin veya CSRF token doğrulamaz.",
      predictionPrompt:
        "SameSite=Lax hangi top-level navigation ve method davranışlarında cookie gönderebilir? Tek kontrol olarak neden yeterli görmemelisin?",
      mentalModel:
        "CSRF kurbanın imzalı zarfını başka siteden postalamaktır; XSS ise kurbanın ofisine içeriden bir yazıcı koymaktır. Biri istek kökenini, diğeri çalıştırılan içeriği hedefler.",
      workedExample:
        "Trade mutation'ı SameSite cookie yanında unpredictable CSRF token ve Origin doğrular. Task açıklaması text olarak render edilir; zorunlu rich HTML ayrı sanitizer ve nonce tabanlı CSP ile sınırlandırılır.",
      labTask:
        "VTrade için cross-origin HTML form PoC ve TaskManagment için stored-XSS fixture'ı oluştur; koruma öncesi başarısız güvenlik testini, sonra aktif endpoint/header davranışını doğrula.",
      doneWhen:
        "Cross-site mutation reddediliyor, untrusted içerik script çalıştıramıyor, CSP report gözleniyor ve koruma gerçek deployment header'larında mevcutsa.",
      transferPrompt:
        "VS Code webview içinde code-review model çıktısını HTML render etmek hangi ayrı XSS sınırını yaratır?",
      reflectionPrompt:
        "Cookie güvenliği ile içerik güvenliğini aynı kontrolün çözdüğünü varsaydığın bir yer var mı?",
      diagram: {
        title: "CSRF ve XSS saldırı yolları",
        nodes: ["Saldırgan site", "Browser cookie", "VTrade API", "Untrusted içerik", "Sayfa script context"],
        edges: [
          { from: 0, to: 1, label: "cross-site request" },
          { from: 1, to: 2, label: "otomatik credential" },
          { from: 3, to: 4, label: "XSS sink" },
          { from: 4, to: 2, label: "kullanıcı yetkisi" },
        ],
      },
      reviewQuestions: [
        "CSRF ile XSS'in saldırgan kabiliyetleri nasıl farklıdır?",
        "CORS neden tek başına CSRF savunması değildir?",
        "HttpOnly cookie XSS etkisini neden tamamen ortadan kaldırmaz?",
      ],
    },
  },
  {
    slug: "file-upload-sandboxing",
    title: "Güvenli Dosya Yükleme ve Sandbox",
    domain: "security",
    category: "Untrusted Content",
    difficulty: "advanced",
    summary:
      "Dosya yüklemeyi isim ve MIME kontrolünden öte; stream limitleri, magic bytes, arşiv genişlemesi, path canonicalization, izole işlem, kaynak kotası ve güvenli indirme yaşam döngüsüyle ele alır.",
    whyItMatters:
      "converter LibreOffice'u kullanıcı dosyası üzerinde çalıştırdığı için parser exploit, zip bomb ve process kaçışı riski taşır. Validation doğru olsa bile dönüştürücüyü ana API container'ında yüksek yetkiyle çalıştırmak blast radius'u büyütür.",
    objectives: [
      "Dosya adı, declared MIME ve gerçek içerik sinyallerini ayrı doğrulamak.",
      "CPU, bellek, disk, süre ve çıktı boyutu için fail-closed kotalar kurmak.",
      "Sandbox ile ana uygulama/tenant verisine erişimi sınırlamak.",
    ],
    prerequisites: ["runtime-boundary-validation", "durable-background-jobs"],
    related: [
      "threat-modeling-and-trust-boundaries",
      "container-build-security",
      "object-level-authorization",
    ],
    misconceptions: [
      "Dosya uzantısı ve Content-Type uyuşuyorsa içerik güvenlidir.",
      "Antivirus taraması parser sandbox, boyut limiti ve authorization ihtiyacını ortadan kaldırır.",
    ],
    projectContexts: ["converter", "TaskManagment attachment", "code-review repository archive"],
    careerWeight: 5,
    patternWeight: 2,
    freshnessQueries: [
      "OWASP file upload current security guidance sandbox",
      "LibreOffice headless container security current CVE guidance",
    ],
    sourceKeys: ["owasp-api", "docker-docs"],
    seed: {
      openingCase:
        "Saldırgan 5 MB görünen fakat açıldığında 20 GB üreten bir PPTX yükler. API boyut kontrolünü geçer; worker temp diski doldurur ve aynı node'daki tüm tenant conversion'ları durur.",
      predictionPrompt:
        "Compressed boyut limiti neden yeterli değildir? Stream açılırken hangi sayaçların hard limit olması gerekir?",
      mentalModel:
        "Yüklenen dosya veri değil, potansiyel programdır: parser'ın karmaşık kod yollarını çalıştırır. Onu misafir değil, karantina laboratuvarındaki bilinmeyen örnek gibi ele al.",
      workedExample:
        "Upload random storage key ile private alana stream edilir; byte limiti ve magic bytes doğrulanır. Ayrı non-root worker network kapalı, read-only rootfs ve CPU/RAM/time/output kotasıyla conversion yapar.",
      labTask:
        "Converter için çift uzantı, traversal adı, oversized stream, zip bomb fixture, timeout ve output explosion test matrisi kur; worker'ın erişebildiği mount/network listesini çıkar.",
      doneWhen:
        "Zararlı input ana API'yi etkilemiyor, kaynak limiti aşımı terminal ve gözlenebilir hata oluyor, dosya random key ile saklanıyor ve download owner kontrolü yapıyorsa.",
      transferPrompt:
        "Code-review arşiv açma özelliğinde symlink ve `../` entry'leri çalışma dizini dışına nasıl yazabilir?",
      reflectionPrompt:
        "Dosya kontrolün yalnız metadata'yı mı, parser'ın gerçek kaynak tüketimini de mi kapsıyor?",
      diagram: {
        title: "Karantinalı dosya işleme hattı",
        nodes: ["Upload stream", "Doğrulama", "Private storage", "Sandbox worker", "Yetkili download"],
        edges: [
          { from: 0, to: 1, label: "byte + content limit" },
          { from: 1, to: 2, label: "random key" },
          { from: 2, to: 3, label: "read-only input" },
          { from: 3, to: 4, label: "bounded output" },
        ],
      },
      reviewQuestions: [
        "Declared MIME neden güvenilir içerik kanıtı değildir?",
        "Zip bomb'a karşı compressed size dışında ne ölçülmelidir?",
        "Sandbox hangi blast radius'u azaltır, hangi validation ihtiyacını kaldırmaz?",
      ],
    },
  },
  {
    slug: "threat-modeling-and-trust-boundaries",
    title: "Threat Modeling ve Trust Boundary",
    domain: "security",
    category: "Güvenlik Tasarımı",
    difficulty: "intermediate",
    summary:
      "Varlıklar, aktörler, veri akışları, güven sınırları ve abuse case'ler üzerinden en pahalı güvenlik failure mode'larını koddan önce görünür kılar; kontrolleri gerçek execution path'e bağlar.",
    whyItMatters:
      "VTrade istemci, fiyat provider'ı ve admin job aynı güven düzeyinde düşünülürse sahte fiyat veya yetki yükseltme fark edilmez. Checklist yerine sistem özelindeki değerli varlık ve saldırgan yoluna odaklanmak gerekir.",
    objectives: [
      "Data-flow diagram üzerinde trust boundary ve varlıkları işaretlemek.",
      "STRIDE kategorilerini somut abuse case üretmek için kullanmak.",
      "Her yüksek risk için önleme, tespit ve recovery kontrolü bağlamak.",
    ],
    prerequisites: ["http-request-lifecycle", "runtime-boundary-validation"],
    related: [
      "object-level-authorization",
      "file-upload-sandboxing",
      "secrets-and-egress-control",
      "ai-guardrails-and-human-review",
    ],
    misconceptions: [
      "Threat model yalnız security ekibinin release sonunda yaptığı belgedir.",
      "Bir kontrol kaynak kodda varsa ilgili saldırı yolu kapalıdır; gerçek route/job wiring'i doğrulanmalıdır.",
    ],
    projectContexts: ["VTrade", "converter", "code-review", "TaskManagment"],
    careerWeight: 5,
    patternWeight: 3,
    freshnessQueries: [
      "OWASP threat modeling current process trust boundaries",
      "OWASP API Security Top 10 current edition",
    ],
    sourceKeys: ["owasp-api", "microsoft-architecture"],
    seed: {
      openingCase:
        "VTrade mobil client pricePerUnit gönderir ve backend bunu type-safe DTO olduğu için kullanır. Sistem diyagramında mobil ile finansal karar arasındaki trust boundary hiç çizilmemiştir.",
      predictionPrompt:
        "VTrade'de korunacak ilk üç varlık nedir ve her biri için saldırgan hangi giriş noktasını kullanabilir?",
      mentalModel:
        "Trust boundary gümrük çizgisidir: veri kimden gelirse gelsin çizgiyi her geçtiğinde kimlik, bütünlük ve yetki yeniden sorgulanır. İç ağ adresi pasaport değildir.",
      workedExample:
        "Client yalnız assetId/quantity/quoteId yollar; API quote'u trusted store'dan okur, authz yapar ve transaction uygular. Sahte fiyat prevention, rejected-quote metric detection, ledger reconciliation recovery sağlar.",
      labTask:
        "Converter için browser, API, object storage, queue, worker, LibreOffice ve download veri akışını çiz; en az sekiz abuse case'i risk/aktif kontrol/test ile eşleştir.",
      doneWhen:
        "Kritik varlık ve sınırlar açık, her yüksek risk çalışan kontrol ve negatif teste bağlı, kabul edilen residual risk sahibiyle belgelenmişse.",
      transferPrompt:
        "Code-review'da repository içeriği prompt instruction taşıdığında hangi yeni trust boundary ortaya çıkar?",
      reflectionPrompt:
        "En son özelliğinde güvenilir sandığın ama aslında kullanıcı veya upstream kontrolündeki veri hangisiydi?",
      diagram: {
        title: "VTrade güven sınırları",
        nodes: ["Kullanıcı cihazı", "Edge/API", "Domain işlem", "PostgreSQL", "Fiyat provider"],
        edges: [
          { from: 0, to: 1, label: "untrusted intent" },
          { from: 1, to: 2, label: "validated command" },
          { from: 2, to: 3, label: "transaction" },
          { from: 4, to: 2, label: "untrusted upstream data" },
        ],
      },
      reviewQuestions: [
        "Trust boundary geçtiğinde hangi kontroller yeniden uygulanır?",
        "Threat modelde prevention, detection ve recovery neden birlikte düşünülür?",
        "Bir helper'ın varlığı active path korumasını neden kanıtlamaz?",
      ],
    },
  },
  {
    slug: "secrets-and-egress-control",
    title: "Secret Yönetimi, SSRF ve Egress Kontrolü",
    domain: "security",
    category: "Infrastructure Security",
    difficulty: "advanced",
    summary:
      "Secret'ların üretim, dağıtım, kullanım, rotation ve redaction yaşamını; kullanıcı kontrollü URL üzerinden iç ağ veya metadata servislerine erişen SSRF riskiyle birlikte ele alır.",
    whyItMatters:
      "Code-review webhook URL'sini server fetch ederse saldırgan cloud metadata endpoint'ine yönlendirebilir. Environment secret'ı doğru saklansa bile process sınırsız egress ve ayrıntılı loglarla onu dışarı çıkarabilir.",
    objectives: [
      "Secret'ı kod/config değeri değil yaşam döngülü yetki olarak yönetmek.",
      "URL parse, DNS resolution, redirect ve private-range kontrollerini SSRF modeliyle tasarlamak.",
      "Least-privilege egress ve log redaction kontrollerini test etmek.",
    ],
    prerequisites: ["threat-modeling-and-trust-boundaries"],
    related: ["container-build-security", "ci-quality-gates", "retrieval-context-and-privacy"],
    misconceptions: [
      "Secret environment variable'daysa otomatik olarak güvenlidir.",
      "SSRF için yalnız URL string'inde `localhost` aramak yeterlidir; DNS rebinding ve redirect yolu kalır.",
    ],
    projectContexts: ["code-review provider token'ları", "VTrade webhook/provider", "converter remote import"],
    careerWeight: 5,
    patternWeight: 2,
    freshnessQueries: [
      "OWASP SSRF prevention current DNS redirect allowlist",
      "Docker secrets current build runtime guidance",
    ],
    sourceKeys: ["owasp-api", "docker-docs", "github-actions"],
    seed: {
      openingCase:
        "Converter URL'den dosya alma özelliği ekler. Saldırgan redirect zinciriyle `169.254.169.254` adresine ulaşıp worker identity credential'ını output dosyasına dönüştürür.",
      predictionPrompt:
        "İlk DNS çözümünde public IP görülen host bağlantı anında private IP'ye dönerse yalnız parse-time kontrol neden aşılır?",
      mentalModel:
        "Secret anahtar, egress ise kapıdır. Anahtarı kasaya koyup process'e tüm kapıları açarsan ele geçirilmiş kod anahtarı yine dışarı taşıyabilir.",
      workedExample:
        "Remote import yalnız allowlist host/HTTPS kabul eder; her redirect yeniden doğrulanır, resolved IP private/link-local aralıklara karşı kontrol edilir, outbound proxy yalnız izinli hedeflere çıkar ve response byte/time limiti uygular.",
      labTask:
        "Converter fetcher için localhost varyasyonları, IPv6, decimal IP, redirect-private, DNS değişimi ve oversized response testleri yaz; loglarda token/URL credential redaction'ını doğrula.",
      doneWhen:
        "Secret repoda/build layer'da yok, rotation yolu testli, outbound hedefler least privilege ve private metadata erişimi redirect/DNS varyasyonlarında engelleniyorsa.",
      transferPrompt:
        "Code-review model provider'ına gönderilen source code teknik olarak egress'tir; hangi policy ve redaction katmanları gerekir?",
      reflectionPrompt:
        "Bir secret sızarsa onu ne kadar sürede iptal edip hangi kullanımları etkilediğini belirleyebilirsin?",
      diagram: {
        title: "Kontrollü outbound istek",
        nodes: ["Untrusted URL", "URL/DNS policy", "Egress proxy", "İzinli upstream", "Secret store"],
        edges: [
          { from: 0, to: 1, label: "parse + resolve" },
          { from: 1, to: 2, label: "allow" },
          { from: 2, to: 3, label: "bounded request" },
          { from: 4, to: 3, label: "scoped credential" },
        ],
      },
      reviewQuestions: [
        "SSRF kontrolü neden her redirect'te yeniden yapılmalıdır?",
        "Secret saklama ile egress kısıtlama hangi farklı riski azaltır?",
        "Build arg ile verilen secret image layer/history açısından neden risklidir?",
      ],
    },
  },
  {
    slug: "retries-timeouts-and-backoff",
    title: "Timeout, Retry, Backoff ve Jitter",
    domain: "reliability",
    category: "Resilience",
    difficulty: "intermediate",
    summary:
      "Dağıtık çağrının sonsuza kadar beklememesi için deadline; geçici hatayı kontrollü yeniden denemek için retry budget, exponential backoff ve jitter tasarlar. Her katmanın bağımsız retry yaparak yükü çarpmasını önler.",
    whyItMatters:
      "Code-review provider çöktüğünde üç katmanın üçer retry'ı 27 çağrı üretir. Timeout yoksa request kaynak tutar; jitter yoksa tüm instance'lar aynı anda tekrar deneyerek bağımlılığı iyileşemez hale getirir.",
    objectives: [
      "Connection, per-attempt ve end-to-end deadline farkını açıklamak.",
      "Retryable, permanent ve unknown-result hataları ayırmak.",
      "Backoff+jitter ve retry budget davranışını fake clock ile test etmek.",
    ],
    prerequisites: ["http-request-lifecycle", "idempotent-api-commands"],
    related: [
      "decorator-pattern",
      "graceful-degradation-and-recovery",
      "observability-traces-and-context",
    ],
    misconceptions: [
      "Her 5xx ve timeout güvenle retry edilebilir.",
      "Exponential backoff tek başına herd davranışını önler; jitter olmadan istemciler senkron kalabilir.",
    ],
    projectContexts: ["code-review DeepSeek", "VTrade market API", "converter LibreOffice/process"],
    careerWeight: 5,
    patternWeight: 4,
    freshnessQueries: [
      "AWS Builders Library timeouts retries backoff jitter current",
      "DeepSeek API current rate limits retry guidance",
    ],
    sourceKeys: ["aws-builders-library", "deepseek-docs"],
    seed: {
      openingCase:
        "DeepSeek 429 döndürür; route, service ve SDK ayrı ayrı üç retry yapar. Tek kullanıcı isteği 27 çağrı ve 80 saniye latency üretir, provider rate limit penceresi sürekli uzar.",
      predictionPrompt:
        "Toplam kullanıcı deadline'ı 10 saniyeyse üç attempt'in timeout ve backoff bütçesini nasıl paylaştırırsın?",
      mentalModel:
        "Retry ücretsiz ikinci şans değil, bağımlılıktan alınan kredidir. Hata anında herkes kredi çekerse sistem iflas eder; deadline ve budget harcamayı sınırlar, jitter sırayı dağıtır.",
      workedExample:
        "Tek retry katmanı 8 saniye total deadline içinde en fazla üç attempt yapar; 429/503 ve connect reset retryable, validation 4xx permanent, mutation timeout ise idempotency lookup gerektiren unknown olur.",
      labTask:
        "Code-review provider adapter'ında fake clock ve scripted responses kullan; 429 Retry-After, timeout, 400 ve cancellation senaryolarında çağrı sayısı, toplam süre ve jitter aralığını doğrula.",
      doneWhen:
        "Tek retry sahibi var, deadline tüm çağrı ağacına yayılıyor, permanent hata tekrar edilmiyor ve outage sırasında trafik budget içinde kalıyorsa.",
      transferPrompt:
        "LibreOffice process'i timeout sonrası kill edildiğinde aynı conversion'ı retry etmek için output cleanup ve idempotency nasıl tasarlanmalıdır?",
      reflectionPrompt:
        "Retry politikan bağımlılığın iyileşmesine alan mı bırakıyor, yoksa failure'ı büyütüyor mu?",
      diagram: {
        title: "Deadline içindeki retry bütçesi",
        nodes: ["Total deadline", "Attempt 1", "Backoff+jitter", "Attempt 2", "Sonuç/fail"],
        edges: [
          { from: 0, to: 1, label: "kalan süre" },
          { from: 1, to: 2, label: "retryable" },
          { from: 2, to: 3, label: "gecik" },
          { from: 3, to: 4, label: "başarı veya budget bitti" },
        ],
      },
      reviewQuestions: [
        "Per-attempt timeout ile end-to-end deadline nasıl farklıdır?",
        "Retry katmanlarının çarpılması neden load amplification yaratır?",
        "Unknown-result mutation neden idempotency olmadan körlemesine retry edilmemelidir?",
      ],
    },
  },
  {
    slug: "messaging-delivery-semantics",
    title: "Mesaj Teslimat Semantiği ve Idempotent Consumer",
    domain: "reliability",
    category: "Messaging",
    difficulty: "advanced",
    summary:
      "At-most-once, at-least-once ve uygulama düzeyi effectively-once etkilerini ack/crash zaman çizelgeleriyle açıklar; duplicate, ordering, poison message ve consumer deduplication tasarlar.",
    whyItMatters:
      "VTrade consumer portfolio'yu increment eder ve ack öncesi çökerse mesaj yeniden gelir, holding iki kez artar. Broker'ın exactly-once etiketi dış database yan etkisini otomatik olarak tekilleştirmez.",
    objectives: [
      "Ack'ten önce/sonra crash senaryolarını teslimat garantisiyle ilişkilendirmek.",
      "Inbox/processed-event constraint'i ile idempotent consumer kurmak.",
      "Ordering key, retry ve dead-letter politikasını domain'e göre seçmek.",
    ],
    prerequisites: [
      "idempotent-api-commands",
      "transactional-outbox-pattern",
      "durable-background-jobs",
    ],
    related: ["saga-pattern", "domain-events", "observability-traces-and-context"],
    misconceptions: [
      "Message broker exactly-once diyorsa tüm harici yan etkiler exactly-once olur.",
      "Dead-letter queue hatayı çözer; aslında yalnız karantinaya alır ve operasyon ister.",
    ],
    projectContexts: ["VTrade portfolio projection", "converter queue", "TaskManagment notifications"],
    careerWeight: 5,
    patternWeight: 4,
    freshnessQueries: [
      "microservices idempotent consumer pattern current",
      "message delivery semantics exactly once external side effects current",
    ],
    sourceKeys: ["microservices-patterns", "postgres-transactions"],
    seed: {
      openingCase:
        "Portfolio consumer TradeExecuted event'ini işler, quantity ekler; ack gönderemeden process ölür. Redelivery aynı increment'i tekrar yapar ve kullanıcı gerçekte aldığının iki katını görür.",
      predictionPrompt:
        "Mesajı işlemden önce ack etmek ile işlemden sonra ack etmek hangi kayıp/duplicate risklerini değiştirir?",
      mentalModel:
        "Mesaj teslimatı imzalı kargo gibidir: imzadan önce kargo kaybolabilir, teslimden sonra imza kaybolabilir. Sistem aynı paketin yeniden gelmesini normal kabul etmelidir.",
      workedExample:
        "Consumer tek DB transaction'da `processed_events(event_id)` insert ve projection upsert yapar. UNIQUE ihlali duplicate'i no-op yapar; offset/ack commit sonrasında ilerler.",
      labTask:
        "VTrade consumer'ında yan etki öncesi, yan etki sonrası ve ack öncesi crash enjekte et; duplicate ve out-of-order event fixture'larında portfolio invariant'ını doğrula.",
      doneWhen:
        "Her crash noktasında event ya yeniden işleniyor ya tamamlanmış sayılıyor, duplicate etki yok, poison event alarm/DLQ runbook'una bağlıysa.",
      transferPrompt:
        "TaskManagment email consumer'ında aynı mesajın iki kez gelmesi nasıl kullanıcı-visible duplicate'i engelleyecek?",
      reflectionPrompt:
        "Consumer'ın idempotent olduğunu yalnız kod yoluna mı, database constraint'e de mi dayandırıyorsun?",
      diagram: {
        title: "At-least-once consumer işlemi",
        nodes: ["Broker mesajı", "Consumer", "Inbox UNIQUE", "Domain yan etkisi", "Ack"],
        edges: [
          { from: 0, to: 1, label: "deliver/redeliver" },
          { from: 1, to: 2, label: "dedupe" },
          { from: 2, to: 3, label: "aynı tx" },
          { from: 3, to: 4, label: "commit sonrası" },
        ],
      },
      reviewQuestions: [
        "Ack'i işlemden önce vermek hangi kayıp riskini doğurur?",
        "Broker exactly-once özelliği dış database update'ini neden kapsamayabilir?",
        "Inbox kaydı ile domain yan etkisi neden aynı transaction'da olmalıdır?",
      ],
    },
  },
  {
    slug: "observability-traces-and-context",
    title: "Observability: Log, Metric, Trace ve Context",
    domain: "reliability",
    category: "Production Teşhisi",
    difficulty: "intermediate",
    summary:
      "Sistemin iç durumunu önceden tahmin edilmeyen sorularla anlayabilmek için yapılandırılmış log, düşük kardinaliteli metric ve dağıtık trace'i ortak correlation bağlamında tasarlar.",
    whyItMatters:
      "Converter 'failed' logu jobId, attempt ve exit code taşımıyorsa kullanıcı hatasıyla worker kaynak tükenmesi ayrılmaz. VTrade tradeId trace'i yoksa API, DB ve outbox gecikmesi arasında kök neden bulunamaz.",
    objectives: [
      "Log, metric ve trace'in cevapladığı farklı soruları ayırmak.",
      "Request/job/event context'ini async sınırlar boyunca taşımak.",
      "PII/secret redaction ve metric cardinality bütçesi uygulamak.",
    ],
    prerequisites: ["http-request-lifecycle", "durable-background-jobs"],
    related: ["slos-and-error-budgets", "retries-timeouts-and-backoff", "transactional-outbox-pattern"],
    misconceptions: [
      "Daha fazla log otomatik olarak daha iyi observability sağlar.",
      "UserId veya raw URL'yi metric label yapmak yararlıdır; cardinality ve gizlilik maliyeti patlayabilir.",
    ],
    projectContexts: ["VTrade trade trace'i", "converter job", "code-review model çağrısı"],
    careerWeight: 5,
    patternWeight: 3,
    freshnessQueries: [
      "OpenTelemetry current semantic conventions HTTP database GenAI",
      "OpenTelemetry current context propagation messaging",
    ],
    sourceKeys: ["opentelemetry"],
    seed: {
      openingCase:
        "VTrade kullanıcısı trade'in kaybolduğunu söyler. Loglarda üç farklı `success` satırı vardır ama requestId, tradeId veya transaction sonucu yoktur; olay yeniden üretilemez.",
      predictionPrompt:
        "TradeId metric label olarak eklenirse neden sorgu kolaylaşırken metric sistemi zarar görebilir? Onu nerede taşımalısın?",
      mentalModel:
        "Observability kara kutuya yerleştirilen uçuş kayıt sistemidir: log olayın ayrıntısını, metric filonun eğilimini, trace tek yolculuğun nedensel rotasını gösterir.",
      workedExample:
        "HTTP span tradeId baggage değil güvenli attribute olarak taşır; DB/outbox child span'leri oluşur. Counter outcome+operation düşük kardinalite taşır, structured log traceId ile ayrıntıya bağlanır.",
      labTask:
        "VTrade Buy veya converter job akışını OpenTelemetry ile izle; success, validation reject, DB timeout ve retry yollarında trace ağacı, metric ve redact edilmiş logları doğrula.",
      doneWhen:
        "Tek correlation id ile uçtan uca yol bulunuyor, failure span'da sınıflı, metric label'ları bounded ve secret/PII telemetry'ye düşmüyorsa.",
      transferPrompt:
        "Code-review model/prompt version bilgisini trace ve metric'te hangi kardinaliteyle taşırsın?",
      reflectionPrompt:
        "Production'da bugün soramayacağın en pahalı teşhis sorusu nedir?",
      diagram: {
        title: "Tek işlem, üç telemetry sinyali",
        nodes: ["Request/job", "Trace ağacı", "Structured log", "Metric", "Teşhis"],
        edges: [
          { from: 0, to: 1, label: "nedensel yol" },
          { from: 1, to: 2, label: "traceId" },
          { from: 1, to: 3, label: "bounded dimensions" },
          { from: 2, to: 4, label: "ayrıntı" },
          { from: 3, to: 4, label: "eğilim" },
        ],
      },
      reviewQuestions: [
        "Log, metric ve trace hangi farklı soruları cevaplar?",
        "Yüksek kardinaliteli değer metric label'ında hangi sorunu yaratır?",
        "Async queue sınırında trace context nasıl devam ettirilir?",
      ],
    },
  },
  {
    slug: "slos-and-error-budgets",
    title: "SLI, SLO ve Error Budget",
    domain: "reliability",
    category: "Service Reliability",
    difficulty: "advanced",
    summary:
      "Kullanıcı açısından başarı ve hız sinyallerini SLI olarak ölçer, hedef güvenilirliği SLO ile tanımlar ve kalan hata payını release hızıyla reliability yatırımı arasında karar mekanizmasına dönüştürür.",
    whyItMatters:
      "VTrade health endpoint'i yüzde 100 up iken trade'lerin yüzde 8'i stale quote yüzünden başarısız olabilir. Teknik uptime kullanıcı yolculuğunun başarısını ölçmez; yanlış SLI yanlış güven verir.",
    objectives: [
      "Kritik kullanıcı yolculuğu için iyi event/toplam event SLI'sı yazmak.",
      "Percentile latency ve availability hedeflerini risk bazlı seçmek.",
      "Burn-rate alert ve error-budget politikasını release kararına bağlamak.",
    ],
    prerequisites: ["observability-traces-and-context", "web-performance-budgets"],
    related: ["graceful-degradation-and-recovery", "feature-flags-and-progressive-delivery", "ci-quality-gates"],
    misconceptions: [
      "SLO mümkün olan en yüksek yüzde olmalıdır; 100% hedef değişim ve maliyet gerçeğini yok sayar.",
      "Ortalama latency kullanıcı kuyruğundaki kötü kuyruğu gösterir; percentile daha anlamlıdır.",
    ],
    projectContexts: ["VTrade trade", "converter completion", "code-review generation"],
    careerWeight: 5,
    patternWeight: 2,
    freshnessQueries: [
      "OpenTelemetry SLI instrumentation current guidance",
      "AWS Builders Library availability error budget current",
    ],
    sourceKeys: ["opentelemetry", "aws-builders-library"],
    seed: {
      openingCase:
        "Converter API 202 döndürdüğü için availability dashboard'u yeşildir; fakat job'ların yüzde 15'i 30 dakika sonra timeout olur. Kullanıcının sonucu alma yolculuğu ölçülmemiştir.",
      predictionPrompt:
        "Converter için başarılı upload response mu, süre içinde indirilebilir output mu iyi event sayılmalıdır? SLO penceresini seç.",
      mentalModel:
        "SLO kullanıcıyla yapılmış ölçülebilir söz, error budget ise bu söz içinde harcanabilecek risk sermayesidir. Sermaye hızlı release'e de arıza payına da gider.",
      workedExample:
        "VTrade SLI: yetkili ve geçerli Buy komutlarından 2 saniye içinde kesin success/domain-reject sonucu alanlar / tüm geçerli Buy komutları. Unknown 5xx ve timeout kötü event'tir.",
      labTask:
        "VTrade, converter veya code-review için bir availability ve bir latency SLI tanımla; telemetry sorgusu, 30 günlük hedef ve hızlı/yavaş burn alert eşikleri yaz.",
      doneWhen:
        "SLI gerçek kullanıcı sonucunu ölçüyor, numerator/denominator koddan üretilebilir, alert semptom bazlı ve budget tüketimi açık release politikasına bağlıysa.",
      transferPrompt:
        "AI code-review quality için latency SLO sağlanırken doğruluk düşüyorsa tek boyutlu SLO neden yetersizdir?",
      reflectionPrompt:
        "Mevcut uptime metriğin kullanıcıya hangi başarısız deneyimi görünmez bırakıyor?",
      diagram: {
        title: "Olaylardan reliability kararına",
        nodes: ["Kullanıcı eventleri", "SLI", "SLO hedefi", "Error budget", "Release/reliability kararı"],
        edges: [
          { from: 0, to: 1, label: "iyi/toplam" },
          { from: 1, to: 2, label: "pencere" },
          { from: 2, to: 3, label: "kalan hata payı" },
          { from: 3, to: 4, label: "policy" },
        ],
      },
      reviewQuestions: [
        "SLI ile SLO arasındaki fark nedir?",
        "Health endpoint availability'si neden kullanıcı journey SLI'sı olmayabilir?",
        "Burn-rate alert sabit hata sayısından neden daha kullanışlıdır?",
      ],
    },
  },
  {
    slug: "graceful-degradation-and-recovery",
    title: "Graceful Degradation, Reconciliation ve Recovery",
    domain: "reliability",
    category: "Failure Management",
    difficulty: "advanced",
    summary:
      "Bağımlılık veya kapasite kaybında hangi özelliklerin güvenle azalacağını, hangilerinin fail closed olacağını belirler; restart sonrası reconciliation ve operatör runbook'uyla sistemi bilinen doğru duruma taşır.",
    whyItMatters:
      "VTrade fiyat provider'ı çöktüğünde watchlist son bilinen fiyatı gösterebilir, fakat trade execution aynı şekilde devam edemez. Her hatada tüm sistemi kapatmak kadar her şeyi stale veriyle sürdürmek de yanlıştır.",
    objectives: [
      "Core ve optional kullanıcı kabiliyetlerini failure domain'e göre ayırmak.",
      "Degraded mode'u açık freshness ve capability sinyalleriyle tasarlamak.",
      "Reconciliation, retry ve manuel recovery yollarını runbook'a bağlamak.",
    ],
    prerequisites: [
      "retries-timeouts-and-backoff",
      "caching-and-staleness",
      "slos-and-error-budgets",
    ],
    related: ["saga-pattern", "durable-background-jobs", "feature-flags-and-progressive-delivery"],
    misconceptions: [
      "Graceful degradation bütün özelliklerin kısmen çalışmasıdır; kritik doğruluk akışları fail closed olabilir.",
      "Retry recovery'dir; kalıcı sapmış veri için reconciliation gerekir.",
    ],
    projectContexts: ["VTrade provider outage", "converter worker capacity", "code-review AI fallback"],
    careerWeight: 5,
    patternWeight: 3,
    freshnessQueries: [
      "AWS Builders Library graceful degradation overload current",
      "reconciliation jobs distributed systems current patterns",
    ],
    sourceKeys: ["aws-builders-library", "opentelemetry", "microservices-patterns"],
    seed: {
      openingCase:
        "CoinGecko çöker. VTrade endpoint'i cached price'ı timestamp olmadan 200 döndürür ve Buy'ı açık bırakır; kullanıcı saatler eski değeri güncel sanarak işlem yapar.",
      predictionPrompt:
        "Market data yokken watchlist, portfolio valuation, buy ve withdrawal özelliklerinin her biri nasıl davranmalı? Doğruluk riskine göre sınıflandır.",
      mentalModel:
        "Sistem su geçirmez bölmeli gemidir: bir bölüm su alınca kritik bölmeler kapanır, güvenli servisler sınırlı devam eder. Sonra pompa ve hasar sayımı reconciliation yapar.",
      workedExample:
        "VTrade display son fiyatı `asOf` ve degraded banner ile gösterir; Buy/Sell yeni trusted quote olmadan 503 problem döner. Recovery sonrası ledger, open order ve reservation reconciliation çalışır.",
      labTask:
        "VTrade veya converter dependency matrix'i oluştur; timeout, partial outage, queue saturation ve recovery için kullanıcı davranışı, metric, alert ve reconciliation adımını test et.",
      doneWhen:
        "Her bağımlılık kaybında açık ürün davranışı var, kritik invariant fail closed, recovery otomatik kontrol ediliyor ve operatör belirsiz state'i sorgulayabiliyorsa.",
      transferPrompt:
        "Code-review'da ana model çöktüğünde daha zayıf modele fallback etmek kalite ve disclosure açısından nasıl güvenli yapılır?",
      reflectionPrompt:
        "Fallback'in gerçekten daha güvenli mi, yoksa hatayı kullanıcıdan gizleyen daha yanlış bir sonuç mu üretiyor?",
      diagram: {
        title: "Normalden degraded ve recovery'ye",
        nodes: ["Normal servis", "Bağımlılık hatası", "Capability policy", "Degraded/fail closed", "Reconciliation"],
        edges: [
          { from: 0, to: 1, label: "failure" },
          { from: 1, to: 2, label: "sınıflandır" },
          { from: 2, to: 3, label: "ürün davranışı" },
          { from: 3, to: 4, label: "recovery" },
          { from: 4, to: 0, label: "doğrula" },
        ],
      },
      reviewQuestions: [
        "Graceful degradation ile fail closed hangi risk ölçütüyle seçilir?",
        "Retry ile reconciliation hangi farklı sistem durumlarını düzeltir?",
        "Degraded mode kullanıcıya hangi freshness/capability bilgisini vermelidir?",
      ],
    },
  },
  {
    slug: "container-build-security",
    title: "Container Build Güvenliği ve Supply Chain",
    domain: "delivery",
    category: "Containerization",
    difficulty: "intermediate",
    summary:
      "Container image'ını çalışan paket değil, provenance ve saldırı yüzeyi olan immutable artifact olarak ele alır; pinned base, multi-stage build, non-root runtime, secret mount, SBOM ve vulnerability triage uygular.",
    whyItMatters:
      "Converter image'ı root olarak çalışıp Docker socket veya geniş host mount görürse zararlı dosya parser açığı host'a sıçrayabilir. `latest` base etiketi aynı commit'ten farklı ve denetlenemez image üretir.",
    objectives: [
      "Build ve runtime bağımlılıklarını ayrı stage'lere bölmek.",
      "Image kaynağını digest, lockfile ve provenance ile tekrarlanabilir yapmak.",
      "Runtime user, filesystem, capability ve secret erişimini en aza indirmek.",
    ],
    prerequisites: ["file-upload-sandboxing", "secrets-and-egress-control"],
    related: ["ci-quality-gates", "zero-downtime-database-delivery", "graceful-degradation-and-recovery"],
    misconceptions: [
      "Container VM gibi tam bir güvenlik sınırıdır.",
      "En küçük image otomatik en güvenli image'dır; patch/provenance ve gerekli runtime araçları da önemlidir.",
    ],
    projectContexts: ["converter sandbox worker", "VTrade deployment", "code-review CI image"],
    careerWeight: 5,
    patternWeight: 2,
    freshnessQueries: [
      "Docker current build security best practices secrets provenance SBOM",
      "Docker current rootless read only filesystem capabilities guidance",
    ],
    sourceKeys: ["docker-docs", "github-actions"],
    seed: {
      openingCase:
        "Converter Dockerfile API key'i `ARG` ile alıp RUN adımında config'e yazar, sonra dosyayı siler. Secret final filesystem'de yoktur ama image layer history'sinden çıkarılabilir.",
      predictionPrompt:
        "Dosyayı sonraki layer'da silmek neden önceki layer'daki secret byte'larını yok etmez?",
      mentalModel:
        "Image katmanlı ve imzalı bir valizdir: her layer geçmişte konan şeyi saklar. Runtime'da valizi mümkün olan en az anahtar, oda ve süreyle açarsın.",
      workedExample:
        "Pinned digest'li builder lockfile ile derler; BuildKit secret mount layer'a yazılmaz. Runtime yalnız gerekli binary'leri içerir, non-root UID, read-only rootfs, tmpfs çalışma alanı ve dropped capabilities kullanır.",
      labTask:
        "Converter image'ını history, package listesi, user, mounts, capabilities ve SBOM açısından incele; secret fixture'ın image export içinde bulunmadığını ve read-only/non-root çalışmayı test et.",
      doneWhen:
        "Aynı source/lock/digest aynı artifact'ı üretiyor, secret layer'da yok, critical bulgular policy'ye göre kapılı ve runtime least privilege ile çalışıyorsa.",
      transferPrompt:
        "VTrade migration aracı production image'ında sürekli bulunmalı mı, ayrı kontrollü artifact mı olmalı? Saldırı yüzeyiyle operasyonu tart.",
      reflectionPrompt:
        "Container'ın erişebildiği hangi host veya network kaynağı uygulamanın gerçek ihtiyacından daha geniş?",
      diagram: {
        title: "Kaynak koddan sınırlı runtime'a",
        nodes: ["Source + lock", "Pinned builder", "SBOM/provenance", "Minimal runtime", "Restricted process"],
        edges: [
          { from: 0, to: 1, label: "reproducible build" },
          { from: 1, to: 2, label: "attest" },
          { from: 2, to: 3, label: "promote" },
          { from: 3, to: 4, label: "non-root + limits" },
        ],
      },
      reviewQuestions: [
        "Build secret neden ARG veya COPY ile image'a konmamalıdır?",
        "Digest pinning hangi reproducibility riskini azaltır?",
        "Non-root çalışmak parser exploit'inin hangi etkisini sınırlar, hangisini önlemez?",
      ],
    },
  },
  {
    slug: "ci-quality-gates",
    title: "CI Quality Gates ve Güvenilir Artifact Promotion",
    domain: "delivery",
    category: "Continuous Integration",
    difficulty: "intermediate",
    summary:
      "Lint çalıştıran workflow'dan öte; typecheck, test, security scan, migration doğrulama ve immutable artifact üretimini bağımlılık sırasıyla zorunlu kalite kapılarına dönüştürür.",
    whyItMatters:
      "VTrade workflow'unda test başarısız olsa bile deploy job'ı `always()` ile devam ederse CI güven sinyali değil otomasyonlu risk olur. Deploy sırasında yeniden build etmek test edilen byte'larla yayınlanan byte'ları ayırır.",
    objectives: [
      "Riskleri en ucuz kanıtlayıcı kontrol seviyesine eşlemek.",
      "Required checks ve job bağımlılıklarıyla başarısızlığı fail closed yapmak.",
      "Bir kez build edilen SHA/digest artifact'ını ortamlar arasında promote etmek.",
    ],
    prerequisites: ["container-build-security", "runtime-boundary-validation"],
    related: [
      "zero-downtime-database-delivery",
      "feature-flags-and-progressive-delivery",
      "web-performance-budgets",
    ],
    misconceptions: [
      "CI dosyasının varlığı quality gate olduğu anlamına gelir.",
      "Production deploy'da tekrar build etmek daha günceldir; test edilmeyen yeni artifact üretir.",
    ],
    projectContexts: ["VTrade GitHub Actions", "code-review Go/extension CI", "converter image"],
    careerWeight: 5,
    patternWeight: 2,
    freshnessQueries: [
      "GitHub Actions current artifact attestations environments required reviewers",
      "GitHub Actions current least privilege permissions OIDC",
    ],
    sourceKeys: ["github-actions", "docker-docs"],
    seed: {
      openingCase:
        "VTrade CI test job'ı kırılır; deploy job'ında dependency olmadığı için son commit yine production'a çıkar. Ayrıca server `docker compose build` yaparak CI'ın taradığı image'dan farklı byte'lar üretir.",
      predictionPrompt:
        "Build, test, scan ve deploy adımlarının artifact ilişkisini çiz; hangi adım kaynak koddan yeniden build ederse güven zinciri kopar?",
      mentalModel:
        "CI havaalanı güvenlik hattıdır: her kapı geçilmeden uçağa binilmez ve kontrol edilen valiz son kapıda başka valizle değiştirilmez.",
      workedExample:
        "Commit SHA için image bir kez build edilir, test/scan/SBOM aynı digest'i doğrular; environment approval sonrası production yalnız digest'i çeker. Workflow token permissions job bazında minimumdur.",
      labTask:
        "VTrade workflow graph'ini çıkar; kasıtlı unit test, migration test ve image scan hatasında deploy'un erişilemez olduğunu doğrula, deploy edilen digest'i build output ile karşılaştır.",
      doneWhen:
        "Tüm kritik kontroller required, deploy yalnız test edilen immutable digest'i kullanıyor, secret long-lived key yerine scoped mekanizmayla geliyor ve provenance kaydediliyorsa.",
      transferPrompt:
        "Code-review eval sonucu gerilerken unit testler geçerse AI kalite kapısını pipeline'a nasıl eklersin?",
      reflectionPrompt:
        "Pipeline'daki hangi yeşil check gerçek bir risk kararını değil yalnız komutun çalıştığını gösteriyor?",
      diagram: {
        title: "Tek artifact'ın promotion zinciri",
        nodes: ["Commit", "Build artifact", "Test + scan", "Approval", "Production digest"],
        edges: [
          { from: 0, to: 1, label: "bir kez build" },
          { from: 1, to: 2, label: "aynı digest" },
          { from: 2, to: 3, label: "gate" },
          { from: 3, to: 4, label: "promote" },
        ],
      },
      reviewQuestions: [
        "Testten sonra yeniden build etmek neden artifact güvenini bozar?",
        "Required check ile workflow step'i arasındaki davranış farkı nedir?",
        "CI token permission'ları neden job bazında en aza indirilmelidir?",
      ],
    },
  },
  {
    slug: "zero-downtime-database-delivery",
    title: "Sıfır Kesintiye Yakın Veritabanı Değişikliği",
    domain: "delivery",
    category: "Database Delivery",
    difficulty: "advanced",
    summary:
      "Eski ve yeni uygulama sürümlerinin rollout boyunca aynı şemayla çalışabilmesi için expand-migrate-contract, online backfill, lock bütçesi ve backward-compatible deployment sırası tasarlar.",
    whyItMatters:
      "VTrade migration'ı yoğun tabloda kolon rename veya NOT NULL default ile uzun lock alırsa tüm trade'ler durabilir. Uygulama rollback olurken şema geri dönemiyorsa otomatik rollback de yeni hata üretir.",
    objectives: [
      "Şema ve uygulama değişikliğini uyumlu çok adımlı rollout'a bölmek.",
      "Migration lock, tablo rewrite ve backfill yükünü production benzeri veride ölçmek.",
      "Forward-fix ve rollback uyumluluğunu release planına dahil etmek.",
    ],
    prerequisites: [
      "relational-modeling-and-constraints",
      "database-transactions",
      "api-contract-evolution",
      "ci-quality-gates",
    ],
    related: ["feature-flags-and-progressive-delivery", "modular-monolith", "architecture-decision-records"],
    misconceptions: [
      "Transactional migration production'da otomatik olarak kesintisizdir; lock süresi yine trafiği durdurabilir.",
      "Uygulama rollback'i her zaman database migration rollback'iyle birlikte yapılmalıdır.",
    ],
    projectContexts: ["VTrade PostgreSQL", "TaskManagment schema", "converter job tablosu"],
    careerWeight: 5,
    patternWeight: 3,
    freshnessQueries: [
      "PostgreSQL current alter table lock rewrite behavior",
      "expand contract database migration zero downtime current",
    ],
    sourceKeys: ["postgres-transactions", "postgres-constraints", "github-actions"],
    seed: {
      openingCase:
        "VTrade deploy'u `trades.amount` kolonunu tek adımda `quantity` olarak rename eder. Rollout sırasında eski pod hâlâ amount yazar ve 500 döner; rollback edilen pod da yeni şemayla çalışamaz.",
      predictionPrompt:
        "Kolon rename'i add-copy-dual-read/write-contract adımlarına böl; her adımda hangi sürümlerin uyumlu olduğunu belirt.",
      mentalModel:
        "Şema değişimi açık kalp ameliyatıdır: eski ve yeni dolaşım bir süre paralel çalışır. Önce yeni yolu aç, trafiği taşı ve doğrula; eski yolu en son kapat.",
      workedExample:
        "Nullable `quantity` eklenir, yeni sürüm dual-write eder ve eski alanı okuyabilir; batch backfill checkpoint'li yürür, doğrulama metric'i sıfır fark gösterir; tüm podlar geçince NOT NULL ve sonra eski kolon kaldırılır.",
      labTask:
        "VTrade benzeri milyon satırlı test tablosunda bir kolon dönüşümünü expand-contract planla; eski/yeni app contract testleri, lock timeout ve restartable backfill yaz.",
      doneWhen:
        "Her deploy adımı önceki sürümle uyumlu, migration bounded lock süresinde, backfill idempotent/restartable ve contract adımı telemetry kanıtından sonra çalışıyorsa.",
      transferPrompt:
        "TaskManagment enum değerini değiştirmek schema kadar veri semantiği migration'ı da gerektirir mi? Eski client davranışını dahil et.",
      reflectionPrompt:
        "Rollback planın yalnız application image'ını mı, o image'ın yeni şemayla uyumunu da mı test ediyor?",
      diagram: {
        title: "Expand-migrate-contract akışı",
        nodes: ["Eski şema", "Expand", "Dual uyumlu app", "Backfill + verify", "Contract"],
        edges: [
          { from: 0, to: 1, label: "ekle" },
          { from: 1, to: 2, label: "deploy" },
          { from: 2, to: 3, label: "taşı" },
          { from: 3, to: 4, label: "kanıttan sonra kaldır" },
        ],
      },
      reviewQuestions: [
        "Expand-contract neden rolling deployment uyumluluğu sağlar?",
        "Büyük backfill neden tek transaction yerine checkpoint'li olabilir?",
        "Application rollback ile schema rollback neden aynı karar değildir?",
      ],
    },
  },
  {
    slug: "feature-flags-and-progressive-delivery",
    title: "Feature Flag ve Progressive Delivery",
    domain: "delivery",
    category: "Release Engineering",
    difficulty: "advanced",
    summary:
      "Deploy ile kullanıcıya açmayı ayırır; deterministik targeting, canary, kill switch, telemetry guardrail ve flag yaşam döngüsüyle blast radius'u kontrollü büyütür.",
    whyItMatters:
      "VTrade yeni matching policy'sini tüm kullanıcılara aynı anda açarsa nadir rounding hatası finansal olarak yayılır. Flag yalnız boolean if değildir; cohort tutarlılığı, veri uyumu ve kaldırma planı gerekir.",
    objectives: [
      "Release, experiment, ops ve permission flag'lerini ayırmak.",
      "Stable cohort ve server-authoritative evaluation tasarlamak.",
      "Metric guardrail ile otomatik durdurma/rollback kararı kurmak.",
    ],
    prerequisites: ["ci-quality-gates", "slos-and-error-budgets", "observability-traces-and-context"],
    related: ["zero-downtime-database-delivery", "strategy-pattern", "architecture-decision-records"],
    misconceptions: [
      "Feature flag authorization kontrolüdür.",
      "Flag kapatmak bütün veri etkilerini geri alır; yeni şema veya yazılmış durum kalabilir.",
    ],
    projectContexts: ["VTrade execution policy", "code-review model rollout", "TaskManagment yeni board"],
    careerWeight: 5,
    patternWeight: 3,
    freshnessQueries: [
      "progressive delivery feature flag current best practices guardrails",
      "GitHub Actions current deployment environments canary guidance",
    ],
    sourceKeys: ["github-actions", "aws-builders-library", "opentelemetry"],
    seed: {
      openingCase:
        "VTrade yeni fee strategy'sini yüzde 10 cohort'a açar fakat her request'te random seçim yapar. Aynı kullanıcının quote ve execution adımları farklı strategy kullanarak tutarsız toplam üretir.",
      predictionPrompt:
        "Cohort kararı userId hash ile sabitlenmezse çok adımlı işlemde hangi invariant bozulabilir?",
      mentalModel:
        "Progressive delivery dimmer anahtarıdır: ışığı bir anda yakmak yerine alan alan artırırsın; smoke metric'i yükselirse enerjiyi kesersin. Kablodaki değişikliği ise flag geri alamaz.",
      workedExample:
        "Server userId+flagVersion hash'iyle stable cohort seçer, quote'a policyVersion yazar ve execution aynı version'ı kullanır. Error rate/ledger mismatch burn threshold'u flag'i otomatik kapatır.",
      labTask:
        "VTrade fee policy veya code-review model rollout'u için yüzde 1-10-50-100 planı; cohort testi, metric guardrail, kill switch ve flag deletion issue'su tasarla.",
      doneWhen:
        "Aynı kullanıcı/işlem kararlı varyant görüyor, kritik karar client flag'ine güvenmiyor, guardrail ölçülüyor ve rollout bitince dead branch kaldırılıyorsa.",
      transferPrompt:
        "Database write formatını flag'lemek neden yalnız UI özelliğini flag'lemekten daha zor rollback edilir?",
      reflectionPrompt:
        "Repodaki hangi flag kalıcı konfigürasyona dönüşmüş ve iki kod yolunu gereksiz yaşatıyor?",
      diagram: {
        title: "Kontrollü rollout döngüsü",
        nodes: ["Immutable deploy", "Stable cohort", "Yeni davranış", "SLI guardrail", "İlerle/durdur"],
        edges: [
          { from: 0, to: 1, label: "flag evaluate" },
          { from: 1, to: 2, label: "varyant" },
          { from: 2, to: 3, label: "ölç" },
          { from: 3, to: 4, label: "policy" },
          { from: 4, to: 1, label: "oranı değiştir" },
        ],
      },
      reviewQuestions: [
        "Feature flag neden authorization yerine geçmez?",
        "Stable cohort çok adımlı işlemlerde neden önemlidir?",
        "Kill switch hangi kalıcı veri etkilerini geri alamaz?",
      ],
    },
  },
  {
    slug: "go-concurrency-and-cancellation",
    title: "Go Concurrency, Context ve Backpressure",
    domain: "backend",
    category: "Go Sistem Programlama",
    difficulty: "advanced",
    summary:
      "Goroutine ve channel'ı ucuz paralellik aracı olarak değil, sahiplik, cancellation, bounded concurrency ve backpressure sözleşmeleriyle yönetilen yaşam döngüleri olarak ele alır.",
    whyItMatters:
      "Code-review CLI her dosya için sınırsız goroutine açarsa büyük repoda memory, file descriptor ve provider rate limit tükenir. Komut iptal olduğunda child işler durmazsa sonuçlar kapanmış channel'a yazabilir veya process asılı kalabilir.",
    objectives: [
      "Goroutine sahipliği ve kapanış sorumluluğunu belirlemek.",
      "Context cancellation/deadline'ını tüm blocking çağrılara yaymak.",
      "Worker pool, semaphore ve bounded queue ile backpressure uygulamak.",
    ],
    prerequisites: ["retries-timeouts-and-backoff", "durable-background-jobs"],
    related: ["messaging-delivery-semantics", "observability-traces-and-context", "strategy-pattern"],
    misconceptions: [
      "Goroutine ucuz olduğu için sınırsız oluşturulabilir.",
      "Context değer çantasıdır; asıl amacı cancellation/deadline sinyalini request scope boyunca taşımaktır.",
    ],
    projectContexts: ["code-review Go CLI", "converter worker", "VTrade reconciliation aracı"],
    careerWeight: 4,
    patternWeight: 3,
    freshnessQueries: [
      "Go current context package cancellation cause documentation",
      "Go current concurrency patterns worker pool errgroup backpressure",
    ],
    sourceKeys: ["go-docs", "aws-builders-library"],
    seed: {
      openingCase:
        "Code-review CLI 30 bin dosyada goroutine başlatır; kullanıcı Ctrl+C yapar fakat model HTTP çağrıları context almamıştır. Process dakikalarca çalışır ve rate-limit kotasını tüketmeye devam eder.",
      predictionPrompt:
        "Producer consumer'dan hızlıysa unbuffered, büyük buffered ve bounded küçük channel davranışlarını bellek ve throughput açısından karşılaştır.",
      mentalModel:
        "Goroutine kiralanmış işçidir: kimin işe aldığı, ne zaman duracağı ve ürünü kime teslim edeceği belli olmalıdır. Backpressure depo dolunca üretim bandını yavaşlatan sensördür.",
      workedExample:
        "`signal.NotifyContext` root context'i iptal eder; bounded errgroup en fazla N dosya işler, HTTP request aynı context'i alır, tek owner results channel'ı worker'lar bittikten sonra kapatır.",
      labTask:
        "Code-review benzeri pipeline kur; race detector altında early error, Ctrl+C, yavaş consumer, provider timeout ve 10 bin input senaryolarında goroutine sayısı ve cleanup süresini ölç.",
      doneWhen:
        "Concurrency bounded, iptal child çağrılara ulaşıyor, channel yalnız sahibi tarafından kapanıyor, leak/race yok ve throughput limiti gerekçeli ise.",
      transferPrompt:
        "Converter'da CPU-bound LibreOffice process sayısı ile network-bound upload worker sayısı neden aynı limit olmamalıdır?",
      reflectionPrompt:
        "Başlattığın goroutine'lerin hangisinin bitmesini kim bekliyor ve hata sonucunu kim sahipleniyor?",
      diagram: {
        title: "Bounded Go pipeline",
        nodes: ["Root context", "Producer", "Bounded queue", "Worker pool", "Result collector"],
        edges: [
          { from: 0, to: 1, label: "cancel" },
          { from: 1, to: 2, label: "backpressure" },
          { from: 2, to: 3, label: "N worker" },
          { from: 3, to: 4, label: "owned results" },
          { from: 0, to: 3, label: "deadline" },
        ],
      },
      reviewQuestions: [
        "Goroutine yaşam döngüsünün sahibi nasıl belirlenir?",
        "Bounded queue hangi overload failure mode'unu önler?",
        "Channel'ı neden sender/owner kapatmalı, receiver rastgele kapatmamalıdır?",
      ],
    },
  },
  {
    slug: "structured-llm-output",
    title: "Yapılandırılmış LLM Çıktısı ve Güvenli Parsing",
    domain: "ai",
    category: "AI Entegrasyonu",
    difficulty: "intermediate",
    summary:
      "Model cevabını serbest metin yerine açık şema, uzunluk ve enum sınırlarıyla ister; yine de cevabı güvenilmeyen dış veri kabul edip runtime parse, semantic validation ve kontrollü fallback uygular.",
    whyItMatters:
      "Code-review modeli geçerli JSON içinde olmayan dosya satırına yorum veya devasa markdown döndürebilir. JSON Schema shape'i kısıtlar; bulgunun gerçek, güvenli ve ilgili olduğunu kanıtlamaz.",
    objectives: [
      "Syntactic, structural ve semantic doğrulamayı ayrı aşamalara bölmek.",
      "Schema'yı tüketici kararına yetecek minimum sözleşme olarak tasarlamak.",
      "Truncation, refusal, malformed output ve provider drift için fallback kurmak.",
    ],
    prerequisites: ["runtime-boundary-validation", "api-contract-evolution"],
    related: [
      "llm-evaluation-and-regression",
      "retrieval-context-and-privacy",
      "ai-guardrails-and-human-review",
      "adapter-pattern",
    ],
    misconceptions: [
      "JSON mode kullanmak alanların doğru ve gerçek olmasını garanti eder.",
      "Parse hatasında cevabı regex ile kurtarmak her zaman güvenlidir; yanlış anlamı geçerliymiş gibi kabul edebilir.",
    ],
    projectContexts: ["code-review finding üretimi", "adaptive learning lesson seed", "converter metadata extraction"],
    careerWeight: 5,
    patternWeight: 3,
    freshnessQueries: [
      "OpenAI current structured outputs JSON schema limitations",
      "DeepSeek current JSON output response format documentation",
    ],
    sourceKeys: ["openai-evals", "deepseek-docs"],
    seed: {
      openingCase:
        "Code-review modeli parse edilebilir JSON döndürür, fakat `line: 9000` dosyada yoktur ve severity=`critical!!!` değeridir. UI doğrudan render edince annotation API hata verir ve tüm review kaybolur.",
      predictionPrompt:
        "Schema-valid bir finding hangi semantic kontrollerden yine geçmelidir? Dosya yolu, satır ve kanıt için kurallar yaz.",
      mentalModel:
        "LLM çıktısı stajyerin doldurduğu formdur: kutular doğru biçimde dolmuş olabilir, fakat iddia ve yetki yine doğrulanır. Schema formu düzenler, gerçeği onaylamaz.",
      workedExample:
        "Adapter response status/refusal/truncation kontrol eder, JSON'u unknown'dan parse eder; finding path'i allowed diff setinde, line değişen aralıkta, severity enum'da ve body limit içindeyse kabul edilir.",
      labTask:
        "Code-review parser'ı için eksik alan, unknown enum, markdown fence, truncated JSON, valid-but-wrong line, prompt injection metni ve oversized body fixture'ları yaz.",
      doneWhen:
        "Bozuk veya semantik geçersiz çıktı UI/pipeline'ı çökertmiyor, reddedilme nedeni metric'te sınıflı ve fallback yanlış bulguyu sessizce yayınlamıyorsa.",
      transferPrompt:
        "Adaptive lesson generator'da üç review question şartını tuple tipi ve runtime parser birlikte nasıl korur?",
      reflectionPrompt:
        "Model cevabındaki hangi alanı şema-valid olduğu için gerçek kabul ediyorsun?",
      diagram: {
        title: "Model token'ından güvenli domain sonucuna",
        nodes: ["Model response", "Envelope kontrolü", "Schema parse", "Semantic validation", "Domain result/fallback"],
        edges: [
          { from: 0, to: 1, label: "status + truncation" },
          { from: 1, to: 2, label: "unknown JSON" },
          { from: 2, to: 3, label: "shape valid" },
          { from: 3, to: 4, label: "kanıtlı veya reddet" },
        ],
      },
      reviewQuestions: [
        "Structured output syntactic ve semantic doğruluk arasında neyi garanti eder?",
        "Truncated model cevabı neden kısmi JSON repair ile sessizce kabul edilmemelidir?",
        "Finding satır numarası hangi güvenilir veriyle doğrulanabilir?",
      ],
    },
  },
  {
    slug: "llm-evaluation-and-regression",
    title: "LLM Evaluation, Golden Dataset ve Regresyon",
    domain: "ai",
    category: "AI Quality Engineering",
    difficulty: "advanced",
    summary:
      "Model veya prompt kalitesini demo hissiyle değil, versiyonlu temsilî dataset, açık rubric, slice bazlı precision/recall, maliyet ve latency ile tekrar ölçer.",
    whyItMatters:
      "Code-review yeni prompt ile daha çok yorum üretip etkileyici görünebilir; false positive artışı geliştiricinin güvenini düşürür. Kritik security bug'ı kaçırma ile stil yorumunu kaçırmanın maliyeti eşit değildir.",
    objectives: [
      "Üretim risklerini temsil eden golden ve adversarial örnek seti kurmak.",
      "Severity/slice bazında precision, recall ve weighted utility hesaplamak.",
      "Prompt, model, evaluator ve dataset version'larını sonuçla birlikte kaydetmek.",
    ],
    prerequisites: ["structured-llm-output"],
    related: [
      "ai-guardrails-and-human-review",
      "retrieval-context-and-privacy",
      "ci-quality-gates",
      "slos-and-error-budgets",
    ],
    misconceptions: [
      "Daha uzun ve daha çok bulgu üreten model daha iyi reviewer'dır.",
      "LLM-as-judge tek başına objektif ground truth sağlar; bias ve evaluator drift ölçülmelidir.",
    ],
    projectContexts: ["code-review", "adaptive learning content", "converter document classification"],
    careerWeight: 5,
    patternWeight: 3,
    freshnessQueries: [
      "OpenAI current evaluation best practices datasets graders",
      "LLM code review precision recall benchmark current",
    ],
    sourceKeys: ["openai-evals", "deepseek-docs"],
    seed: {
      openingCase:
        "Yeni code-review prompt'u 30 yerine 80 yorum üretir ve demo güçlü görünür. İncelemede 50 yorum yanlış alarmdır; geliştiriciler bir hafta sonra tüm AI yorumlarını görmezden gelir.",
      predictionPrompt:
        "Security finding'leri için recall, stil finding'leri için precision neden farklı ağırlık alabilir? Hata maliyet matrisi kur.",
      mentalModel:
        "Eval dataset modelin uçuş simülatörüdür: aynı zor hava koşullarını her sürüme uygular. Tek güzel uçuş değil, bilinen risklerde tekrar edilebilir davranış önemlidir.",
      workedExample:
        "Dataset gerçek/sentetik diff'leri, beklenen finding ve kabul edilebilir varyantları içerir. Authz, concurrency, false-positive trap slice'ları ayrı raporlanır; CI kritik recall düşüşünde kırılır.",
      labTask:
        "Code-review için en az 30 diff'lik başlangıç dataset şeması tasarla; bug category, severity, expected evidence ve no-finding örneklerini etiketle, iki prompt'u kör karşılaştır.",
      doneWhen:
        "Aynı dataset deterministik koşullarda yeniden koşuyor, slice metrikleri ve confidence interval görünür, kalite/maliyet/latency trade-off'u release kapısına bağlıysa.",
      transferPrompt:
        "Adaptive öğrenme içeriğinde 'teknik doğruluk' ve 'öğreticilik' için ayrı rubric neden gerekir?",
      reflectionPrompt:
        "Model kalitesini şu anda kullanıcı güveniyle ilişkili hangi metriği ölçmeden değerlendiriyorsun?",
      diagram: {
        title: "Versiyonlu eval döngüsü",
        nodes: ["Golden dataset", "Model + prompt", "Structured sonuç", "Grader + human audit", "Slice metrikleri"],
        edges: [
          { from: 0, to: 1, label: "aynı vakalar" },
          { from: 1, to: 2, label: "çıktı" },
          { from: 2, to: 3, label: "rubric" },
          { from: 3, to: 4, label: "precision/recall" },
          { from: 4, to: 0, label: "yeni failure ekle" },
        ],
      },
      reviewQuestions: [
        "Precision ve recall code-review ürününde hangi farklı kullanıcı maliyetlerini temsil eder?",
        "Dataset slice'ları aggregate skorun gizlediği neyi gösterir?",
        "LLM-as-judge sonucu neden düzenli insan audit'i ister?",
      ],
    },
  },
  {
    slug: "retrieval-context-and-privacy",
    title: "Retrieval, Context Engineering ve Mahremiyet",
    domain: "ai",
    category: "RAG ve Context",
    difficulty: "advanced",
    summary:
      "Modele daha çok veri vermek yerine göreve ilişkin, yetkili, güncel ve kaynaklanabilir bağlam seçer; retrieval kalitesini, prompt injection'ı, token maliyetini ve data egress politikasını birlikte yönetir.",
    whyItMatters:
      "Code-review tüm repoyu provider'a gönderirse secret, müşteri kodu ve lisanslı içerik sızabilir; gereksiz context gerçek bug sinyalini de seyreltebilir. Retrieval sonucu kullanıcı authorization'ını bypass etmemelidir.",
    objectives: [
      "Chunking ve retrieval stratejisini görev sorusuna göre tasarlamak.",
      "Context precision/recall ve answer groundedness'i ayrı ölçmek.",
      "Tenant authorization, redaction, retention ve provider egress policy uygulamak.",
    ],
    prerequisites: [
      "structured-llm-output",
      "threat-modeling-and-trust-boundaries",
      "object-level-authorization",
      "indexes-and-query-plans",
    ],
    related: ["llm-evaluation-and-regression", "secrets-and-egress-control", "ai-guardrails-and-human-review"],
    misconceptions: [
      "Context window büyüdükçe cevap kalitesi monoton artar.",
      "Vector similarity authorization filtresidir; benzer ama başka tenant'a ait belgeyi döndürebilir.",
    ],
    projectContexts: ["code-review repository context", "adaptive learning kaynak seçimi", "TaskManagment AI arama"],
    careerWeight: 5,
    patternWeight: 3,
    freshnessQueries: [
      "OpenAI current retrieval eval context precision groundedness",
      "prompt injection RAG data exfiltration current guidance",
    ],
    sourceKeys: ["openai-evals", "owasp-api", "deepseek-docs"],
    seed: {
      openingCase:
        "Code-review retrieval sistemi `.env.example`, test fixture ve başka workspace cache'ini semantik olarak ilgili bulup prompt'a ekler. Model yorumunda gerçek API key'i tekrarlar.",
      predictionPrompt:
        "Retrieval query'sine tenant filtresi sonuç geldikten sonra uygulanırsa top-k kalitesi ve veri sızıntısı nasıl etkilenir?",
      mentalModel:
        "Context açık kitap sınavındaki masadır: masaya bütün kütüphaneyi yığmak düşünmeyi kolaylaştırmaz. Yalnız yetkili ve ilgili sayfalar gelir; sayfadaki talimat öğretmenin talimatı sayılmaz.",
      workedExample:
        "Diff symbol'larından import/call graph ile aday dosyalar seçilir, secret scanner redaction yapar, tenant/repo filter retrieval öncesi uygulanır; chunk'lar path+commit citation taşır ve prompt içeriği data olarak sınırlandırılır.",
      labTask:
        "Code-review için whole-repo ve selective-context stratejilerini aynı eval setinde karşılaştır; token, kritik recall, context precision, secret exposure ve latency ölç.",
      doneWhen:
        "Gönderilen her chunk'ın authorization/source/version'ı izleniyor, secret policy uygulanıyor, retrieval metriği kaliteyi kanıtlıyor ve kullanıcı silme/retention politikası açık ise.",
      transferPrompt:
        "TaskManagment AI özeti yalnız kullanıcının görebildiği task'ları nasıl retrieve etmeli ve sonradan permission değişirse cache ne olmalı?",
      reflectionPrompt:
        "Modele gönderdiğin context'in her satırı gerçekten karar kalitesine katkı sağlıyor mu ve gönderilmesine yetkin var mı?",
      diagram: {
        title: "Yetkili context üretim hattı",
        nodes: ["Kullanıcı görevi", "Authz + source filter", "Retriever", "Redaction + ranking", "Model + citations"],
        edges: [
          { from: 0, to: 1, label: "tenant/repo" },
          { from: 1, to: 2, label: "izinli corpus" },
          { from: 2, to: 3, label: "aday chunk" },
          { from: 3, to: 4, label: "minimum context" },
        ],
      },
      reviewQuestions: [
        "Retrieval authorization filtresi neden aramadan önce uygulanmalıdır?",
        "Context precision ile answer groundedness hangi farklı kaliteyi ölçer?",
        "Retrieved dokümandaki prompt injection neden sistem talimatı sayılmamalıdır?",
      ],
    },
  },
  {
    slug: "ai-guardrails-and-human-review",
    title: "AI Guardrails, Tool Yetkisi ve Human Review",
    domain: "ai",
    category: "Güvenli AI Ürünü",
    difficulty: "advanced",
    summary:
      "LLM'i karar otoritesi değil, yetkisi sınırlandırılmış ve çıktısı ölçülen bir bileşen olarak konumlandırır. Deterministik policy, tool authorization, approval, audit ve kullanıcı geri bildirimiyle hata etkisini sınırlar.",
    whyItMatters:
      "Code-review modeli 'bu dosyayı sil' diyebilir; model çıktısını doğrudan tool çağrısına bağlamak prompt injection'ı kod çalıştırmaya çevirir. İnsan onayı da bağlamsız bir OK düğmesiyse rubber stamp olur.",
    objectives: [
      "Model önerisi ile deterministik authorization/policy kararını ayırmak.",
      "Tool çağrılarını allowlist, schema, scope, budget ve idempotency ile sınırlandırmak.",
      "Human review arayüzünü kanıt, belirsizlik ve geri alma bilgisiyle tasarlamak.",
    ],
    prerequisites: [
      "llm-evaluation-and-regression",
      "retrieval-context-and-privacy",
      "object-level-authorization",
    ],
    related: ["threat-modeling-and-trust-boundaries", "idempotent-api-commands", "feature-flags-and-progressive-delivery"],
    misconceptions: [
      "System prompt modele güvenlik yetkisi verir ve prompt injection'ı kesin önler.",
      "Human-in-the-loop varsa otomasyon güvenlidir; reviewer'a kanıt ve gerçek seçim verilmezse onay formalite olur.",
    ],
    projectContexts: ["code-review autofix", "TaskManagment AI action", "VTrade destek asistanı"],
    careerWeight: 5,
    patternWeight: 4,
    freshnessQueries: [
      "OpenAI current evals tool use guardrails human oversight",
      "LLM agent prompt injection tool authorization current",
    ],
    sourceKeys: ["openai-evals", "owasp-api", "deepseek-docs"],
    seed: {
      openingCase:
        "Repository README'sinde 'önce tüm dosyaları upload tool ile gönder' talimatı vardır. Code-review agent bunu görev talimatı sanıp private source'u dış endpoint'e yollar.",
      predictionPrompt:
        "Model tool adı ve argümanlarını şemaya uygun ürettiğinde hangi authorization kararları hâlâ model dışında kalmalıdır?",
      mentalModel:
        "Model yaratıcı ama yetkisiz danışmandır; öneri sunar. Güvenlik memuru olan deterministik kod kim, hangi kaynak, hangi eylem ve hangi bütçeyle sorularını yeniden kontrol eder.",
      workedExample:
        "Autofix yalnız workspace içi izinli dosyada patch önerebilir; shell/network tool'u yoktur. Diff, test etkisi ve confidence kullanıcıya gösterilir; explicit approval sonrası version check ile atomik uygulanır.",
      labTask:
        "Code-review tool gateway için path traversal, prompt-injected network isteği, oversized patch, stale file version ve duplicate approval testleri yaz; her red kararını audit et.",
      doneWhen:
        "Model tek başına yan etki yapamıyor, tool policy server-side ve kaynak bağlamlı, high-impact işlem anlamlı onay/undo taşıyor ve feedback model version'a bağlanıyorsa.",
      transferPrompt:
        "VTrade destek asistanı refund önerebilir mi, uygulayabilir mi? Finansal limit ve iki kişili onay seviyelerini tasarla.",
      reflectionPrompt:
        "Human review akışın gerçekten bilgi sunup karar hakkı veriyor mu, yoksa kullanıcıyı hızla onaya mı itiyor?",
      diagram: {
        title: "Modelden kontrollü eyleme",
        nodes: ["Untrusted context", "Model önerisi", "Deterministik policy", "Human approval", "Scoped tool + audit"],
        edges: [
          { from: 0, to: 1, label: "data, not authority" },
          { from: 1, to: 2, label: "schema + authz" },
          { from: 2, to: 3, label: "kanıt göster" },
          { from: 3, to: 4, label: "explicit intent" },
        ],
      },
      reviewQuestions: [
        "Tool authorization neden model prompt'una bırakılamaz?",
        "Anlamlı human review arayüzü hangi kanıtları göstermelidir?",
        "Stale file version kontrolü AI patch uygulamasında hangi race condition'ı önler?",
      ],
    },
  },
  {
    slug: "architecture-decision-records",
    title: "Architecture Decision Records ve Karar Geri Bildirimi",
    domain: "architecture",
    category: "Architecture Practice",
    difficulty: "intermediate",
    summary:
      "Önemli teknik kararın bağlamını, seçeneklerini, trade-off'unu, beklenen sonucunu ve yeniden değerlendirme sinyalini kısa, versiyonlu bir kayıtla korur; kararı ölçümle yaşayan hipoteze dönüştürür.",
    whyItMatters:
      "VTrade neden modular monolith seçtiğini yalnız ekip hafızasında tutarsa altı ay sonra microservice veya shared table tartışması aynı varsayımlarla tekrar edilir. Sonuçları kaydedilmeyen karar dogmaya dönüşür.",
    objectives: [
      "Karar, bağlam, seçenek, consequence ve status alanlarını açık yazmak.",
      "Geri döndürülebilir ve yüksek maliyetli kararlar için farklı kanıt eşiği seçmek.",
      "ADR'yi SLO, maliyet veya coupling metric'iyle yeniden değerlendirmek.",
    ],
    prerequisites: ["modular-monolith"],
    related: [
      "hexagonal-architecture",
      "zero-downtime-database-delivery",
      "feature-flags-and-progressive-delivery",
      "bounded-contexts",
    ],
    misconceptions: [
      "ADR toplantı tutanağı veya uzun tasarım dokümanıdır.",
      "Accepted ADR sonsuza kadar değişmez; superseded durumu ve review trigger'ı olmalıdır.",
    ],
    projectContexts: ["VTrade mimari evrimi", "code-review provider seçimi", "converter sandbox"],
    careerWeight: 4,
    patternWeight: 4,
    freshnessQueries: [
      "architecture decision records current best practices review triggers",
      "Microsoft architecture decision record current guidance",
    ],
    sourceKeys: ["microsoft-architecture", "aws-builders-library"],
    seed: {
      openingCase:
        "Ekip VTrade'ı microservice'e bölmeyi tartışır; kararın önce neden ertelendiğini kimse hatırlamaz. Yeni ekip üyesi deployment sayısını ölçek ihtiyacı sanır ve transaction maliyetini hesaba katmaz.",
      predictionPrompt:
        "'PostgreSQL kullanacağız' ifadesini karar bağlamı, iki alternatif, consequence ve review trigger içeren ADR özetine dönüştür.",
      mentalModel:
        "ADR fosil değil uçuş rotası kaydıdır: o günkü hava, seçilmeyen rotalar ve yakıt varsayımı görünür kalır. Hava değiştiğinde karar suçlanmaz, yeniden hesaplanır.",
      workedExample:
        "ADR: VTrade için modular monolith. Bağlam küçük ekip ve güçlü transaction ihtiyacı; alternatif microservices; consequence tek deploy ve boundary test zorunluluğu; trigger bağımsız ölçek/SLO veya ekip sahipliği kanıtı.",
      labTask:
        "VTrade, code-review veya converter'daki tartışmalı bir seçim için en fazla iki sayfalık ADR yaz; ölçülebilir varsayım, sahip, tarih ve supersede koşulu ekle.",
      doneWhen:
        "Yeni ekip üyesi yalnız kaydı okuyarak neden/bedel/alternatifleri açıklayabiliyor ve kararın ne zaman yeniden açılacağı ölçülebilir ise.",
      transferPrompt:
        "AI provider seçimi için kalite, data residency, maliyet ve fallback varsayımları ADR'ye nasıl bağlanır?",
      reflectionPrompt:
        "Bugün 'best practice' dediğin hangi seçim aslında bağlama bağlı ve ölçülmemiş bir varsayım?",
      diagram: {
        title: "Kararın yaşam döngüsü",
        nodes: ["Bağlam", "Seçenekler", "Karar", "Sonuç metric'leri", "Review/supersede"],
        edges: [
          { from: 0, to: 1, label: "kısıtlar" },
          { from: 1, to: 2, label: "trade-off" },
          { from: 2, to: 3, label: "beklenti" },
          { from: 3, to: 4, label: "trigger" },
          { from: 4, to: 0, label: "yeni bağlam" },
        ],
      },
      reviewQuestions: [
        "ADR hangi bilgiyi kod ve ticket'tan farklı olarak korur?",
        "Review trigger kararı dogmaya dönüşmekten nasıl korur?",
        "Geri döndürülebilir karar ile pahalı tek yönlü kararın kanıt eşiği neden farklıdır?",
      ],
    },
  },
];
