/* ============================================================
   ส่วนที่ 2: ตั้งค่าการเชื่อมต่อ Supabase
   ⚠️ แก้ไข SUPABASE_URL และ SUPABASE_ANON_KEY เป็นของโปรเจกต์คุณ
   หาได้จาก Supabase Dashboard > Project Settings > API
   ============================================================ */
const SUPABASE_URL = "https://pynixspbqytddfzhttse.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_pps6JY5DBhbkFaqOLw86NA_1GDEjWlM";

const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const BUCKET_NAME = "product-images";
const TABLE_NAME = "products";
const CATEGORY_KEYS = ["ram", "ssd", "hdd", "cpu", "motherboard", "gpu", "psu", "case", "monitor", "peripheral", "other"];
const CATEGORY_LABELS = {
  th: { ram: "RAM", ssd: "SSD", hdd: "HDD", cpu: "CPU", motherboard: "เมนบอร์ด", gpu: "การ์ดจอ", psu: "เพาเวอร์ซัพพลาย", case: "เคสคอมพิวเตอร์", monitor: "จอมอนิเตอร์", peripheral: "อุปกรณ์ต่อพ่วง", other: "อื่นๆ" },
  en: { ram: "RAM", ssd: "SSD", hdd: "HDD", cpu: "CPU", motherboard: "Motherboard", gpu: "Graphics Card", psu: "Power Supply", case: "Computer Case", monitor: "Monitor", peripheral: "Peripherals", other: "Other" },
  zh: { ram: "RAM", ssd: "SSD", hdd: "HDD", cpu: "CPU", motherboard: "主板", gpu: "显卡", psu: "电源", case: "机箱", monitor: "显示器", peripheral: "外围设备", other: "其他" },
};
// รองรับสินค้าเดิมที่เคยบันทึกหมวดหมู่เป็นข้อความภาษาไทยไว้ก่อนเปลี่ยนมาใช้ key
const LEGACY_CATEGORY_MAP = {
  "RAM": "ram", "SSD": "ssd", "HDD": "hdd", "CPU": "cpu",
  "เมนบอร์ด": "motherboard", "การ์ดจอ": "gpu", "เพาเวอร์ซัพพลาย": "psu",
  "เคสคอมพิวเตอร์": "case", "จอมอนิเตอร์": "monitor", "อุปกรณ์ต่อพ่วง": "peripheral", "อื่นๆ": "other",
};
function normalizeCategoryKey(cat) {
  if (!cat) return "";
  if (CATEGORY_KEYS.includes(cat)) return cat;
  if (LEGACY_CATEGORY_MAP[cat]) return LEGACY_CATEGORY_MAP[cat];
  return cat;
}
function getCategoryLabel(cat, lang) {
  const key = normalizeCategoryKey(cat);
  const labels = CATEGORY_LABELS[lang] || CATEGORY_LABELS.th;
  return labels[key] || cat || "";
}
const LOW_STOCK_THRESHOLD = 3;

let allProducts = [];

