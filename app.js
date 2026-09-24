const tg = window.Telegram?.WebApp;
if (tg) { tg.ready(); tg.expand(); }

const translations = {
  en: {
    subtitle:"English & Vietnamese Translator",
    step1:"STEP 1 OF 3", goalTitle:"Your Translation Goal", goalLead:"What would you like to translate today?",
    goalQuestion:"How would you best describe your goal?", enVi:"English → Vietnamese", enViDesc:"Translate English text naturally into Vietnamese.",
    viEn:"Vietnamese → English", viEnDesc:"Translate Vietnamese text naturally into English.",
    auto:"Automatic detection", autoDesc:"Detect English or Vietnamese automatically.",
    conversation:"Conversation mode", conversationDesc:"Translate messages while keeping the context.",
    simple:"Simple translation", simpleDesc:"Short, clear translations for everyday use.",
    continue:"Continue", step2:"STEP 2 OF 3", settingsTitle:"Translation Settings", settingsLead:"Tell us how you want your translation.",
    styleLabel:"Translation style", natural:"Natural / Conversational", formal:"Formal", literal:"Literal", simpleStyle:"Simple",
    contextLabel:"Translation context", contextPlaceholder:"e.g. chatting with a friend, hotel, pharmacy, work...",
    languageLabel:"Preferred output language", autoOutput:"Auto", english:"English", vietnamese:"Vietnamese",
    step3:"STEP 3 OF 3", contactTitle:"Contact Information", contactLead:"How can we reach you?",
    telegramLinked:"Your Telegram account is automatically linked to this submission.",
    emailLabel:"Contact Email", emailHint:"We will use your email only for translation-related contact.",
    confidential:"Your information is private and is only used to provide this service.",
    startTranslation:"Start Translation", translatorTitle:"Translator", clear:"Clear", translate:"Translate", translation:"Translation", copy:"Copy",
    enter:"Enter text to translate..."
  },
  vi: {
    subtitle:"Trình dịch tiếng Anh & tiếng Việt",
    step1:"BƯỚC 1 TRÊN 3", goalTitle:"Mục đích dịch", goalLead:"Bạn muốn dịch nội dung gì hôm nay?",
    goalQuestion:"Bạn muốn dịch theo nhu cầu nào?", enVi:"Tiếng Anh → Tiếng Việt", enViDesc:"Dịch văn bản tiếng Anh tự nhiên sang tiếng Việt.",
    viEn:"Tiếng Việt → Tiếng Anh", viEnDesc:"Dịch văn bản tiếng Việt tự nhiên sang tiếng Anh.",
    auto:"Tự động nhận diện", autoDesc:"Tự động nhận diện tiếng Anh hoặc tiếng Việt.",
    conversation:"Chế độ hội thoại", conversationDesc:"Dịch tin nhắn và giữ nguyên ngữ cảnh.",
    simple:"Dịch đơn giản", simpleDesc:"Bản dịch ngắn gọn, dễ hiểu cho giao tiếp hằng ngày.",
    continue:"Tiếp tục", step2:"BƯỚC 2 TRÊN 3", settingsTitle:"Cài đặt dịch", settingsLead:"Chọn cách bạn muốn bản dịch được thực hiện.",
    styleLabel:"Phong cách dịch", natural:"Tự nhiên / Hội thoại", formal:"Trang trọng", literal:"Sát nghĩa", simpleStyle:"Đơn giản",
    contextLabel:"Ngữ cảnh", contextPlaceholder:"ví dụ: nói chuyện với bạn, khách sạn, nhà thuốc, công việc...",
    languageLabel:"Ngôn ngữ đầu ra", autoOutput:"Tự động", english:"Tiếng Anh", vietnamese:"Tiếng Việt",
    step3:"BƯỚC 3 TRÊN 3", contactTitle:"Thông tin liên hệ", contactLead:"Bạn muốn chúng tôi liên hệ với bạn bằng cách nào?",
    telegramLinked:"Tài khoản Telegram của bạn được tự động liên kết với biểu mẫu này.",
    emailLabel:"Email liên hệ", emailHint:"Email chỉ được sử dụng cho các vấn đề liên quan đến dịch thuật.",
    confidential:"Thông tin của bạn được bảo mật và chỉ được sử dụng để cung cấp dịch vụ.",
    startTranslation:"Bắt đầu dịch", translatorTitle:"Trình dịch", clear:"Xóa", translate:"Dịch", translation:"Bản dịch", copy:"Sao chép",
    enter:"Nhập nội dung cần dịch..."
  }
};

