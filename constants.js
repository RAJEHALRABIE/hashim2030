/**
 * ملف الثوابت - Constants
 * يحتوي على جميع القيم الثابتة المستخدمة في التطبيق
 * للحفاظ على نظافة الكود وسهولة الصيانة
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

  // أوقات الذروة (Peak Times)
  PEAK_TIMES: {
    // الأحد إلى الأربعاء
    SUN_TO_WED: {
      start: 6,    // 6 صباحاً
      end: 19      // 7 مساءً
    },
    // الخميس
    THURSDAY: {
      start: 6,    // 6 صباحاً
      extensionEnd: 1  // امتداد حتى 1 فجر الجمعة
    },
    // الجمعة والسبت
    FRI_SAT: {
      start: 18,   // 6 مساءً
      extensionEnd: 1  // امتداد حتى 1 فجر اليوم التالي
    }
  },

  // حدود التحقق من الصحة (Validation Limits)
  VALIDATION: {
    MAX_FARE: 10000,           // الحد الأقصى لقيمة الرحلة
    MIN_FARE: 0,               // الحد الأدنى لقيمة الرحلة
    MAX_DURATION_HOURS: 24,    // الحد الأقصى لمدة الرحلة بالساعات
    MIN_DURATION_MINUTES: 1,   // الحد الأدنى لمدة الرحلة بالدقائق
    MAX_WEEKLY_HOURS: 168,     // الحد الأقصى لساعات العمل الأسبوعية (7 أيام × 24 ساعة)
    MIN_ACCEPT_RATE: 0,        // الحد الأدنى لنسبة القبول
    MAX_ACCEPT_RATE: 100,      // الحد الأقصى لنسبة القبول
    MIN_CANCEL_RATE: 0,        // الحد الأدنى لنسبة الإلغاء
    MAX_CANCEL_RATE: 100       // الحد الأقصى لنسبة الإلغاء
  },

  // الإعدادات الافتراضية للحافز
  DEFAULT_BONUS_SETTINGS: {
    minHours: 25,              // الحد الأدنى لساعات العمل
    minTripsBase: 35,          // الحد الأدنى الأساسي لعدد الرحلات
    peakPercentRequired: 70,   // الحد الأدنى لنسبة رحلات الذروة
    bonusPerTrip: 3,           // قيمة الحافز لكل رحلة بالريال
    acceptRate: 93,            // نسبة القبول المطلوبة
    cancelRate: 0,             // نسبة الإلغاء القصوى
    extraTripsPer5Hours: 1.5   // عدد الرحلات الإضافية لكل ساعة بعد 25 ساعة
  },

  // إعدادات الصوت (Audio Settings)
  AUDIO: {
    TAP: {
      freq: 440,
      duration: 0.08,
      volume: 0.08
    },
    SUCCESS: {
      freq: 760,
      duration: 0.14,
      volume: 0.1
    },
    ERROR: {
      freq: 220,
      duration: 0.2,
      volume: 0.14
    }
  },

  // أنواع الدفع
  PAYMENT_TYPES: {
    CASH: "cash",
    CARD: "card",
    MIXED: "mixed"
  },

  // أيام الأسبوع (للاستخدام في حساب أوقات الذروة)
  DAYS: {
    SUNDAY: 0,
    MONDAY: 1,
    TUESDAY: 2,
    WEDNESDAY: 3,
    THURSDAY: 4,
    FRIDAY: 5,
    SATURDAY: 6
  },

  // رسائل الأخطاء
  ERROR_MESSAGES: {
    INVALID_FARE: "قيمة الرحلة غير صحيحة",
    FARE_TOO_HIGH: "قيمة الرحلة تبدو مرتفعة جداً، هل أنت متأكد؟",
    CASH_EXCEEDS_FARE: "الكاش المستلم لا يمكن أن يكون أكبر من قيمة الرحلة",
    INSUFFICIENT_DATA: "البيانات المدخلة غير كافية",
    STORAGE_FULL: "مساحة التخزين ممتلئة. سيتم حذف البيانات القديمة.",
    INVALID_DATE: "تاريخ غير صحيح",
    DURATION_TOO_LONG: "مدة الرحلة طويلة جداً",
    NO_ACTIVE_TRIP: "لا توجد رحلة نشطة حالياً"
  },

  // رسائل النجاح
  SUCCESS_MESSAGES: {
    TRIP_SAVED: "تم حفظ الرحلة بنجاح",
    SETTINGS_SAVED: "تم حفظ الإعدادات بنجاح",
    WEEK_RESET: "تم بدء أسبوع جديد بنجاح"
  },

  // إعدادات UI/UX
  UI: {
    DEBOUNCE_DELAY: 150,       // تأخير debounce بالميلي ثانية
    ANIMATION_DURATION: 180,    // مدة الأنيميشن القياسية
    TOAST_DURATION: 3000,       // مدة ظهور الإشعارات
    MODAL_ANIMATION: 160        // مدة أنيميشن المودال
  },

  // Breakpoints للشاشات
  BREAKPOINTS: {
    MOBILE: 380,
    TABLET: 768,
    DESKTOP: 1024
  },

  // إعدادات التقرير
  REPORT: {
    DATE_FORMAT: {
      locale: 'ar-SA',
      options: {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }
    },
    TIME_FORMAT: {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }
  },

  // معلومات النسخة
  VERSION: {
    APP: "4.2",
    BUILD: "20250101"
  }
};

// تجميد الكائن لمنع التعديل عليه
Object.freeze(CONSTANTS);

// تصدير للاستخدام في ملفات أخرى
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONSTANTS;
}
