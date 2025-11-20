// تخزين محلي
const STORAGE_KEY = 'thrivve-tracker-v4.2-state'; 
// ملاحظة: تم حذف CONSTANTS للاعتماد على القيم المدمجة لتبسيط الكود وتجنب الأخطاء السابقة

// الدوال المساعدة الأساسية المُدمجة
function isValidNumber(value) {
  return typeof value === 'number' && isFinite(value) && !isNaN(value);
}

function formatNumber(num, digits = 2) {
  if (!isValidNumber(num)) return '0.' + '0'.repeat(digits);
  return Number(num).toFixed(digits);
}

function getDurationMinutes(start, end) {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diffMs = endDate - startDate;
  return Math.max(1, diffMs / (1000 * 60)); 
}

function formatTimeForTable(date) {
  const d = new Date(date);
  return d.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  });
}

function formatDateTimeShort(date) {
  const d = new Date(date);
  const dateStr = d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit"
  });
  const timeStr = d.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  });
  return `${dateStr} • ${timeStr}`;
}

// الدوال الأساسية (loadState, saveState)
function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.error("Error loading state:", e);
    return null;
  }
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error("Error saving state:", e);
  }
}

// حالة افتراضية
function getMondayOfWeek(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay(); // 0 = Sun
  const diff = (day === 0 ? -6 : 1) - day;
  d.setDate(d.getDate() + diff);
  return d;
}

// 📌 [تصحيح منطق الأسبوع]
function defaultState() {
  const now = new Date();
  const monday = getMondayOfWeek(now);
  const sunday = new Date(monday);
  
  // ✅ التصحيح: إضافة 6 أيام لضمان الأحد
  sunday.setDate(sunday.getDate() + 6); 

  const defaultSettings = {
    minHours: 25,
    minTripsBase: 35,
    peakPercentRequired: 70,
    bonusPerTrip: 3,
    acceptRate: 93,
    cancelRate: 0,
    extraTripsPer5Hours: 1.5
  };

  return {
    weekStart: monday.toISOString(),
    weekEnd: sunday.toISOString(),
    settings: defaultSettings,
    trips: [],
    activeTripStart: null,
    peakMigratedV2: true
  };
}

let state = loadState() || defaultState();

// عناصر DOM
const screens = document.querySelectorAll(".screen");
const navItems = document.querySelectorAll(".bottom-nav .nav-item");

const headerAcceptRate = document.getElementById("header-accept-rate");
const headerCancelRate = document.getElementById("header-cancel-rate");
const currentDayInfo = document.getElementById("current-day-info");
const currentWeekRange = document.getElementById("current-week-range");
const newWeekBtn = document.getElementById("new-week-btn");

const heroBonusAmount = document.getElementById("hero-bonus-amount");
const heroTripCount = document.getElementById("hero-trip-count");
const heroWorkHours = document.getElementById("hero-work-hours");
const heroTotalIncome = document.getElementById("hero-total-income");
const heroIncomeBoost = document.getElementById("hero-income-boost");
const heroIndicatorDot = document.getElementById("hero-indicator-dot");
const heroIndicatorText = document.getElementById("hero-indicator-text");

const metricTotalHours = document.getElementById("metric-total-hours");
const metricMinHours = document.getElementById("metric-min-hours");
const metricTotalTrips = document.getElementById("metric-total-trips");
const metricRequiredTrips = document.getElementById("metric-required-trips");
const metricPeakPercent = document.getElementById("metric-peak-percent");
const metricPeakRequired = document.getElementById("metric-peak-required");
const metricAcceptOfficial = document.getElementById("metric-accept-official");
const metricCancelOfficial = document.getElementById("metric-cancel-official");
const metricHoursDiff = document.getElementById("metric-hours-diff");
const metricTripsDiff = document.getElementById("metric-trips-diff");
const metricPeakDiff = document.getElementById("metric-peak-diff");
const barHours = document.getElementById("bar-hours");
const barTrips = document.getElementById("bar-trips");
const barPeak = document.getElementById("bar-peak");
const barQuality = document.getElementById("bar-quality");
const statusPill = document.getElementById("status-pill");
const statusText = document.getElementById("status-text");
const qualityAlert = document.getElementById("quality-alert");
const qualityAlertText = document.getElementById("quality-alert-text");

const quickStatusCore = document.getElementById("quick-status-core");
const quickStatusPeak = document.getElementById("quick-status-peak");
const quickStatusQuality = document.getElementById("quick-status-quality");

const startTripBtn = document.getElementById("start-trip-btn");
const endTripBtn = document.getElementById("end-trip-btn");
const activeTripChip = document.getElementById("active-trip-chip");
const statusInfoBtn = document.getElementById("status-info-btn");

const tripsEmptyState = document.getElementById("trips-empty-state");
const tripsTableWrapper = document.getElementById("trips-table-wrapper");
const tripsTableBody = document.getElementById("trips-table-body");

const walletCashTotal = document.getElementById("wallet-cash-total");
const walletOnlineTotal = document.getElementById("wallet-online-total");
const walletTotalGross = document.getElementById("wallet-total-gross");