let uiLang = "en";
let screen = 1;
let goal = null;
let style = "natural";
let direction = "en-vi";

const screens = [...document.querySelectorAll(".screen")];
const progress = document.getElementById("progress");
const backBtn = document.getElementById("backBtn");

function setText() {
  const t = translations[uiLang];
  document.documentElement.lang = uiLang;
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.dataset.i18n;
    if (t[key]) el.textContent = t[key];
  });
  document.querySelectorAll("[data-placeholder]").forEach(el => {
    const key = el.dataset.placeholder;
    if (t[key]) el.placeholder = t[key];
  });
  const source = document.getElementById("sourceText");
  if (source) source.placeholder = t.enter;
  document.querySelectorAll(".completed").forEach((el,i) => el.textContent = `${[33,67,100][Math.min(i,2)]}% completed`);
}

function showScreen(n) {
  screen = n;
  screens.forEach(s => s.classList.toggle("active", Number(s.dataset.screen) === n));
  progress.style.width = `${n === 4 ? 100 : n * 33.333}%`;
  backBtn.classList.toggle("hidden", n === 1 || n === 4);
  window.scrollTo({top:0, behavior:"instant"});
}

document.querySelectorAll(".lang").forEach(btn => {
  btn.addEventListener("click", () => {
    uiLang = btn.dataset.uiLang;
    document.querySelectorAll(".lang").forEach(x => x.classList.toggle("active", x === btn));
    setText();
  });
});

document.querySelectorAll(".option-card").forEach(card => {
  card.addEventListener("click", () => {
    goal = card.dataset.value;
    document.querySelectorAll(".option-card").forEach(x => x.classList.remove("selected"));
    card.classList.add("selected");
  });
});

document.querySelectorAll(".pill-option").forEach(btn => {
  btn.addEventListener("click", () => {
    style = btn.dataset.style;
    document.querySelectorAll(".pill-option").forEach(x => x.classList.remove("selected"));
    btn.classList.add("selected");
  });
});

document.querySelectorAll("[data-next]").forEach(btn => {
  btn.addEventListener("click", () => {
    if (screen === 1 && !goal) {
      document.querySelector(".cards").animate([{transform:"translateX(-5px)"},{transform:"translateX(5px)"},{transform:"translateX(0)"}], {duration:180});
      return;
    }
    showScreen(Math.min(screen + 1, 3));
  });
});

backBtn.addEventListener("click", () => showScreen(Math.max(1, screen - 1)));

document.getElementById("submitBtn").addEventListener("click", () => {
  showScreen(4);
  const payload = {
    telegram: tg?.initDataUnsafe?.user || null,
    goal, style,
    context: document.getElementById("context").value,
    outputLanguage: document.getElementById("outputLanguage").value,
    email: document.getElementById("email").value
  };
  console.log("Mini App submission:", payload);
});

document.getElementById("translatorBack").addEventListener("click", () => showScreen(3));

function setDirection(d) {
  direction = d;
  document.querySelectorAll(".direction-btn").forEach(b => b.classList.toggle("active", b.dataset.direction === d));
}
document.querySelectorAll(".direction-btn").forEach(b => b.addEventListener("click", () => setDirection(b.dataset.direction)));
document.getElementById("swapBtn").addEventListener("click", () => setDirection(direction === "en-vi" ? "vi-en" : "en-vi"));

const sourceText = document.getElementById("sourceText");
const sourceCount = document.getElementById("sourceCount");
sourceText.addEventListener("input", () => sourceCount.textContent = sourceText.value.length);

document.getElementById("clearBtn").addEventListener("click", () => {
  sourceText.value = "";
  sourceCount.textContent = "0";
  document.getElementById("resultText").textContent = "";
});

document.getElementById("copyBtn").addEventListener("click", async () => {
  const text = document.getElementById("resultText").textContent;
  if (!text) return;
  try { await navigator.clipboard.writeText(text); } catch {}
});

document.getElementById("translateBtn").addEventListener("click", async () => {
  const text = sourceText.value.trim();
  const result = document.getElementById("resultText");
  if (!text) return;
  result.textContent = uiLang === "vi"
    ? "Kết nối dịch thuật sẽ được bật ở bước tiếp theo."
    : "Translation API will be connected in the next step.";
});

setText();
