// Starting "Puja Samagri Generator" templates. Each template lists the
// items typically needed, with quantities that scale by guest count.
//
// ⚠️ IMPORTANT FOR THE SHOP OWNER: these lists are a general starting
// point built from common practice — NOT a religious authority. Rituals
// vary a lot by family tradition, region, and the priest's own
// requirements — especially "13वीं" (terahvin), which is sensitive and
// tradition-specific. Please review and edit every template from the
// Admin panel (Puja Templates tab) to match what you and your regular
// pandits actually recommend, before relying on this with real customers.
//
// Each item:
//   label        — what's shown to the customer
//   baseQty      — fixed starting quantity
//   perGuestQty  — extra quantity added per guest (0 if it doesn't scale)
//   unit         — जैसे "ग्राम", "पीस", "माला"
//   matchName    — text used to search your product catalog for a link;
//                  if nothing matches, it's shown as a text-only reminder
//                  instead of being addable to cart

module.exports = [
  {
    id: 'satyanarayan-katha',
    nameHi: 'सत्यनारायण कथा',
    description: 'घर में सत्यनारायण भगवान की कथा व पूजा के लिए',
    note: 'प्रसाद की मात्रा (सूजी/चीनी/घी) मेहमानों की संख्या पर अनुमानित है — अपने हिसाब से बढ़ा-घटा लें।',
    items: [
      { label: 'कलश', baseQty: 1, perGuestQty: 0, unit: 'पीस', matchName: 'कलश' },
      { label: 'नारियल (श्रीफल)', baseQty: 2, perGuestQty: 0, unit: 'पीस', matchName: 'नारियल' },
      { label: 'रोली-मौली सेट', baseQty: 1, perGuestQty: 0, unit: 'सेट', matchName: 'रोली' },
      { label: 'पीली चुनरी/वस्त्र', baseQty: 1, perGuestQty: 0, unit: 'पीस', matchName: 'चुनरी' },
      { label: 'अगरबत्ती', baseQty: 1, perGuestQty: 0.02, unit: 'पैकेट', matchName: 'अगरबत्ती' },
      { label: 'दीपक/दीया', baseQty: 4, perGuestQty: 0, unit: 'पीस', matchName: 'दीया' },
      { label: 'शुद्ध घी', baseQty: 100, perGuestQty: 5, unit: 'ग्राम', matchName: 'घी' },
      { label: 'शुद्ध कपूर', baseQty: 1, perGuestQty: 0, unit: 'पैकेट', matchName: 'कपूर' },
      { label: 'फूल/माला', baseQty: 2, perGuestQty: 0, unit: 'पीस', matchName: 'माला' },
      { label: 'हवन सामग्री', baseQty: 1, perGuestQty: 0, unit: 'पैकेट', matchName: 'हवन सामग्री' },
      { label: 'सुपारी व पान के पत्ते', baseQty: 10, perGuestQty: 1, unit: 'पीस', matchName: 'सुपारी' }
    ]
  },
  {
    id: 'griha-pravesh',
    nameHi: 'गृह प्रवेश',
    description: 'नए घर में प्रवेश की पूजा के लिए',
    note: '',
    items: [
      { label: 'कलश', baseQty: 1, perGuestQty: 0, unit: 'पीस', matchName: 'कलश' },
      { label: 'नारियल', baseQty: 2, perGuestQty: 0, unit: 'पीस', matchName: 'नारियल' },
      { label: 'रोली-मौली सेट', baseQty: 1, perGuestQty: 0, unit: 'सेट', matchName: 'रोली' },
      { label: 'हवन सामग्री (बड़ा पैकेट)', baseQty: 2, perGuestQty: 0, unit: 'पैकेट', matchName: 'हवन सामग्री' },
      { label: 'शुद्ध घी', baseQty: 250, perGuestQty: 0, unit: 'ग्राम', matchName: 'घी' },
      { label: 'दीपक/दीया', baseQty: 5, perGuestQty: 0, unit: 'पीस', matchName: 'दीया' },
      { label: 'अगरबत्ती', baseQty: 2, perGuestQty: 0.02, unit: 'पैकेट', matchName: 'अगरबत्ती' },
      { label: 'शुद्ध कपूर', baseQty: 1, perGuestQty: 0, unit: 'पैकेट', matchName: 'कपूर' },
      { label: 'फूल/माला', baseQty: 2, perGuestQty: 0.05, unit: 'पीस', matchName: 'माला' },
      { label: 'पूजा थाली सेट', baseQty: 1, perGuestQty: 0, unit: 'सेट', matchName: 'थाली' },
      { label: 'आम के पत्ते / तोरण', baseQty: 1, perGuestQty: 0, unit: 'सेट', matchName: null }
    ]
  },
  {
    id: 'mahamrityunjay-jaap',
    nameHi: 'महामृत्युंजय जाप',
    description: 'महामृत्युंजय मंत्र जाप व हवन के लिए',
    note: 'जाप संख्या (11/21/108/1008) के हिसाब से मात्रा घटा-बढ़ा सकते हैं — यहां "मेहमान" की जगह अंदाज़न 11 आवृत्ति मान के हिसाब से दिखाया है।',
    items: [
      { label: 'हवन सामग्री', baseQty: 1, perGuestQty: 0, unit: 'पैकेट', matchName: 'हवन सामग्री' },
      { label: 'शुद्ध घी', baseQty: 150, perGuestQty: 0, unit: 'ग्राम', matchName: 'घी' },
      { label: 'रुद्राक्ष माला', baseQty: 1, perGuestQty: 0, unit: 'पीस', matchName: 'रुद्राक्ष' },
      { label: 'शुद्ध कपूर', baseQty: 1, perGuestQty: 0, unit: 'पैकेट', matchName: 'कपूर' },
      { label: 'दीपक/दीया', baseQty: 2, perGuestQty: 0, unit: 'पीस', matchName: 'दीया' },
      { label: 'चंदन', baseQty: 1, perGuestQty: 0, unit: 'पैकेट', matchName: 'चंदन' },
      { label: 'काले तिल', baseQty: 100, perGuestQty: 0, unit: 'ग्राम', matchName: null },
      { label: 'बेल पत्र', baseQty: 21, perGuestQty: 0, unit: 'पत्ते', matchName: null }
    ]
  },
  {
    id: 'bhagwat-katha',
    nameHi: 'भागवत कथा',
    description: 'बहु-दिवसीय भागवत कथा आयोजन के लिए',
    note: 'ये अंदाज़न मात्रा है, कथा कितने दिन चलेगी उसके हिसाब से (खासकर दीया/घी/अगरबत्ती) मात्रा खुद बढ़ा लें।',
    items: [
      { label: 'कलश', baseQty: 1, perGuestQty: 0, unit: 'पीस', matchName: 'कलश' },
      { label: 'नारियल', baseQty: 2, perGuestQty: 0, unit: 'पीस', matchName: 'नारियल' },
      { label: 'व्यास पीठ हेतु वस्त्र/चुनरी', baseQty: 1, perGuestQty: 0, unit: 'पीस', matchName: 'चुनरी' },
      { label: 'अखंड दीपक हेतु घी', baseQty: 500, perGuestQty: 0, unit: 'ग्राम', matchName: 'घी' },
      { label: 'दीपक/दीया', baseQty: 10, perGuestQty: 0, unit: 'पीस', matchName: 'दीया' },
      { label: 'अगरबत्ती/धूप', baseQty: 5, perGuestQty: 0.03, unit: 'पैकेट', matchName: 'अगरबत्ती' },
      { label: 'फूल/माला', baseQty: 5, perGuestQty: 0.1, unit: 'पीस', matchName: 'माला' },
      { label: 'हवन सामग्री (पूर्णाहुति हेतु)', baseQty: 2, perGuestQty: 0, unit: 'पैकेट', matchName: 'हवन सामग्री' },
      { label: 'शुद्ध कपूर', baseQty: 2, perGuestQty: 0, unit: 'पैकेट', matchName: 'कपूर' }
    ]
  },
  {
    id: 'terahvin',
    nameHi: '13वीं (तेरहवीं संस्कार)',
    description: 'शोक संस्कार की तेरहवीं की रस्म के लिए',
    note: '⚠️ ये एक सामान्य शुरुआती सूची है। तेरहवीं की रस्म परिवार की परंपरा और पंडित जी के अनुसार काफी अलग होती है (खासकर दान की वस्तुएं) — कृपया अंतिम सूची अपने पंडित जी से ज़रूर confirm करें।',
    items: [
      { label: 'सफ़ेद वस्त्र/चुनरी', baseQty: 1, perGuestQty: 0, unit: 'पीस', matchName: 'चुनरी' },
      { label: 'तिल', baseQty: 100, perGuestQty: 0, unit: 'ग्राम', matchName: null },
      { label: 'चावल (अक्षत)', baseQty: 250, perGuestQty: 0, unit: 'ग्राम', matchName: null },
      { label: 'शुद्ध घी', baseQty: 100, perGuestQty: 0, unit: 'ग्राम', matchName: 'घी' },
      { label: 'दीपक/दीया', baseQty: 2, perGuestQty: 0, unit: 'पीस', matchName: 'दीया' },
      { label: 'अगरबत्ती', baseQty: 1, perGuestQty: 0, unit: 'पैकेट', matchName: 'अगरबत्ती' },
      { label: 'सफ़ेद फूल', baseQty: 1, perGuestQty: 0, unit: 'माला', matchName: 'माला' },
      { label: 'शुद्ध कपूर', baseQty: 1, perGuestQty: 0, unit: 'पैकेट', matchName: 'कपूर' },
      { label: 'दान हेतु वस्तुएं (वस्त्र/बर्तन आदि)', baseQty: 1, perGuestQty: 0, unit: 'सेट', matchName: null }
    ]
  }
];