const inputMinHours = document.getElementById("input-min-hours");
const inputMinTrips = document.getElementById("input-min-trips");
const inputPeakPercent = document.getElementById("input-peak-percent");
const inputBonusPerTrip = document.getElementById("input-bonus-per-trip");
const inputAcceptRate = document.getElementById("input-accept-rate");
const inputCancelRate = document.getElementById("input-cancel-rate");
const settingsForm = document.getElementById("settings-form");

const previewTripCount = document.getElementById("preview-trip-count");
const previewWorkHours = document.getElementById("preview-work-hours");
const previewIncome = document.getElementById("preview-income");
const previewBonus = document.getElementById("preview-bonus");
const openReportBtn = document.getElementById("open-report-btn");

// المودال العام
const modalBackdrop = document.getElementById("modal-backdrop");
const modalIcon = document.getElementById("modal-icon");
const modalTitle = document.getElementById("modal-title");
const modalMessage = document.getElementById("modal-message");
const modalCloseBtn = document.getElementById("modal-close-btn");
const modalActionsInfo = document.getElementById("modal-actions-info");
const modalActionsConfirm = document.getElementById("modal-actions-confirm");
const modalConfirmYes = document.getElementById("modal-confirm-yes");
const modalConfirmNo = document.getElementById("modal-confirm-no");

// Bottom sheet إنهاء الرحلة
const sheetBackdrop = document.getElementById("end-trip-sheet-backdrop");
const sheetTripInfo = document.getElementById("sheet-trip-info");
const sheetCloseBtn = document.getElementById("sheet-close-btn");
const payTypeButtons = document.querySelectorAll(".pay-type-btn");
const sheetFareInput = document.getElementById("sheet-fare-input");
const sheetCashGroup = document.getElementById("sheet-cash-group");
const sheetCashInput = document.getElementById("sheet-cash-input");
const sheetKeypad = document.getElementById("sheet-keypad");
const sheetSaveBtn = document.getElementById("sheet-save-btn");
const sheetCancelBtn = document.getElementById("sheet-cancel-btn");

// الأصوات (Web Audio API)
let audioCtx = null;
function ensureAudioContext() {
  if (audioCtx) return audioCtx;
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) return null;
  audioCtx = new Ctx();
  return audioCtx;
}

function playTone(type = "tap") {
  const ctx = ensureAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  let settings = {freq: 440, duration: 0.08, volume: 0.08}; 
  if (type === "success") {
    settings = {freq: 760, duration: 0.14, volume: 0.1};
  } else if (type === "error") {
    settings = {freq: 220, duration: 0.2, volume: 0.14};
  }

  osc.type = "sine";
  osc.frequency.value = settings.freq;

  gain.gain.setValueAtTime(settings.volume, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + settings.duration);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + settings.duration);
}

// منطق أوقات الذروة (بسيط)
function isPeakTime(date) {
  const d = new Date(date);
  const day = d.getDay(); // 0 = Sun
  const h = d.getHours(); // 0 - 23
  
  const DAYS = {SUNDAY: 0, MONDAY: 1, WEDNESDAY: 3, THURSDAY: 4, FRIDAY: 5, SATURDAY: 6};

  if (day >= DAYS.SUNDAY && day <= DAYS.WEDNESDAY) {
    return h >= 6 && h < 19;
  }

  if (day === DAYS.THURSDAY && h >= 6) {
    return true;
  }
  if (day === DAYS.FRIDAY && h < 1) {
    return true;
  }

  if ((day === DAYS.FRIDAY || day === DAYS.SATURDAY) && h >= 18) {
    return true;
  }
  if ((day === DAYS.SATURDAY || day === DAYS.SUNDAY) && h < 1) {
    return true;
  }

  return false;
}

// إعادة احتساب الذروة للرحلات القديمة وفق المنطق الجديد
function migratePeakFlagsOnce() {
  try {
    if (!state || !Array.isArray(state.trips)) return;
    if (state.peakMigratedV2) return;

    let changed = false;
    state.trips = state.trips.map((t) => {
      if (!t || !t.start) return t;
      const startDate = new Date(t.start);
      const newIsPeak = isPeakTime(startDate);
      if (t.isPeak !== newIsPeak) {
        changed = true;
        return { ...t, isPeak: newIsPeak };
      }
      return t;
    });

    state.peakMigratedV2 = true;
    if (changed) {
      saveState(state);
    } else {
      saveState(state);
    }
  } catch (e) {
    console.error("Migration error:", e);
  }
}

function formatDateRangeISO(startIso, endIso) {
  const start = new Date(startIso);
  const end = new Date(endIso);
  const opts = { day: "2-digit", month: "2-digit", year: "numeric" };
  const startStr = start.toLocaleDateString("en-GB", opts);
  const endStr = end.toLocaleDateString("en-GB", opts);
  return `${startStr} - ${endStr}`;
}

