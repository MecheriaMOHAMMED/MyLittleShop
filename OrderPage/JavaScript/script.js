document.addEventListener('DOMContentLoaded', function() {
    const container = document.querySelector('.container');
    const registerBtn = document.querySelector('.register-btn');
    const loginBtn = document.querySelector('.login-btn');
    const body = document.querySelector('body');
    const orderButtons = document.querySelectorAll('.order');
    const formBoxes = document.querySelectorAll('.form-box');
    const togglePanels = document.querySelectorAll('.toggle-panel');

    // Check if dark mode is enabled
    if (localStorage.getItem("darkMode") === "enabled") {
        body.classList.add("dark");
    }

    // Dynamic Pricing Configuration
    const pricingConfig = {
        shorts: {
            productPrice: 2200,
            productName: "شورتات"
        },
        shoes: {
            productPrice: 1600,
            productName: "أحذية"
        }
    };

    // Wilaya-specific delivery and home fee pricing
    const wilayaPricing = {
        "02 - الشلف": {delivery: 400, home: 700},
        "01 - أدرار": {delivery: 400, home: 700},
        "18 - جيجل": {delivery: 400, home: 700},
        "09 - البليدة": {delivery: 450, home: 700},
        "10 - البويرة": {delivery: 450, home: 700},
        "23 - عنابة": {delivery: 450, home: 700},
        "19 - سطيف": {delivery: 450, home: 700},
        "25 - قسنطينة": {delivery: 450, home: 700},
        "06 - بجاية": {delivery: 450, home: 700},
        "31 - وهران": {delivery: 450, home: 700},
        "34 - برج بوعريريج": {delivery: 450, home: 700},
        "21 - سكيكدة": {delivery: 450, home: 700},
        "42 - تيبازة": {delivery: 450, home: 700},
        "44 - عين الدفلى": {delivery: 450, home: 700},
        "04 - أم البواقي": {delivery: 550, home: 750},
        "05 - باتنة": {delivery: 550, home: 750},
        "07 - بسكرة": {delivery: 550, home: 750},
        "13 - تلمسان": {delivery: 550, home: 750},
        "14 - تيارت": {delivery: 550, home: 750},
        "12 - تبسة": {delivery: 550, home: 750},
        "20 - سعيدة": {delivery: 550, home: 750},
        "22 - سيدي بلعباس": {delivery: 550, home: 750},
        "24 - قالمة": {delivery: 550, home: 750},
        "27 - مستغانم": {delivery: 550, home: 750},
        "28 - المسيلة": {delivery: 550, home: 750},
        "29 - معسكر": {delivery: 550, home: 750},
        "43 - ميلة": {delivery: 550, home: 750},
        "35 - بومرداس": {delivery: 550, home: 750},
        "17 - الجلفة": {delivery: 600, home: 800},
        "20 - سعيدة": {delivery: 600, home: 800},
        "47 - غرداية": {delivery: 600, home: 800},
        "29 - معسكر": {delivery: 600, home: 800},
        "40 - خنشلة": {delivery: 650, home: 800},
        "41 - سوق أهراس": {delivery: 650, home: 800},
        "46 - عين تموشنت": {delivery: 650, home: 800},
        "05 - باتنة": {delivery: 700, home: 850},
        "12 - تبسة": {delivery: 700, home: 850},
        "36 - الطارف": {delivery: 700, home: 850},
        "03 - الأغواط": {delivery: 700, home: 850},
        "51 - أولاد جلال": {delivery: 800, home: 900},
        "30 - ورقلة": {delivery: 900, home: 1000},
        "32 - البيض": {delivery: 900, home: 1000},
        "55 - توغرت": {delivery: 900, home: 1000},
        "45 - النعامة": {delivery: 900, home: 1000},
        "47 - غرداية": {delivery: 900, home: 1000},
        "55 - توغرت": {delivery: 900, home: 1000},
        "57 - المغير": {delivery: 900, home: 1000},
        "52 - بني عباس": {delivery: 1000, home: 1100},
        "01 - أدرار": {delivery: 1200, home: 1400},
        "08 - بشار": {delivery: 1200, home: 1400},
        "11 - تمنراست": {delivery: 1200, home: 1400},
        "52 - بني عباس": {delivery: 1200, home: 1400},
        "49 - تيميمون": {delivery: 1200, home: 1400},
        "53 - بني عباس": {delivery: 1200, home: 1400},
        "11 - تمنراست": {delivery: 1600, home: 1800},
        "37 - تندوف": {delivery: 1600, home: 1800},
        "33 - إليزي": {delivery: 2000, home: 2000},
        "50 - برج باجي مختار": {delivery: 2000, home: 2000},
        "54 - عين صالح": {delivery: 2000, home: 2000},
        "56 - جانت": {delivery: 2000, home: 2000},
        "16 - الجزائر": {delivery: 500, home: 700}
    };

    // Function to get delivery and home fee based on wilaya
    function getWilayaFees(wilaya) {
        return wilayaPricing[wilaya] || {delivery: 0, home: 0};
    }

    // Function to update order summary
    function updateOrderSummary(formType) {
        const form = document.querySelector(`#${formType}Form`);
        if (!form) return;

        const quantityInput = form.querySelector(`#quantity${formType === 'shoes' ? '-shoes' : ''}`);
        const quantity = parseInt(quantityInput.value) || 1;
        
        const config = pricingConfig[formType];
        const productTotal = config.productPrice * quantity;
        
        // Get delivery and home fee based on selected wilaya
        const wilayaSelect = form.querySelector('.Wilaya');
        const selectedWilaya = wilayaSelect.value;
        const {delivery: deliveryCost, home: homeFee} = selectedWilaya ? getWilayaFees(selectedWilaya) : {delivery: 0, home: 0};
        
        // Get delivery type
        const deliveryTypeRadios = form.querySelectorAll('input[name="مكان التوصيل"]');
        let isHomeDelivery = false;
        deliveryTypeRadios.forEach(radio => {
            if (radio.checked && radio.value === "المنزل") {
                isHomeDelivery = true;
            }
        });
        
        // Calculate total based on delivery type
        let total = productTotal;
        let usedFee = 0;
        let usedLabel = '';
        if (selectedWilaya) {
            if (isHomeDelivery) {
                usedFee = homeFee;
                usedLabel = 'رسوم التوصيل للمنزل:';
                total += homeFee;
            } else {
                usedFee = deliveryCost;
                usedLabel = 'سعر التوصيل:';
                total += deliveryCost;
            }
        }

        // Update summary elements
        const summaryItems = form.querySelectorAll('.summary-item');
        const summaryTotal = form.querySelector('.summary-total');
        
        // Update product name
        if (summaryItems[0]) {
            const productSpan = summaryItems[0].querySelector('span:last-child');
            if (productSpan) {
                productSpan.textContent = config.productName;
            }
        }
        
        // Update product price
        if (summaryItems[1]) {
            const priceSpan = summaryItems[1].querySelector('span:last-child');
            if (priceSpan) {
                priceSpan.textContent = `${productTotal} دج`;
            }
        }
        
        // Update delivery/home fee (third summary item)
        if (summaryItems[2]) {
            const labelSpan = summaryItems[2].querySelector('.label');
            const valueSpan = summaryItems[2].querySelector('span:last-child');
            if (labelSpan && valueSpan) {
                if (selectedWilaya) {
                    labelSpan.textContent = usedLabel;
                    valueSpan.textContent = `${usedFee} دج`;
                } else {
                    labelSpan.textContent = 'التوصيل:';
                    valueSpan.textContent = 'اختر الولاية';
                }
            }
        }
        
        // Remove any home delivery fee extra line if it exists
        let homeDeliveryItem = form.querySelector('.summary-item.home-delivery-fee');
        if (homeDeliveryItem) {
            homeDeliveryItem.remove();
        }
        
        // Update total
        if (summaryTotal) {
            const totalSpan = summaryTotal.querySelector('span:last-child');
            if (totalSpan) {
                totalSpan.textContent = selectedWilaya ? `${total} دج` : "اختر الولاية";
            }
        }
    }

    // Function to handle quantity changes
    function handleQuantityChange(event) {
        const input = event.target;
        const form = input.closest('form');
        const formType = form.id === 'shoesForm' ? 'shoes' : 'shorts';
        
        // Ensure minimum quantity of 1
        if (input.value < 1) {
            input.value = 1;
        }
        
        updateOrderSummary(formType);
    }

    // Function to handle wilaya selection
    function handleWilayaChange(event) {
        const select = event.target;
        const form = select.closest('form');
        const formType = form.id === 'shoesForm' ? 'shoes' : 'shorts';
        
        updateOrderSummary(formType);
    }

    // Function to handle delivery type changes
    function handleDeliveryTypeChange(event) {
        const radio = event.target;
        const form = radio.closest('form');
        const formType = form.id === 'shoesForm' ? 'shoes' : 'shorts';
        
        updateOrderSummary(formType);
    }

    // Initialize quantity event listeners
    const quantityInputs = document.querySelectorAll('input[type="number"]');
    quantityInputs.forEach(input => {
        input.addEventListener('input', handleQuantityChange);
        input.addEventListener('change', handleQuantityChange);
    });

    // Initialize wilaya event listeners
    const wilayaSelects = document.querySelectorAll('.Wilaya');
    wilayaSelects.forEach((select, index) => {
        select.addEventListener('change', function() {
            const selectedWilaya = this.value;
            const municipalityContainer = municipalityContainers[index];
            const municipalitySelect = municipalitySelects[index];
            
            // Clear current options
            municipalitySelect.innerHTML = '<option value="" disabled selected>اختر البلدية</option>';
            
            // For all wilayas, show the municipality dropdown
            municipalityContainer.style.display = 'block';
            
            // If we have municipalities for this wilaya
            if (municipalities[selectedWilaya]) {
                // Add new options
                municipalities[selectedWilaya].forEach(municipality => {
                    const option = document.createElement('option');
                    option.value = municipality;
                    option.textContent = municipality;
                    municipalitySelect.appendChild(option);
                });
                
                municipalitySelect.disabled = false;
            } else {
                // If no data, add a default option
                const option = document.createElement('option');
                option.value = "بلدية";
                option.textContent = "بلدية";
                municipalitySelect.appendChild(option);
                municipalitySelect.disabled = false;
            }
            
            // Update order summary when wilaya is selected
            const form = this.closest('form');
            const formType = form.id === 'shoesForm' ? 'shoes' : 'shorts';
            updateOrderSummary(formType);
            
            // On mobile, scroll to reveal municipality field
            if (window.innerWidth <= 650) {
                setTimeout(() => {
                    municipalityContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }, 100);
            }
        });
    });

    // Initialize delivery type event listeners
    const deliveryTypeRadios = document.querySelectorAll('input[name="مكان التوصيل"]');
    deliveryTypeRadios.forEach(radio => {
        radio.addEventListener('change', handleDeliveryTypeChange);
    });

    // Initialize order summaries on page load
    updateOrderSummary('shorts');
    updateOrderSummary('shoes');

    // Municipality handling for both forms
    const municipalityContainers = document.querySelectorAll('.municipality-container');
    const municipalitySelects = document.querySelectorAll('.municipality');

    // Municipality data for Algeria
    const municipalities = {
        "01 - أدرار": [
    "أدرار", "تامست", "شروين", "رقان", "إن زغمير", "تيت", "قصر قدور", "تسابيت",
    "تيميمون", "أولاد السعيد", "زاوية كونتة", "أولف", "تيمقتن", "تامنطيت", "فنوغيل",
    "تنركوك", "دلدول", "سالي", "أقبلي", "المطارفة", "أولاد أحمد تيمي", "بودة",
    "أوقروت", "طالمين", "برج باجي مختار", "السبع", "أولاد عيسى", "تيمياوين"],

        "02 - الشلف": [
    "الشلف", "تنس", "الزبوجة", "الكريمية", "أبو الحسن", "تاوقريت",
    "بني حواء", "بوقادير", "حرشون", "أولاد فارس", "سيدي عكاشة",
    "بني راشد", "تلعصة", "الهرانفة", "وادي قوسين", "الظهرة",
    "أولاد عباس", "سنجاس", "وادي سلي", "أبو الحسن", "المرسى",
    "الشطية", "سيدي عبد الرحمن", "مصدق", "الحجاج", "الأبيض مجاجة",
    "وادي الفضة", "أولاد بن عبد القادر", "بوزغاية", "عين مران",
    "أم الذروع", "بريرة", "بني بوعتاب"],

    "03 - الأغواط": [
    "الأغواط", "قصر الحيران", "بن ناصر بن شهرة", "سيدي مخلوف", "حاسي الدلاعة",
    "حاسي الرمل", "عين ماضي", "تاجموت", "الخنق", "قلتة سيدي سعد",
    "عين سيدي علي", "البيضاء", "بريدة", "الغيشة", "الحاج المشري",
    "سبقاق", "تاويالة", "تاجرونة", "أفلو", "العسافية",
    "وادي مرة", "وادي مزي", "الحويطة"
],
       "04 - أم البواقي": [
    "أم البواقي", "عين البيضاء", "عين مليلة", "بحير شرقي", "العامرية",
    "سيقوس", "البلالة", "عين بابوش", "بريش", "أولاد حملة",
    "الضلعة", "عين كرشة", "هنشير تومغني", "الجازية", "عين الديس",
    "فكرينة", "سوق نعمان", "الزرق", "الفجوج بوغرارة سعودي", "أولاد زواي",
    "بئر الشهداء", "قصر صباحي", "وادي نيني", "مسكيانة", "عين فكرون",
    "الراحية", "عين الزيتون", "أولاد قاسم", "الحرميلية"
],
       "05 - باتنة": [
    "باتنة", "غسيرة", "معافة", "مروانة", "سريانة",
    "منعة", "المعذر", "تازولت", "نقاوس", "القيقبة",
    "إينوغيسن", "عيون العصافير", "جرمة", "بيطام", "عزيل عبد القادر",
    "آريس", "كيمل", "تيلاطو", "عين جاسر", "أولاد سلام",
    "تيغرغار", "عين ياقوت", "فسديس", "سفيان", "الرحبات",
    "تيغانمين", "لمسان", "قصر بلزمة", "سقانة", "إشمول",
    "فم الطوب", "بني فضالة الحقانية", "وادي الماء", "تالخمت", "بوزينة",
    "الشمرة", "وادي الشعبة", "تاكسلانت", "القصبات", "أولاد عوف",
    "بومقر", "بريكة", "الجزار", "تكوت", "عين التوتة",
    "حيدوسة", "ثنية العابد", "وادي الطاقة", "أولاد فاضل", "تيمقاد",
    "رأس العيون", "شير", "أولاد سي سليمان", "زانة البيضاء", "أمدوكال",
    "أولاد عمار", "الحاسي", "لازرو", "بومية", "بولهيلات",
    "لارباع"
],

     "06 - بجاية": [
    "آدكار", "تاوريرت آغيل", "بني كسيلة",
    "أقبو", "شلاطة", "آغرام", "تمقرة",
    "أميزور", "بني جليل", "سمعون", "فرعون",
    "أوقاس", "تيزي أنبربار",
    "برباشة", "كنديرة",
    "بجاية", "وادي غير",
    "بني معوش",
    "شميني", "طيبان", "سوق أوفلة", "أكفادو",
    "درقينة", "آيت سماعيل", "تاسكريوت",
    "القصر", "فناية الماثن", "توجة",
    "إغيل علي", "آيت أرزين",
    "خراطة", "ذراع القايد",
    "أوزلاقن",
    "صدوق", "أمالو", "مسيسنة", "بوحمزة",
    "سيدي عيش", "لفلاي", "تينبذار", "تيفرة", "سيدي عياد",
    "سوق الاثنين", "ملبو", "تامريجت",
    "تازمالت", "بني مليكش", "بوجليل",
    "تيشي", "بوخليفة", "تالة حمزة",
    "تيمزريت"
],

       "07 - بسكرة": [
        "أوماش",   "البرانيس","الحاجب","الحوش", "الغروس", "الفيض", "القنطرة", "المزيرعة", 
         "برج بن عزوز",  "بسكرة",  "بوشقرون", "جمورة", "خنقة سيدي ناجي",  "اورلال",  "زريبة الوادي", 
         "سيدي عقبة", "شتمة", "طولقة",  "عين الناقة",  "عين زعطوط", "فوغالة", "الوطاية", "ليشانه","ليوة", 
         "مخادمة","مشونش","مليلي"
],
     "08 - بشار": [
    "بشار", "الأحمر", "موغل", "بوقايس", "بني ونيف", "قنادسة", "مريجة",
    "العبادلة", "عرق فراج", "مشرع هواري بومدين", "تاغيت", "بني عباس",
    "تامترت", "إقلي", "الواتة", "كرزاز", "بني يخلف", "تيمودي",
    "أولاد خضير", "قصابي", "تبلبالة"
],
     "09 - البليدة": [
    "البليدة", "الشبلي", "بوينان", "وادي العلايق", "أولاد يعيش",
    "الشريعة", "العفرون", "الشفة", "حمام ملوان", "بن خليل",
    "الصومعة", "موزاية", "صوحان", "مفتاح", "أولاد سلامة",
    "بوفاريك", "الأربعاء", "وادي جر", "بني تامو", "بوعرفة",
    "بني مراد", "بوقرة", "قرواو", "عين الرمانة", "جبابرة"
],
    "10 - البويرة": [
    "عين بسام", "عين العلوي", "عين الحجر", "بشلول", "الأصنام",
    "العجيبية", "أهل القصر", "أولاد راشد", "بئر غبالو", "الروراوة",
    "الخبوزية", "برج أوخريص", "مسدور", "تاقديت", "الحجرة الزرقاء",
    "البويرة", "عين الترك", "آيت لعزيز", "الهاشمية", "وادي البردي",
    "حيزر", "تاغزوت", "قادرية", "عمر", "الجباحية", "الأخضرية",
    "بوكرام", "معالة", "بودربالة", "الزبربر", "قرومة", "مشدا الله",
    "الصھاريج", "الشرفة", "الحانيف", "أغبالو", "آث منصور", "سوق الخميس",
    "المقراني", "سور الغزلان", "المعمورة", "ريدان", "الحاكمية",
    "الدشمية", "ديرة"
],
      "11 - تمنراست": [
    "تمنراست", "عين أمقل", "أبلسة", "تاظروك", "إدلس",
    "عين صالح", "فقارة الزوى", "إينغر", "عين قزام", "تين زواتين"
],
"12 - تبسة": [
    "تبسة", "بئر العاتر", "الشريعة", "سطح قنطيس", "العوينات",
    "الحويجبات", "صفصاف الوسرة", "الحمامات", "نقرين", "بئر مقدم",
    "الكويف", "مرسط", "العقلة", "بئر الذهب", "العقلة المالحة",
    "قريقر", "بكارية", "بوخضرة", "الونزة", "الماء الأبيض",
    "أم علي", "ثليجان", "عين الزرقاء", "المريج", "بولحاف الدير",
    "بجن", "المزرعة", "فركان"
],
      "13 - تلمسان": [
    "تلمسان", "المنصورة", "تيرني بني هديل", "عين غرابة", "بني مستار",
    "شتوان", "عين فزة", "عمير", "أولاد ميمون", "الواد الأخضر", "بني صميل",
    "عين تالوت", "عين نحالة", "بن سكران", "سيدي العبدلي", "الرمشي",
    "بني ورسوس", "عين يوسف", "السبعة شيوخ", "الفحول", "الحناية",
    "زناتة", "أولاد رياح", "الغزوات", "السواحلية", "تيانت", "دار يغمراسن",
    "ندرومة", "جبالة", "فلاوسن", "عين فتاح", "عين الكبيرة", "مغنية",
    "حمام بوغرارة", "بني بوسعيد", "سيدي مجاهد", "صبرة", "بوحلو",
    "سبدو", "القور", "العريشة", "سيدي الجيلالي", "البويهي",
    "بني سنوس", "العزايل", "بني بهدل", "باب العسة", "السواني",
    "سوق الثلاثاء", "مرسى بن مهيدي", "مسيردة الفواقة", "هنين", "بني خلاد"
],
"14 - تيارت": [
    "مدروسة", "سيدي بختي", "ملاكو",
    "عين الذهب", "النعيمة", "الشحيمة",
    "الدحموني", "عين بوشقيف",
    "الرحوية", "قرطوفة",
    "مهدية", "عين الدزاريت", "السبعين", "الناظورة",
    "السوقر", "سي عبد الغني", "توسنينة", "الفايجة",
    "مغيلة", "السبت", "سيدي الحسني",
    "فرندة", "عين الحديد", "تخمارت",
    "عين كرمس", "مدريسة", "مادنة", "الرصفة", "سيدي عبد الرحمان",
    "قصر الشلالة", "سرقين", "زمالة الأمير عبد القادر",
    "واد ليلي", "سيدي علي ملال", "تيدة",
    "مشرع الصفا", "جيلالي بن عمار", "تاقدمت",
    "حمادية", "الرشايقة", "بوقارة"
],
      "15 - تيزي وزو": [
    "تيزي وزو", "واسيف", "أيت بومهدي", "أيت تودرت", "عين الحمام", "أيت يحي", "أقبيل",
    "أبي يوسف", "عزازقة", "فريحة", "زكري", "إعكوران", "إيفيغاء", "بوغني", "مشطراس",
    "بونوح", "أسي يوسف", "ذراع الميزان", "فريقات", "عين الزاوية", "أيت يحي موسى",
    "واقنون", "تيميزارت", "آيت عيسى ميمون", "الأربعاء نايث إيراثن", "أيت قواشة",
    "إرجن", "أزفون", "أقرو", "أيت شفعة", "أغريب", "ذراع بن خدة", "تادمايت",
    "سيدي نعمان", "تيرمتين", "تيقزيرت", "إفليسن", "مزرانة", "بوزغن", "إجر",
    "إيلولة أمالو", "بني زيكي", "بني دوالة", "أيت محمود", "بني عيسي", "بني زمنزر",
    "واضية", "أقني قغران", "تيزي نثلاثة", "أيت بوعدو", "المعاتقة", "سوق الاثنين",
    "مقلع", "أيت خليلي", "الصوامع", "بني يني", "يطافن", "إبودرارن", "تيزي راشد",
    "أيت أومالو", "إيفرحونن", "أمسوحال", "إليلتن", "تيزي غنيف", "مكيرة", "ماكودة",
    "بوجيمة"
],
       "16 - الجزائر": [
    "الجزائر الوسطى", "سيدي امحمد", "المدنية", "المرادية",
    "باب الواد", "القصبة", "بولوغين", "واد قريش", "رايس حميدو",
    "المقارية", "بلوزداد", "حسين داي", "القبة",
    "بن عكنون", "بني مسوس", "بوزريعة", "الأبيار",
    "بئر مراد رايس", "بئر خادم", "جسر قسنطينة", "حيدرة", "سحاولة",
    "باش جراح", "بوروبة", "الحراش", "وادي السمار",
    "عين طاية", "باب الزوار", "برج البحري", "برج الكيفان", "الدار البيضاء", "المرسى", "المحمدية",
    "عين البنيان", "الشراقة", "دالي إبراهيم", "أولاد فايت", "الحمامات",
    "المحالمة", "الرحمانية", "السويدانية", "سطاوالي", "زرالدة",
    "بابا حسن", "دويرة", "الدرارية", "العاشور", "خرايسية",
    "بئر توتة", "أولاد شبل", "تسالة المرجة",
    "براقي", "الكاليتوس", "سيدي موسى",
    "هراوة", "الرغاية", "الرويبة"
],
   "17 - الجلفة": [
    "أم الشقاق", "أم العظام", "الإدريسية", "الخميس", "القديد",
    "بن يعقوب", "بنهار", "بويرة الأحداب", "البيرين", "بيرين",
    "تعظميت", "الجلفة", "حاسي العش", "حاسي بحبح", "حاسي فدول",
    "حد الصحاري", "دار الشيوخ", "دلدول", "دويس", "زعفران",
    "زكار", "سد الرحال", "سد رحال", "سلمانة", "سيدي بايزيد",
    "سيدي لعجال", "الشارف", "عمورة", "عين الابل", "عين الشهداء",
    "عين فقه", "عين معبد", "عين وسارة", "فرزول", "فيض البطمة",
    "قرنيني", "قطارة", "مجبارة", "مسعد", "مليليحة"
],
"18 - جيجل": [
    "جيجل",
    "اراقن",
    "العوانة",
    "زيامة المنصورية",
    "الطاهير",
    "الأمير عبد القادر",
    "الشقفة",
    "شحنة",
    "الميلية",
    "سيدي معروف",
    "السطارة",
    "العنصر",
    "سيدي عبد العزيز",
    "قاوس",
    "غبالة",
    "بوراوي بلهادف",
    "جيملة",
    "سلمى بن زيادة",
    "بوسيف أولاد عسكر",
    "القنار نوشفى",
    "أولاد يحيى خدروش",
    "بودريعة بن ياجيس",
    "خيري وادي العجول",
    "تاكسنة",
    "الجمعة بني حبيبي",
    "برج الطهر",
    "أولاد رابح",
    "وجانة"
],

"19 - سطيف": [
    "عين عباسة",
    "عين أرنات",
    "عين الكبيرة",
    "عين آزال",
    "عين لحجر",
    "عين لقراج",
    "عين ولمان",
    "عين الروى",
    "عين السبت",
    "آيت نوال",
    "آيت تيزي",
    "عموشة",
    "بابور",
    "بازر سكرة",
    "بيضاء برج",
    "بلاعة",
    "بني عزيز",
    "بني شيبانة",
    "بني فودة",
    "بني حسين",
    "بني محلي",
    "بني ورتيلان",
    "بئر العرش",
    "بئر حدادة",
    "بوعنداس",
    "بوقاعة",
    "بوسلام",
    "بوطالب",
    "دهامشة",
    "جميلة",
    "ذراع قبيلة",
    "العلمة",
    "الولجة",
    "الأوريسية",
    "قلال",
    "القلتة الزرقا"
],

  "20 - سعيدة": [
    "سعيدة", "عين الحجر", "الحساسنة", "مولاي العربي", "سيدي أحمد", "سيدي بوبكر", 
    "سيدي أعمر", "أولاد خالد", "دوي ثابت", "تيرسين", "يوب", "أولا إبراهيم"
  ],
  "21 - سكيكدة": [
    "سكيكدة", "الحروش", "رمضان جمال", "عزابة", "المرسى", "عين شرشار", "بين الويدان",
    "الزويت", "القل", "أولاد عطية", "كركرة", "تازة", "بني بشير", "بني زيد", "تمالوس",
    "الولجة بوالبلوط", "زردازة", "بكوش لخضر", "عين قشرة", "سيدي مزغيش", "حمادي كرومة",
    "الشرايع", "الحدائق", "عين بوزيان", "أمجاز الدشيش", "قنواع"
  ],
  "22 - سيدي بلعباس": [
    "سيدي بلعباس", "تلموني", "سيدي لحسن", "بن باديس", "عين البرد", "عين تمر", 
    "المرحوم", "مستغانم الصغير", "رجم دموش", "مولاي سليسن", "تلاغ", "مرين", 
    "رأس الماء", "وادي السبع", "سفيزف", "بوحنيفية", "عين عدان", "الضاية", 
    "مكدرة", "المرين", "عين تندامين", "سيدي شعيب", "أولاد إبراهيم", "سيدي علي بوسيدي", 
    "سيدي دحو الزرزور", "سيدي يخلف", "زروالة", "مزاورو", "مرين", "بوخنفيس", 
    "سيد الهواري", "الشيخ", "تفسور", "مشراق"
  ],
  "23 - عنابة": [
    "عنابة",
    "برحال",
    "الحجار",
    "العلمة",
    "البوني",
    "وادي العنب",
    "الشرفة",
    "سرايدي",
    "عين الباردة",
    "شطايبي",
    "سيدي عمار",
    "تريعات"
],

  "24 - قالمة": [
    "قالمة", "بوشقوف", "وادي الزناتي", "عين مخلوف", "هيليوبوليس", "بني مزلين", 
    "بوصواف", "حمام دباغ", "حمام النبائل", "بلخير", "عين صندل", "عين رقادة", 
    "بومهرة أحمد", "واد الشحم", "الركنية", "هواري بومدين", "الفجوج", "مجاز عمار", 
    "وادي فراغة", "سلاوة عنونة", "عين العربي", "قلعة بوصبع", "دراوش"
  ],
  "25 - قسنطينة": [
    "قسنطينة",
    "الخروب",
    "أولاد رحمون",
    "عين عبيد",
    "ابن باديس",
    "زيغود يوسف",
    "بني حميدان",
    "حامة بوزيان",
    "ديدوش مراد",
    "ابن زياد",
    "مسعود بوجريو",
    "عين سمارة"
],
  "26 - المدية": [
    "المدية", "وزرة", "عين بوسيف", "البرواقية", "شلالة العذاورة", "قصر البخاري",
    "بوغزول", "العمارية", "السواقي", "تمزقيدة", "الكاف الأخضر", "أولاد إبراهيم",
    "عين القصير", "بني سليمان", "سغوان", "بوسكن", "بوغار", "سيدي نعمان", 
    "مجبر", "الزوبيرية", "أولاد امبارك", "أولاد هلال", "ثنية الحد", "الكاف الأخضر", 
    "بن شكاو", "حناشة", "تابلاط", "العمارية", "حناشة", "دراقة", "مزغنة", "وادي حربيل"
  ],
  "27 - مستغانم": [
    "مستغانم", "عين تادلس", "عشعاشة", "حاسي ماماش", "سيرات", "مزغران", 
    "نكمارية", "فرناكة", "خضرة", "سيدي علي", "الصور", "سيدي لخضر", 
    "بوقيراط", "عين النويصي", "ستيديا", "الحسيان", "صفصاف", "حجاج", 
    "الطواهرية", "أولاد بوغالم", "الصفصافة"
  ],
  "28 - المسيلة": [
    "المسيلة",
    "مقرة",
    "برهوم",
    "بلعايبة",
    "عين الخضراء",
    "الدهاهنة",
    "أولاد دراج",
    "معاضيد",
    "صوامع",
    "أولاد عدي لقبالة",
    "مطارفة",
    "حمام ضلعة",
    "تارمونت",
    "أولاد منصور",
    "ونوغة",
    "عين الحجل",
    "سيدي هجرس",
    "سيدي عيسى",
    "بوطي سايح",
    "بني يلمان",
    "شلال",
    "خطوطي سد الجير",
    "أولاد ماضي",
    "المعاريف",
    "خبانة",
    "الحومد",
    "مسيف",
    "مجدل",
    "مناعة",
    "بوسعادة",
    "هامل",
    "ولتام",
    "أولاد سيدي إبراهيم",
    "بن زوه",
    "سيدي عامر",
    "تامسة",
    "بن سرور",
    "محمد بوضياف",
    "زرزور",
    "أولاد سليمان",
    "عين الملح",
    "بئر فضة",
    "عين فارس",
    "سيدي امحمد",
    "عين الريش",
    "جبل مسعد",
    "سليم"
],
  "29 - معسكر": [
    "معسكر", "غريس", "تيغنيف", "سيق", "الزبوجة", "عين فارس", "وادي الأبطال",
    "القرطوفة", "ماوسة", "بوحنيفية", "المحمدية", "سجرارة", "زهانة", "الكنانيط",
    "الكرط", "عين فراح", "عين يحيى", "خلوية", "تسالة", "عوف", "الحشم", 
    "الخيثر", "المطمر", "البرج", "البرج الجديد", "سيدي عبد المؤمن", 
    "رأس العين عميروش", "سيدي قادة", "سيدي بوسعيد"
  ],
  "30 - ورقلة": [
    "ورقلة", "تقرت", "تماسين", "الطيبات", "البرمة", "أنقوسة", 
    "الحجيرة", "النقوسة", "بلدة عمر", "سيدي سليمان", "العالية", 
    "سيدي خويلد", "نزلة", "حاسي بن عبد الله", "رويسات", "الرويبة"
  ],
        "31 - وهران": [
            "وهران", "قديل", "بئر الجير", "حاسي بونيف", "السانية", "بطيوة", "مرسى الحجاج", 
            "عين الترك", "العنصر", "وادي تليلات", "طفراوي", "سيدي الشحمي", "بوفاتيس", 
            "المرسى الكبير", "بوسفر", "الكرمة", "البراية"
        ],
        "32 - البيض": [
            "البيض", "بوقطب", "الأبيض سيدي الشيخ", "بريزينة", "الكاف لحمر", 
            "الغاسول", "عين العراك", "الأرباص", "المحبس", "الخيثر", 
            "سيدي الطيب", "ستيتن", "تامدة", "سيدي عمر", "استيتن", 
            "سيدي سليمان", "شلالة", "البويهي"
        ],
        "33 - إليزي": [
    "إليزي", "عين أميناس", "جانت", "برج الحواس", "برج عمر إدريس", 
    "دبداب", "إهرير", "إليزي المدينة"
  ],
  "34 - برج بوعريريج": [
    "برج بوعريريج", "رأس الوادي", "المنصورة", "عين تاغروت", "الجعافرة", 
    "بئر قاصد علي", "العناصر", "أولاد براهم", "الحمادية", "المهير", 
    "أولاد سيدي إبراهيم", "القصير", "تسامرت", "تكستار", "بن داود", 
    "المنصورة العليا", "غولام", "برج زمورة", "الزمورة", "خليل", 
    "الياشير", "البلدوزة", "العش", "المهير", "الحامة", 
    "الجعافرة الغربية", "سيدي امبارك", "تقلعيت", "الماين"
]
,
"35 - بومرداس": [
    "بومرداس",
    "تجلابين",
    "قورصو",
    "برج منايل",
    "جنات",
    "زموري",
    "لقاطة",
    "أولاد هداج",
    "بودواو",
    "بودواو البحري",
    "خروبة بودواو",
    "قدارة",
    "أعفير",
    "بن شود",
    "دلس",
    "بني عمران",
    "الثنية",
    "سوق الحد",
    "عمال",
    "تيمزريت",
    "سي مصطفى",
    "شعبة العامر",
    "يسر",
    "الأربعطاش",
    "أولاد موسى",
    "حمادي",
    "خميس الخشنة",
    "أولاد عيسى",
    "الناصرية",
    "بغلية",
    "تاورقة",
    "سيدي داود"
],
"36 - الطارف": [
    "الطارف", "البسباس", "بن مهيدي", "بوثلجة", "الذرعان", 
    "بوقوس", "الشط", "الشافية", "زريزر", "حام بوزيان", 
    "عصفور", "عين العسل", "السوارخ", "رمل السوق"
],
"37 - تندوف": [
    "تندوف", "أم العسل"
],
"38 - تيسمسيلت": [
    "تسمسيلت", "ثنية الأحد", "الأزهرية", "العيون", "بني شعيب", 
    "برج بونعامة", "خميستي", "لرجام", "الملعب", "مولاي العربي", 
    "اليوسفية", "سيدي سليمان", "سيدي العنتري", "تملاحت"
],
"39 - الوادي": [
    "الوادي", "قمار", "الدبيلة", "الرقيبة", "الطريفاوي", 
    "البياضة", "ورماس", "الرباح", "الحمراية", "أميه ونسة", 
    "النخلة", "الطالب العربي", "المقرن", "حساني عبد الكريم", 
    "سيدي عون", "مرارة", "الدوار", "العرقوب", "طويل", 
    "بن قشة", "تماسين", "جامعة", "الطيبات", "المقرن الجديدة"
],
"40 - خنشلة": [
    "عين الطويلة",
    "بابار",
    "بغاي",
    "بوحمامة",
    "ششار",
    "شلية",
    "جلال",
    "الحامة",
    "المحمل",
    "الولجة",
    "انسيغة",
    "قايس",
    "خنشلة",
    "خيران",
    "لمصارة",
    "متوسة",
    "أولاد رشاش",
    "الرميلة",
    "طامزة",
    "تاوزيانت",
    "يابوس"
],
"41 - سوق أهراس": [
    "سوق أهراس", "سدراتة", "تاورة", "أولاد إدريس", "بئر بوحوش", 
    "الزعرورية", "عين الزانة", "المراهنة", "الحنانشة", "المشروحة", 
    "المهاذن", "ويلان", "الرحبات", "بوشقوف", "مداوروش", 
    "تيفاش", "الخضارة", "وادي الكبريت", "الزعرور", "عين سلطان"
],
"42 - تيبازة": [
    "تيبازة", "حجوط", "بوسماعيل", "شرشال", "القليعة", 
    "فوكة", "دواودة", "مراد", "سيدي راشد", "أحمر العين", 
    "سيدي غيلاس", "حجرة النص", "عين تاقورايت", "الحطاطبة", 
    "سيدي سميان", "نزلة", "بوهارون", "بوراوي بلهادف", 
    "الناصرية", "قوراية"
],
"43 - ميلة": [
    "ميلة", "فرجيوة", "شلغوم العيد", "تاجنانت", "ترعي باينان",
    "عين البيضاء احريش", "القرارم قوقة", "وادي النجاء", "الرواشد", "أحمد راشدي",
    "التلاغمة", "وادي سقان", "وادي العثمانية", "عين الملوك", "سيدي خليفة",
    "مشيرة", "زغاية", "أولاد اخلوف", "مينار زارزة", "سيدي مروان",
    "حمالة", "عين كرشة", "تسالة المطاعي"
],
"44 - عين الدفلى": [
    "عين الدفلى", "خميس مليانة", "جندل", "بومدفع", "العامرة", 
    "العطاف", "العبادية", "الروينة", "عين سلطان", "طارق بن زياد", 
    "برج الأمير خالد", "البويرات", "بربوش", "بطحية", "تاشتة زقاغة", 
    "الحسينية", "المخاطرية", "الجمعة أولاد الشيخ", "واد الشرفاء", 
    "عين الاشياخ", "الحطاطبة", "حمام ريغة", "بوشراحيل", 
    "وادي الفضة", "واد الجمعة", "زدين"
],
"45 - النعامة": [
    "النعامة", "عين الصفراء", "مشرية", "مكمن بن عمار", "صفيصيفة",
    "تيوت", "عين بن خليل", "البيوض", "القصدير", "عسلة"
],
"47 - غرداية": [
    "غرداية", "متليلي", "القرارة", "بريان", "المنيعة", 
    "العطف", "ضاية بن ضحوة", "سبسب", "بونورة", "زلفانة", 
    "منصورة"
],
"46 - عين تموشنت": [
    "عين تموشنت", "حمام بوحجر", "بني صاف", "أولاد الكيحل", "شعبة اللحم", 
    "سيدي بن عدة", "سيدي بومدين", "أحفير", "وادي الصباح", "تارقة", 
    "المقطع", "تلموني", "تمزوغة", "العامرية", "عقب الليل", 
    "عين الكيحل", "بوزجار"
],

"48 - غليزان": [
    "غليزان",
    "بن داود",
    "يلل",
    "سيدي سعادة",
    "عين الرحمة",
    "القلعة",
    "المطمر",
    "بلعسل",
    "سيدي خطاب",
    "سيدي امحمد بن عودة",
    "منداس",
    "واد السلام",
    "سيدي لزرق",
    "الحمادنة",
    "واد الجمعة",
    "جديوية",
    "حمري",
    "أولاد سيدي الميهوب",
    "وادي ارهيو",
    "المرجة",
    "واريزان",
    "لحلاف",
    "مازونة",
    "القطار",
    "سيدي امحمد بن علي",
    "بني زنطيس",
    "مديونة",
    "عمي موسى",
    "الولجة",
    "أولاد يعيش",
    "الحاسي",
    "عين طارق",
    "حد الشكالة",
    "الرمكة",
    "سوق الحد",
    "زمورة",
    "دار بن عبد الله",
    "بني درقن"
],
"49 - تيميمون": [
    "تيميمون", "أولاد سعيد", "تبلبالة", "الدبداب", 
    "تمقطن", "أقبلي", "طلمين", "بني مهدي"
],
"50 - برج باجي مختار": [
    "برج باجي مختار", "عين قزام", "عين سليمان", "عين التمر", 
    "أولاد موحلي", "بني وليد"
],
"51 - أولاد جلال": [
    "أولاد جلال",
    "الشعيبة",
    "الدوسن",
    "سيدي خالد",
    "رأس الميعاد",
    "البسباس"
],
"52 - بني عباس": [
    "بني عباس", "عين العراك", "عين الجعافرة", "عين بلعباس", 
    "تامظوت", "عين تندرارة", "تاغيت", "عين الصفراء"
],
"53- عين صالح": [
    "عين صالح", "عين قزام", "تيميمون", "أوكار", "القطارة"
],
"54- عين قزام": [
    "عين قزام", "تينركوك", "بني وليد", "العش", "بئر قاصد علي"
],
"55 - توغرت": [
    "توغرت", "الصرار", "القرارة", "تمنطيط", "الرباح", "العبادلة", "العقلة"
],
"56 - جانت": [
    "جانت", "عين بن بيضاء", "عين الغزال", "عين إنيس", "تينزرات"
],
"57 - المغير": [
    "المغير", "تيميمون", "القصور", "عين سليت", "البرج"
],
"58 - المنيعة": [
    "المنيعة", "عين صالح", "القرارة", "تامنطيط", "أم الطوب"
]
    };

    // Improve visibility of toggle panels on mobile
    function adjustTogglePanelsForMobile() {
        const isMobile = window.innerWidth <= 650;
        if (isMobile) {
            togglePanels.forEach(panel => {
                // Increase font weight for better visibility
                panel.querySelectorAll('h1, p').forEach(element => {
                    element.style.fontWeight = 'bold';
                });
                
                // Ensure buttons are visible and properly sized
                const button = panel.querySelector('.btn');
                if (button) {
                    button.style.border = '2px solid #fff';
                }
                
                // Ensure social icons are visible
                const socialIcons = panel.querySelectorAll('.social-icons a');
                socialIcons.forEach(icon => {
                    icon.style.border = '2px solid #fff';
                });
            });
        } else {
            // Reset styles when not on mobile
            togglePanels.forEach(panel => {
                panel.querySelectorAll('h1, p').forEach(element => {
                    element.style.fontWeight = '';
                });
                
                const button = panel.querySelector('.btn');
                if (button) {
                    button.style.border = '';
                }
                
                const socialIcons = panel.querySelectorAll('.social-icons a');
                socialIcons.forEach(icon => {
                    icon.style.border = '';
                });
            });
        }
    }

    // Auto-focus prevention on mobile
    const formInputs = document.querySelectorAll('input, select');
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            if (window.innerWidth <= 650) {
                // Prevent keyboard from pushing content
                document.body.scrollTop = 0;
                document.documentElement.scrollTop = 0;
            }
        });
    });

    // Fix for iOS input focusing issues
    function fixIOSInputIssues() {
        if (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) {
            document.body.style.cursor = 'pointer';
            document.documentElement.style.webkitTouchCallout = 'none';
        }
    }

    // Validate form fields before submission
    function validateForm(form) {
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value.trim() || field.disabled) {
                isValid = false;
                field.classList.add('error');
                
                // Highlight the field with error
                field.style.border = '2px solid #ff3333';
                
                // Remove error styling after user starts typing
                field.addEventListener('input', function() {
                    this.style.border = '';
                    this.classList.remove('error');
                }, { once: true });
            }
        });
        
        return isValid;
    }

    // Toggle between forms
    registerBtn.addEventListener('click', () => {
        container.classList.add('active');
        // Scroll to top when switching forms on mobile
        if (window.innerWidth <= 650) {
            setTimeout(() => {
                formBoxes[1].scrollTop = 0;
            }, 500);
        }
    });

    loginBtn.addEventListener('click', () => {
        container.classList.remove('active');
        // Scroll to top when switching forms on mobile
        if (window.innerWidth <= 650) {
            setTimeout(() => {
                formBoxes[0].scrollTop = 0;
            }, 500);
        }
    });

    // Add responsive behavior for mobile devices
    function handleMobileView() {
        const isMobile = window.innerWidth <= 650;
        const isSmallMobile = window.innerWidth <= 480;
        const viewportHeight = window.innerHeight;
        
        // Set a minimum height for the content
        const minHeight = 500;
        const calculatedVH = Math.max(viewportHeight * 0.01, minHeight / 100);
        
        // Handle form box height based on device size
        formBoxes.forEach(box => {
            if (isSmallMobile) {
                box.style.maxHeight = (viewportHeight * 0.8) + 'px'; // 80% of viewport height for small mobile
            } else if (isMobile) {
                box.style.maxHeight = (viewportHeight * 0.75) + 'px'; // 75% of viewport height for mobile
            } else {
                box.style.maxHeight = '';
            }
        });
        
        // Fix for iOS viewport height issues
        document.documentElement.style.setProperty('--vh', `${calculatedVH}px`);
        
        // Adjust toggle panels for better mobile visibility
        adjustTogglePanelsForMobile();
    }

    // Fix for iOS initial viewport height
    function setVhProperty() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }

    // Add animation to order buttons
    orderButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Get the form
            const form = this.closest('form');
            const orderBtn = this;
            // Validate the form before submitting
            if (validateForm(form)) {
                if (!orderBtn.classList.contains('animate')) {
                    orderBtn.classList.add('animate');
                    // Disable scrolling during animation
                    const formBox = button.closest('.form-box');
                    formBox.style.overflowY = 'hidden';
                    // Submit form after animation
                    setTimeout(() => {
                        form.submit();
                        form.reset();
                        // Update order summary after reset
                        const formType = form.id === 'shoesForm' ? 'shoes' : 'shorts';
                        updateOrderSummary(formType);
                        // Re-enable scrolling if needed
                        setTimeout(() => {
                            formBox.style.overflowY = 'auto';
                        }, 500);
                        // Remove animate class after the full animation (10s)
                        setTimeout(() => {
                            orderBtn.classList.remove('animate');
                        }, 10000 - 2400); // 10s total minus the 2.4s already waited
                    }, 2400);
                }
            } else {
                // If validation fails, scroll to the first error field
                const firstError = form.querySelector('.error');
                if (firstError) {
                    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    firstError.focus();
                }
            }
        });
    });

    // Fix iOS 100vh issue
    window.addEventListener('resize', () => {
        handleMobileView();
        setVhProperty();
    });

    // Check for orientation change on mobile
    window.addEventListener('orientationchange', () => {
        // Small delay to ensure new dimensions are calculated
        setTimeout(() => {
            handleMobileView();
            setVhProperty();
            
            // Reset form scrolling position on orientation change
            formBoxes.forEach(box => {
                box.scrollTop = 0;
            });
        }, 200);
    });

    // Initial setup
    handleMobileView();
    setVhProperty();
    fixIOSInputIssues();
    adjustTogglePanelsForMobile();

    // Fix for mobile scrolling issues
    formBoxes.forEach(formBox => {
        formBox.addEventListener('touchstart', function(e) {
            if (this.scrollHeight > this.clientHeight) {
                e.stopPropagation();
            }
        }, { passive: true });
    });

    // Prevent form submission on enter key
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                return false;
            }
        });
    });
});