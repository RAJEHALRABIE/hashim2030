/**
 * ملف الثوابت - Constants
 */

const CONSTANTS = {
  // مفاتيح التخزين المحلي
  STORAGE: {
    STATE_KEY: "thrivve-tracker-v4.2-state",
    THEME_KEY: "thrivve-theme",
    PEAK_MIGRATED_FLAG: "peakMigratedV2"
  },

  // Service Worker & PWA
  PWA: {
    CACHE_NAME: "thrivve-tracker-v4.2",
    RUNTIME_CACHE: "thrivve-runtime-v4.2"
  },

  // أوقات الذروة (Peak Times) - المنطق المُحدّث
  PEAK_TIMES: {
    SUN_TO_WED: {
      start: 6,    // 6 صباحاً
      end: 19      // 7 مساءً
    },
    THURSDAY: {
      start: 6,    // 6 صباحاً
      extensionEnd: 1  // امتداد حتى 1 فجر الجمعة
    },
    FRI_SAT: {
      start: 18,   // 6 مساءً
      extensionEnd: 1  // امتداد حتى 1 فجر اليوم التالي
    }
  },

  VALIDATION: {
    MAX_FARE: 10000,           
    MIN_DURATION_MINUTES: 1,   
    MAX_DURATION_HOURS: 24,    
  },

  // الإعدادات الافتراضية للحافز
  DEFAULT_BONUS_SETTINGS: {
    minHours: 25,              // الحد الأدنى لساعات العمل
    minTripsBase: 35,          // الحد الأدنى الأساسي لعدد الرحلات
    peakPercentRequired: 70,   // الحد الأدنى لنسبة رحلات الذروة
    bonusPerTrip: 3,           // قيمة الحافز لكل رحلة بالريال
    acceptRate: 93,            
    cancelRate: 0,             
    extraTripsPer5Hours: 1.5   // معدل الرحلات التصاعدي: 1.5 رحلة لكل ساعة بعد 25 ساعة
  },

  AUDIO: {
    TAP: { freq: 440, duration: 0.08, volume: 0.08 },
    SUCCESS: { freq: 760, duration: 0.14, volume: 0.1 },
    ERROR: { freq: 220, duration: 0.2, volume: 0.14 }
  },

  PAYMENT_TYPES: {
    CASH: "cash",
    CARD: "card",
    MIXED: "mixed"
  },
  
  DAYS: {
    SUNDAY: 0, MONDAY: 1, TUESDAY: 2, WEDNESDAY: 3, THURSDAY: 4, FRIDAY: 5, SATURDAY: 6
  },

  ERROR_MESSAGES: {
    TRIP_VALIDATION_FAILED: "تحقق من قيم الرحلة ونوع الدفع.",
    SETTINGS_INVALID: "الرجاء إدخال قيم صحيحة للإعدادات.",
    STORAGE_FULL: "مساحة التخزين ممتلئة.",
  },
  SUCCESS_MESSAGES: {
    TRIP_SAVED: "تم حفظ الرحلة بنجاح",
    SETTINGS_SAVED: "تم حفظ الإعدادات بنجاح",
    WEEK_RESET: "تم بدء أسبوع جديد بنجاح"
  },
  UI: {
    DEBOUNCE_DELAY: 150,
  }
};

Object.freeze(CONSTANTS);