const translations = {
  th: {
    pageTitle: "CompStock Manager - ระบบจัดการสินค้าอุปกรณ์คอมพิวเตอร์",
    addProductButton: "เพิ่มสินค้าใหม่",
    sectionTitle: "รายการสินค้าอุปกรณ์คอมพิวเตอร์",
    searchPlaceholder: "ค้นหาสินค้า... เช่น RAM, SSD, CPU",
    loadingText: "กำลังโหลดข้อมูลสินค้า...",
    emptyTitle: "ยังไม่มีสินค้าในระบบ",
    emptyHelp: "กดปุ่ม \"เพิ่มสินค้าใหม่\" เพื่อเริ่มบันทึกข้อมูล",
    modalTitle: "เพิ่มสินค้าใหม่",
    labelProductName: "ชื่อสินค้า",
    labelProductDesc: "รายละเอียดสินค้า",
    labelProductPrice: "ราคา (กีบ)",
    labelProductImage: "รูปภาพสินค้า",
    imageHelperText: "เพิ่มได้หลายรูป เลือกไฟล์หรือถ่ายจากกล้องมือถือได้",
    placeholderProductName: "เช่น RAM DDR4 16GB",
    placeholderProductDesc: "รายละเอียด สเปค หรือหมายเหตุเพิ่มเติม",
    cancelButton: "ยกเลิก",
    saveButton: "บันทึกสินค้า",
    editModalTitle: "แก้ไขสินค้า",
    countLabel: (count) => `${count} รายการ`,
    noDescription: "ไม่มีรายละเอียด",
    loadError: "ไม่สามารถโหลดข้อมูลสินค้าได้: ",
    requireFields: "กรุณากรอกชื่อสินค้าและราคาให้ครบถ้วน",
    saved: "บันทึกสินค้าเรียบร้อยแล้ว",
    saveError: "เกิดข้อผิดพลาดในการบันทึก: ",
    confirmDelete: "ยืนยันการลบสินค้านี้หรือไม่?",
    deleted: "ลบสินค้าเรียบร้อยแล้ว",
    deleteError: "เกิดข้อผิดพลาดในการลบสินค้า: ",
    updateNoRows: "ไม่พบสินค้าที่จะอัปเดต หรือคุณไม่มีสิทธิ์แก้ไข",
    labelProductCategory: "หมวดหมู่",
    labelProductQty: "จำนวนคงเหลือ",
    qtyLabel: "คงเหลือ",
    outOfStock: "สินค้าหมด",
    statTypesLabel: "ชนิดสินค้า",
    statQuantityLabel: "จำนวนรวม (ชิ้น)",
    statValueLabel: "มูลค่าสต๊อกรวม",
    statLowLabel: "สินค้าใกล้หมด",
    allCategories: "ทุกหมวดหมู่",
    stockButton: "สต๊อกสินค้า",
    stockModalTitle: "สรุปข้อมูลสต๊อกสินค้า",
    viewEditButton: "แก้ไข",
    viewDeleteButton: "ลบ",
    sortNewest: "ใหม่ล่าสุด",
    sortOldest: "เก่าสุด",
    sortPriceAsc: "ราคา: น้อย → มาก",
    sortPriceDesc: "ราคา: มาก → น้อย",
    sortNameAsc: "ชื่อ: ก → ฮ",
    deleteButton: "ลบ",
  },
  en: {
    pageTitle: "CompStock Manager - Product Inventory",
    addProductButton: "Add Product",
    sectionTitle: "Computer Parts Inventory",
    searchPlaceholder: "Search products... e.g. RAM, SSD, CPU",
    loadingText: "Loading products...",
    emptyTitle: "No products yet",
    emptyHelp: "Click \"Add Product\" to start adding items",
    modalTitle: "Add New Product",
    labelProductName: "Product Name",
    labelProductDesc: "Product Description",
    labelProductPrice: "Price (KIP)",
    labelProductImage: "Product Image",
    imageHelperText: "Add multiple photos. Use your camera or choose files.",
    placeholderProductName: "e.g. RAM DDR4 16GB",
    placeholderProductDesc: "Specifications, notes or additional details",
    cancelButton: "Cancel",
    saveButton: "Save Product",
    editModalTitle: "Edit Product",
    countLabel: (count) => `${count} items`,
    noDescription: "No description",
    loadError: "Unable to load products: ",
    requireFields: "Please enter product name and price",
    saved: "Product saved successfully",
    saveError: "Error saving product: ",
    updateNoRows: "No product was updated or you don't have permission to edit it",
    confirmDelete: "Delete this product?",
    deleted: "Product deleted",
    deleteError: "Error deleting product: ",
    labelProductCategory: "Category",
    labelProductQty: "Quantity in stock",
    qtyLabel: "In stock:",
    outOfStock: "Out of stock",
    statTypesLabel: "Product types",
    statQuantityLabel: "Total quantity",
    statValueLabel: "Total stock value",
    statLowLabel: "Low stock",
    allCategories: "All categories",
    stockButton: "Stock Summary",
    stockModalTitle: "Stock Summary",
    viewEditButton: "Edit",
    viewDeleteButton: "Delete",
    sortNewest: "Newest first",
    sortOldest: "Oldest first",
    sortPriceAsc: "Price: Low to High",
    sortPriceDesc: "Price: High to Low",
    sortNameAsc: "Name: A to Z",
    deleteButton: "Delete",
  },
  zh: {
    pageTitle: "CompStock Manager - 产品库存",
    addProductButton: "添加产品",
    sectionTitle: "电脑配件库存",
    searchPlaceholder: "搜索产品... 如 RAM、SSD、CPU",
    loadingText: "正在加载商品...",
    emptyTitle: "暂无商品",
    emptyHelp: "点击\"添加产品\"开始添加商品",
    modalTitle: "添加新商品",
    labelProductName: "商品名称",
    labelProductDesc: "商品描述",
    labelProductPrice: "价格 (基普)",
    labelProductImage: "产品图片",
    imageHelperText: "可添加多张图片，使用手机摄像头或选择本地图片。",
    placeholderProductName: "例如 RAM DDR4 16GB",
    placeholderProductDesc: "规格、备注或其他说明",
    cancelButton: "取消",
    saveButton: "保存商品",
    editModalTitle: "编辑商品",
    countLabel: (count) => `${count} 件`,
    noDescription: "暂无描述",
    loadError: "无法加载商品: ",
    requireFields: "请填写商品名称和价格",
    saved: "商品保存成功",
    saveError: "保存商品时出错: ",
    updateNoRows: "未更新任何商品，或您没有编辑权限",
    confirmDelete: "确认删除此商品？",
    deleted: "商品已删除",
    deleteError: "删除商品时出错: ",
    labelProductCategory: "分类",
    labelProductQty: "库存数量",
    qtyLabel: "库存:",
    outOfStock: "缺货",
    statTypesLabel: "商品种类",
    statQuantityLabel: "总数量",
    statValueLabel: "库存总价值",
    statLowLabel: "库存不足",
    allCategories: "所有分类",
    stockButton: "库存汇总",
    stockModalTitle: "库存汇总",
    viewEditButton: "编辑",
    viewDeleteButton: "删除",
    sortNewest: "最新",
    sortOldest: "最早",
    sortPriceAsc: "价格：低到高",
    sortPriceDesc: "价格：高到低",
    sortNameAsc: "名称：A到Z",
    deleteButton: "删除",
  },
};

