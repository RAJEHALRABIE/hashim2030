/**
 * ملف الدوال المساعدة - Utilities
 * يحتوي على دوال مساعدة يمكن إعادة استخدامها في أجزاء مختلفة من التطبيق
 */

/**
 * Debounce - تأخير تنفيذ الدالة حتى انتهاء الاستدعاءات المتكررة
 * @param {Function} func - الدالة المراد تأخير تنفيذها
 * @param {number} wait - مدة الانتظار بالميلي ثانية
 * @returns {Function} - دالة جديدة مع debounce
 */
function debounce(func, wait = 150) {
  let timeout;
  return function executedFunction(...args) {
    const context = this;
    const later = () => {
      clearTimeout(timeout);
      func.apply(context, args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle - تحديد عدد مرات تنفيذ الدالة في فترة زمنية معينة
 * @param {Function} func - الدالة المراد تقييد تنفيذها
 * @param {number} limit - الحد الزمني بالميلي ثانية
 * @returns {Function} - دالة جديدة مع throttle
 */
function throttle(func, limit = 200) {
  let inThrottle;
  return function(...args) {
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * التحقق من صحة الرقم
 * @param {*} value - القيمة المراد التحقق منها
 * @returns {boolean} - true إذا كانت رقم صحيح
 */
function isValidNumber(value) {
  return typeof value === 'number' && isFinite(value) && !isNaN(value);
}

/**
 * التحقق من صحة التاريخ
 * @param {Date|string} date - التاريخ المراد التحقق منه
 * @returns {boolean} - true إذا كان تاريخ صحيح
 */
function isValidDate(date) {
  const d = new Date(date);
  return d instanceof Date && !isNaN(d.getTime());
}

/**
 * تنسيق الأرقام مع فواصل عشرية
 * @param {number} num - الرقم المراد تنسيقه
 * @param {number} decimals - عدد الخانات العشرية
 * @returns {string} - الرقم المنسق
 */
function formatNumber(num, decimals = 2) {
  if (!isValidNumber(num)) return '0.' + '0'.repeat(decimals);
  return Number(num).toFixed(decimals);
}

/**
 * تنسيق التاريخ والوقت بالعربية
 * @param {Date|string} date - التاريخ المراد تنسيقه
 * @returns {string} - التاريخ المنسق
 */
function formatDateTimeArabic(date) {
  if (!isValidDate(date)) return '';
  
  try {
    const d = new Date(date);
    return new Intl.DateTimeFormat('ar-SA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(d);
  } catch (error) {
    console.error('خطأ في تنسيق التاريخ:', error);
    return '';
  }
}

/**
 * تنسيق التاريخ فقط
 * @param {Date|string} date - التاريخ المراد تنسيقه
 * @returns {string} - التاريخ المنسق
 */
function formatDateOnly(date) {
  if (!isValidDate(date)) return '';
  
  try {
    const d = new Date(date);
    return new Intl.DateTimeFormat('ar-SA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(d);
  } catch (error) {
    console.error('خطأ في تنسيق التاريخ:', error);
    return '';
  }
}

/**
 * حساب الفرق بين تاريخين بالدقائق
 * @param {Date|string} start - تاريخ البداية
 * @param {Date|string} end - تاريخ النهاية
 * @returns {number} - الفرق بالدقائق
 */
function getDurationMinutes(start, end) {
  if (!isValidDate(start) || !isValidDate(end)) return 0;
  
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diffMs = endDate - startDate;
  
  if (diffMs < 0) return 0;
  
  return diffMs / (1000 * 60);
}

/**
 * حساب الفرق بين تاريخين بالساعات
 * @param {Date|string} start - تاريخ البداية
 * @param {Date|string} end - تاريخ النهاية
 * @returns {number} - الفرق بالساعات
 */
function getDurationHours(start, end) {
  return getDurationMinutes(start, end) / 60;
}

/**
 * التحقق من صحة بيانات الرحلة
 * @param {number} fareVal - قيمة الرحلة
 * @param {number} cashVal - قيمة الكاش
 * @param {string} paymentType - نوع الدفع
 * @returns {Object} - نتيجة التحقق
 */
function validateTripData(fareVal, cashVal, paymentType) {
  const errors = [];
  const warnings = [];
  
  // التحقق من القيم السالبة
  if (fareVal < 0 || cashVal < 0) {
    errors.push("القيم يجب أن تكون موجبة");
  }
  
  // التحقق من القيم الكبيرة جداً
  if (fareVal > CONSTANTS.VALIDATION.MAX_FARE) {
    warnings.push(`قيمة الرحلة (${fareVal} ر.س) تبدو مرتفعة جداً، هل أنت متأكد؟`);
  }
  
  // التحقق حسب نوع الدفع
  switch (paymentType) {
    case CONSTANTS.PAYMENT_TYPES.CARD:
      if (fareVal <= 0) {
        errors.push("في حالة الدفع بالبطاقة، يجب إدخال قيمة الرحلة");
      }
      break;
      
    case CONSTANTS.PAYMENT_TYPES.CASH:
      if (fareVal <= 0 && cashVal <= 0) {
        errors.push("أدخل على الأقل قيمة واحدة: قيمة الرحلة أو الكاش المستلم");
      }
      if (cashVal > 0 && fareVal > 0 && cashVal > fareVal) {
        errors.push("الكاش المستلم لا يمكن أن يكون أكبر من قيمة الرحلة");
      }
      break;
      
    case CONSTANTS.PAYMENT_TYPES.MIXED:
      if (fareVal <= 0 && cashVal <= 0) {
        errors.push("في حالة الدفع المختلط، أدخل على الأقل قيمة واحدة");
      }
      if (cashVal > fareVal && fareVal > 0) {
        errors.push("الكاش المستلم لا يمكن أن يكون أكبر من قيمة الرحلة");
      }
      break;
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * التحقق من صحة مدة الرحلة
 * @param {number} durationMinutes - مدة الرحلة بالدقائق
 * @returns {Object} - نتيجة التحقق
 */
function validateTripDuration(durationMinutes) {
  const errors = [];
  const warnings = [];
  
  if (!isValidNumber(durationMinutes)) {
    errors.push("مدة الرحلة غير صحيحة");
    return { isValid: false, errors, warnings };
  }
  
  if (durationMinutes < CONSTANTS.VALIDATION.MIN_DURATION_MINUTES) {
    errors.push(`مدة الرحلة يجب أن تكون على الأقل ${CONSTANTS.VALIDATION.MIN_DURATION_MINUTES} دقيقة`);
  }
  
  const durationHours = durationMinutes / 60;
  if (durationHours > CONSTANTS.VALIDATION.MAX_DURATION_HOURS) {
    warnings.push(`مدة الرحلة (${formatNumber(durationHours, 1)} ساعة) تبدو طويلة جداً، هل أنت متأكد؟`);
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * تنظيف المدخلات من HTML و XSS
 * @param {string} input - النص المراد تنظيفه
 * @returns {string} - النص النظيف
 */
function sanitizeInput(input) {
  if (typeof input !== 'string') return '';
  
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
}

/**
 * حفظ آمن في localStorage مع معالجة الأخطاء
 * @param {string} key - مفتاح التخزين
 * @param {*} value - القيمة المراد حفظها
 * @returns {boolean} - true إذا تم الحفظ بنجاح
 */
function safeLocalStorageSet(key, value) {
  try {
    const serialized = JSON.stringify(value);
    localStorage.setItem(key, serialized);
    return true;
  } catch (error) {
    console.error('خطأ في حفظ البيانات:', error);
    
    if (error.name === 'QuotaExceededError') {
      console.warn('مساحة التخزين ممتلئة');
      // يمكن إضافة منطق لحذف البيانات القديمة هنا
    }
    
    return false;
  }
}

/**
 * قراءة آمنة من localStorage مع معالجة الأخطاء
 * @param {string} key - مفتاح التخزين
 * @param {*} defaultValue - القيمة الافتراضية عند الفشل
 * @returns {*} - القيمة المحفوظة أو القيمة الافتراضية
 */
function safeLocalStorageGet(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(key);
    if (item === null) return defaultValue;
    
    return JSON.parse(item);
  } catch (error) {
    console.error('خطأ في قراءة البيانات:', error);
    return defaultValue;
  }
}

/**
 * حساب نسبة مئوية
 * @param {number} part - الجزء
 * @param {number} whole - الكل
 * @returns {number} - النسبة المئوية
 */
function calculatePercentage(part, whole) {
  if (!isValidNumber(part) || !isValidNumber(whole) || whole === 0) {
    return 0;
  }
  
  return (part / whole) * 100;
}

/**
 * تقريب رقم لأقرب منزلة عشرية
 * @param {number} num - الرقم المراد تقريبه
 * @param {number} decimals - عدد المنازل العشرية
 * @returns {number} - الرقم المقرب
 */
function roundToDecimals(num, decimals = 2) {
  if (!isValidNumber(num)) return 0;
  
  const multiplier = Math.pow(10, decimals);
  return Math.round(num * multiplier) / multiplier;
}

/**
 * التحقق من دعم المتصفح لميزة معينة
 * @param {string} feature - اسم الميزة
 * @returns {boolean} - true إذا كانت مدعومة
 */
function isFeatureSupported(feature) {
  const features = {
    serviceWorker: 'serviceWorker' in navigator,
    localStorage: typeof Storage !== 'undefined',
    webAudio: 'AudioContext' in window || 'webkitAudioContext' in window,
    vibrate: 'vibrate' in navigator,
    share: 'share' in navigator,
    notifications: 'Notification' in window,
    geolocation: 'geolocation' in navigator
  };
  
  return features[feature] || false;
}

/**
 * اهتزاز الجهاز (Haptic Feedback)
 * @param {number|Array} pattern - نمط الاهتزاز
 */
function vibrate(pattern = [10]) {
  if (isFeatureSupported('vibrate')) {
    try {
      navigator.vibrate(pattern);
    } catch (error) {
      console.warn('خطأ في الاهتزاز:', error);
    }
  }
}

/**
 * نسخ نص إلى الحافظة
 * @param {string} text - النص المراد نسخه
 * @returns {Promise<boolean>} - Promise يعود بـ true عند النجاح
 */
async function copyToClipboard(text) {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback للمتصفحات القديمة
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      const success = document.execCommand('copy');
      document.body.removeChild(textarea);
      return success;
    }
  } catch (error) {
    console.error('خطأ في النسخ:', error);
    return false;
  }
}

/**
 * تأخير تنفيذ Promise
 * @param {number} ms - مدة التأخير بالميلي ثانية
 * @returns {Promise} - Promise يكتمل بعد المدة المحددة
 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * إنشاء معرف فريد (UUID بسيط)
 * @returns {string} - معرف فريد
 */
function generateUniqueId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * التحقق من كون القيمة فارغة
 * @param {*} value - القيمة المراد التحقق منها
 * @returns {boolean} - true إذا كانت فارغة
 */
function isEmpty(value) {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}

/**
 * دمج كائنات بشكل عميق
 * @param {Object} target - الكائن الهدف
 * @param {Object} source - الكائن المصدر
 * @returns {Object} - الكائن المدمج
 */
function deepMerge(target, source) {
  const result = { ...target };
  
  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      if (source[key] instanceof Object && !Array.isArray(source[key])) {
        result[key] = deepMerge(result[key] || {}, source[key]);
      } else {
        result[key] = source[key];
      }
    }
  }
  
  return result;
}

// تصدير الدوال
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    debounce,
    throttle,
    isValidNumber,
    isValidDate,
    formatNumber,
    formatDateTimeArabic,
    formatDateOnly,
    getDurationMinutes,
    getDurationHours,
    validateTripData,
    validateTripDuration,
    sanitizeInput,
    safeLocalStorageSet,
    safeLocalStorageGet,
    calculatePercentage,
    roundToDecimals,
    isFeatureSupported,
    vibrate,
    copyToClipboard,
    delay,
    generateUniqueId,
    isEmpty,
    deepMerge
  };
}