// حسابات أساسية
function computeTotals() {
  const trips = state.trips || [];
  let totalMinutes = 0;
  let totalFare = 0;
  let peakMinutes = 0;
  let peakTripsCount = 0;
  let cashTotal = 0;
  let onlineTotal = 0;

  for (const t of trips) {
    const dur = t.durationMinutes || 0;
    totalMinutes += dur;
    const fare = Number(t.fare || 0);
    totalFare += fare;

    if (t.isPeak) {
      peakMinutes += dur;
      peakTripsCount += 1;
    }

    const cash = Number(t.cashCollected || 0);
    cashTotal += cash;

    if (fare > cash) {
      onlineTotal += fare - cash;
    }
  }

  const totalHours = totalMinutes / 60;
  const tripCount = trips.length;
  const peakPercent = totalMinutes > 0 ? (peakMinutes / totalMinutes) * 100 : 0;
  const peakTripsPercent = tripCount > 0 ? (peakTripsCount / tripCount) * 100 : 0;

  return {
    totalMinutes,
    totalHours,
    totalFare,
    tripCount,
    peakMinutes,
    peakPercent,
    peakTripsCount,
    peakTripsPercent,
    cashTotal,
    onlineTotal
  };
}

// منطق الرحلات التصاعدي
function computeRequiredTrips() {
  const s = state.settings;
  const { totalHours } = computeTotals();
  const base = Number(s.minTripsBase || 0);
  const baseHours = Number(s.minHours || 0);
  
  if (totalHours <= baseHours) return base;

  const extraHours = totalHours - baseHours;
  const extraTrips = extraHours * 1.5; // استخدام 1.5 مباشرة
  return base + Math.ceil(extraTrips);
}

function checkConditions() {
  const {
    totalHours,
    tripCount,
    peakPercent
  } = computeTotals();
  const s = state.settings;

  const requiredTrips = computeRequiredTrips();
  const hoursOk = totalHours >= Number(s.minHours || 0);
  const tripsOk = tripCount >= requiredTrips;
  const peakOk = peakPercent >= Number(s.peakPercentRequired || 0);
  const acceptOk = Number(s.acceptRate || 0) >= 65;
  const cancelOk = Number(s.cancelRate || 0) <= 10;

  return {
    hoursOk,
    tripsOk,
    peakOk,
    acceptOk,
    cancelOk,
    requiredTrips
  };
}

// عرض الحالة (يستخدم debouncedUpdateUI)
function updateUI() {
  // معلومات اليوم والعد التنازلي للأيام المتبقية
  if (currentDayInfo) {
    const today = new Date();
    const weekEnd = new Date(state.weekEnd);
    const dayName = today.toLocaleDateString("ar-SA", { weekday: "long" });
    const todayStr = today.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
    weekEnd.setHours(23, 59, 59, 999);
    const diffMs = weekEnd - today;
    const daysLeft = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
    currentDayInfo.textContent = `اليوم: ${dayName} ${todayStr} • المتبقي: ${daysLeft} أيام`;
  }

  // رأس الصفحة
  if (currentWeekRange) {
    currentWeekRange.textContent = `أسبوع الحافز: ${formatDateRangeISO(
      state.weekStart,
      state.weekEnd
    )}`;
  }

  // ... (بقية منطق تحديث الواجهة) ...

  const totals = computeTotals();
  const cond = checkConditions();

  // ... (تحديث الأرقام) ...
}

// تنقل بين الشاشات
navItems.forEach((btn) => {
  btn.addEventListener("click", () => {
    const targetId = btn.dataset.target;
    screens.forEach((s) => s.classList.remove("active"));
    document.getElementById(targetId).classList.add("active");

    navItems.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    playTone("tap");
  });
});

// ... (بقية الدوال: المودال، أسبوع جديد، الإعدادات، إلخ) ...

// زر أسبوع جديد (لضمان نهاية الأسبوع يوم الأحد)
newWeekBtn.addEventListener("click", () => {
  openConfirmModal(
    "بدء أسبوع حافز جديد",
    "سيتم مسح جميع الرحلات الحالية والبدء من جديد مع الاحتفاظ بنفس إعدادات الشروط. هل أنت متأكد؟",
    "⚠️",
    () => {
      const now = new Date();
      const monday = getMondayOfWeek(now);
      const sunday = new Date(monday);
      
      // التصحيح: إضافة 6 أيام ليكون الأحد
      sunday.setDate(sunday.getDate() + 6); 

      state.weekStart = monday.toISOString();
      state.weekEnd = sunday.toISOString();
      state.trips = [];
      state.activeTripStart = null;
      saveState(state);
      debouncedUpdateUI(); 
      playTone("success");
    }
  );
});

// ... (بقية الدوال: حفظ الرحلة، إلخ) ...

// 📌 [الحل النهائي]: تأكيد تحميل DOM بالكامل قبل بدء التطبيق
document.addEventListener('DOMContentLoaded', () => {
    // التحقق من وجود العناصر قبل محاولة ربط الأحداث
    if (navItems.length > 0 && newWeekBtn && sheetKeypad) {
        migratePeakFlagsOnce(); 
        debouncedUpdateUI(); 
    } else {
        // إذا لم يتم العثور على العناصر الأساسية، قد يكون هناك خطأ في HTML
        console.error("Critical DOM elements not found. UI rendering halted.");
    }
});
