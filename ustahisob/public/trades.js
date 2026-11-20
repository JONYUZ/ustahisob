/* UstaHisob — soha (xizmat turi) profillari.
   Har bir soha uchun: ish nomlari ro'yxati va shu sohaga mos shartnoma matni. */
(function(){
  const PC = 'umumiy summadan';
  const COMMON_PRICE = "Ish jarayonida material yoki bozor narxlarida o'zgarish yuz bersa, narx tegishlicha o'zgarishi mumkin — bu haqda Buyurtmachiga oldindan xabar beriladi va yozma yoki og'zaki kelishib olinadi.";
  const COMMON_ACCEPT = "Ishlar tugagach tomonlar bajarilgan ishlarni qabul qilish dalolatnomasiga (yoki ushbu shartnomaning tegishli bo'limiga) imzo qo'yadi. Buyurtmachi 3 (uch) kun ichida e'tiroz bildirmasa, ishlar qabul qilingan hisoblanadi.";

  const T = {};

  T.mebel = {
    label: "Mebel ustasi",
    tag: "Individual mebel ishlab chiqarish va o'rnatish",
    itemsLabel: "Mebel / xona nomi",
    items: ["Oshxona","Yotoqxona","Mehmonxona (zal)","Prixojka","Bolalar xonasi","Sanuzel mebeli","Garderob","Ofis mebeli","Shkaf-kupe","Stol-stul"],
    customPlaceholder: "Masalan: Balkon shkafi",
    doc: {
      title: "BUYURTMA UCHUN TIJORIY TAKLIF VA SHARTNOMA",
      itemsHeading: "BAJARILADIGAN ISHLAR / MAHSULOTLAR RO'YXATI VA NARXI",
      itemColumn: "Ish / mahsulot nomi",
      avansPct: 70,
      designerRow: true,
      start: "3D model Buyurtmachi tomonidan tasdiqlangan kundan boshlanadi.",
      deliveryLabel: "Topshirish sanasi (tayyorlash muddati)",
      warranty: "12 (o'n ikki) oy (mebel jihozni Buyurtmachi tomonidan o'zboshimchalik bilan ochib, ta'mirlashga harakat qilingan holatlar bundan mustasno)",
      payment: [
        "Mebel jihozning 3D dizayni tayyor bo'lib, Buyurtmachi tomonidan tasdiqlangandan so'ng 3 (uch) kun ichida {PC} {AV}% (avans) to'lanishi shart.",
        "Avans {AV} foiz to'langandan so'ng buyurtma ishlab chiqarishga topshiriladi. Buyurtma tayyor bo'lgach, Bajaruvchi Buyurtmachini chaqirib, mebellarni ko'rsatadi. Buyurtmachi to'lovning qolgan qismini to'laydi, so'ngra mebellar manzilga olib borilib o'rnatiladi.",
        "Mahsulot topshirilgandan so'ng ikkala tomon dalolatnomaga (yoki ushbu shartnomaning tegishli bo'limiga) imzo qo'yadi.",
        COMMON_PRICE,
        "Mebel o'rnatilishi jarayonida obyekt remonti sifati yoki devor/burchak nomutanosibligi ta'sir qilib, buni tuzatish uchun Bajaruvchi tomonidan qo'shimcha xizmat ko'rsatilsa, bu xizmat uchun Buyurtmachi tomonidan alohida to'lov amalga oshiriladi.",
        "Mebel tayyor bo'lgach, Buyurtmachi mahsulotni 3 (uch) kun ichida olib ketmasa, keyingi kundan boshlab har kuni 30 000 (o'ttiz ming) so'm miqdorida saqlov (ijara) haqi hisoblanadi."
      ],
      cancel: [
        "Buyurtma qabul qilingandan so'ng Buyurtmachi buyurtmani bekor qilsa — buyurtma summasidan 20% jarima ushlab qolinadi.",
        "Agar mebel jihozning 3D dizayni yoki konstruksiyasi loyihalashtirilgan bo'lsa — buyurtma summasidan 25% jarima ushlab qolinadi.",
        "Agar buyurtmani tayyorlash uchun xom ashyo allaqachon kesilgan bo'lsa — kelishilgan buyurtma narxining 100% i Buyurtmachi tomonidan to'liq qoplanadi."
      ]
    }
  };

  T.qurilish = {
    label: "Qurilish / g'isht terish",
    tag: "Qurilish va g'isht terish ishlari",
    itemsLabel: "Qurilish ishi nomi",
    items: ["Poydevor ishlari","G'isht terish (devor)","Ichki to'siqlar (peregorodka)","Beton quyish / quyma ishlar","Yopma plita","Karkas (ustun, balka)","Tom konstruksiyasi","Fasad ishlari","Zinapoya qurish","Obyektni butunlay qurish"],
    customPlaceholder: "Masalan: To'siq devor",
    doc: {
      title: "QURILISH ISHLARINI BAJARISH SHARTNOMASI",
      itemsHeading: "BAJARILADIGAN QURILISH ISHLARI RO'YXATI VA NARXI",
      itemColumn: "Qurilish ishi nomi",
      avansPct: 50,
      start: "Buyurtmachi avansni to'laganidan va obyekt (uchastka) ishga topshirilganidan so'ng boshlanadi.",
      deliveryLabel: "Ishlarni yakunlash muddati",
      warranty: "24 (yigirma to'rt) oy (Buyurtmachi tomonidan konstruksiyaga ruxsatsiz o'zgartirish kiritilgan, ortiqcha yuk tushirilgan yoki tabiiy ofat holatlari bundan mustasno)",
      payment: [
        "Shartnoma imzolangach, {PC} {AV}% (avans) to'lanadi. Qolgan summa bosqichma-bosqich: har bir yakunlangan bosqich (poydevor, devor, yopma va h.k.) qabul qilingach to'lanadi.",
        "Qurilish materiallari kim tomonidan sotib olinishi (Bajaruvchi yoki Buyurtmachi) tomonlar o'rtasida alohida kelishiladi. Buyurtmachi materiallarni obyektga o'z vaqtida yetkazmasa, ish muddati shunga mos cho'ziladi.",
        "Buyurtmachi Bajaruvchini obyektga kirish, suv va elektr bilan ta'minlaydi, ishlar uchun zarur ruxsatnomalarni (kerak bo'lsa) o'zi rasmiylashtiradi.",
        "Bajaruvchi mehnat xavfsizligi qoidalariga amal qiladi. Ish joyida Buyurtmachi yoki uchinchi shaxslar tomonidan yetkazilgan zarar uchun Bajaruvchi javobgar emas.",
        COMMON_PRICE,
        COMMON_ACCEPT
      ],
      cancel: [
        "Ishlar boshlanishidan oldin Buyurtmachi shartnomani bekor qilsa — to'langan avansdan 10% ushlab qolinadi, qolgani qaytariladi.",
        "Ishlar boshlangach bekor qilinsa — Buyurtmachi bajarilgan ishlar hajmi va sotib olingan materiallar qiymatini to'liq to'laydi.",
        "Bajaruvchi ishni asossiz to'xtatsa yoki muddatni buzsa — kechikkan har bir kun uchun shartnoma summasining 0,1% miqdorida (jami 10% dan oshmagan holda) penya to'laydi."
      ]
    }
  };

  T.elektrik = {
    label: "Elektrik",
    tag: "Elektr montaji va ta'mirlash ishlari",
    itemsLabel: "Elektr ishi nomi",
    items: ["Elektr simlarini tortish","Rozetka va viklyuchatellar o'rnatish","Elektr shit yig'ish","Yoritish (lampa, lyustra) montaji","Zaminlash tizimi","Hisoblagich ulash","Kuchsiz tok (internet, video, signalizatsiya)","Avtomat (himoya) almashtirish","Elektr tarmog'ini diagnostika qilish","Isitish (issiq pol) elektr ulanishi"],
    customPlaceholder: "Masalan: Tashqi yoritish",
    doc: {
      title: "ELEKTR MONTAJ ISHLARINI BAJARISH SHARTNOMASI",
      itemsHeading: "BAJARILADIGAN ELEKTR ISHLARI RO'YXATI VA NARXI",
      itemColumn: "Elektr ishi nomi",
      avansPct: 50,
      start: "Buyurtmachi avansni to'lagan va obyektga kirish imkonini bergan kundan boshlanadi.",
      deliveryLabel: "Ishlarni yakunlash muddati",
      warranty: "12 (o'n ikki) oy bajarilgan montaj ishlariga; materiallar va jihozlarga — ishlab chiqaruvchi kafolati (Buyurtmachi tomonidan tarmoqqa ruxsatsiz aralashilgan yoki kuchlanish keskin o'zgargan holatlar bundan mustasno)",
      payment: [
        "Ishlar boshlanishidan oldin {PC} {AV}% (avans) to'lanadi, qolgan qismi ishlar tugab, tarmoq sinovdan o'tkazilgach to'lanadi.",
        "Kabel, avtomat, rozetka va boshqa materiallar Bajaruvchi tomonidan xarid qilinsa, ularning narxi alohida ko'rsatiladi; Buyurtmachi o'z materialini bersa, uning sifati uchun Bajaruvchi javobgar emas.",
        "Bajaruvchi elektr xavfsizligi qoidalariga amal qiladi. Ishlar vaqtida tarmoq o'chirilishi mumkinligi Buyurtmachiga oldindan ma'lum qilinadi.",
        "Devor/shift ochish (shtroba) va keyingi tiklash (suvoq, bo'yoq) ishlari narxga kiritilmagan bo'lsa, alohida kelishiladi va alohida to'lanadi.",
        "Eskirgan yoki talabga javob bermaydigan mavjud tarmoq aniqlansa, Bajaruvchi buni Buyurtmachiga bildiradi; uni almashtirish qo'shimcha ish sifatida alohida to'lanadi.",
        COMMON_PRICE,
        COMMON_ACCEPT
      ],
      cancel: [
        "Materiallar sotib olinmagan va ish boshlanmagan bo'lsa, Buyurtmachi bekor qilganda avansning 10% i ushlab qolinadi.",
        "Ish boshlangach bekor qilinsa — bajarilgan ishlar va sotib olingan materiallar qiymati to'liq to'lanadi.",
        "Buyurtmachi tomonidan Bajaruvchining tavsiyalariga zid ravishda o'zgartirish talab qilinib, bu avariyaga olib kelsa, javobgarlik Buyurtmachida bo'ladi."
      ]
    }
  };

  T.santexnik = {
    label: "Santexnik",
    tag: "Santexnika va isitish tizimlari ishlari",
    itemsLabel: "Santexnika ishi nomi",
    items: ["Suv quvurlarini o'tkazish","Kanalizatsiya tizimi","Vanna / dush kabinasi o'rnatish","Unitaz va rakovina o'rnatish","Radiator va isitish tizimi","Qozon (kotyol) montaji","Suv isitgich (boyler) o'rnatish","Suv filtri va hisoblagich","Quvur tiqilishini tozalash","Oshxona santexnikasi"],
    customPlaceholder: "Masalan: Bog' uchun sug'orish quvuri",
    doc: {
      title: "SANTEXNIKA ISHLARINI BAJARISH SHARTNOMASI",
      itemsHeading: "BAJARILADIGAN SANTEXNIKA ISHLARI RO'YXATI VA NARXI",
      itemColumn: "Santexnika ishi nomi",
      avansPct: 50,
      start: "Buyurtmachi avansni to'lagan va suv ta'minoti o'chirilishiga rozilik bergan kundan boshlanadi.",
      deliveryLabel: "Ishlarni yakunlash muddati",
      warranty: "12 (o'n ikki) oy montaj ishlariga; santexnika jihozlari va quvurlariga — ishlab chiqaruvchi kafolati (noto'g'ri foydalanish, muzlash yoki bosim keskin oshgan holatlar bundan mustasno)",
      payment: [
        "Ishlar boshlanishidan oldin {PC} {AV}% (avans) to'lanadi; qolgan qismi tizim bosim sinovidan o'tib, sizib chiqish yo'qligi tasdiqlangach to'lanadi.",
        "Quvur, fitinglar va jihozlar Bajaruvchi tomonidan sotib olinsa, narxi alohida ko'rsatiladi; Buyurtmachi o'z jihozini bersa, uning sifati va butligi uchun Bajaruvchi javobgar emas.",
        "Ishlar vaqtida suv ta'minoti vaqtincha o'chirilishi mumkin; Buyurtmachi buni oldindan biladi va rozi.",
        "Devor, pol yoki kafelni ochish va keyin tiklash ishlari narxga kirmasa, alohida kelishiladi va to'lanadi.",
        "Mavjud eski tizimning yashirin nosozliklari (chirigan quvur, zanglagan ulanish) ish jarayonida aniqlansa, ularni bartaraf etish qo'shimcha ish hisoblanadi.",
        COMMON_PRICE,
        COMMON_ACCEPT
      ],
      cancel: [
        "Ish boshlanmagan va material sotib olinmagan bo'lsa, bekor qilinganda avansning 10% i ushlab qolinadi.",
        "Ish boshlangach bekor qilinsa — bajarilgan ishlar va sotib olingan materiallar qiymati to'liq to'lanadi.",
        "Buyurtmachi yoki uchinchi shaxs tizimga montajdan keyin aralashsa, shu sabab yuzaga kelgan zarar uchun Bajaruvchi javobgar emas."
      ]
    }
  };

  T.suvoq_boyoq = {
    label: "Suvoqchi / bo'yoqchi",
    tag: "Suvoq, shpaklyovka va bo'yoq ishlari",
    itemsLabel: "Ish nomi",
    items: ["Devor suvoqi","Shift suvoqi","Shpaklyovka (qirrasi bilan)","Devor bo'yash","Shift bo'yash","Dekorativ suvoq","Oboy yopishtirish","Fasad suvoq va bo'yash","Gruntovka va tayyorlov","Eshik / deraza qiyalari"],
    customPlaceholder: "Masalan: Zina kataki",
    doc: {
      title: "SUVOQ VA BO'YOQ ISHLARINI BAJARISH SHARTNOMASI",
      itemsHeading: "BAJARILADIGAN SUVOQ / BO'YOQ ISHLARI RO'YXATI VA NARXI",
      itemColumn: "Ish nomi",
      avansPct: 50,
      start: "Buyurtmachi avansni to'lagan va xonalar bo'shatilgan kundan boshlanadi.",
      deliveryLabel: "Ishlarni yakunlash muddati",
      warranty: "12 (o'n ikki) oy (namlik, suv bosishi, devor to'kilishi yoki Buyurtmachi tomonidan mexanik shikast yetkazilgan holatlar bundan mustasno)",
      payment: [
        "Ishlar boshlanishidan oldin {PC} {AV}% (avans) to'lanadi; qolgan qismi ishlar tugagach, qabul qilishda to'lanadi.",
        "Ish hajmi (kv.m) obyektda o'lchab hisoblanadi. Haqiqiy hajm kelishilgandan farq qilsa, yakuniy narx haqiqiy hajmga qarab qayta hisoblanadi.",
        "Suvoq, shpaklyovka va bo'yoq quriishi uchun texnologik tanaffus zarur; bu vaqtda Buyurtmachi xonada ishlarga xalaqit beruvchi harakatlar qilmaydi.",
        "Bo'yoq, shpaklyovka, gruntovka va boshqa materiallar kim tomonidan olinishi alohida kelishiladi; rang va turi Buyurtmachi bilan oldindan tasdiqlanadi.",
        "Devor notekisligi, namlik yoki zamburug' kabi yashirin nuqsonlar aniqlansa, ularni bartaraf etish qo'shimcha ish bo'lib, alohida to'lanadi.",
        COMMON_PRICE,
        COMMON_ACCEPT
      ],
      cancel: [
        "Ish boshlanmagan bo'lsa, Buyurtmachi bekor qilganda avansning 10% i ushlab qolinadi.",
        "Ish boshlangach bekor qilinsa — bajarilgan ishlar hajmi va sotib olingan materiallar (tonlangan bo'yoq qaytarilmaydi) qiymati to'liq to'lanadi.",
        "Buyurtmachi tasdiqlagan rangni keyinroq o'zgartirishni talab qilsa, qayta bajarish ishi alohida to'lanadi."
      ]
    }
  };

  T.kafel_parket = {
    label: "Kafelchi / parketchi",
    tag: "Kafel, parket va pol qoplamalari ishlari",
    itemsLabel: "Ish nomi",
    items: ["Kafel yotqizish (pol)","Kafel yotqizish (devor)","Parket yotqizish","Laminat yotqizish","Plintus o'rnatish","Granit / marmar qoplama","Pol tekislash (styazhka)","Mozaika / dekorativ kafel","Eski qoplamani yechish","Vannaxona gidroizolyatsiyasi"],
    customPlaceholder: "Masalan: Balkon kafeli",
    doc: {
      title: "KAFEL VA POL QOPLAMA ISHLARINI BAJARISH SHARTNOMASI",
      itemsHeading: "BAJARILADIGAN QOPLAMA ISHLARI RO'YXATI VA NARXI",
      itemColumn: "Ish nomi",
      avansPct: 50,
      start: "Buyurtmachi avans to'lab, kafel/parket materialini obyektga yetkazgan kundan boshlanadi.",
      deliveryLabel: "Ishlarni yakunlash muddati",
      warranty: "12 (o'n ikki) oy yotqizish ishlariga (asos namlik tortishi, suv bosishi yoki Buyurtmachi tomonidan erta yuk tushirilgan holatlar bundan mustasno); material sifati — sotuvchi/ishlab chiqaruvchi kafolati",
      payment: [
        "Ishlar boshlanishidan oldin {PC} {AV}% (avans) to'lanadi; qolgan qismi ishlar tugab, qabul qilingach to'lanadi.",
        "Ish hajmi (kv.m) obyektda o'lchab hisoblanadi; kesish, burchak va yo'nalish talab qiladigan murakkab ishlar (diagonal, mozaika) uchun narx kelishuv bo'yicha oshishi mumkin.",
        "Kafel, parket, yelim va fuga materiallarini sotib olish tartibi alohida kelishiladi. Material zaxirasi (kesish va nuqsonlar uchun) kamida 10% bo'lishi tavsiya etiladi.",
        "Buyurtmachi tomonidan olib kelingan materialdagi zavod nuqsonlari, o'lchamlar farqi yoki partiya rang farqi uchun Bajaruvchi javobgar emas.",
        "Pol asosi (styazhka) yaroqsiz yoki notekis bo'lsa, uni tekislash qo'shimcha ish bo'lib, alohida to'lanadi.",
        "Yotqizilgan qoplama yelim/qorishma qurimaguncha (odatda 48-72 soat) ustida yurish yoki mebel qo'yish mumkin emas.",
        COMMON_PRICE,
        COMMON_ACCEPT
      ],
      cancel: [
        "Ish boshlanmagan bo'lsa, Buyurtmachi bekor qilganda avansning 10% i ushlab qolinadi.",
        "Ish boshlangach bekor qilinsa — bajarilgan ishlar hajmi va sotib olingan materiallar qiymati to'liq to'lanadi.",
        "Kesilgan va ishlatilgan materiallar (kafel, parket) qaytarilmaydi va qiymati Buyurtmachi tomonidan qoplanadi."
      ]
    }
  };

  T.payvand_temir = {
    label: "Payvandchi / temirchi",
    tag: "Payvandlash va metall konstruksiyalar",
    itemsLabel: "Buyum / ish nomi",
    items: ["Metall kirish eshigi","Darvoza","Panjara / to'siq","Metall karkas","Zinapoya metall konstruksiyasi","Navis (soyabon)","Deraza panjarasi","Mangal / pech","Metall mebel (stol, javon)","Payvandlash ta'mirlash ishi"],
    customPlaceholder: "Masalan: Kuzatuv minorasi",
    doc: {
      title: "METALL KONSTRUKSIYALARNI TAYYORLASH VA O'RNATISH SHARTNOMASI",
      itemsHeading: "TAYYORLANADIGAN BUYUMLAR / BAJARILADIGAN ISHLAR RO'YXATI VA NARXI",
      itemColumn: "Buyum / ish nomi",
      avansPct: 60,
      start: "Buyurtmachi o'lchamlar va eskizni tasdiqlab, avansni to'lagan kundan boshlanadi.",
      deliveryLabel: "Tayyorlash va o'rnatish muddati",
      warranty: "12 (o'n ikki) oy payvand choklari va konstruksiyaga (zang — bo'yoq qatlami buzilganda, mexanik shikast yoki noto'g'ri foydalanish holatlari bundan mustasno)",
      payment: [
        "Eskiz/o'lcham tasdiqlangach, 3 (uch) kun ichida {PC} {AV}% (avans) to'lanadi. Avansdan material (metall, profil) sotib olinadi.",
        "Buyum tayyor bo'lgach, Bajaruvchi Buyurtmachiga ko'rsatadi; qolgan summa to'langach, buyum yetkaziladi va o'rnatiladi.",
        "Metall narxi bozorda keskin o'zgarsa, qolgan to'lov summasi tegishlicha tuzatilishi mumkin; bu haqda Buyurtmachiga oldindan xabar beriladi.",
        "Bo'yash, grunt va qoplama turi shartnomada alohida ko'rsatilmagan bo'lsa, standart grunt-bo'yoq qo'llaniladi.",
        "O'rnatish joyida beton, g'isht yoki mavjud konstruksiyaga qo'shimcha moslashtirish talab etilsa, u alohida ish hisoblanadi va to'lanadi.",
        "Buyum tayyor bo'lgach, Buyurtmachi uni 5 (besh) kun ichida olib ketmasa, keyingi kunlardan saqlov haqi hisoblanishi mumkin.",
        COMMON_ACCEPT
      ],
      cancel: [
        "Material sotib olinmagan bo'lsa, Buyurtmachi bekor qilganda avansning 10% i ushlab qolinadi.",
        "Material sotib olinib, kesish/payvandlash boshlangan bo'lsa — bajarilgan ish va sarflangan material qiymati to'liq to'lanadi.",
        "Buyurtmachi tasdiqlagan o'lchamdan keyin o'zgartirish talab qilsa, qayta bajarish xarajati Buyurtmachi zimmasida."
      ]
    }
  };

  T.tom = {
    label: "Tom yopuvchi",
    tag: "Tom yopish va tom ta'mirlash ishlari",
    itemsLabel: "Tom ishi nomi",
    items: ["Tom karkasi (stropila)","Metall cherepitsa yopish","Shifer yopish","Profnastil yopish","Gidroizolyatsiya va issiqlik izolyatsiyasi","Suv tarnovi o'rnatish","Mansarda tomi","Tom ta'mirlash","Parapet va qirralar","Tom oynasi (mansard deraza)"],
    customPlaceholder: "Masalan: Soyabon tomi",
    doc: {
      title: "TOM YOPISH ISHLARINI BAJARISH SHARTNOMASI",
      itemsHeading: "BAJARILADIGAN TOM ISHLARI RO'YXATI VA NARXI",
      itemColumn: "Tom ishi nomi",
      avansPct: 50,
      start: "Buyurtmachi avansni to'lagan va materiallar obyektga yetkazilgan kundan boshlanadi; ob-havo sharoitiga bog'liq.",
      deliveryLabel: "Ishlarni yakunlash muddati",
      warranty: "24 (yigirma to'rt) oy montaj va germetiklikka (kuchli to'fon, do'l, qor yuki me'yoridan oshishi yoki Buyurtmachi tomonidan zarar yetkazilgan holatlar bundan mustasno)",
      payment: [
        "Ishlar boshlanishidan oldin {PC} {AV}% (avans) to'lanadi; qolgan qismi tom yopilib, sinovdan o'tgach to'lanadi.",
        "Tom yuzasi (kv.m) obyektda o'lchab hisoblanadi; yakuniy narx haqiqiy yuzaga qarab qayta hisoblanishi mumkin.",
        "Yomg'ir, qor, kuchli shamol kabi noqulay ob-havo sababli ishlar to'xtatilsa, muddat shunga mos ravishda cho'ziladi; bu Bajaruvchining aybi hisoblanmaydi.",
        "Balandlikda ishlash xavfsizlik qoidalariga amal qilinadi. Buyurtmachi ish vaqtida tom ostida odamlar bo'lmasligini ta'minlaydi.",
        "Eski tom yechilganda yashirin nuqson (chirigan to'sin, konstruksiya) aniqlansa, uni tuzatish qo'shimcha ish bo'lib, alohida to'lanadi.",
        COMMON_PRICE,
        COMMON_ACCEPT
      ],
      cancel: [
        "Ish boshlanmagan va material olinmagan bo'lsa, bekor qilinganda avansning 10% i ushlab qolinadi.",
        "Eski tom yechilgan yoki material sotib olingan bo'lsa — bajarilgan ish va sarflangan material qiymati to'liq to'lanadi.",
        "Ish boshlangach Buyurtmachi bekor qilsa, tomni yopiq holatga keltirish xarajatlari Buyurtmachi zimmasida."
      ]
    }
  };

  T.deraza_eshik = {
    label: "Deraza / eshik o'rnatuvchi",
    tag: "Deraza va eshik tayyorlash va o'rnatish",
    itemsLabel: "Deraza / eshik nomi",
    items: ["Plastik deraza","Alyuminiy deraza","Balkon ramasi (jalyuzi bilan)","Kirish eshigi","Ichki eshik","Shisha eshik / peregorodka","Qiyalar va podokonnik","Sunnat to'r (moskitnaya setka)","Deraza ta'mirlash va sozlash","Eski deraza/eshikni demontaj qilish"],
    customPlaceholder: "Masalan: Vitrina oynasi",
    doc: {
      title: "DERAZA VA ESHIKLARNI TAYYORLASH HAMDA O'RNATISH SHARTNOMASI",
      itemsHeading: "TAYYORLANADIGAN VA O'RNATILADIGAN MAHSULOTLAR RO'YXATI VA NARXI",
      itemColumn: "Deraza / eshik nomi",
      avansPct: 70,
      start: "O'lchov olingandan so'ng, Buyurtmachi o'lcham va konfiguratsiyani tasdiqlab, avansni to'lagan kundan boshlanadi.",
      deliveryLabel: "Tayyorlash va o'rnatish muddati",
      warranty: "36 (o'ttiz olti) oy o'rnatish ishlariga; profil va furnitura — ishlab chiqaruvchi kafolati (mexanik shikast, noto'g'ri foydalanish holatlari bundan mustasno)",
      payment: [
        "O'lchov va konfiguratsiya tasdiqlangach, 3 (uch) kun ichida {PC} {AV}% (avans) to'lanadi; shundan so'ng buyurtma ishlab chiqarishga beriladi.",
        "Mahsulot tayyor bo'lib, o'rnatishga keltirilganda qolgan summa to'lanadi.",
        "O'lchamlar Bajaruvchi tomonidan olinadi. Buyurtmachi o'zi bergan o'lchamlardagi xato uchun Bajaruvchi javobgar emas.",
        "Tasdiqlanganidan keyin tayyorlangan mahsulot (maxsus o'lcham, rang) boshqa mijozga yaramaydi, shu bois qaytarilmaydi.",
        "Eski deraza/eshikni demontaj qilish, devor qiyalarini suvoq va bo'yash ishlari narxga kirmasa, alohida kelishiladi.",
        "O'rnatishdan oldin Buyurtmachi ish joyini bo'shatib, kirish yo'lini ta'minlaydi.",
        COMMON_ACCEPT
      ],
      cancel: [
        "Buyurtma tasdiqlangach, lekin ishlab chiqarishga berilmagan bo'lsa — bekor qilganda avansning 15% i ushlab qolinadi.",
        "Ishlab chiqarish boshlangan bo'lsa — mahsulot narxining 100% i Buyurtmachi tomonidan to'liq qoplanadi.",
        "O'rnatish kuni Buyurtmachi obyektga kirishni ta'minlamasa, qayta chiqish xarajati alohida to'lanadi."
      ]
    }
  };

  T.loyiha_dizayn = {
    label: "Arxitektor / dizayner",
    tag: "Arxitektura va interer dizayn xizmatlari",
    itemsLabel: "Loyiha / xizmat nomi",
    items: ["Arxitektura loyihasi","Interer dizayn loyihasi","3D vizualizatsiya","Eskiz loyiha","Ishchi chizmalar","Smeta (xarajatlar hisobi)","Avtor nazorati","Planirovka (rejalashtirish)","Fasad dizayni","Landshaft dizayn loyihasi"],
    customPlaceholder: "Masalan: Mebel dizayni",
    doc: {
      title: "LOYIHALASH (DIZAYN) XIZMATLARI SHARTNOMASI",
      itemsHeading: "BAJARILADIGAN LOYIHA XIZMATLARI RO'YXATI VA NARXI",
      itemColumn: "Loyiha / xizmat nomi",
      avansPct: 50,
      designerRow: true,
      start: "Texnik topshiriq (TZ) Buyurtmachi bilan kelishilgan va avans to'langan kundan boshlanadi.",
      deliveryLabel: "Loyihani topshirish muddati",
      warranty: "Loyiha topshirilgach, 14 (o'n to'rt) kun ichida kelishilgan hajmdagi tuzatishlar bepul kiritiladi; undan keyingi o'zgartirishlar alohida to'lanadi",
      payment: [
        "Texnik topshiriq kelishilgach, {PC} {AV}% (avans) to'lanadi; qolgan qismi yakuniy loyiha topshirilganda to'lanadi.",
        "Loyiha bosqichlarga bo'linadi (eskiz, asosiy variant, yakuniy loyiha). Har bir bosqich Buyurtmachi tomonidan tasdiqlanadi.",
        "Narxga kiritilgan bepul tuzatishlar soni — har bir bosqich uchun 2 (ikki) marta. Undan ortiq o'zgartirishlar alohida to'lanadi.",
        "Loyiha mualliflik huquqi Bajaruvchida qoladi. Buyurtmachi loyihadan faqat shu obyekt uchun foydalanadi; uni boshqa obyektlarda yoki uchinchi shaxslarga berishda foydalanishi uchun yozma rozilik zarur. Bajaruvchi loyihani portfoliosida ko'rsatish huquqini saqlab qoladi.",
        "Buyurtmachi kerakli ma'lumotlarni (o'lchamlar, obyekt rejasi, istaklar) o'z vaqtida taqdim etadi; kechiktirilsa, muddat shunga mos cho'ziladi.",
        "Avtor nazorati (obyektga chiqish) shartnomaga kiritilmagan bo'lsa, alohida kelishiladi va to'lanadi.",
        COMMON_ACCEPT
      ],
      cancel: [
        "Eskiz bosqichi boshlanmagan bo'lsa, bekor qilinganda avansning 10% i ushlab qolinadi.",
        "Ish boshlangach bekor qilinsa — bajarilgan bosqichlar uchun to'liq haq to'lanadi; avans bu hisobga o'tkaziladi.",
        "Buyurtmachi tasdiqlagan bosqichdan keyin loyiha mohiyatini butunlay o'zgartirishni talab qilsa, bu yangi buyurtma sifatida baholanadi."
      ]
    }
  };

  T.landshaft = {
    label: "Landshaft ustasi",
    tag: "Landshaft dizayni va obodonlashtirish ishlari",
    itemsLabel: "Landshaft ishi nomi",
    items: ["Maysazor (gazon) yotqizish","Daraxt va buta ekish","Avtomatik sug'orish tizimi","Yo'lkalar (plitka, tosh)","Dekorativ suv havzasi / favvora","Bog' yoritish","Gulzor va alpinariy","Tayanch devor / to'siq","Maydonni tekislash va tayyorlash","Bog'ni parvarishlash (mavsumiy)"],
    customPlaceholder: "Masalan: Pergola",
    doc: {
      title: "LANDSHAFT ISHLARINI BAJARISH SHARTNOMASI",
      itemsHeading: "BAJARILADIGAN LANDSHAFT ISHLARI RO'YXATI VA NARXI",
      itemColumn: "Landshaft ishi nomi",
      avansPct: 50,
      start: "Buyurtmachi reja va avansni tasdiqlagan hamda maydon ishga tayyor bo'lgan kundan boshlanadi; mavsum va ob-havoga bog'liq.",
      deliveryLabel: "Ishlarni yakunlash muddati",
      warranty: "12 (o'n ikki) oy inshootlar va montaj ishlariga; o'simliklar uchun — 30 (o'ttiz) kun ichida tutmay qolgan ko'chatlar bir marta bepul almashtiriladi (Buyurtmachi parvarish qoidalariga amal qilgan holda)",
      payment: [
        "Ishlar boshlanishidan oldin {PC} {AV}% (avans) to'lanadi; qolgan qismi bosqichlar bo'yicha yoki ishlar tugagach to'lanadi.",
        "O'simlik, ko'chat va materiallarning turi, miqdori va narxi kelishuv varaqasida alohida ko'rsatiladi.",
        "Ko'chat va maysazorni parvarishlash (sug'orish, o'g'itlash) bo'yicha ko'rsatmalarga Buyurtmachi amal qiladi. Parvarish buzilishi natijasida o'simlik nobud bo'lsa, almashtirish pullik bo'ladi.",
        "Sug'orish tizimi uchun suv va elektr manbasini Buyurtmachi ta'minlaydi.",
        "Tabiiy ofat (sovuq, do'l, quraqchilik) sabab o'simliklar nobud bo'lsa, Bajaruvchi javobgar emas.",
        COMMON_PRICE,
        COMMON_ACCEPT
      ],
      cancel: [
        "Ishlar boshlanmagan bo'lsa, bekor qilinganda avansning 10% i ushlab qolinadi.",
        "Ko'chat/material olingan yoki ekilgan bo'lsa — bajarilgan ishlar va sarflangan material qiymati to'liq to'lanadi.",
        "Buyurtmachi tasdiqlangan rejadan keyin o'zgartirish talab qilsa, qo'shimcha xarajat Buyurtmachi zimmasida."
      ]
    }
  };

  T.boshqa = {
    label: "Boshqa",
    tag: "Professional ishlar va xizmatlar",
    itemsLabel: "Ish / xizmat nomi",
    items: ["Asosiy ish","Qo'shimcha ish","Materiallar yetkazib berish","Ta'mirlash ishi","Montaj ishi","Konsultatsiya / xizmat"],
    customPlaceholder: "Masalan: Ish nomi",
    doc: {
      title: "ISHLARNI BAJARISH (XIZMAT KO'RSATISH) SHARTNOMASI",
      itemsHeading: "BAJARILADIGAN ISHLAR / XIZMATLAR RO'YXATI VA NARXI",
      itemColumn: "Ish / xizmat nomi",
      avansPct: 50,
      start: "Buyurtmachi avansni to'lagan kundan boshlanadi.",
      deliveryLabel: "Ishlarni yakunlash muddati",
      warranty: "6 (olti) oy bajarilgan ishlarga (Buyurtmachi tomonidan noto'g'ri foydalanish yoki o'zboshimchalik bilan aralashish holatlari bundan mustasno)",
      payment: [
        "Ishlar boshlanishidan oldin {PC} {AV}% (avans) to'lanadi; qolgan qismi ishlar tugab, qabul qilingach to'lanadi.",
        "Materiallar kim tomonidan sotib olinishi tomonlar o'rtasida alohida kelishiladi.",
        "Buyurtmachi Bajaruvchiga ish joyiga kirish va ishlash uchun zarur sharoitlarni ta'minlaydi.",
        COMMON_PRICE,
        COMMON_ACCEPT
      ],
      cancel: [
        "Ish boshlanmagan bo'lsa, bekor qilinganda avansning 10% i ushlab qolinadi.",
        "Ish boshlangach bekor qilinsa — bajarilgan ishlar va sarflangan materiallar qiymati to'liq to'lanadi.",
        "Bajaruvchi ishni asossiz kechiktirsa, kechikkan har bir kun uchun shartnoma summasining 0,1% miqdorida (jami 10% dan oshmagan) penya to'laydi."
      ]
    }
  };

  function get(key){ return T[key] || T.boshqa; }
  function clauses(arr, section, avansPct){
    return arr.map((t,i)=> `<p class="term">${section}.${i+1}. ${t.replace(/\{PC\}/g,PC).replace(/\{AV\}/g,avansPct)}</p>`).join('\n    ');
  }
  window.TRADES = T;
  window.getTrade = get;
  window.tradeClausesHTML = clauses;
})();