// ------------------- DOM Elements -------------------
const productGrid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const productCount = document.getElementById("productCount");
const languageSelect = document.getElementById("languageSelect");
const addProductButton = document.getElementById("addProductButton");
const stockButtonLabel = document.getElementById("stockButtonLabel");
const stockModalTitle = document.getElementById("stockModalTitle");
const loadingText = document.getElementById("loadingText");
const emptyTitle = document.getElementById("emptyTitle");
const emptyHelp = document.getElementById("emptyHelp");
const modalTitle = document.getElementById("modalTitle");
const labelProductName = document.getElementById("labelProductName");
const labelProductDesc = document.getElementById("labelProductDesc");
const labelProductPrice = document.getElementById("labelProductPrice");
const labelProductImage = document.getElementById("labelProductImage");
const imageHelperText = document.getElementById("imageHelperText");
const sectionTitle = document.getElementById("sectionTitle");
const loadingState = document.getElementById("loadingState");
const emptyState = document.getElementById("emptyState");
const addProductForm = document.getElementById("addProductForm");
const productImageInput = document.getElementById("productImage");
const imagePreviewWrap = document.getElementById("imagePreviewWrap");
const saveBtn = document.getElementById("saveBtn");
const saveBtnText = document.getElementById("saveBtnText");
const saveBtnSpinner = document.getElementById("saveBtnSpinner");
const addProductModalEl = document.getElementById("addProductModal");
const addProductModal = new bootstrap.Modal(addProductModalEl);
const viewProductModalEl = document.getElementById("viewProductModal");
const viewProductModal = new bootstrap.Modal(viewProductModalEl);
const viewProductTitle = document.getElementById("viewProductTitle");
const viewCarouselInner = document.getElementById("viewCarouselInner");
const viewProductDesc = document.getElementById("viewProductDesc");
const viewProductPrice = document.getElementById("viewProductPrice");
const viewProductDate = document.getElementById("viewProductDate");
const viewEditBtn = document.getElementById("viewEditBtn");
const viewEditBtnText = document.getElementById("viewEditBtnText");
const viewDeleteBtn = document.getElementById("viewDeleteBtn");
const viewDeleteBtnText = document.getElementById("viewDeleteBtnText");
let currentViewProduct = null;

const categoryFilterEl = document.getElementById("categoryFilter");
const sortSelectEl = document.getElementById("sortSelect");
const productCategorySelect = document.getElementById("productCategory");
const productQtyInput = document.getElementById("productQty");
const qtyMinusBtn = document.getElementById("qtyMinusBtn");
const qtyPlusBtn = document.getElementById("qtyPlusBtn");
const labelProductCategory = document.getElementById("labelProductCategory");
const labelProductQty = document.getElementById("labelProductQty");

const statTypes = document.getElementById("statTypes");
const statQuantity = document.getElementById("statQuantity");
const statValue = document.getElementById("statValue");
const statLow = document.getElementById("statLow");

const confirmDeleteModalEl = document.getElementById("confirmDeleteModal");
const confirmDeleteModal = new bootstrap.Modal(confirmDeleteModalEl);
const confirmDeleteOkBtn = document.getElementById("confirmDeleteOkBtn");
let pendingDeleteProduct = null;

let currentLang = localStorage.getItem("appLanguage") || "th";
let currentEditId = null;
let existingImages = [];   // รูปเดิมที่ยังเก็บไว้ (ตอนแก้ไข)
let pendingFiles = [];     // ไฟล์ใหม่ที่เพิ่งเลือก ยังไม่อัปโหลด
let currentCategoryFilter = "";
let currentSort = "newest";

