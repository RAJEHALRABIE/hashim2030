/**
 * ملف الدوال المساعدة - Utilities (للتأكد من وجود الدوال المستخدمة في app.js)
 */

function isValidNumber(value) {
  return typeof value === 'number' && isFinite(value) && !isNaN(value);
}

function isValidDate(date) {
  const d = new Date(date);
  return d instanceof Date && !isNaN(d.getTime());
}

function formatNumber(num, decimals = 2) {
  if (!isValidNumber(num)) return '0.' + '0'.repeat(decimals);
  return Number(num).toFixed(decimals);
}

function formatDateTimeShort(date) {
  if (!isValidDate(date)) return '';
  const d = new Date(date);
  const dateStr = d.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "2-digit" });
  const timeStr = d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: true });
  return `${dateStr} • ${timeStr}`;
}

function getDurationMinutes(start, end) {
  if (!isValidDate(start) || !isValidDate(end)) return 0;
  
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diffMs = endDate - startDate;
  
  if (diffMs < 0) return 0;
  
  return diffMs / (1000 * 60);
}

function validateTripData(fareVal, cashVal, paymentType) {
  const errors = [];
  
  // التحقق من القيم الأساسية
  if (!isValidNumber(fareVal) || !isValidNumber(cashVal)) {
      errors.push("قيمة الرحلة أو الكاش غير صحيحة.");
  }
  if (fareVal < 0 || cashVal < 0) {
    errors.push("القيم يجب أن تكون موجبة");
  }
  
  // التحقق حسب نوع الدفع
  switch (paymentType) {
    case CONSTANTS.PAYMENT_TYPES.CARD:
      if (fareVal <= 0) {
        errors.push("في حالة الدفع بالبطاقة، يجب إدخال قيمة الرحلة");
      }
      break;
    case CONSTANTS.PAYMENT_TYPES.CASH:
    case CONSTANTS.PAYMENT_TYPES.MIXED:
      if (fareVal <= 0 && cashVal <= 0) {
        errors.push("أدخل على الأقل قيمة واحدة: قيمة الرحلة أو الكاش المستلم");
      }
      if (cashVal > fareVal && fareVal > 0) {
        errors.push("الكاش المستلم لا يمكن أن يكون أكبر من قيمة الرحلة");
      }
      break;
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

function safeLocalStorageSet(key, value) {
  try {
    const serialized = JSON.stringify(value);
    localStorage.setItem(key, serialized);
    return true;
  } catch (error) {
    console.error('خطأ في حفظ البيانات:', error);
    if (error.name === 'QuotaExceededError') {
      alert(CONSTANTS.ERROR_MESSAGES.STORAGE_FULL);
    }
    return false;
  }
}

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

function generateUniqueId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