// ------------------- ตั้งค่าตัวเลือกหมวดหมู่ -------------------
function populateCategoryOptions() {
  const labels = CATEGORY_LABELS[currentLang] || CATEGORY_LABELS.th;
  const prevProductCat = productCategorySelect.value;
  const prevFilterCat = categoryFilterEl.value;

  productCategorySelect.innerHTML = CATEGORY_KEYS.map((k) => `<option value="${k}">${labels[k]}</option>`).join("");
  categoryFilterEl.innerHTML = `<option value="">${translations[currentLang].allCategories}</option>` +
    CATEGORY_KEYS.map((k) => `<option value="${k}">${labels[k]}</option>`).join("");

  if (CATEGORY_KEYS.includes(prevProductCat)) productCategorySelect.value = prevProductCat;
  if (CATEGORY_KEYS.includes(prevFilterCat)) categoryFilterEl.value = prevFilterCat;
}
populateCategoryOptions();

categoryFilterEl.addEventListener("change", (e) => {
  currentCategoryFilter = e.target.value;
  applyProductFilter();
});

sortSelectEl.addEventListener("change", (e) => {
  currentSort = e.target.value;
  applyProductFilter();
});

qtyMinusBtn.addEventListener("click", () => {
  const val = Math.max(0, (parseInt(productQtyInput.value, 10) || 0) - 1);
  productQtyInput.value = val;
});
qtyPlusBtn.addEventListener("click", () => {
  const val = (parseInt(productQtyInput.value, 10) || 0) + 1;
  productQtyInput.value = val;
});

function setProductCount(count) {
  productCount.textContent = translations[currentLang].countLabel(count);
}

function setLanguage(lang) {
  if (!translations[lang]) lang = "th";
  currentLang = lang;
  document.documentElement.lang = lang;
  document.title = translations[lang].pageTitle;
  addProductButton.innerHTML = `<i class="bi bi-plus-lg"></i> ${translations[lang].addProductButton}`;
  sectionTitle.innerHTML = `<i class="bi bi-box-seam"></i> ${translations[lang].sectionTitle}`;
  searchInput.placeholder = translations[lang].searchPlaceholder;
  loadingText.textContent = translations[lang].loadingText;
  emptyTitle.textContent = translations[lang].emptyTitle;
  emptyHelp.textContent = translations[lang].emptyHelp;
  modalTitle.innerHTML = currentEditId
    ? `<i class="bi bi-pencil-square"></i> ${translations[lang].editModalTitle}`
    : `<i class="bi bi-plus-circle"></i> ${translations[lang].modalTitle}`;
  labelProductName.innerHTML = `${translations[lang].labelProductName} <span class="text-danger">*</span>`;
  labelProductDesc.textContent = translations[lang].labelProductDesc;
  labelProductPrice.innerHTML = `${translations[lang].labelProductPrice} <span class="text-danger">*</span>`;
  labelProductImage.textContent = translations[lang].labelProductImage;
  imageHelperText.textContent = translations[lang].imageHelperText;
  labelProductCategory.textContent = translations[lang].labelProductCategory;
  labelProductQty.textContent = translations[lang].labelProductQty;
  populateCategoryOptions();
  const sortNewestOpt = document.querySelector('#sortSelect option[value="newest"]');
  const sortOldestOpt = document.querySelector('#sortSelect option[value="oldest"]');
  const sortPriceAscOpt = document.querySelector('#sortSelect option[value="price_asc"]');
  const sortPriceDescOpt = document.querySelector('#sortSelect option[value="price_desc"]');
  const sortNameAscOpt = document.querySelector('#sortSelect option[value="name_asc"]');
  if (sortNewestOpt) sortNewestOpt.textContent = translations[lang].sortNewest;
  if (sortOldestOpt) sortOldestOpt.textContent = translations[lang].sortOldest;
  if (sortPriceAscOpt) sortPriceAscOpt.textContent = translations[lang].sortPriceAsc;
  if (sortPriceDescOpt) sortPriceDescOpt.textContent = translations[lang].sortPriceDesc;
  if (sortNameAscOpt) sortNameAscOpt.textContent = translations[lang].sortNameAsc;
  document.getElementById("statTypesLabel").textContent = translations[lang].statTypesLabel;
  document.getElementById("statQuantityLabel").textContent = translations[lang].statQuantityLabel;
  document.getElementById("statValueLabel").textContent = translations[lang].statValueLabel;
  document.getElementById("statLowLabel").textContent = translations[lang].statLowLabel;
  stockButtonLabel.textContent = translations[lang].stockButton;
  stockModalTitle.innerHTML = `<i class="bi bi-clipboard-data"></i> ${translations[lang].stockModalTitle}`;
  viewEditBtnText.textContent = translations[lang].viewEditButton;
  viewDeleteBtnText.textContent = translations[lang].viewDeleteButton;
  document.getElementById("cancelBtn").textContent = translations[lang].cancelButton;
  document.getElementById("confirmDeleteCancelBtn").textContent = translations[lang].cancelButton;
  document.getElementById("confirmDeleteOkBtn").textContent = translations[lang].deleteButton;
  document.getElementById("productName").placeholder = translations[lang].placeholderProductName;
  document.getElementById("productDesc").placeholder = translations[lang].placeholderProductDesc;
  saveBtnText.innerHTML = `<i class="bi bi-save"></i> ${translations[lang].saveButton}`;
  languageSelect.value = lang;
  localStorage.setItem("appLanguage", lang);
  applyProductFilter();
}

languageSelect?.addEventListener("change", (e) => setLanguage(e.target.value));

setLanguage(currentLang);

// ------------------- Utility: Toast -------------------
function showToast(message, type = "success") {
  const toastEl = document.getElementById("appToast");
  const toastBody = document.getElementById("appToastBody");
  toastEl.classList.remove("bg-success", "bg-danger");
  toastEl.classList.add(type === "success" ? "bg-success" : "bg-danger");
  toastBody.textContent = message;
  const toast = new bootstrap.Toast(toastEl, { delay: 3000 });
  toast.show();
}

// ------------------- Utility: Format Price -------------------
function formatPrice(price) {
  return "₭" + Number(price).toLocaleString("lo-LA", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}

// ------------------- Utility: Format Date -------------------
function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("th-TH", { year: "numeric", month: "short", day: "numeric" }) +
    " " + d.toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" });
}

// ------------------- บีบอัดรูปก่อนอัปโหลด (ลดขนาดไฟล์) -------------------
function compressImage(file, maxDim = 1600, quality = 0.82) {
  return new Promise((resolve) => {
    if (!file.type.startsWith("image/") || file.type === "image/gif") {
      resolve(file);
      return;
    }
    const img = new Image();
    const reader = new FileReader();
    reader.onload = (e) => {
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (!blob) { resolve(file); return; }
            const compressedFile = new File([blob], file.name, { type: "image/jpeg" });
            resolve(compressedFile);
          },
          "image/jpeg",
          quality
        );
      };
      img.onerror = () => resolve(file);
      img.src = e.target.result;
    };
    reader.onerror = () => resolve(file);
    reader.readAsDataURL(file);
  });
}

// ------------------- ฟังก์ชันอัปโหลดรูปไป Supabase Storage (หลายไฟล์) -------------------
async function uploadProductImage(file) {
  if (!file) return null;

  const compressed = await compressImage(file);
  const fileExt = compressed.type === "image/jpeg" ? "jpg" : (file.name.split(".").pop() || "jpg");
  const fileName = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${fileExt}`;

  const { error } = await supabaseClient.storage
    .from(BUCKET_NAME)
    .upload(fileName, compressed, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    console.error("Upload error:", error);
    throw error;
  }

  const { data: publicUrlData } = supabaseClient.storage
    .from(BUCKET_NAME)
    .getPublicUrl(fileName);

  return publicUrlData.publicUrl;
}

async function uploadMultipleImages(files) {
  const urls = [];
  for (const file of files) {
    const url = await uploadProductImage(file);
    if (url) urls.push(url);
  }
  return urls;
}

// ------------------- Image Preview (หลายรูป) -------------------
function renderImagePreviews() {
  imagePreviewWrap.innerHTML = "";

  existingImages.forEach((url, idx) => {
    const thumb = document.createElement("div");
    thumb.className = "preview-thumb";
    thumb.innerHTML = `
      <img src="${url}" alt="preview">
      <button type="button" class="remove-thumb-btn" data-type="existing" data-index="${idx}">
        <i class="bi bi-x"></i>
      </button>
    `;
    imagePreviewWrap.appendChild(thumb);
  });

  pendingFiles.forEach((file, idx) => {
    const thumb = document.createElement("div");
    thumb.className = "preview-thumb";
    const img = document.createElement("img");
    const reader = new FileReader();
    reader.onload = (e) => { img.src = e.target.result; };
    reader.readAsDataURL(file);
    thumb.appendChild(img);
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "remove-thumb-btn";
    btn.dataset.type = "pending";
    btn.dataset.index = idx;
    btn.innerHTML = `<i class="bi bi-x"></i>`;
    thumb.appendChild(btn);
    imagePreviewWrap.appendChild(thumb);
  });

  imagePreviewWrap.querySelectorAll(".remove-thumb-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const idx = Number(btn.dataset.index);
      if (btn.dataset.type === "existing") {
        existingImages.splice(idx, 1);
      } else {
        pendingFiles.splice(idx, 1);
      }
      renderImagePreviews();
    });
  });
}

productImageInput.addEventListener("change", () => {
  const files = Array.from(productImageInput.files || []);
  pendingFiles = pendingFiles.concat(files);
  productImageInput.value = "";
  renderImagePreviews();
});

// ------------------- ฟังก์ชันลบรูปจาก Supabase Storage -------------------
async function deleteProductImage(imageUrl) {
  if (!imageUrl) return;
  try {
    const parts = imageUrl.split(`${BUCKET_NAME}/`);
    if (parts.length < 2) return;
    const filePath = parts[1];
    await supabaseClient.storage.from(BUCKET_NAME).remove([filePath]);
  } catch (err) {
    console.error("Delete image error:", err);
  }
}

async function deleteProductImages(imageUrls) {
  if (!imageUrls || imageUrls.length === 0) return;
  for (const url of imageUrls) {
    await deleteProductImage(url);
  }
}

/* ============================================================
   ส่วนที่ 3: ระบบ CRUD (Fetch / Insert / Delete)
   ============================================================ */

// ------------------- Fetch รายการสินค้าทั้งหมด -------------------
async function fetchProducts() {
  loadingState.classList.remove("d-none");
  emptyState.classList.add("d-none");
  productGrid.innerHTML = "";

  const { data, error } = await supabaseClient
    .from(TABLE_NAME)
    .select("*")
    .order("created_at", { ascending: false });

  loadingState.classList.add("d-none");

  if (error) {
    console.error("Fetch error:", error);
    showToast(translations[currentLang].loadError + error.message, "danger");
    return;
  }

  if (!data || data.length === 0) {
    allProducts = [];
    emptyState.classList.remove("d-none");
    setProductCount(0);
    updateDashboardStats();
    return;
  }

  allProducts = data;
  applyProductFilter();
}

function applyProductFilter() {
  const query = searchInput?.value.trim().toLowerCase() || "";

  let filtered = query
    ? allProducts.filter((item) => {
        const text = `${item.name || ""} ${item.description || ""}`.toLowerCase();
        return text.includes(query);
      })
    : [...allProducts];

  if (currentCategoryFilter) {
    filtered = filtered.filter((item) => normalizeCategoryKey(item.category || "") === currentCategoryFilter);
  }

  filtered.sort((a, b) => {
    switch (currentSort) {
      case "oldest":
        return new Date(a.created_at) - new Date(b.created_at);
      case "price_asc":
        return (a.price || 0) - (b.price || 0);
      case "price_desc":
        return (b.price || 0) - (a.price || 0);
      case "name_asc":
        return (a.name || "").localeCompare(b.name || "", "th");
      case "newest":
      default:
        return new Date(b.created_at) - new Date(a.created_at);
    }
  });

  setProductCount(filtered.length);
  renderProducts(filtered);
  updateDashboardStats();
}

function updateDashboardStats() {
  const totalTypes = allProducts.length;
  const totalQty = allProducts.reduce((sum, p) => sum + (Number(p.quantity) || 0), 0);
  const totalValue = allProducts.reduce((sum, p) => sum + (Number(p.price) || 0) * (Number(p.quantity) || 0), 0);
  const lowStockCount = allProducts.filter((p) => (Number(p.quantity) || 0) <= LOW_STOCK_THRESHOLD).length;

  statTypes.textContent = totalTypes;
  statQuantity.textContent = totalQty.toLocaleString("lo-LA");
  statValue.textContent = formatPrice(totalValue);
  statLow.textContent = lowStockCount;
}

searchInput?.addEventListener("input", applyProductFilter);

// ------------------- Render สินค้าเป็น Card -------------------
async function renderProducts(products) {
  productGrid.innerHTML = "";

  products.forEach((p, index) => {
    const col = document.createElement("div");
    col.className = "col-6 col-sm-6 col-md-4 col-xl-3 product-card-col";
    col.style.animationDelay = `${Math.min(index, 12) * 0.04}s`;

    const thumbUrl = (Array.isArray(p.images) && p.images.length > 0) ? p.images[0] : p.image_url;
    const imageHtml = thumbUrl
      ? `<img src="${thumbUrl}" alt="${escapeHtml(p.name)}">`
      : `<i class="bi bi-image"></i>`;
    const imageCountBadge = (Array.isArray(p.images) && p.images.length > 1)
      ? `<span class="position-absolute top-0 end-0 m-2 badge bg-dark bg-opacity-75"><i class="bi bi-images"></i> ${p.images.length}</span>`
      : "";

    const qty = Number(p.quantity) || 0;
    const qtyClass = qty <= 0 ? "qty-out" : (qty <= LOW_STOCK_THRESHOLD ? "qty-low" : "qty-ok");
    const qtyText = qty <= 0 ? translations[currentLang].outOfStock : `${translations[currentLang].qtyLabel} ${qty}`;
    const categoryBadge = p.category ? `<span class="category-badge">${escapeHtml(getCategoryLabel(p.category, currentLang))}</span>` : "";

    col.innerHTML = `
      <div class="card product-card h-100" data-id="${p.id}">
        <div class="product-img-wrap position-relative">${imageHtml}${imageCountBadge}</div>
        <div class="card-body d-flex flex-column">
          <div class="d-flex justify-content-between align-items-start gap-2 mb-1">
            ${categoryBadge}
            <span class="qty-badge ${qtyClass}">${qtyText}</span>
          </div>
          <h6 class="card-title-custom mb-1">${escapeHtml(p.name)}</h6>
          <p class="card-desc mb-2">${escapeHtml(p.description || translations[currentLang].noDescription)}</p>
          <div class="d-flex justify-content-between align-items-center mt-auto">
            <span class="price-badge">${formatPrice(p.price)}</span>
          </div>
          <div class="card-date mt-2"><i class="bi bi-clock-history"></i> ${formatDate(p.created_at)}</div>
        </div>
      </div>
    `;
    productGrid.appendChild(col);
  });

  document.querySelectorAll(".product-card").forEach((card) => {
    card.addEventListener("click", () => {
      const product = allProducts.find((item) => item.id.toString() === card.dataset.id.toString());
      if (product) openViewModal(product);
    });
  });
}

function openViewModal(product) {
  currentViewProduct = product;
  const images = (Array.isArray(product.images) && product.images.length > 0)
    ? product.images
    : (product.image_url ? [product.image_url] : []);

  const qty = Number(product.quantity) || 0;
  const qtyClass = qty <= 0 ? "qty-out" : (qty <= LOW_STOCK_THRESHOLD ? "qty-low" : "qty-ok");
  const qtyText = qty <= 0 ? translations[currentLang].outOfStock : `${translations[currentLang].qtyLabel} ${qty}`;
  const categoryBadge = product.category ? `<span class="category-badge me-2">${escapeHtml(getCategoryLabel(product.category, currentLang))}</span>` : "";

  viewProductTitle.innerHTML = `${escapeHtml(product.name || "")}`;
  viewProductDesc.innerHTML = `${categoryBadge}<span class="qty-badge ${qtyClass}">${qtyText}</span>
    <div class="mt-2">${escapeHtml(product.description || translations[currentLang].noDescription)}</div>`;
  viewProductPrice.textContent = formatPrice(product.price);
  viewProductDate.innerHTML = `<i class="bi bi-clock-history"></i> ${formatDate(product.created_at)}`;

  viewCarouselInner.innerHTML = "";
  if (images.length === 0) {
    viewCarouselInner.innerHTML = `
      <div class="carousel-item active">
        <div class="carousel-img-wrap"><i class="bi bi-image"></i></div>
      </div>
    `;
  } else {
    images.forEach((url, idx) => {
      const item = document.createElement("div");
      item.className = `carousel-item${idx === 0 ? " active" : ""}`;
      item.innerHTML = `<div class="carousel-img-wrap"><img src="${url}" alt="${escapeHtml(product.name)}"></div>`;
      viewCarouselInner.appendChild(item);
    });
  }

  viewProductModal.show();
}

viewEditBtn.addEventListener("click", () => {
  if (!currentViewProduct) return;
  viewProductModal.hide();
  openEditModal(currentViewProduct);
});

viewDeleteBtn.addEventListener("click", () => {
  if (!currentViewProduct) return;
  viewProductModal.hide();
  requestDelete(currentViewProduct);
});

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function openEditModal(product) {
  currentEditId = String(product.id);
  existingImages = (Array.isArray(product.images) && product.images.length > 0)
    ? [...product.images]
    : (product.image_url ? [product.image_url] : []);
  pendingFiles = [];

  document.getElementById("productName").value = product.name || "";
  document.getElementById("productDesc").value = product.description || "";
  document.getElementById("productPrice").value = product.price ?? "";
  productCategorySelect.value = normalizeCategoryKey(product.category) || CATEGORY_KEYS[CATEGORY_KEYS.length - 1];
  productQtyInput.value = product.quantity ?? 1;
  renderImagePreviews();

  modalTitle.textContent = translations[currentLang].editModalTitle;
  saveBtnText.innerHTML = `<i class="bi bi-save"></i> ${translations[currentLang].saveButton}`;
  addProductModal.show();
}

addProductButton.addEventListener("click", () => {
  currentEditId = null;
  existingImages = [];
  pendingFiles = [];
  renderImagePreviews();
  productCategorySelect.value = CATEGORY_KEYS[0];
  productQtyInput.value = 1;
  modalTitle.textContent = translations[currentLang].modalTitle;
  saveBtnText.innerHTML = `<i class="bi bi-save"></i> ${translations[currentLang].saveButton}`;
});

// ------------------- Insert / Edit สินค้า -------------------
addProductForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("productName").value.trim();
  const description = document.getElementById("productDesc").value.trim();
  const price = document.getElementById("productPrice").value;

  if (!name || !price) {
    showToast(translations[currentLang].requireFields, "danger");
    return;
  }

  setSaving(true);

  try {
    const uploadedUrls = await uploadMultipleImages(pendingFiles);
    const finalImages = existingImages.concat(uploadedUrls);

    const payload = {
      name,
      description,
      price: parseFloat(price),
      images: finalImages,
      image_url: finalImages[0] || null,
      category: productCategorySelect.value || null,
      quantity: parseInt(productQtyInput.value, 10) || 0,
    };

    let data;
    let error;

    if (currentEditId) {
      const matchValue = /^\d+$/.test(currentEditId) ? Number(currentEditId) : currentEditId;
      console.log("Update id:", matchValue, "payload:", payload);

      const rowCheck = await supabaseClient
        .from(TABLE_NAME)
        .select("id")
        .eq("id", matchValue)
        .single();

      console.log("Existing row check:", rowCheck);
      if (rowCheck.error && rowCheck.status !== 406) {
        throw rowCheck.error;
      }
      if (!rowCheck.data) {
        throw new Error(translations[currentLang].updateNoRows);
      }

      const result = await supabaseClient
        .from(TABLE_NAME)
        .update(payload)
        .eq("id", matchValue)
        .select();

      data = result.data;
      error = result.error;
      console.log("Update result:", result);

      if (error) throw error;
      if (!data || data.length === 0) {
        throw new Error(translations[currentLang].updateNoRows);
      }
      data = data[0];
    } else {
      const result = await supabaseClient
        .from(TABLE_NAME)
        .insert([payload])
        .select()
        .single();

      data = result.data;
      error = result.error;
      if (error) throw error;
      if (!data) throw new Error("Supabase operation returned no data");
    }

    console.log("Save success:", data);
    showToast(translations[currentLang].saved);
    currentEditId = null;
    existingImages = [];
    pendingFiles = [];
    addProductForm.reset();
    productCategorySelect.value = CATEGORY_KEYS[0];
    productQtyInput.value = 1;
    renderImagePreviews();
    addProductModal.hide();
    await fetchProducts();
  } catch (err) {
    console.error("Insert error:", err);
    showToast(translations[currentLang].saveError + (err?.message || err), "danger");
  } finally {
    setSaving(false);
  }
});

function setSaving(isSaving) {
  saveBtn.disabled = isSaving;
  saveBtnText.classList.toggle("d-none", isSaving);
  saveBtnSpinner.classList.toggle("d-none", !isSaving);
}

// ------------------- Delete สินค้า -------------------
function requestDelete(product) {
  pendingDeleteProduct = product;
  document.getElementById("confirmDeleteText").textContent = translations[currentLang].confirmDelete;
  document.getElementById("confirmDeleteCancelBtn").textContent = translations[currentLang].cancelButton;
  confirmDeleteModal.show();
}

confirmDeleteOkBtn.addEventListener("click", async () => {
  const product = pendingDeleteProduct;
  pendingDeleteProduct = null;
  confirmDeleteModal.hide();
  if (product) await handleDelete(product);
});

async function handleDelete(product) {
  try {
    const images = (Array.isArray(product.images) && product.images.length > 0)
      ? product.images
      : (product.image_url ? [product.image_url] : []);
    await deleteProductImages(images);

    const { error } = await supabaseClient.from(TABLE_NAME).delete().eq("id", product.id);
    if (error) throw error;

    showToast(translations[currentLang].deleted);
    await fetchProducts();
  } catch (err) {
    console.error("Delete error:", err);
    showToast(translations[currentLang].deleteError + err.message, "danger");
  }
}

// รีเซ็ตฟอร์มเมื่อปิด Modal
addProductModalEl.addEventListener("hidden.bs.modal", () => {
  currentEditId = null;
  existingImages = [];
  pendingFiles = [];
  renderImagePreviews();
});

// ------------------- Init -------------------
fetchProducts();
