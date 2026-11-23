// ==============================================================
// KIRA PET LOVE - AUTENTICACIÓN SEGURA POR ROLES Y TIENDA REALTIME
// ==============================================================

// Colecciones en Firebase
const PROD_COLLECTION = "kira_productos";
const ORDERS_COLLECTION = "kira_pedidos";
const USERS_COLLECTION = "kira_usuarios";

// Estado de la Aplicación
let storeProducts = [];
let allUsers = [];
let currentUser = JSON.parse(localStorage.getItem("kira_user")) || null;
// El carrito pertenece exclusivamente al usuario activo. Si no ha iniciado sesión, está vacío (0).
localStorage.removeItem("kira_cart"); // Limpieza de carritos anónimos previos
let cart = currentUser ? (JSON.parse(localStorage.getItem(`kira_cart_${currentUser.email}`)) || []) : [];
let currentCategory = "todos";

// Elementos del DOM - Tienda
const productsGrid = document.getElementById("productsGrid");
const productsCount = document.getElementById("productsCount");
const currentCategoryTitle = document.getElementById("currentCategoryTitle");
const storeSearchInput = document.getElementById("storeSearchInput");
const storeSearchBtn = document.getElementById("storeSearchBtn");
const catPills = document.querySelectorAll("#buyerCategoryBar .cat-pill");
const connectionStatus = document.getElementById("connectionStatus");
const statusText = document.getElementById("statusText");
const toast = document.getElementById("toast");

// Elementos de Vista Alternable de Mis Productos en Admin
const adminViewCardsBtn = document.getElementById("adminViewCardsBtn");
const adminViewTableBtn = document.getElementById("adminViewTableBtn");
const adminProductsCardsContainer = document.getElementById("adminProductsCardsContainer");
const adminProductsTableContainer = document.getElementById("adminProductsTableContainer");

// Carrito
const cartCount = document.getElementById("cartCount");
const openCartBtn = document.getElementById("openCartBtn");
const closeCartBtn = document.getElementById("closeCartBtn");
const cartModal = document.getElementById("cartModal");
const cartItemsList = document.getElementById("cartItemsList");
const cartTotalPrice = document.getElementById("cartTotalPrice");
const checkoutBtn = document.getElementById("checkoutBtn");

// Carrito Flotante Lateral y Opciones de Envío
const floatingLeftCartBtn = document.getElementById("floatingLeftCartBtn");
const floatingCartCount = document.getElementById("floatingCartCount");
const floatingCartTotal = document.getElementById("floatingCartTotal");
const shippingOptDelivery = document.getElementById("shippingOptDelivery");
const shippingOptPickup = document.getElementById("shippingOptPickup");
const cartShippingCostInput = document.getElementById("cartShippingCostInput");
const cartDeliveryCostRow = document.getElementById("cartDeliveryCostRow");
const cartSubtotalVal = document.getElementById("cartSubtotalVal");
const cartShippingDisplayVal = document.getElementById("cartShippingDisplayVal");

// Autenticación Unificada
const userLoggedOut = document.getElementById("userLoggedOut");
const userLoggedIn = document.getElementById("userLoggedIn");
const userNameNav = document.getElementById("userNameNav");
const userRoleBadge = document.getElementById("userRoleBadge");
const openRolePanelBtn = document.getElementById("openRolePanelBtn");
const openMyOrdersBtn = document.getElementById("openMyOrdersBtn");
const openProfileBtn = document.getElementById("openProfileBtn");
const openRegisterBtn = document.getElementById("openRegisterBtn");
const openLoginBtn = document.getElementById("openLoginBtn");
const logoutBtn = document.getElementById("logoutBtn");

// Modales
const registerModal = document.getElementById("registerModal");
const loginModal = document.getElementById("loginModal");
const profileModal = document.getElementById("profileModal");
const closeRegisterBtn = document.getElementById("closeRegisterBtn");
const closeLoginBtn = document.getElementById("closeLoginBtn");
const closeProfileBtn = document.getElementById("closeProfileBtn");
const authRegisterForm = document.getElementById("authRegisterForm");
const authLoginForm = document.getElementById("authLoginForm");
const userProfileForm = document.getElementById("userProfileForm");

// Inputs de Perfil
const profName = document.getElementById("profName");
const profEmail = document.getElementById("profEmail");
const profPhone = document.getElementById("profPhone");
const profPassword = document.getElementById("profPassword");
const saveProfileBtn = document.getElementById("saveProfileBtn");

// Vistas
const storeView = document.getElementById("storeView");
const productsManagementView = document.getElementById("productsManagementView");
const ordersManagementView = document.getElementById("ordersManagementView");
const usersManagementView = document.getElementById("usersManagementView");
const myOrdersView = document.getElementById("myOrdersView");
const exitMyOrdersBtn = document.getElementById("exitMyOrdersBtn");
const goHomeBtn = document.getElementById("goHomeBtn");

// Barra superior dinámica de Admin / Comprador
const buyerCategoriesBar = document.getElementById("buyerCategoriesBar");
const adminNavHeaderBar = document.getElementById("adminNavHeaderBar");
const adminBarStoreBtn = document.getElementById("adminBarStoreBtn");
const adminBarProductsBtn = document.getElementById("adminBarProductsBtn");
const adminBarOrdersBtn = document.getElementById("adminBarOrdersBtn");
const adminBarUsersBtn = document.getElementById("adminBarUsersBtn");
const adminBarOrdersCount = document.getElementById("adminBarOrdersCount");
const adminBarStatsBtn = document.getElementById("adminBarStatsBtn");
const adminBarNotesBtn = document.getElementById("adminBarNotesBtn");
const adminBarNotesCount = document.getElementById("adminBarNotesCount");
const adminBarMyOrdersBtn = document.getElementById("adminBarMyOrdersBtn");
const adminBarMyOrdersCount = document.getElementById("adminBarMyOrdersCount");

// Menús desplegables en Barra de Navegación de Admin (Clientes y Configuración de Cuenta)
const adminClientsDropdownContainer = document.getElementById("adminClientsDropdownContainer");
const adminBarClientsDropdownBtn = document.getElementById("adminBarClientsDropdownBtn");
const adminBarClientsDropdownMenu = document.getElementById("adminBarClientsDropdownMenu");

const adminSettingsDropdownContainer = document.getElementById("adminSettingsDropdownContainer");
const adminBarSettingsDropdownBtn = document.getElementById("adminBarSettingsDropdownBtn");
const adminBarSettingsDropdownMenu = document.getElementById("adminBarSettingsDropdownMenu");

const adminBarProfileBtn = document.getElementById("adminBarProfileBtn");

// Precios de compra / costo de producto
const prodCostPrice = document.getElementById("prodCostPrice");
const editProdCostPrice = document.getElementById("editProdCostPrice");

const exitProductsBtn = document.getElementById("exitProductsBtn");
const exitOrdersBtn = document.getElementById("exitOrdersBtn");
const exitUsersBtn = document.getElementById("exitUsersBtn");
const exitAnalyticsBtn = document.getElementById("exitAnalyticsBtn");
const exitNotesBtn = document.getElementById("exitNotesBtn");

// Vistas
const analyticsManagementView = document.getElementById("analyticsManagementView");
const notesManagementView = document.getElementById("notesManagementView");

// Tablas y Formularios
const newProductForm = document.getElementById("newProductForm");
const adminProductsTableBody = document.getElementById("adminProductsTableBody");
const adminProductFilterInput = document.getElementById("adminProductFilterInput");
const adminProductsCountBadge = document.getElementById("adminProductsCountBadge");
const adminOrdersTableBody = document.getElementById("adminOrdersTableBody");
const adminOrderFilterInput = document.getElementById("adminOrderFilterInput");
const adminOrdersCountBadge = document.getElementById("adminOrdersCountBadge");
const adminUsersTableBody = document.getElementById("adminUsersTableBody");
const adminUserFilterInput = document.getElementById("adminUserFilterInput");
const adminUsersCountBadge = document.getElementById("adminUsersCountBadge");
const noOrdersMsg = document.getElementById("noOrdersMsg");
const myOrdersListContainer = document.getElementById("myOrdersListContainer");
const myActiveOrdersSection = document.getElementById("myActiveOrdersSection");
const buyerActiveOrderBanner = document.getElementById("buyerActiveOrderBanner");
const buyerActiveOrderStatus = document.getElementById("buyerActiveOrderStatus");
const viewActiveOrderBtn = document.getElementById("viewActiveOrderBtn");
const profileViewOrdersBtn = document.getElementById("profileViewOrdersBtn");
const profileOrdersCount = document.getElementById("profileOrdersCount");

// Modal Nota de Entrega de Cliente (Remito Oficial)
const deliveryNoteModal = document.getElementById("deliveryNoteModal");
const closeDeliveryNoteBtn = document.getElementById("closeDeliveryNoteBtn");
const closeDeliveryNoteBottomBtn = document.getElementById("closeDeliveryNoteBottomBtn");
const dnPrintBtn = document.getElementById("dnPrintBtn");
const dnShareWhatsAppBtn = document.getElementById("dnShareWhatsAppBtn");
const dnStatusBadge = document.getElementById("dnStatusBadge");
const dnOrderId = document.getElementById("dnOrderId");
const dnOrderDate = document.getElementById("dnOrderDate");
const dnDeliveryDateRow = document.getElementById("dnDeliveryDateRow");
const dnDeliveryDate = document.getElementById("dnDeliveryDate");
const dnClientName = document.getElementById("dnClientName");
const dnClientPhone = document.getElementById("dnClientPhone");
const dnClientEmail = document.getElementById("dnClientEmail");
const dnShippingStatus = document.getElementById("dnShippingStatus");
const dnItemsTableBody = document.getElementById("dnItemsTableBody");
const dnSubtotalVal = document.getElementById("dnSubtotalVal");
const dnGrandTotal = document.getElementById("dnGrandTotal");
const dnOrderNotesBox = document.getElementById("dnOrderNotesBox");
const dnOrderNotesDisplay = document.getElementById("dnOrderNotesDisplay");
const dnOrderNotesEditor = document.getElementById("dnOrderNotesEditor");
const dnOrderNotesInput = document.getElementById("dnOrderNotesInput");
const dnSaveOrderNoteBtn = document.getElementById("dnSaveOrderNoteBtn");

// Elementos de Envío / Delivery en Nota de Entrega
const dnShippingCostVal = document.getElementById("dnShippingCostVal");
const dnEditShippingBtn = document.getElementById("dnEditShippingBtn");
const dnShippingEditorBox = document.getElementById("dnShippingEditorBox");
const dnShippingInput = document.getElementById("dnShippingInput");
const dnSaveShippingBtn = document.getElementById("dnSaveShippingBtn");
const dnCancelShippingBtn = document.getElementById("dnCancelShippingBtn");

// Elementos de Ganancias, Gráficas y Métricas (Analytics)
const statsMonthFrom = document.getElementById("statsMonthFrom");
const statsMonthTo = document.getElementById("statsMonthTo");
const statsProfitMargin = document.getElementById("statsProfitMargin");
const applyStatsFilterBtn = document.getElementById("applyStatsFilterBtn");
const analyticsExportExcelBtn = document.getElementById("analyticsExportExcelBtn");
const analyticsPrintPdfBtn = document.getElementById("analyticsPrintPdfBtn");
const kpiTotalSales = document.getElementById("kpiTotalSales");
const kpiSalesSub = document.getElementById("kpiSalesSub");
const kpiTotalProfit = document.getElementById("kpiTotalProfit");
const kpiProfitSub = document.getElementById("kpiProfitSub");
const kpiTotalOrders = document.getElementById("kpiTotalOrders");
const kpiOrdersSub = document.getElementById("kpiOrdersSub");
const kpiAverageTicket = document.getElementById("kpiAverageTicket");
const kpiUnitsSub = document.getElementById("kpiUnitsSub");
const salesChartCanvas = document.getElementById("salesChartCanvas");
const salesChartSummaryText = document.getElementById("salesChartSummaryText");
const topProductsContainer = document.getElementById("topProductsContainer");
const topProductsCountLabel = document.getElementById("topProductsCountLabel");
const analyticsTableSearch = document.getElementById("analyticsTableSearch");
const analyticsOrdersTableBody = document.getElementById("analyticsOrdersTableBody");
const analyticsOrdersCount = document.getElementById("analyticsOrdersCount");
const analyticsNoOrdersMsg = document.getElementById("analyticsNoOrdersMsg");

// Elementos de Reporte Imprimible PDF
const printableAnalyticsReport = document.getElementById("printableAnalyticsReport");
const prPeriodText = document.getElementById("prPeriodText");
const prPrintDate = document.getElementById("prPrintDate");
const prMarginText = document.getElementById("prMarginText");
const prTotalSales = document.getElementById("prTotalSales");
const prTotalProfit = document.getElementById("prTotalProfit");
const prTotalOrders = document.getElementById("prTotalOrders");
const prAvgTicket = document.getElementById("prAvgTicket");
const prTopProductsTableWrapper = document.getElementById("prTopProductsTableWrapper");
const prOrdersTableWrapper = document.getElementById("prOrdersTableWrapper");

// Elementos de Bloc de Notas del Negocio (Admin)
const newAdminNoteForm = document.getElementById("newAdminNoteForm");
const noteTitleInput = document.getElementById("noteTitleInput");
const noteCategorySelect = document.getElementById("noteCategorySelect");
const noteContentInput = document.getElementById("noteContentInput");
const notesSearchInput = document.getElementById("notesSearchInput");
const adminNotesListContainer = document.getElementById("adminNotesListContainer");
const notesCountBadge = document.getElementById("notesCountBadge");
const noNotesMsg = document.getElementById("noNotesMsg");

// Modal Editar Producto
const editProductModal = document.getElementById("editProductModal");
const editProductForm = document.getElementById("editProductForm");
const closeEditProductBtn = document.getElementById("closeEditProductBtn");
const cancelEditProductBtn = document.getElementById("cancelEditProductBtn");
const editProdId = document.getElementById("editProdId");
const editProdTitle = document.getElementById("editProdTitle");
const editProdCategory = document.getElementById("editProdCategory");
const editProdPrice = document.getElementById("editProdPrice");
const editProdStock = document.getElementById("editProdStock");
const editProdImage = document.getElementById("editProdImage");
const editProdDesc = document.getElementById("editProdDesc");

const adminBarSettingsBtn = document.getElementById("adminBarSettingsBtn");
const headerLogoIcon = document.getElementById("headerLogoIcon");
const headerLogoTitle = document.getElementById("headerLogoTitle");
const headerLogoSub = document.getElementById("headerLogoSub");

// Modal Configuración de Tienda y Logo
const storeSettingsModal = document.getElementById("storeSettingsModal");
const closeStoreSettingsBtn = document.getElementById("closeStoreSettingsBtn");
const cancelStoreSettingsBtn = document.getElementById("cancelStoreSettingsBtn");
const storeSettingsForm = document.getElementById("storeSettingsForm");
const storeLogoFileInput = document.getElementById("storeLogoFileInput");
const storeLogoUrlInput = document.getElementById("storeLogoUrlInput");
const storeNameInput = document.getElementById("storeNameInput");
const storeSubInput = document.getElementById("storeSubInput");
const storeLogoPreviewBox = document.getElementById("storeLogoPreviewBox");
const storeLogoPreviewIcon = document.getElementById("storeLogoPreviewIcon");
let storeLogoBase64 = "";

// Modal Detalle de Producto
const productDetailModal = document.getElementById("productDetailModal");
const closeDetailModalBtn = document.getElementById("closeDetailModalBtn");
const detailImgBox = document.getElementById("detailImgBox");
const detailProdCategoryTag = document.getElementById("detailProdCategoryTag");
const detailProdBrand = document.getElementById("detailProdBrand");
const detailProdTitle = document.getElementById("detailProdTitle");
const detailProdPrice = document.getElementById("detailProdPrice");
const detailProdStockBadge = document.getElementById("detailProdStockBadge");
const detailProdDescText = document.getElementById("detailProdDescText");
const detailQtyMinus = document.getElementById("detailQtyMinus");
const detailQtyPlus = document.getElementById("detailQtyPlus");
const detailQtyVal = document.getElementById("detailQtyVal");
const detailAddCartBtn = document.getElementById("detailAddCartBtn");
let currentDetailProduct = null;
let currentDetailQty = 1;

// Carrusel de Productos Destacados
const featuredCarouselTrack = document.getElementById("featuredCarouselTrack");
const carouselPrevBtn = document.getElementById("carouselPrevBtn");
const carouselNextBtn = document.getElementById("carouselNextBtn");
const carouselDots = document.getElementById("carouselDots");
let carouselIndex = 0;
let carouselAutoPlayTimer = null;

// Subida multi-imagen (hasta 5 fotos por producto)
let newProductImages = [];
let editProductImages = [];

// Detalle de producto y galería
let currentDetailImages = [];
let currentDetailImgIndex = 0;

// Lightbox visor de imagen ampliada a pantalla completa
let lightboxCurrentIndex = 0;
const imageLightboxModal = document.getElementById("imageLightboxModal");
const closeLightboxBtn = document.getElementById("closeLightboxBtn");
const lightboxPrevBtn = document.getElementById("lightboxPrevBtn");
const lightboxNextBtn = document.getElementById("lightboxNextBtn");
const lightboxMediaContainer = document.getElementById("lightboxMediaContainer");
const lightboxProductTitle = document.getElementById("lightboxProductTitle");
const lightboxCounter = document.getElementById("lightboxCounter");

const detailThumbnailsStrip = document.getElementById("detailThumbnailsStrip");
const detailProdIdBadge = document.getElementById("detailProdIdBadge");
const detailCopyIdBtn = document.getElementById("detailCopyIdBtn");

// Modal Letrero de Publicación Exitosa
const publishSuccessModal = document.getElementById("publishSuccessModal");
const successProdImgBox = document.getElementById("successProdImgBox");
const successProdCategory = document.getElementById("successProdCategory");
const successProdFeaturedBadge = document.getElementById("successProdFeaturedBadge");
const successProdTitle = document.getElementById("successProdTitle");
const successProdPrice = document.getElementById("successProdPrice");
const successProdId = document.getElementById("successProdId");
const successCopyIdBtn = document.getElementById("successCopyIdBtn");
const successGoToStoreBtn = document.getElementById("successGoToStoreBtn");
const successPublishAnotherBtn = document.getElementById("successPublishAnotherBtn");
const successViewInAdminBtn = document.getElementById("successViewInAdminBtn");

// Modal Editor y Recortador de Imagen (Canvas Cropper)
const imageCropperModal = document.getElementById("imageCropperModal");
const closeCropperBtn = document.getElementById("closeCropperBtn");
const cropperCancelBtn = document.getElementById("cropperCancelBtn");
const cropperApplyBtn = document.getElementById("cropperApplyBtn");
const cropperCanvas = document.getElementById("cropperCanvas");
const cropperZoomRange = document.getElementById("cropperZoomRange");
const cropperZoomValue = document.getElementById("cropperZoomValue");
const cropperZoomInBtn = document.getElementById("cropperZoomInBtn");
const cropperZoomOutBtn = document.getElementById("cropperZoomOutBtn");
const cropperRatioSquare = document.getElementById("cropperRatioSquare");
const cropperRatio43 = document.getElementById("cropperRatio43");
const cropperRatioFree = document.getElementById("cropperRatioFree");
const cropperRotateLeftBtn = document.getElementById("cropperRotateLeftBtn");
const cropperRotateRightBtn = document.getElementById("cropperRotateRightBtn");
const cropperResetBtn = document.getElementById("cropperResetBtn");

// Estado del Editor de Recorte
let cropperImage = null;
let cropperTargetArray = null;
let cropperTargetIndex = -1;
let cropperOnComplete = null;
let cropperZoom = 1.0;
let cropperRotation = 0;
let cropperPanX = 0;
let cropperPanY = 0;
let cropperAspectRatio = "1:1";
let isDraggingCropper = false;
let dragStartMouseX = 0;
let dragStartMouseY = 0;
let dragStartPanX = 0;
let dragStartPanY = 0;
let isSubmittingNewProduct = false;

// Helper global para copiar texto al portapapeles
function copiarTextoPortapapeles(texto, mensajeExito = "📋 Copiado al portapapeles") {
  if (!texto) return;
  const textoLimpio = String(texto).replace(/^#/, "").trim();
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(textoLimpio)
      .then(() => showToast(`${mensajeExito}: ${textoLimpio}`))
      .catch(() => fallbackCopiar(textoLimpio, mensajeExito));
  } else {
    fallbackCopiar(textoLimpio, mensajeExito);
  }
}

function fallbackCopiar(texto, mensajeExito) {
  try {
    const temp = document.createElement("textarea");
    temp.value = texto;
    temp.style.position = "fixed";
    temp.style.opacity = "0";
    document.body.appendChild(temp);
    temp.select();
    document.execCommand("copy");
    document.body.removeChild(temp);
    showToast(`${mensajeExito}: ${texto}`);
  } catch (e) {
    prompt("Copia este ID manualmente:", texto);
  }
}

// Elementos de formulario Nuevo Producto
const prodImageFilesInput = document.getElementById("prodImageFiles");
const prodImageUrlInput = document.getElementById("prodImageUrlInput");
const btnAddImageUrlBtn = document.getElementById("btnAddImageUrlBtn");
const newProdGalleryPreview = document.getElementById("newProdGalleryPreview");
const newProdImgCountBadge = document.getElementById("newProdImgCountBadge");

// Elementos de formulario Editar Producto
const editProdImageFilesInput = document.getElementById("editProdImageFiles");
const editProdImageUrlInput = document.getElementById("editProdImageUrlInput");
const btnEditAddImageUrlBtn = document.getElementById("btnEditAddImageUrlBtn");
const editProdGalleryPreview = document.getElementById("editProdGalleryPreview");
const editProdImgCountBadge = document.getElementById("editProdImgCountBadge");

function renderizarPreviewGaleriaNuevo() {
  if (!newProdGalleryPreview) return;
  newProdGalleryPreview.innerHTML = "";

  if (newProdImgCountBadge) {
    newProdImgCountBadge.textContent = `${newProductImages.length} / 5 agregadas`;
    newProdImgCountBadge.style.color = newProductImages.length > 0 ? "#0f766e" : "#64748b";
  }

  newProductImages.forEach((imgSrc, idx) => {
    const item = document.createElement("div");
    item.className = "gallery-preview-item";
    const mediaHtml = getProductMediaHtml(imgSrc, `Foto ${idx + 1}`);
    item.innerHTML = `
      ${mediaHtml}
      ${idx === 0 ? '<span class="badge-main-img">Portada</span>' : ''}
      <button type="button" class="btn-crop-thumb" data-idx="${idx}" title="✂️ Recortar y ubicar foto">✂️</button>
      <button type="button" class="btn-remove-thumb" data-idx="${idx}" title="Eliminar foto">&times;</button>
    `;

    // Botón Recortar
    item.querySelector(".btn-crop-thumb").addEventListener("click", (e) => {
      e.stopPropagation();
      abrirEditorRecorte(imgSrc, newProductImages, idx, renderizarPreviewGaleriaNuevo);
    });

    // Clic en la foto para abrir recortador directamente
    item.addEventListener("click", (e) => {
      if (e.target.closest(".btn-remove-thumb") || e.target.closest(".btn-crop-thumb")) return;
      abrirEditorRecorte(imgSrc, newProductImages, idx, renderizarPreviewGaleriaNuevo);
    });

    item.querySelector(".btn-remove-thumb").addEventListener("click", (e) => {
      e.stopPropagation();
      newProductImages.splice(idx, 1);
      renderizarPreviewGaleriaNuevo();
    });

    newProdGalleryPreview.appendChild(item);
  });
}

function renderizarPreviewGaleriaEditar() {
  if (!editProdGalleryPreview) return;
  editProdGalleryPreview.innerHTML = "";

  if (editProdImgCountBadge) {
    editProdImgCountBadge.textContent = `${editProductImages.length} / 5 agregadas`;
    editProdImgCountBadge.style.color = editProductImages.length > 0 ? "#0f766e" : "#64748b";
  }

  editProductImages.forEach((imgSrc, idx) => {
    const item = document.createElement("div");
    item.className = "gallery-preview-item";
    const mediaHtml = getProductMediaHtml(imgSrc, `Foto ${idx + 1}`);
    item.innerHTML = `
      ${mediaHtml}
      ${idx === 0 ? '<span class="badge-main-img">Portada</span>' : ''}
      <button type="button" class="btn-crop-thumb" data-idx="${idx}" title="✂️ Recortar y ubicar foto">✂️</button>
      <button type="button" class="btn-remove-thumb" data-idx="${idx}" title="Eliminar foto">&times;</button>
    `;

    // Botón Recortar
    item.querySelector(".btn-crop-thumb").addEventListener("click", (e) => {
      e.stopPropagation();
      abrirEditorRecorte(imgSrc, editProductImages, idx, renderizarPreviewGaleriaEditar);
    });

    // Clic en la foto para abrir recortador directamente
    item.addEventListener("click", (e) => {
      if (e.target.closest(".btn-remove-thumb") || e.target.closest(".btn-crop-thumb")) return;
      abrirEditorRecorte(imgSrc, editProductImages, idx, renderizarPreviewGaleriaEditar);
    });

    item.querySelector(".btn-remove-thumb").addEventListener("click", (e) => {
      e.stopPropagation();
      editProductImages.splice(idx, 1);
      renderizarPreviewGaleriaEditar();
    });

    editProdGalleryPreview.appendChild(item);
  });
}

// Helper para leer y comprimir imágenes automáticamente en el navegador
// (Evita exceder el límite estricto de 1MB por documento de Firestore)
function leerYComprimirImagen(file, callback, maxDimension = 800, quality = 0.70) {
  if (!file) return;
  if (!file.type || !file.type.startsWith("image/")) {
    showToast("⚠️ Por favor selecciona un archivo de imagen válido");
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    const img = new Image();
    img.onload = function() {
      let width = img.width;
      let height = img.height;

      // Escalar proporcionalmente si supera la dimensión máxima
      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");

      // Fondo blanco suave para evitar fondos negros en caso de PNGs con transparencia al guardar en JPEG
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);

      // Comprimir a JPEG optimizado (reduce fotos de 5MB a ~50KB con excelente nitidez)
      let dataUrl = canvas.toDataURL("image/jpeg", quality);

      // Si por alguna razón excede 160KB (fotos muy complejas), recomprimir a calidad menor
      if (dataUrl.length > 170000) {
        dataUrl = canvas.toDataURL("image/jpeg", 0.52);
      }

      callback(dataUrl);
    };

    img.onerror = function() {
      showToast("❌ No se pudo procesar la imagen seleccionada");
    };

    img.src = e.target.result;
  };

  reader.onerror = function() {
    showToast("❌ Error al leer el archivo");
  };

  reader.readAsDataURL(file);
}

// Alias para compatibilidad global
function leerArchivoComoDataURL(file, callback, maxDimension = 800) {
  leerYComprimirImagen(file, callback, maxDimension);
}

// Helper para renderizar imagen web o emoji
function getProductMediaHtml(imgOrEmoji, title) {
  const val = (imgOrEmoji || "🐾").trim();
  const isUrl = val.startsWith("http://") || val.startsWith("https://") || val.startsWith("data:image");
  if (isUrl) {
    return `<img src="${escapeHtml(val)}" alt="${escapeHtml(title || 'Producto')}" class="product-thumb-img" onerror="this.onerror=null; this.parentElement.innerHTML='🐾';">`;
  }
  return `<span>${escapeHtml(val)}</span>`;
}

// ==============================================================
// MOTOR DE EDICIÓN Y RECORTE DE IMÁGENES (CANVAS CROPPER)
// ==============================================================
function abrirEditorRecorte(imgSrc, targetArray, targetIndex, onComplete) {
  if (!imgSrc) return;
  const val = String(imgSrc).trim();
  const esUrlValida = val.startsWith("data:image") || val.startsWith("http://") || val.startsWith("https://");
  
  if (!esUrlValida) {
    showToast("ℹ️ Los emojis no requieren recorte. Puedes recortar fotos subidas o enlaces.");
    return;
  }

  const img = new Image();
  img.crossOrigin = "anonymous";
  img.onload = () => {
    cropperImage = img;
    cropperTargetArray = targetArray;
    cropperTargetIndex = targetIndex;
    cropperOnComplete = onComplete;
    cropperZoom = 1.0;
    cropperRotation = 0;
    cropperPanX = 0;
    cropperPanY = 0;
    cropperAspectRatio = "1:1";

    actualizarBotonesProporcionCropper("1:1");
    actualizarZoomSlider(1.0);
    dibujarCanvasCropper();

    if (imageCropperModal) imageCropperModal.style.display = "flex";
  };
  img.onerror = () => {
    showToast("❌ No se pudo cargar la imagen para editar");
  };
  img.src = val;
}

function getCropRect(cw, ch) {
  if (cropperAspectRatio === "1:1") {
    const size = Math.min(cw, ch) - 40;
    return { x: (cw - size) / 2, y: (ch - size) / 2, w: size, h: size };
  } else if (cropperAspectRatio === "4:3") {
    let w = cw - 40;
    let h = Math.round(w * (3 / 4));
    if (h > ch - 40) {
      h = ch - 40;
      w = Math.round(h * (4 / 3));
    }
    return { x: (cw - w) / 2, y: (ch - h) / 2, w: w, h: h };
  } else {
    // Proporción libre
    const w = cw - 30;
    const h = ch - 30;
    return { x: 15, y: 15, w: w, h: h };
  }
}

function dibujarCanvasCropper() {
  if (!cropperCanvas || !cropperImage) return;
  const ctx = cropperCanvas.getContext("2d");
  const cw = cropperCanvas.width;
  const ch = cropperCanvas.height;

  ctx.clearRect(0, 0, cw, ch);

  // Fondo oscuro
  ctx.fillStyle = "#090d16";
  ctx.fillRect(0, 0, cw, ch);

  const cropRect = getCropRect(cw, ch);

  // 1. Dibujar la imagen con transformación de usuario (pan, rotación, zoom)
  ctx.save();
  ctx.translate(cw / 2 + cropperPanX, ch / 2 + cropperPanY);
  ctx.rotate((cropperRotation * Math.PI) / 180);
  ctx.scale(cropperZoom, cropperZoom);

  // Ajuste inicial para cubrir el marco
  const baseScale = Math.max(cropRect.w / cropperImage.width, cropRect.h / cropperImage.height);
  const drawW = cropperImage.width * baseScale;
  const drawH = cropperImage.height * baseScale;

  ctx.drawImage(cropperImage, -drawW / 2, -drawH / 2, drawW, drawH);
  ctx.restore();

  // 2. Máscara oscura exterior al recuadro de recorte
  ctx.save();
  ctx.fillStyle = "rgba(10, 15, 29, 0.72)";
  ctx.beginPath();
  ctx.rect(0, 0, cw, ch);
  ctx.rect(cropRect.x, cropRect.y, cropRect.w, cropRect.h);
  ctx.fill("evenodd");

  // 3. Borde del marco de recorte
  ctx.strokeStyle = "#0f766e";
  ctx.lineWidth = 2.5;
  ctx.strokeRect(cropRect.x, cropRect.y, cropRect.w, cropRect.h);

  // 4. Guías de tercios (Rule of Thirds)
  ctx.strokeStyle = "rgba(255, 255, 255, 0.35)";
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(cropRect.x + cropRect.w / 3, cropRect.y);
  ctx.lineTo(cropRect.x + cropRect.w / 3, cropRect.y + cropRect.h);
  ctx.moveTo(cropRect.x + (cropRect.w * 2) / 3, cropRect.y);
  ctx.lineTo(cropRect.x + (cropRect.w * 2) / 3, cropRect.y + cropRect.h);
  ctx.moveTo(cropRect.x, cropRect.y + cropRect.h / 3);
  ctx.lineTo(cropRect.x + cropRect.w, cropRect.y + cropRect.h / 3);
  ctx.moveTo(cropRect.x, cropRect.y + (cropRect.h * 2) / 3);
  ctx.lineTo(cropRect.x + cropRect.w, cropRect.y + (cropRect.h * 2) / 3);
  ctx.stroke();
  ctx.setLineDash([]);

  // 5. Esquinas reforzadas estilo visor profesional
  ctx.strokeStyle = "#14b8a6";
  ctx.lineWidth = 3.5;
  const cLen = 14;
  ctx.beginPath();
  // Arriba-Izquierda
  ctx.moveTo(cropRect.x, cropRect.y + cLen);
  ctx.lineTo(cropRect.x, cropRect.y);
  ctx.lineTo(cropRect.x + cLen, cropRect.y);
  // Arriba-Derecha
  ctx.moveTo(cropRect.x + cropRect.w - cLen, cropRect.y);
  ctx.lineTo(cropRect.x + cropRect.w, cropRect.y);
  ctx.lineTo(cropRect.x + cropRect.w, cropRect.y + cLen);
  // Abajo-Izquierda
  ctx.moveTo(cropRect.x, cropRect.y + cropRect.h - cLen);
  ctx.lineTo(cropRect.x, cropRect.y + cropRect.h);
  ctx.lineTo(cropRect.x + cLen, cropRect.y + cropRect.h);
  // Abajo-Derecha
  ctx.moveTo(cropRect.x + cropRect.w - cLen, cropRect.y + cropRect.h);
  ctx.lineTo(cropRect.x + cropRect.w, cropRect.y + cropRect.h);
  ctx.lineTo(cropRect.x + cropRect.w, cropRect.y + cropRect.h - cLen);
  ctx.stroke();

  ctx.restore();
}

function aplicarRecorte() {
  if (!cropperCanvas || !cropperImage) return;
  const cw = cropperCanvas.width;
  const ch = cropperCanvas.height;
  const cropRect = getCropRect(cw, ch);

  // Lienzo de exportación en alta definición
  const exportW = 700;
  const exportH = Math.round(exportW * (cropRect.h / cropRect.w));

  const exportCanvas = document.createElement("canvas");
  exportCanvas.width = exportW;
  exportCanvas.height = exportH;
  const eCtx = exportCanvas.getContext("2d");

  // Fondo blanco para fotos con bordes o transparencias
  eCtx.fillStyle = "#ffffff";
  eCtx.fillRect(0, 0, exportW, exportH);

  const scaleRatio = exportW / cropRect.w;
  const baseScale = Math.max(cropRect.w / cropperImage.width, cropRect.h / cropperImage.height);
  const drawW = cropperImage.width * baseScale;
  const drawH = cropperImage.height * baseScale;

  const relX = (cw / 2 + cropperPanX) - (cropRect.x + cropRect.w / 2);
  const relY = (ch / 2 + cropperPanY) - (cropRect.y + cropRect.h / 2);

  eCtx.save();
  eCtx.translate(exportW / 2 + relX * scaleRatio, exportH / 2 + relY * scaleRatio);
  eCtx.rotate((cropperRotation * Math.PI) / 180);
  eCtx.scale(cropperZoom * scaleRatio, cropperZoom * scaleRatio);
  eCtx.drawImage(cropperImage, -drawW / 2, -drawH / 2, drawW, drawH);
  eCtx.restore();

  // Comprimir a JPEG optimizado
  let dataUrl = exportCanvas.toDataURL("image/jpeg", 0.76);
  if (dataUrl.length > 170000) {
    dataUrl = exportCanvas.toDataURL("image/jpeg", 0.58);
  }

  if (cropperTargetArray && cropperTargetIndex >= 0) {
    cropperTargetArray[cropperTargetIndex] = dataUrl;
  }

  if (typeof cropperOnComplete === "function") {
    cropperOnComplete();
  }

  if (imageCropperModal) imageCropperModal.style.display = "none";
  showToast("✂️ Foto recortada y encuadrada con éxito");
}

function actualizarZoomSlider(val) {
  cropperZoom = Math.round(val * 100) / 100;
  if (cropperZoomRange) cropperZoomRange.value = cropperZoom;
  if (cropperZoomValue) cropperZoomValue.textContent = `${Math.round(cropperZoom * 100)}%`;
}

function actualizarBotonesProporcionCropper(ratio) {
  cropperAspectRatio = ratio;
  if (cropperRatioSquare) cropperRatioSquare.classList.toggle("active", ratio === "1:1");
  if (cropperRatio43) cropperRatio43.classList.toggle("active", ratio === "4:3");
  if (cropperRatioFree) cropperRatioFree.classList.toggle("active", ratio === "free");
}

function getCanvasPoint(e) {
  const rect = cropperCanvas.getBoundingClientRect();
  const scaleX = cropperCanvas.width / rect.width;
  const scaleY = cropperCanvas.height / rect.height;
  return {
    x: (e.clientX - rect.left) * scaleX,
    y: (e.clientY - rect.top) * scaleY
  };
}

if (cropperCanvas) {
  cropperCanvas.addEventListener("mousedown", (e) => {
    isDraggingCropper = true;
    const pt = getCanvasPoint(e);
    dragStartMouseX = pt.x;
    dragStartMouseY = pt.y;
    dragStartPanX = cropperPanX;
    dragStartPanY = cropperPanY;
  });

  window.addEventListener("mousemove", (e) => {
    if (!isDraggingCropper || !cropperCanvas) return;
    const pt = getCanvasPoint(e);
    cropperPanX = dragStartPanX + (pt.x - dragStartMouseX);
    cropperPanY = dragStartPanY + (pt.y - dragStartMouseY);
    dibujarCanvasCropper();
  });

  window.addEventListener("mouseup", () => {
    isDraggingCropper = false;
  });

  cropperCanvas.addEventListener("touchstart", (e) => {
    if (e.touches.length === 1) {
      e.preventDefault();
      isDraggingCropper = true;
      const touch = e.touches[0];
      const pt = getCanvasPoint(touch);
      dragStartMouseX = pt.x;
      dragStartMouseY = pt.y;
      dragStartPanX = cropperPanX;
      dragStartPanY = cropperPanY;
    }
  }, { passive: false });

  cropperCanvas.addEventListener("touchmove", (e) => {
    if (!isDraggingCropper || e.touches.length !== 1) return;
    e.preventDefault();
    const touch = e.touches[0];
    const pt = getCanvasPoint(touch);
    cropperPanX = dragStartPanX + (pt.x - dragStartMouseX);
    cropperPanY = dragStartPanY + (pt.y - dragStartMouseY);
    dibujarCanvasCropper();
  }, { passive: false });

  cropperCanvas.addEventListener("touchend", () => {
    isDraggingCropper = false;
  });

  cropperCanvas.addEventListener("wheel", (e) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.08 : -0.08;
    cropperZoom = Math.max(0.2, Math.min(3.5, cropperZoom + delta));
    actualizarZoomSlider(cropperZoom);
    dibujarCanvasCropper();
  }, { passive: false });
}

if (cropperZoomRange) {
  cropperZoomRange.addEventListener("input", (e) => {
    cropperZoom = parseFloat(e.target.value);
    if (cropperZoomValue) cropperZoomValue.textContent = `${Math.round(cropperZoom * 100)}%`;
    dibujarCanvasCropper();
  });
}

if (cropperZoomInBtn) {
  cropperZoomInBtn.addEventListener("click", () => {
    cropperZoom = Math.min(3.5, cropperZoom + 0.15);
    actualizarZoomSlider(cropperZoom);
    dibujarCanvasCropper();
  });
}

if (cropperZoomOutBtn) {
  cropperZoomOutBtn.addEventListener("click", () => {
    cropperZoom = Math.max(0.2, cropperZoom - 0.15);
    actualizarZoomSlider(cropperZoom);
    dibujarCanvasCropper();
  });
}

if (cropperRotateLeftBtn) {
  cropperRotateLeftBtn.addEventListener("click", () => {
    cropperRotation = (cropperRotation - 90 + 360) % 360;
    dibujarCanvasCropper();
  });
}

if (cropperRotateRightBtn) {
  cropperRotateRightBtn.addEventListener("click", () => {
    cropperRotation = (cropperRotation + 90) % 360;
    dibujarCanvasCropper();
  });
}

if (cropperRatioSquare) {
  cropperRatioSquare.addEventListener("click", () => {
    actualizarBotonesProporcionCropper("1:1");
    dibujarCanvasCropper();
  });
}

if (cropperRatio43) {
  cropperRatio43.addEventListener("click", () => {
    actualizarBotonesProporcionCropper("4:3");
    dibujarCanvasCropper();
  });
}

if (cropperRatioFree) {
  cropperRatioFree.addEventListener("click", () => {
    actualizarBotonesProporcionCropper("free");
    dibujarCanvasCropper();
  });
}

if (cropperResetBtn) {
  cropperResetBtn.addEventListener("click", () => {
    cropperPanX = 0;
    cropperPanY = 0;
    cropperZoom = 1.0;
    cropperRotation = 0;
    actualizarZoomSlider(1.0);
    dibujarCanvasCropper();
  });
}

if (closeCropperBtn) closeCropperBtn.addEventListener("click", () => { if (imageCropperModal) imageCropperModal.style.display = "none"; });
if (cropperCancelBtn) cropperCancelBtn.addEventListener("click", () => { if (imageCropperModal) imageCropperModal.style.display = "none"; });
if (cropperApplyBtn) cropperApplyBtn.addEventListener("click", aplicarRecorte);

// ==============================================================
// MODAL LETRERO DE PUBLICACIÓN EXITOSA
// ==============================================================
function mostrarModalPublicadoExito(prod) {
  if (!publishSuccessModal) return;

  if (successProdTitle) successProdTitle.textContent = prod.titulo;
  if (successProdCategory) successProdCategory.textContent = prod.categoria || "Mascotas";
  if (successProdPrice) successProdPrice.textContent = `$ ${Number(prod.precio).toLocaleString("es-AR")}`;
  if (successProdId) {
    successProdId.textContent = `#${prod.id}`;
    successProdId.dataset.id = prod.id;
  }

  if (successProdFeaturedBadge) {
    successProdFeaturedBadge.style.display = prod.destacado ? "inline-block" : "none";
  }

  if (successProdImgBox) {
    const mediaVal = prod.imagen || (Array.isArray(prod.imagenes) && prod.imagenes[0]) || "🐾";
    successProdImgBox.innerHTML = getProductMediaHtml(mediaVal, prod.titulo);
  }

  publishSuccessModal.style.display = "flex";
}

if (successCopyIdBtn) {
  successCopyIdBtn.addEventListener("click", () => {
    const id = successProdId ? (successProdId.dataset.id || successProdId.textContent.replace("#", "")) : "";
    copiarTextoPortapapeles(id, "📋 ID de producto copiado");
  });
}

if (successGoToStoreBtn) {
  successGoToStoreBtn.addEventListener("click", () => {
    publishSuccessModal.style.display = "none";
    mostrarTienda();
    const catalogHeader = document.querySelector(".section-header");
    if (catalogHeader) catalogHeader.scrollIntoView({ behavior: "smooth" });
  });
}

if (successPublishAnotherBtn) {
  successPublishAnotherBtn.addEventListener("click", () => {
    publishSuccessModal.style.display = "none";
    const prodTitleEl = document.getElementById("prodTitle");
    if (prodTitleEl) {
      prodTitleEl.focus();
      prodTitleEl.scrollIntoView({ behavior: "smooth" });
    }
  });
}

if (successViewInAdminBtn) {
  successViewInAdminBtn.addEventListener("click", () => {
    publishSuccessModal.style.display = "none";
    const adminCard = document.querySelector(".admin-table-card-col");
    if (adminCard) {
      adminCard.scrollIntoView({ behavior: "smooth" });
    }
  });
}

// ==============================================================
// 1. INICIALIZACIÓN
// ==============================================================
function inicializarApp() {
  actualizarUIUsuario();
  actualizarBadgeCarrito();

  if (typeof isFirebaseConfigured === "function" && isFirebaseConfigured() && window.db) {
    connectionStatus.className = "status-indicator connected";
    statusText.textContent = "🟢 Conectado con Kira PET love en tiempo real";
    
    // Asegurar cuenta admin inicial sólo si no existe ningún admin
    asegurarCuentaAdminPorDefecto();

    // Oyentes en vivo
    iniciarEscuchaAjustesTienda();
    iniciarEscuchaProductosEnVivo();
    iniciarEscuchaPedidosEnVivo();
    iniciarEscuchaUsuariosEnVivo();
    iniciarEscuchaNotasAdmin();
  } else {
    connectionStatus.className = "status-indicator error";
    statusText.textContent = "Revisa las claves en firebase-config.js";
  }
}

if (document.readyState === "loading") {
  window.addEventListener("DOMContentLoaded", inicializarApp);
} else {
  inicializarApp();
}

// Cuenta administradora inicial segura
async function asegurarCuentaAdminPorDefecto() {
  try {
    const colRef = window.db.collection(USERS_COLLECTION);
    const snap = await colRef.where("rol", "==", "admin").get();
    
    if (snap.empty) {
      const snapEmail = await colRef.where("email", "==", "admin@kirapetlove.com").get();
      if (snapEmail.empty) {
        await colRef.add({
          nombre: "Administrador Kira",
          email: "admin@kirapetlove.com",
          telefono: "+54 9 11 0000-0000",
          password: "admin123",
          rol: "admin",
          fechaRegistro: firebase.firestore.FieldValue.serverTimestamp()
        });
      }
    }
  } catch (e) {
    console.error("Error al asegurar admin:", e);
  }
}

// ==============================================================
// 2. PRODUCTOS POR DEFECTO
// ==============================================================
const DEFAULT_PRODUCTS = [
  {
    titulo: "Alimento Royal Canin Perro Adulto 15kg",
    categoria: "Alimentos",
    marca: "Royal Canin",
    precio: 28500,
    stock: 15,
    emoji: "🍖",
    imagen: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=600&auto=format&fit=crop&q=80",
    destacado: true,
    vendedorNombre: "Kira Pet Oficial",
    descripcion: "Nutrición completa y balanceada para perros adultos de raza mediana. Ayuda a mantener las defensas naturales y favorece una digestión óptima con proteínas de altísima calidad."
  },
  {
    titulo: "Rascador Torre de Lujo para Gatos con Cama",
    categoria: "Camas",
    marca: "Kira Pet Confort",
    precio: 34990,
    stock: 8,
    emoji: "🛋️",
    imagen: "https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=600&auto=format&fit=crop&q=80",
    destacado: true,
    vendedorNombre: "Kira Pet Oficial",
    descripcion: "Torre rascador de 1.40m con postes de sisal natural y cubículo acolchado. Ideal para que tu gato afile sus uñas, juegue y descanse con total confort y seguridad."
  },
  {
    titulo: "Pelota Kong Classic con Dispensador de Premios",
    categoria: "Juguetes",
    marca: "KONG",
    precio: 9200,
    stock: 30,
    emoji: "🎾",
    imagen: "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=600&auto=format&fit=crop&q=80",
    destacado: true,
    vendedorNombre: "Kira Pet Oficial",
    descripcion: "Juguete de caucho natural ultra resistente para masticadores exigentes. Rebote dinámico y compartimento interno para rellenar con galletas o alimento húmedo."
  },
  {
    titulo: "Arnés Antitirones Regulable + Correa Reflectiva",
    categoria: "Accesorios",
    marca: "Kira Pet Safe",
    precio: 12400,
    stock: 20,
    emoji: "🦮",
    imagen: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&auto=format&fit=crop&q=80",
    destacado: true,
    vendedorNombre: "Kira Pet Oficial",
    descripcion: "Diseño ergonómico antitirones con tiras reflectivas de alta visibilidad para paseos seguros día y noche. Forro interior de malla transpirable acolchada."
  },
  {
    titulo: "Pipeta Antipulgas y Garrapatas Frontline Plus",
    categoria: "Salud",
    marca: "Frontline",
    precio: 8500,
    stock: 50,
    emoji: "💊",
    imagen: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=600&auto=format&fit=crop&q=80",
    destacado: false,
    vendedorNombre: "Kira Pet Oficial",
    descripcion: "Protección total por 30 días contra pulgas, garrapatas y piojos. Acción rápida y resistente al agua para perros de tamaño mediano."
  },
  {
    titulo: "Snacks Dentales Pedigree Dentastix (Pack x28)",
    categoria: "Alimentos",
    marca: "Pedigree",
    precio: 6800,
    stock: 40,
    emoji: "🦴",
    imagen: "https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=600&auto=format&fit=crop&q=80",
    destacado: false,
    vendedorNombre: "Kira Pet Oficial",
    descripcion: "Snacks dentales diarios con textura estriada única que ayuda a reducir hasta un 80% la formación de sarro en los dientes y mantener el aliento fresco."
  }
];

// ==============================================================
// 3. ESCUCHA DE PRODUCTOS EN TIEMPO REAL (onSnapshot)
// ==============================================================
function iniciarEscuchaProductosEnVivo() {
  const colRef = window.db.collection(PROD_COLLECTION);

  colRef.onSnapshot(async (snapshot) => {
    if (snapshot.empty) {
      for (const p of DEFAULT_PRODUCTS) {
        await colRef.add({
          ...p,
          fechaCreacion: firebase.firestore.FieldValue.serverTimestamp()
        });
      }
      return;
    }

    storeProducts = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      const imagenes = Array.isArray(data.imagenes) && data.imagenes.length > 0
        ? data.imagenes
        : [data.imagen || data.emoji || "🐾"];
      storeProducts.push({ id: doc.id, ...data, imagenes });
    });

    renderizarCatalogo();
    renderizarTablaAdminProductos();
    renderizarCarruselDestacados();
  });
}

// ==============================================================
// 4. RENDERIZAR CATÁLOGO
// ==============================================================
function renderizarCatalogo() {
  const search = (storeSearchInput ? storeSearchInput.value : "").trim().toLowerCase();
  const cat = currentCategory || "todos";

  const filtrados = storeProducts.filter((item) => {
    if (cat !== "todos" && item.categoria !== cat) {
      return false;
    }
    const titleMatch = item.titulo ? item.titulo.toLowerCase().includes(search) : false;
    const catMatch = item.categoria ? item.categoria.toLowerCase().includes(search) : false;
    const brandMatch = item.marca ? item.marca.toLowerCase().includes(search) : false;
    const idMatch = item.id ? item.id.toLowerCase().includes(search) : false;
    return titleMatch || catMatch || brandMatch || idMatch;
  });

  if (productsCount) {
    productsCount.textContent = `${filtrados.length} productos`;
  }
  if (!productsGrid) return;
  productsGrid.innerHTML = "";

  if (filtrados.length === 0) {
    productsGrid.innerHTML = `
      <div class="empty-state">
        <div style="font-size: 3rem;">🔍</div>
        <h3>No encontramos productos que coincidan</h3>
        <p>Prueba con otra palabra o revisa otra categoría.</p>
      </div>
    `;
    return;
  }

  filtrados.forEach((prod) => {
    const card = document.createElement("div");
    card.className = "product-card";

    const formattedPrice = Number(prod.precio).toLocaleString("es-AR");

    card.innerHTML = `
      <div class="product-emoji-img">${getProductMediaHtml(prod.imagen || prod.emoji, prod.titulo)}</div>
      <div class="product-category-tag">${escapeHtml(prod.categoria)}</div>
      <h3 class="product-title">${escapeHtml(prod.titulo)}</h3>
      
      <div class="product-price-row">
        <div class="product-price">$ ${formattedPrice}</div>
        <div class="product-shipping">⚡ Envío Pet Express</div>
        <div class="product-stock">Stock disponible: ${prod.stock} u.</div>
        <div class="product-card-btns">
          <button class="btn btn-sm btn-secondary btn-quick-detail" data-id="${prod.id}" style="flex: 1;">👁️ Detalle</button>
          <button class="btn-add-cart" data-id="${prod.id}" style="flex: 2; margin-top: 0;">Agregar</button>
        </div>
      </div>
    `;

    card.addEventListener("click", () => {
      abrirDetalleProducto(prod);
    });

    card.querySelector(".btn-quick-detail").addEventListener("click", (e) => {
      e.stopPropagation();
      abrirDetalleProducto(prod);
    });

    // CONDICIÓN EXCLUSIVA: SI NO ESTÁ REGISTRADO/LOGUEADO, MANDA AL REGISTRO
    card.querySelector(".btn-add-cart").addEventListener("click", (e) => {
      e.stopPropagation();

      if (!currentUser) {
        showToast("🐾 Creá tu cuenta o ingresá para agregar productos al carrito");
        registerModal.style.display = "flex";
        return;
      }

      agregarAlCarrito(prod);
    });

    productsGrid.appendChild(card);
  });
}

catPills.forEach((btn) => {
  btn.addEventListener("click", () => {
    catPills.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentCategory = btn.getAttribute("data-cat") || "todos";
    if (currentCategoryTitle) currentCategoryTitle.textContent = btn.textContent;
    renderizarCatalogo();
  });
});

storeSearchBtn.addEventListener("click", renderizarCatalogo);
storeSearchInput.addEventListener("input", renderizarCatalogo);

// ==============================================================
// 4.1 CARRUSEL DE PRODUCTOS DESTACADOS ADMINISTRABLE
// ==============================================================
function renderizarCarruselDestacados() {
  if (!featuredCarouselTrack) return;
  featuredCarouselTrack.innerHTML = "";
  if (carouselDots) carouselDots.innerHTML = "";

  const destacados = storeProducts.filter((p) => p.destacado !== false);
  const items = destacados.length > 0 ? destacados : storeProducts.slice(0, 4);

  if (items.length === 0) {
    featuredCarouselTrack.innerHTML = `<p style="padding: 24px; color: #64748b; text-align: center; width: 100%;">No hay productos en el carrusel aún. Elige productos desde Mis Productos para destacarlos aquí.</p>`;
    return;
  }

  items.forEach((prod, idx) => {
    const card = document.createElement("div");
    card.className = "carousel-card";
    card.innerHTML = `
      <div class="carousel-card-img">
        ${getProductMediaHtml(prod.imagen || prod.emoji, prod.titulo)}
      </div>
      <span class="carousel-card-tag">${escapeHtml(prod.categoria)}</span>
      <h4 class="carousel-card-title">${escapeHtml(prod.titulo)}</h4>
      <div class="carousel-card-price">$ ${Number(prod.precio).toLocaleString("es-AR")}</div>
      <button class="btn btn-sm btn-primary carousel-view-btn" data-id="${prod.id}">
        👁️ Ver detalle
      </button>
    `;

    card.addEventListener("click", () => abrirDetalleProducto(prod));
    card.querySelector(".carousel-view-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      abrirDetalleProducto(prod);
    });

    featuredCarouselTrack.appendChild(card);

    if (carouselDots) {
      const dot = document.createElement("div");
      dot.className = `carousel-dot ${idx === 0 ? 'active' : ''}`;
      dot.addEventListener("click", () => moverCarrusel(idx));
      carouselDots.appendChild(dot);
    }
  });

  iniciarAutoPlayCarrusel(items.length);
}

function moverCarrusel(indice) {
  const items = storeProducts.filter((p) => p.destacado !== false);
  const total = items.length > 0 ? items.length : storeProducts.slice(0, 4).length;
  if (total === 0) return;

  carouselIndex = (indice + total) % total;

  // Cálculo dinámico del desplazamiento para que sea 100% responsivo en cualquier pantalla
  const firstCard = featuredCarouselTrack ? featuredCarouselTrack.querySelector(".carousel-card") : null;
  const gap = window.innerWidth <= 640 ? 10 : 16;
  const cardWidth = firstCard ? (firstCard.offsetWidth + gap) : (window.innerWidth <= 640 ? 200 : 266);

  if (featuredCarouselTrack) {
    featuredCarouselTrack.style.transform = `translateX(-${carouselIndex * cardWidth}px)`;
  }

  if (carouselDots) {
    const dots = carouselDots.querySelectorAll(".carousel-dot");
    dots.forEach((d, i) => {
      d.classList.toggle("active", i === carouselIndex);
    });
  }
}

function iniciarAutoPlayCarrusel(total) {
  clearInterval(carouselAutoPlayTimer);
  if (total <= 1) return;
  carouselAutoPlayTimer = setInterval(() => {
    moverCarrusel(carouselIndex + 1);
  }, 4500);
}

if (carouselPrevBtn) {
  carouselPrevBtn.addEventListener("click", () => {
    moverCarrusel(carouselIndex - 1);
  });
}

if (carouselNextBtn) {
  carouselNextBtn.addEventListener("click", () => {
    moverCarrusel(carouselIndex + 1);
  });
}

// Soporte táctil / touch swipe en celular para el carrusel
let touchStartX = 0;
let touchEndX = 0;
if (featuredCarouselWrapper) {
  featuredCarouselWrapper.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  featuredCarouselWrapper.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 35) {
      if (diff > 0) {
        moverCarrusel(carouselIndex + 1);
      } else {
        moverCarrusel(carouselIndex - 1);
      }
    }
  }, { passive: true });
}

window.addEventListener("resize", () => {
  moverCarrusel(carouselIndex);
});

// ==============================================================
// 4.2 MODAL DETALLE DE PRODUCTO PARA COMPRADORES & GALERÍA MULTI-IMAGEN
// ==============================================================
function abrirDetalleProducto(prod) {
  if (!prod) return;
  currentDetailProduct = prod;
  currentDetailQty = 1;

  // Extraer array de hasta 5 imágenes del producto
  currentDetailImages = Array.isArray(prod.imagenes) && prod.imagenes.length > 0
    ? prod.imagenes
    : [prod.imagen || prod.emoji || "🐾"];
  currentDetailImgIndex = 0;

  if (detailProdCategoryTag) detailProdCategoryTag.textContent = prod.categoria || "Mascotas";
  if (detailProdBrand) detailProdBrand.textContent = prod.marca || (prod.vendedorNombre || "Kira Pet Oficial");
  if (detailProdTitle) detailProdTitle.textContent = prod.titulo;
  if (detailProdPrice) detailProdPrice.textContent = `$ ${Number(prod.precio).toLocaleString("es-AR")}`;
  if (detailProdStockBadge) {
    detailProdStockBadge.textContent = prod.stock > 0 ? `🟢 En Stock (${prod.stock} disponibles)` : `🔴 Sin stock`;
  }
  if (detailProdDescText) {
    detailProdDescText.textContent = prod.descripcion || "Producto seleccionado especialmente para el bienestar y cuidado de tu mascota con los más altos estándares de calidad.";
  }

  // Mostrar el ID único del producto en el encabezado del modal de detalle
  if (detailProdIdBadge) {
    detailProdIdBadge.textContent = `#${prod.id}`;
    detailProdIdBadge.dataset.id = prod.id;
  }

  actualizarImagenPrincipalDetalle(0);
  renderizarMiniaturasDetalle();

  if (detailQtyVal) detailQtyVal.textContent = "1";
  if (productDetailModal) productDetailModal.style.display = "flex";
}

function actualizarImagenPrincipalDetalle(idx) {
  currentDetailImgIndex = idx;
  if (detailImgBox && currentDetailImages[idx]) {
    detailImgBox.innerHTML = `
      ${getProductMediaHtml(currentDetailImages[idx], currentDetailProduct.titulo)}
      <span class="detail-zoom-badge">🔍 Haz clic para ampliar</span>
    `;
  }

  // Marcar activa la miniatura correspondiente
  if (detailThumbnailsStrip) {
    const thumbs = detailThumbnailsStrip.querySelectorAll(".detail-thumb-item");
    thumbs.forEach((th, i) => {
      th.classList.toggle("active", i === idx);
    });
  }
}

function renderizarMiniaturasDetalle() {
  if (!detailThumbnailsStrip) return;
  detailThumbnailsStrip.innerHTML = "";

  if (currentDetailImages.length <= 1) {
    detailThumbnailsStrip.style.display = "none";
    return;
  }
  detailThumbnailsStrip.style.display = "flex";

  currentDetailImages.forEach((imgSrc, idx) => {
    const thumb = document.createElement("div");
    thumb.className = `detail-thumb-item ${idx === currentDetailImgIndex ? 'active' : ''}`;
    thumb.title = `Ver foto ${idx + 1}`;
    thumb.innerHTML = getProductMediaHtml(imgSrc, `Foto ${idx + 1}`);

    thumb.addEventListener("click", () => {
      actualizarImagenPrincipalDetalle(idx);
    });

    detailThumbnailsStrip.appendChild(thumb);
  });
}

// Abrir lightbox al hacer clic en la foto principal de detalle
if (detailImgBox) {
  detailImgBox.addEventListener("click", () => {
    abrirLightbox(currentDetailImgIndex);
  });
}

// Funciones del Visor Lightbox a Pantalla Completa
function abrirLightbox(idx) {
  if (!currentDetailImages || currentDetailImages.length === 0) return;
  lightboxCurrentIndex = idx || 0;
  actualizarContenidoLightbox();
  if (imageLightboxModal) imageLightboxModal.style.display = "flex";
}

function cerrarLightbox() {
  const imgEl = document.getElementById("lightboxImgEl");
  if (imgEl) {
    imgEl.classList.remove("zoomed");
    imgEl.style.transformOrigin = "center center";
  }
  if (imageLightboxModal) imageLightboxModal.style.display = "none";
}

function actualizarContenidoLightbox() {
  if (!lightboxMediaContainer) return;
  const currentImg = currentDetailImages[lightboxCurrentIndex] || "🐾";
  const isUrl = currentImg.startsWith("http://") || currentImg.startsWith("https://") || currentImg.startsWith("data:image");

  if (isUrl) {
    lightboxMediaContainer.innerHTML = `<img src="${escapeHtml(currentImg)}" alt="Foto ampliada" id="lightboxImgEl">`;
    const imgEl = document.getElementById("lightboxImgEl");
    if (imgEl) {
      let isZoomed = false;

      // Zoom focal exactamente en el punto donde el usuario hace clic
      imgEl.addEventListener("click", (e) => {
        const rect = imgEl.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;
        const percentX = Math.max(0, Math.min(100, (clickX / rect.width) * 100));
        const percentY = Math.max(0, Math.min(100, (clickY / rect.height) * 100));

        if (!isZoomed) {
          isZoomed = true;
          imgEl.style.transformOrigin = `${percentX}% ${percentY}%`;
          imgEl.classList.add("zoomed");
        } else {
          isZoomed = false;
          imgEl.classList.remove("zoomed");
          imgEl.style.transformOrigin = "center center";
        }
      });

      // Desplazamiento fluido siguiendo el cursor mientras el zoom está activo
      imgEl.addEventListener("mousemove", (e) => {
        if (!isZoomed) return;
        const cRect = lightboxMediaContainer.getBoundingClientRect();
        const percentX = Math.max(0, Math.min(100, ((e.clientX - cRect.left) / cRect.width) * 100));
        const percentY = Math.max(0, Math.min(100, ((e.clientY - cRect.top) / cRect.height) * 100));
        imgEl.style.transformOrigin = `${percentX}% ${percentY}%`;
      });

      // Soporte táctil móvil para zoom en el punto tocado
      imgEl.addEventListener("touchend", (e) => {
        if (e.changedTouches.length === 1) {
          const touch = e.changedTouches[0];
          const rect = imgEl.getBoundingClientRect();
          const clickX = touch.clientX - rect.left;
          const clickY = touch.clientY - rect.top;
          const percentX = Math.max(0, Math.min(100, (clickX / rect.width) * 100));
          const percentY = Math.max(0, Math.min(100, (clickY / rect.height) * 100));

          if (!isZoomed) {
            isZoomed = true;
            imgEl.style.transformOrigin = `${percentX}% ${percentY}%`;
            imgEl.classList.add("zoomed");
          } else {
            isZoomed = false;
            imgEl.classList.remove("zoomed");
            imgEl.style.transformOrigin = "center center";
          }
        }
      });
    }
  } else {
    lightboxMediaContainer.innerHTML = `<span>${escapeHtml(currentImg)}</span>`;
  }

  if (lightboxCounter) {
    lightboxCounter.textContent = `${lightboxCurrentIndex + 1} / ${currentDetailImages.length}`;
  }
  if (lightboxProductTitle && currentDetailProduct) {
    lightboxProductTitle.textContent = currentDetailProduct.titulo;
  }

  const showNav = currentDetailImages.length > 1;
  if (lightboxPrevBtn) lightboxPrevBtn.style.display = showNav ? "flex" : "none";
  if (lightboxNextBtn) lightboxNextBtn.style.display = showNav ? "flex" : "none";
}

if (closeLightboxBtn) closeLightboxBtn.addEventListener("click", cerrarLightbox);
if (imageLightboxModal) {
  imageLightboxModal.addEventListener("click", (e) => {
    if (e.target === imageLightboxModal) cerrarLightbox();
  });
}

if (lightboxPrevBtn) {
  lightboxPrevBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    lightboxCurrentIndex = (lightboxCurrentIndex - 1 + currentDetailImages.length) % currentDetailImages.length;
    actualizarContenidoLightbox();
  });
}

if (lightboxNextBtn) {
  lightboxNextBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    lightboxCurrentIndex = (lightboxCurrentIndex + 1) % currentDetailImages.length;
    actualizarContenidoLightbox();
  });
}

// Navegación con teclado en Lightbox
window.addEventListener("keydown", (e) => {
  if (imageLightboxModal && imageLightboxModal.style.display === "flex") {
    if (e.key === "Escape") {
      cerrarLightbox();
    } else if (e.key === "ArrowLeft" && currentDetailImages.length > 1) {
      lightboxCurrentIndex = (lightboxCurrentIndex - 1 + currentDetailImages.length) % currentDetailImages.length;
      actualizarContenidoLightbox();
    } else if (e.key === "ArrowRight" && currentDetailImages.length > 1) {
      lightboxCurrentIndex = (lightboxCurrentIndex + 1) % currentDetailImages.length;
      actualizarContenidoLightbox();
    }
  }
});

if (closeDetailModalBtn) {
  closeDetailModalBtn.addEventListener("click", () => {
    productDetailModal.style.display = "none";
  });
}

if (detailQtyMinus) {
  detailQtyMinus.addEventListener("click", () => {
    if (currentDetailQty > 1) {
      currentDetailQty--;
      detailQtyVal.textContent = currentDetailQty;
    }
  });
}

if (detailQtyPlus) {
  detailQtyPlus.addEventListener("click", () => {
    if (currentDetailProduct && currentDetailQty < (currentDetailProduct.stock || 99)) {
      currentDetailQty++;
      detailQtyVal.textContent = currentDetailQty;
    }
  });
}

if (detailAddCartBtn) {
  detailAddCartBtn.addEventListener("click", () => {
    if (!currentUser) {
      showToast("🐾 Creá tu cuenta o ingresá para agregar productos al carrito");
      productDetailModal.style.display = "none";
      registerModal.style.display = "flex";
      return;
    }

    if (currentDetailProduct) {
      for (let i = 0; i < currentDetailQty; i++) {
        agregarAlCarrito(currentDetailProduct);
      }
      productDetailModal.style.display = "none";
    }
  });
}

// ==============================================================
// 4.3 AJUSTES DE TIENDA Y LOGO EN TIEMPO REAL
// ==============================================================
const SETTINGS_COLLECTION = "kira_ajustes";
const SETTINGS_DOC = "configuracion";

function iniciarEscuchaAjustesTienda() {
  window.db.collection(SETTINGS_COLLECTION).doc(SETTINGS_DOC).onSnapshot((doc) => {
    if (doc.exists) {
      const data = doc.data();
      aplicarAjustesTienda(data);
    }
  });
}

function aplicarAjustesTienda(data) {
  if (!data) return;
  const logo = data.logo || "🐾";
  const nombre = data.nombre || "Kira PET love";
  const sub = data.subtitulo || "Tu Pet Shop Online";

  if (headerLogoTitle) headerLogoTitle.textContent = nombre;
  if (headerLogoSub) headerLogoSub.textContent = sub;
  document.title = `${nombre} - ${sub}`;

  if (headerLogoIcon) {
    const isUrl = logo.startsWith("http://") || logo.startsWith("https://") || logo.startsWith("data:image");
    if (isUrl) {
      headerLogoIcon.innerHTML = `<img src="${escapeHtml(logo)}" alt="Logo" class="logo-icon-img" style="width:100%; height:100%; max-width:100%; max-height:100%; object-fit:contain; display:block;">`;
    } else {
      headerLogoIcon.textContent = logo;
    }
  }

  if (storeNameInput) storeNameInput.value = nombre;
  if (storeSubInput) storeSubInput.value = sub;
  if (storeLogoPreviewBox) {
    const isUrl = logo.startsWith("http://") || logo.startsWith("https://") || logo.startsWith("data:image");
    if (isUrl) {
      storeLogoPreviewBox.innerHTML = `<img src="${escapeHtml(logo)}" alt="Logo">`;
    } else {
      storeLogoPreviewBox.innerHTML = `<span style="font-size:2.8rem;">${escapeHtml(logo)}</span>`;
    }
  }
}

// Listeners de subida de Logo desde PC
if (storeLogoFileInput) {
  storeLogoFileInput.addEventListener("change", (e) => {
    if (e.target.files && e.target.files[0]) {
      leerYComprimirImagen(e.target.files[0], (dataUrl) => {
        storeLogoBase64 = dataUrl;
        if (storeLogoPreviewBox) {
          storeLogoPreviewBox.innerHTML = `<img src="${dataUrl}" alt="Logo Preview" style="width:100%; height:100%; max-width:100%; max-height:100%; object-fit:contain; display:block;">`;
        }
      }, 300, 0.85);
    }
  });
}

if (storeSettingsForm) {
  storeSettingsForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const logo = storeLogoBase64 || (storeLogoUrlInput ? storeLogoUrlInput.value.trim() : "") || "🐾";
    const nombre = storeNameInput ? storeNameInput.value.trim() : "Kira PET love";
    const subtitulo = storeSubInput ? storeSubInput.value.trim() : "Tu Pet Shop Online";

    try {
      await window.db.collection(SETTINGS_COLLECTION).doc(SETTINGS_DOC).set({
        logo,
        nombre,
        subtitulo,
        fechaActualizacion: firebase.firestore.FieldValue.serverTimestamp()
      }, { merge: true });

      showToast("✅ Logo y configuración de tienda guardados con éxito");
      storeSettingsModal.style.display = "none";
      storeLogoBase64 = "";
    } catch (err) {
      showToast(`❌ Error: ${err.message}`);
    }
  });
}

if (adminBarSettingsBtn) {
  adminBarSettingsBtn.addEventListener("click", () => {
    cerrarTodosLosDropdownsAdmin();
    storeSettingsModal.style.display = "flex";
  });
}
if (adminBarProfileBtn) {
  adminBarProfileBtn.addEventListener("click", () => {
    cerrarTodosLosDropdownsAdmin();
    if (!currentUser) return;
    if (profName) profName.value = currentUser.nombre || "";
    if (profEmail) profEmail.value = currentUser.email || "";
    if (profPhone) profPhone.value = currentUser.telefono || "";
    if (profPassword) profPassword.value = "";
    if (profileModal) profileModal.style.display = "flex";
  });
}
if (closeStoreSettingsBtn) {
  closeStoreSettingsBtn.addEventListener("click", () => {
    storeSettingsModal.style.display = "none";
  });
}
if (cancelStoreSettingsBtn) {
  cancelStoreSettingsBtn.addEventListener("click", () => {
    storeSettingsModal.style.display = "none";
  });
}

// Listeners de subida multi-imagen (hasta 5 fotos) para Nuevo Producto
if (prodImageFilesInput) {
  prodImageFilesInput.addEventListener("change", (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    for (const file of files) {
      if (newProductImages.length >= 5) {
        showToast("⚠️ Máximo 5 fotos por publicación");
        break;
      }
      leerYComprimirImagen(file, (dataUrl) => {
        if (newProductImages.length < 5) {
          newProductImages.push(dataUrl);
          renderizarPreviewGaleriaNuevo();
        }
      }, 800, 0.70);
    }
    prodImageFilesInput.value = "";
  });
}

if (btnAddImageUrlBtn) {
  btnAddImageUrlBtn.addEventListener("click", () => {
    if (!prodImageUrlInput) return;
    const val = prodImageUrlInput.value.trim();
    if (!val) {
      showToast("⚠️ Escribe un enlace web de imagen o un emoji");
      return;
    }
    if (newProductImages.length >= 5) {
      showToast("⚠️ Ya alcanzaste el límite de 5 fotos");
      return;
    }
    newProductImages.push(val);
    prodImageUrlInput.value = "";
    renderizarPreviewGaleriaNuevo();
  });
}

// Listeners de subida multi-imagen para Editar Producto
if (editProdImageFilesInput) {
  editProdImageFilesInput.addEventListener("change", (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    for (const file of files) {
      if (editProductImages.length >= 5) {
        showToast("⚠️ Máximo 5 fotos por publicación");
        break;
      }
      leerYComprimirImagen(file, (dataUrl) => {
        if (editProductImages.length < 5) {
          editProductImages.push(dataUrl);
          renderizarPreviewGaleriaEditar();
        }
      }, 800, 0.70);
    }
    editProdImageFilesInput.value = "";
  });
}

if (btnEditAddImageUrlBtn) {
  btnEditAddImageUrlBtn.addEventListener("click", () => {
    if (!editProdImageUrlInput) return;
    const val = editProdImageUrlInput.value.trim();
    if (!val) {
      showToast("⚠️ Escribe un enlace o un emoji");
      return;
    }
    if (editProductImages.length >= 5) {
      showToast("⚠️ Ya alcanzaste el límite de 5 fotos");
      return;
    }
    editProductImages.push(val);
    editProdImageUrlInput.value = "";
    renderizarPreviewGaleriaEditar();
  });
}

// ==============================================================
// 5. AUTENTICACIÓN SEGURA Y ROLES DINÁMICOS
// ==============================================================
function actualizarUIUsuario() {
  if (currentUser) {
    userLoggedOut.style.display = "none";
    userLoggedIn.style.display = "flex";
    userNameNav.textContent = currentUser.nombre;

    const rol = (currentUser.rol || "comprador").toLowerCase();
    const isStaff = rol === "admin" || rol === "administrador" || rol === "vendedor";
    const isAdmin = rol === "admin" || rol === "administrador";
    userRoleBadge.textContent = rol;
    userRoleBadge.className = `role-badge role-${rol}`;

    // Si es Admin o Vendedor, se activan sus botones directamente en la barra superior señalada
    if (isStaff) {
      adminNavHeaderBar.style.display = "flex";
      if (adminClientsDropdownContainer) adminClientsDropdownContainer.style.display = "inline-block";
      if (adminSettingsDropdownContainer) adminSettingsDropdownContainer.style.display = "inline-block";
      if (adminBarOrdersBtn) adminBarOrdersBtn.style.display = "flex";
      if (adminBarUsersBtn) adminBarUsersBtn.style.display = isAdmin ? "flex" : "none";
      if (adminBarSettingsBtn) adminBarSettingsBtn.style.display = "flex";
      if (adminBarProfileBtn) adminBarProfileBtn.style.display = "flex";
      if (adminBarStatsBtn) adminBarStatsBtn.style.display = "inline-flex";
      if (adminBarNotesBtn) adminBarNotesBtn.style.display = "inline-flex";
      if (adminBarMyOrdersBtn) adminBarMyOrdersBtn.style.display = "flex";
      openMyOrdersBtn.style.display = "none";
      // Si la tienda está activa, mostrar también la barra de categorías para que el admin pueda filtrar
      if (storeView && storeView.style.display !== "none") {
        buyerCategoriesBar.style.display = "flex";
        if (floatingLeftCartBtn) floatingLeftCartBtn.style.display = "flex";
      } else {
        buyerCategoriesBar.style.display = "none";
        if (floatingLeftCartBtn) floatingLeftCartBtn.style.display = "none";
      }
    } else {
      buyerCategoriesBar.style.display = "flex";
      adminNavHeaderBar.style.display = "none";
      if (adminClientsDropdownContainer) adminClientsDropdownContainer.style.display = "none";
      if (adminSettingsDropdownContainer) adminSettingsDropdownContainer.style.display = "none";
      if (adminBarStatsBtn) adminBarStatsBtn.style.display = "none";
      if (adminBarNotesBtn) adminBarNotesBtn.style.display = "none";
      openMyOrdersBtn.style.display = "inline-flex";
      if (floatingLeftCartBtn) floatingLeftCartBtn.style.display = "flex";
    }
    renderizarMisCompras();
  } else {
    userLoggedOut.style.display = "flex";
    userLoggedIn.style.display = "none";
    buyerCategoriesBar.style.display = "flex";
    adminNavHeaderBar.style.display = "none";
    if (adminClientsDropdownContainer) adminClientsDropdownContainer.style.display = "none";
    if (adminSettingsDropdownContainer) adminSettingsDropdownContainer.style.display = "none";
    if (buyerActiveOrderBanner) buyerActiveOrderBanner.style.display = "none";
    if (floatingLeftCartBtn) floatingLeftCartBtn.style.display = "flex";
  }
}

// Modales abrir / cerrar
openRegisterBtn.addEventListener("click", () => (registerModal.style.display = "flex"));
closeRegisterBtn.addEventListener("click", () => (registerModal.style.display = "none"));
openLoginBtn.addEventListener("click", () => (loginModal.style.display = "flex"));
closeLoginBtn.addEventListener("click", () => (loginModal.style.display = "none"));

// Alternar entre registro y login desde los enlaces dentro de los modales
const switchToLoginLink = document.getElementById("switchToLoginLink");
const switchToRegisterLink = document.getElementById("switchToRegisterLink");
if (switchToLoginLink) {
  switchToLoginLink.addEventListener("click", (e) => {
    e.preventDefault();
    registerModal.style.display = "none";
    loginModal.style.display = "flex";
  });
}
if (switchToRegisterLink) {
  switchToRegisterLink.addEventListener("click", (e) => {
    e.preventDefault();
    loginModal.style.display = "none";
    registerModal.style.display = "flex";
  });
}

// Abrir modal de Mi Perfil
openProfileBtn.addEventListener("click", () => {
  if (!currentUser) return;
  profName.value = currentUser.nombre || "";
  profEmail.value = currentUser.email || "";
  profPhone.value = currentUser.telefono || "";
  profPassword.value = "";
  profileModal.style.display = "flex";
});

closeProfileBtn.addEventListener("click", () => {
  profileModal.style.display = "none";
});

// Cerrar modales al hacer clic en el fondo oscuro
window.addEventListener("click", (e) => {
  if (e.target.classList.contains("modal-backdrop") && e.target.id !== "cartModal") {
    e.target.style.display = "none";
  }
});

logoutBtn.addEventListener("click", () => {
  currentUser = null;
  localStorage.removeItem("kira_user");
  localStorage.removeItem("kira_cart");
  cart = [];
  window.location.reload();
});

// Guardar cambios en "Mi Perfil"
userProfileForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!currentUser || !currentUser.id) {
    showToast("⚠️ Error al identificar usuario");
    return;
  }

  saveProfileBtn.disabled = true;
  saveProfileBtn.textContent = "Guardando cambios...";

  const nuevoNombre = profName.value.trim();
  const nuevoEmail = profEmail.value.trim().toLowerCase();
  const nuevoTelefono = profPhone.value.trim();
  const nuevaClave = profPassword.value.trim();

  try {
    const updateData = {
      nombre: nuevoNombre,
      email: nuevoEmail,
      telefono: nuevoTelefono
    };

    if (nuevaClave) {
      updateData.password = nuevaClave;
    }

    await window.db.collection(USERS_COLLECTION).doc(currentUser.id).update(updateData);

    currentUser.nombre = nuevoNombre;
    currentUser.email = nuevoEmail;
    currentUser.telefono = nuevoTelefono;
    localStorage.setItem("kira_user", JSON.stringify(currentUser));

    actualizarUIUsuario();
    profileModal.style.display = "none";
    showToast("✅ ¡Perfil y credenciales actualizadas con éxito!");
  } catch (err) {
    console.error("Error al actualizar perfil:", err);
    showToast(`❌ Error: ${err.message}`);
  } finally {
    saveProfileBtn.disabled = false;
    saveProfileBtn.textContent = "Guardar Cambios de Perfil";
  }
});

// REGISTRO DE CUENTA
authRegisterForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nombre = document.getElementById("regName").value.trim();
  const email = document.getElementById("regEmail").value.trim().toLowerCase();
  const telefono = document.getElementById("regPhone").value.trim();
  const password = document.getElementById("regPassword").value;
  // Todo usuario nuevo entra como Comprador por defecto. Solo el Administrador puede asignarle rol de Vendedor.
  const rol = "comprador";

  const btn = document.getElementById("regSubmitBtn");
  btn.disabled = true;
  btn.textContent = "Creando cuenta...";

  try {
    const existeSnap = await window.db.collection(USERS_COLLECTION).where("email", "==", email).get();
    if (!existeSnap.empty) {
      showToast("⚠️ Ya existe una cuenta con ese correo electrónico");
      btn.disabled = false;
      btn.textContent = "Registrarme";
      return;
    }

    const docRef = await window.db.collection(USERS_COLLECTION).add({
      nombre,
      email,
      telefono,
      password,
      rol,
      fechaRegistro: firebase.firestore.FieldValue.serverTimestamp()
    });

    currentUser = { id: docRef.id, nombre, email, telefono, rol };
    localStorage.setItem("kira_user", JSON.stringify(currentUser));
    cart = JSON.parse(localStorage.getItem(`kira_cart_${currentUser.email}`)) || [];
    actualizarBadgeCarrito();
    actualizarUIUsuario();

    registerModal.style.display = "none";
    authRegisterForm.reset();
    showToast(`🎉 ¡Bienvenido/a a Kira PET love, ${nombre}! Ya podés comprar.`);
  } catch (err) {
    if (err.message && err.message.includes("exceeds the maximum allowed size")) {
      showToast("❌ Las fotos superan el límite de 1MB de Firebase. Sube menos fotos o fotos más ligeras.");
    } else {
      showToast(`❌ Error: ${err.message}`);
    }
  } finally {
    btn.disabled = false;
    btn.textContent = "Registrarme";
  }
});

// INICIO DE SESIÓN ÚNICO
authLoginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("loginEmail").value.trim().toLowerCase();
  const password = document.getElementById("loginPassword").value;
  const btn = document.getElementById("loginSubmitBtn");

  btn.disabled = true;
  btn.textContent = "Verificando credenciales...";

  try {
    const snap = await window.db
      .collection(USERS_COLLECTION)
      .where("email", "==", email)
      .where("password", "==", password)
      .get();

    if (snap.empty) {
      showToast("❌ Correo o contraseña incorrectos");
      btn.disabled = false;
      btn.textContent = "Ingresar";
      return;
    }

    const docSnap = snap.docs[0];
    const data = docSnap.data();

    currentUser = {
      id: docSnap.id,
      nombre: data.nombre,
      email: data.email,
      telefono: data.telefono,
      rol: data.rol || "comprador"
    };

    localStorage.setItem("kira_user", JSON.stringify(currentUser));
    cart = JSON.parse(localStorage.getItem(`kira_cart_${currentUser.email}`)) || [];
    actualizarBadgeCarrito();
    actualizarUIUsuario();

    loginModal.style.display = "none";
    authLoginForm.reset();

    showToast(`👋 ¡Bienvenido/a ${currentUser.nombre}! (${currentUser.rol.toUpperCase()})`);

    if (currentUser.rol === "admin" || currentUser.rol === "vendedor") {
      mostrarMisProductos();
    }
  } catch (err) {
    if (err.message && err.message.includes("exceeds the maximum allowed size")) {
      showToast("❌ Las fotos superan el límite de 1MB de Firebase. Sube menos fotos o fotos más ligeras.");
    } else {
      showToast(`❌ Error: ${err.message}`);
    }
  } finally {
    btn.disabled = false;
    btn.textContent = "Ingresar";
  }
});

// ==============================================================
// 6. NAVEGACIÓN DIRECTA DESDE LA BARRA SUPERIOR
// ==============================================================
function ocultarTodasLasVistas() {
  storeView.style.display = "none";
  productsManagementView.style.display = "none";
  ordersManagementView.style.display = "none";
  usersManagementView.style.display = "none";
  myOrdersView.style.display = "none";
  if (analyticsManagementView) analyticsManagementView.style.display = "none";
  if (notesManagementView) notesManagementView.style.display = "none";
  if (floatingLeftCartBtn) floatingLeftCartBtn.style.display = "none";
  // Ocultar barra de categorías de comprador si estamos en secciones de gestión
  if (buyerCategoriesBar && currentUser && (currentUser.rol === "admin" || currentUser.rol === "vendedor")) {
    buyerCategoriesBar.style.display = "none";
  }
}

function cerrarTodosLosDropdownsAdmin() {
  if (adminBarClientsDropdownMenu) adminBarClientsDropdownMenu.style.display = "none";
  if (adminBarClientsDropdownBtn) adminBarClientsDropdownBtn.classList.remove("active");
  if (adminBarSettingsDropdownMenu) adminBarSettingsDropdownMenu.style.display = "none";
  if (adminBarSettingsDropdownBtn) adminBarSettingsDropdownBtn.classList.remove("active");
}

function marcarBotonAdminActivo(btn) {
  [adminBarStoreBtn, adminBarProductsBtn, adminBarStatsBtn, adminBarNotesBtn, adminBarClientsDropdownBtn, adminBarSettingsDropdownBtn].forEach((b) => {
    if (b) b.classList.remove("active");
  });
  if (btn) {
    if (btn === adminBarOrdersBtn || btn === adminBarUsersBtn || btn === adminBarMyOrdersBtn) {
      if (adminBarClientsDropdownBtn) adminBarClientsDropdownBtn.classList.add("active");
    } else if (btn === adminBarSettingsBtn || btn === adminBarProfileBtn) {
      if (adminBarSettingsDropdownBtn) adminBarSettingsDropdownBtn.classList.add("active");
    } else {
      btn.classList.add("active");
    }
  }
}

function mostrarTienda() {
  ocultarTodasLasVistas();
  cerrarTodosLosDropdownsAdmin();
  storeView.style.display = "block";
  marcarBotonAdminActivo(adminBarStoreBtn);
  if (buyerCategoriesBar) buyerCategoriesBar.style.display = "flex";
  if (floatingLeftCartBtn) floatingLeftCartBtn.style.display = "flex";
  currentCategory = "todos";
  if (currentCategoryTitle) currentCategoryTitle.textContent = "Catálogo de Productos para Mascotas";
  if (catPills) {
    catPills.forEach((b) => {
      b.classList.toggle("active", b.getAttribute("data-cat") === "todos");
    });
  }
  renderizarCatalogo();
  renderizarCarruselDestacados();
}

function mostrarMisProductos() {
  ocultarTodasLasVistas();
  cerrarTodosLosDropdownsAdmin();
  productsManagementView.style.display = "block";
  marcarBotonAdminActivo(adminBarProductsBtn);
  renderizarTablaAdminProductos();
}

function mostrarPedidosClientes() {
  ocultarTodasLasVistas();
  cerrarTodosLosDropdownsAdmin();
  ordersManagementView.style.display = "block";
  marcarBotonAdminActivo(adminBarOrdersBtn);
  renderizarTablaAdminPedidos();
}

function mostrarGestionUsuarios() {
  ocultarTodasLasVistas();
  cerrarTodosLosDropdownsAdmin();
  usersManagementView.style.display = "block";
  marcarBotonAdminActivo(adminBarUsersBtn);
  renderizarTablaUsuariosAdmin();
}

function mostrarMetricasYGanancias() {
  ocultarTodasLasVistas();
  cerrarTodosLosDropdownsAdmin();
  if (analyticsManagementView) analyticsManagementView.style.display = "block";
  marcarBotonAdminActivo(adminBarStatsBtn);
  actualizarPanelMetricasYGanancias();
}

function mostrarMisNotas() {
  ocultarTodasLasVistas();
  cerrarTodosLosDropdownsAdmin();
  if (notesManagementView) notesManagementView.style.display = "block";
  marcarBotonAdminActivo(adminBarNotesBtn);
  renderizarTableroNotas();
}

function abrirMisCompras() {
  if (!currentUser) {
    showToast("🐾 Creá tu cuenta o ingresá para ver tus compras");
    registerModal.style.display = "flex";
    return;
  }
  ocultarTodasLasVistas();
  cerrarTodosLosDropdownsAdmin();
  myOrdersView.style.display = "block";
  if (currentUser && (currentUser.rol === "admin" || currentUser.rol === "vendedor")) {
    marcarBotonAdminActivo(adminBarMyOrdersBtn);
  }
  renderizarMisCompras();
}

// Menú desplegable 1: Clientes y Pedidos
if (adminBarClientsDropdownBtn && adminBarClientsDropdownMenu) {
  adminBarClientsDropdownBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const isVisible = adminBarClientsDropdownMenu.style.display === "flex";
    cerrarTodosLosDropdownsAdmin();
    if (!isVisible) {
      adminBarClientsDropdownMenu.style.display = "flex";
      adminBarClientsDropdownBtn.classList.add("active");
    }
  });
}

// Menú desplegable 2: Configuración de Cuenta
if (adminBarSettingsDropdownBtn && adminBarSettingsDropdownMenu) {
  adminBarSettingsDropdownBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const isVisible = adminBarSettingsDropdownMenu.style.display === "flex";
    cerrarTodosLosDropdownsAdmin();
    if (!isVisible) {
      adminBarSettingsDropdownMenu.style.display = "flex";
      adminBarSettingsDropdownBtn.classList.add("active");
    }
  });
}

// Clic fuera para cerrar ambos menús
document.addEventListener("click", (e) => {
  const insideClients = adminClientsDropdownContainer && adminClientsDropdownContainer.contains(e.target);
  const insideSettings = adminSettingsDropdownContainer && adminSettingsDropdownContainer.contains(e.target);
  if (!insideClients && !insideSettings) {
    cerrarTodosLosDropdownsAdmin();
  }
});

// Botones de la barra superior
if (adminBarStoreBtn) adminBarStoreBtn.addEventListener("click", mostrarTienda);
if (adminBarProductsBtn) adminBarProductsBtn.addEventListener("click", mostrarMisProductos);
if (adminBarOrdersBtn) adminBarOrdersBtn.addEventListener("click", mostrarPedidosClientes);
if (adminBarStatsBtn) adminBarStatsBtn.addEventListener("click", mostrarMetricasYGanancias);
if (adminBarNotesBtn) adminBarNotesBtn.addEventListener("click", mostrarMisNotas);
if (adminBarMyOrdersBtn) adminBarMyOrdersBtn.addEventListener("click", abrirMisCompras);
if (adminBarUsersBtn) adminBarUsersBtn.addEventListener("click", mostrarGestionUsuarios);

if (exitProductsBtn) exitProductsBtn.addEventListener("click", mostrarTienda);
if (exitOrdersBtn) exitOrdersBtn.addEventListener("click", mostrarTienda);
if (exitUsersBtn) exitUsersBtn.addEventListener("click", mostrarTienda);
if (exitAnalyticsBtn) exitAnalyticsBtn.addEventListener("click", mostrarTienda);
if (exitNotesBtn) exitNotesBtn.addEventListener("click", mostrarTienda);
if (exitMyOrdersBtn) exitMyOrdersBtn.addEventListener("click", mostrarTienda);
if (goHomeBtn) goHomeBtn.addEventListener("click", mostrarTienda);
if (openMyOrdersBtn) openMyOrdersBtn.addEventListener("click", abrirMisCompras);

// ==============================================================
// 7. PUBLICAR Y GESTIONAR PRODUCTOS
// ==============================================================
newProductForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!currentUser || (currentUser.rol !== "admin" && currentUser.rol !== "vendedor")) {
    showToast("⚠️ No tienes permisos para publicar productos");
    return;
  }

  // Prevenir envío múltiple si ya se está procesando
  if (isSubmittingNewProduct) return;

  const titulo = document.getElementById("prodTitle").value.trim();
  const prodBrandEl = document.getElementById("prodBrand");
  const marca = (prodBrandEl ? prodBrandEl.value.trim() : "") || "Kira Pet Oficial";
  const categoria = document.getElementById("prodCategory").value;
  const precio = Number(document.getElementById("prodPrice").value);
  const precioCompra = Math.max(0, Number(prodCostPrice ? prodCostPrice.value : 0) || 0);
  const stock = Number(document.getElementById("prodStock").value);
  const descripcion = document.getElementById("prodDesc").value.trim();
  const prodFeaturedEl = document.getElementById("prodFeatured");
  const destacado = prodFeaturedEl ? prodFeaturedEl.checked : true;

  // 1. PREVENCIÓN DE PUBLICACIONES REPETIDAS: Comprobar duplicado por nombre
  const tituloNormalizado = titulo.toLowerCase().trim();
  const productoRepetido = storeProducts.find(
    (p) => (p.titulo || "").toLowerCase().trim() === tituloNormalizado
  );

  const saveProdBtn = document.getElementById("saveProdBtn");
  const textoOriginalBtn = saveProdBtn ? saveProdBtn.innerHTML : "Publicar Producto en Vivo";

  if (productoRepetido) {
    const confirmar = confirm(
      `⚠️ ATENCIÓN - PRODUCTO REPETIDO:\n\nYa existe un producto con el nombre:\n"${titulo}" (ID: ${productoRepetido.id})\n\n¿Deseas publicarlo de todos modos como un nuevo producto, o prefieres cancelar y editar el existente?`
    );
    if (!confirmar) {
      showToast("ℹ️ Publicación cancelada para evitar duplicar el producto");
      return;
    }
  }

  // Si quedó texto pendiente en el input de URL, agregarlo si hay cupo
  if (prodImageUrlInput && prodImageUrlInput.value.trim() && newProductImages.length < 5) {
    newProductImages.push(prodImageUrlInput.value.trim());
    prodImageUrlInput.value = "";
  }

  const imagenesFinales = newProductImages.length > 0 ? [...newProductImages] : ["🐾"];
  const imagenPrincipal = imagenesFinales[0];

  try {
    isSubmittingNewProduct = true;
    if (saveProdBtn) {
      saveProdBtn.disabled = true;
      saveProdBtn.innerHTML = `⏳ Publicando producto en vivo...`;
    }

    const docRef = await window.db.collection(PROD_COLLECTION).add({
      titulo,
      marca,
      categoria,
      precio,
      precioCompra,
      stock,
      imagenes: imagenesFinales,
      imagen: imagenPrincipal,
      emoji: imagenPrincipal,
      descripcion,
      destacado,
      vendedorId: currentUser.id || "admin",
      vendedorNombre: currentUser.nombre,
      fechaCreacion: firebase.firestore.FieldValue.serverTimestamp()
    });

    showToast(`✅ "${titulo}" publicado con éxito`);
    newProductForm.reset();
    newProductImages = [];
    renderizarPreviewGaleriaNuevo();
    if (prodImageFilesInput) prodImageFilesInput.value = "";
    if (prodImageUrlInput) prodImageUrlInput.value = "";

    // Mostrar el letrero modal en pantalla de producto publicado
    mostrarModalPublicadoExito({
      id: docRef.id,
      titulo,
      marca,
      categoria,
      precio,
      stock,
      imagen: imagenPrincipal,
      destacado,
      imagenes: imagenesFinales
    });
  } catch (err) {
    if (err.message && err.message.includes("exceeds the maximum allowed size")) {
      showToast("❌ Las fotos superan el límite de 1MB de Firebase. Sube fotos más ligeras.");
    } else {
      showToast(`❌ Error: ${err.message}`);
    }
  } finally {
    isSubmittingNewProduct = false;
    if (saveProdBtn) {
      saveProdBtn.disabled = false;
      saveProdBtn.innerHTML = textoOriginalBtn;
    }
  }
});

// Oyente de filtro en tiempo real para Mis Productos
if (adminProductFilterInput) {
  adminProductFilterInput.addEventListener("input", renderizarTablaAdminProductos);
}

// Botones para alternar entre vista Tarjetas y vista Tabla en Mis Productos
if (adminViewCardsBtn) {
  adminViewCardsBtn.addEventListener("click", () => {
    adminViewCardsBtn.classList.add("active");
    if (adminViewTableBtn) adminViewTableBtn.classList.remove("active");
    if (adminProductsCardsContainer) adminProductsCardsContainer.style.display = "grid";
    if (adminProductsTableContainer) adminProductsTableContainer.style.display = "none";
  });
}

if (adminViewTableBtn) {
  adminViewTableBtn.addEventListener("click", () => {
    adminViewTableBtn.classList.add("active");
    if (adminViewCardsBtn) adminViewCardsBtn.classList.remove("active");
    if (adminProductsCardsContainer) adminProductsCardsContainer.style.display = "none";
    if (adminProductsTableContainer) adminProductsTableContainer.style.display = "block";
  });
}

function renderizarTablaAdminProductos() {
  if (!adminProductsTableBody && !adminProductsCardsContainer) return;
  if (adminProductsTableBody) adminProductsTableBody.innerHTML = "";
  if (adminProductsCardsContainer) adminProductsCardsContainer.innerHTML = "";

  const filtro = (adminProductFilterInput ? adminProductFilterInput.value : "").trim().toLowerCase();

  const filtrados = storeProducts.filter((prod) => {
    if (!filtro) return true;
    const matchTitulo = (prod.titulo || "").toLowerCase().includes(filtro);
    const matchCat = (prod.categoria || "").toLowerCase().includes(filtro);
    const matchMarca = (prod.marca || "").toLowerCase().includes(filtro);
    const matchId = (prod.id || "").toLowerCase().includes(filtro);
    return matchTitulo || matchCat || matchMarca || matchId;
  });

  if (adminProductsCountBadge) {
    adminProductsCountBadge.textContent = filtrados.length;
  }

  if (filtrados.length === 0) {
    if (adminProductsTableBody) {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td colspan="5" style="text-align: center; padding: 24px; color: var(--text-muted);">
          🔍 No se encontraron productos que coincidan con "${escapeHtml(filtro)}"
        </td>
      `;
      adminProductsTableBody.appendChild(tr);
    }
    if (adminProductsCardsContainer) {
      adminProductsCardsContainer.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 36px 16px; color: var(--text-muted);">
          <div style="font-size: 2.5rem; margin-bottom: 8px;">🔍</div>
          <p style="font-weight: 600; margin: 0;">No se encontraron productos que coincidan con "${escapeHtml(filtro)}"</p>
        </div>
      `;
    }
    return;
  }

  filtrados.forEach((prod) => {
    const mediaVal = prod.imagen || prod.emoji || "🐾";
    const formattedPrice = Number(prod.precio).toLocaleString("es-AR");
    const precioCompraNum = Number(prod.precioCompra) || 0;
    const gananciaUnitaria = Math.max(0, prod.precio - precioCompraNum);
    const margenPct = prod.precio > 0 ? Math.round((gananciaUnitaria / prod.precio) * 100) : 0;
    const isFeatured = prod.destacado !== false;

    // --- 1. RENDERIZAR EN LA VISTA DE TARJETAS (COMO EN LA TIENDA) ---
    if (adminProductsCardsContainer) {
      const card = document.createElement("div");
      card.className = "admin-product-card";

      card.innerHTML = `
        <div class="admin-card-img-box" style="cursor: pointer;" title="Haz clic para ver el detalle de fotos">
          ${getProductMediaHtml(mediaVal, prod.titulo)}
          ${isFeatured ? '<span class="badge-featured-mini">⭐ Carrusel</span>' : ''}
          <span class="admin-card-id-tag">#${escapeHtml(prod.id)}</span>
        </div>
        <div class="admin-card-body">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span class="product-category-tag" style="margin: 0;">${escapeHtml(prod.categoria)}</span>
            <button type="button" class="btn-copy-id" data-id="${escapeHtml(prod.id)}" title="Copiar ID del producto">📋 Copiar ID</button>
          </div>
          <h3 class="admin-card-title">${escapeHtml(prod.titulo)}</h3>
          <small style="color: var(--text-muted); font-size: 0.78rem; display: block; margin-bottom: 4px;">Marca: ${escapeHtml(prod.marca || "Kira Pet Oficial")}</small>
          
          <div class="admin-card-price-stock">
            <div>
              <div class="admin-card-price">Venta: $ ${formattedPrice}</div>
              ${precioCompraNum > 0 ? `<small style="color: #64748b; font-size: 0.74rem; display: block; margin-top: 1px;">Costo: $ ${precioCompraNum.toLocaleString('es-AR')} • <strong style="color: #0f766e;">+$ ${gananciaUnitaria.toLocaleString('es-AR')} (${margenPct}%)</strong></small>` : ''}
            </div>
            <div class="admin-card-stock ${prod.stock <= 3 ? 'low-stock' : ''}">Stock: ${prod.stock} u.</div>
          </div>
          
          <div class="admin-card-actions">
            <button type="button" class="btn btn-secondary btn-card-detail" data-id="${prod.id}" title="Ver detalle del producto" style="flex: 1;">👁️ Detalle</button>
            <button type="button" class="btn btn-secondary btn-card-edit" data-id="${prod.id}" title="Editar producto" style="flex: 1;">✏️ Editar</button>
            <button type="button" class="btn btn-secondary btn-card-feat" data-id="${prod.id}" title="${isFeatured ? 'Quitar del carrusel' : 'Destacar en carrusel'}">${isFeatured ? '⭐' : '☆'}</button>
            <button type="button" class="btn btn-secondary btn-card-del" data-id="${prod.id}" title="Eliminar producto" style="color: red;">🗑️</button>
          </div>
        </div>
      `;

      card.querySelector(".btn-copy-id")?.addEventListener("click", (e) => {
        e.stopPropagation();
        copiarTextoPortapapeles(prod.id, "📋 ID de producto copiado");
      });

      card.querySelector(".btn-card-detail")?.addEventListener("click", (e) => {
        e.stopPropagation();
        abrirDetalleProducto(prod);
      });

      card.querySelector(".btn-card-edit")?.addEventListener("click", (e) => {
        e.stopPropagation();
        abrirFormularioEditar(prod);
      });

      card.querySelector(".btn-card-feat")?.addEventListener("click", async (e) => {
        e.stopPropagation();
        await alternarCarruselProducto(prod, !isFeatured);
      });

      card.querySelector(".btn-card-del")?.addEventListener("click", async (e) => {
        e.stopPropagation();
        await borrarProducto(prod);
      });

      card.querySelector(".admin-card-img-box")?.addEventListener("click", () => {
        abrirDetalleProducto(prod);
      });

      adminProductsCardsContainer.appendChild(card);
    }

    // --- 2. RENDERIZAR EN LA VISTA DE TABLA ---
    if (adminProductsTableBody) {
      const tr = document.createElement("tr");
      const isUrl = mediaVal.startsWith("http://") || mediaVal.startsWith("https://") || mediaVal.startsWith("data:image");
      const mediaHtml = isUrl
        ? `<img src="${escapeHtml(mediaVal)}" style="width:40px; height:40px; object-fit:cover; border-radius:6px; border:1px solid #cbd5e1; vertical-align:middle; margin-right:10px;">`
        : `<span style="font-size:1.5rem; vertical-align:middle; margin-right:10px;">${escapeHtml(mediaVal)}</span>`;

      const featuredBadge = isFeatured
        ? `<span class="badge-featured" title="Visible en el carrusel de inicio">⭐ Carrusel</span>`
        : `<span style="font-size:0.75rem; color:#94a3b8; background:#f1f5f9; padding:2px 6px; border-radius:10px;">Catálogo</span>`;

      tr.innerHTML = `
        <td>
          <div style="display:flex; align-items:center;">
            ${mediaHtml}
            <div style="min-width:0;">
              <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
                <strong>${escapeHtml(prod.titulo)}</strong>
                ${featuredBadge}
              </div>
              <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap; margin-top:2px;">
                <small style="color:var(--text-muted); font-size:0.8rem;">Marca: ${escapeHtml(prod.marca || "Kira Pet Oficial")}</small>
                <div class="admin-prod-id-chip" title="ID de Firebase: ${escapeHtml(prod.id)}">
                  <span class="id-label">ID:</span>
                  <code class="id-val">${escapeHtml(prod.id)}</code>
                  <button type="button" class="btn-copy-mini-id" data-id="${escapeHtml(prod.id)}" title="Copiar ID al portapapeles">📋</button>
                </div>
              </div>
            </div>
          </div>
        </td>
        <td>${escapeHtml(prod.categoria)}</td>
        <td>
          <strong>$ ${formattedPrice}</strong>
          ${precioCompraNum > 0 ? `<br><small style="color: #64748b; font-size: 0.74rem;">Costo: $ ${precioCompraNum.toLocaleString('es-AR')}<br><strong style="color: #0f766e;">Ganancia: $ ${gananciaUnitaria.toLocaleString('es-AR')} (${margenPct}%)</strong></small>` : ''}
        </td>
        <td>${prod.stock} u.</td>
        <td class="text-right">
          <button class="btn btn-sm btn-secondary btn-toggle-feat" data-id="${prod.id}" title="${isFeatured ? 'Quitar del carrusel' : 'Destacar en carrusel'}" style="margin-right:4px;">
            ${isFeatured ? '⭐' : '☆'}
          </button>
          <button class="btn btn-sm btn-secondary btn-edit-prod" data-id="${prod.id}">✏️ Editar</button>
          <button class="btn btn-sm btn-secondary btn-del-prod" data-id="${prod.id}" style="color:red; margin-left:4px;">🗑️</button>
        </td>
      `;

      tr.querySelector(".btn-copy-mini-id")?.addEventListener("click", (e) => {
        e.stopPropagation();
        copiarTextoPortapapeles(prod.id, "📋 ID de producto copiado");
      });

      tr.querySelector(".btn-toggle-feat")?.addEventListener("click", async () => {
        await alternarCarruselProducto(prod, !isFeatured);
      });

      tr.querySelector(".btn-edit-prod")?.addEventListener("click", () => {
        abrirFormularioEditar(prod);
      });

      tr.querySelector(".btn-del-prod")?.addEventListener("click", async () => {
        await borrarProducto(prod);
      });

      adminProductsTableBody.appendChild(tr);
    }
  });
}

function abrirFormularioEditar(prod) {
  editProdId.value = prod.id;
  editProdTitle.value = prod.titulo || "";
  const editBrandEl = document.getElementById("editProdBrand");
  if (editBrandEl) editBrandEl.value = prod.marca || "Kira Pet Oficial";
  editProdCategory.value = prod.categoria || "Alimentos";
  editProdPrice.value = prod.precio || 0;
  if (editProdCostPrice) editProdCostPrice.value = prod.precioCompra || "";
  editProdStock.value = prod.stock || 0;
  editProdDesc.value = prod.descripcion || "";
  const editFeaturedEl = document.getElementById("editProdFeatured");
  if (editFeaturedEl) editFeaturedEl.checked = (prod.destacado !== false);

  // Cargar imágenes existentes (hasta 5)
  editProductImages = Array.isArray(prod.imagenes) && prod.imagenes.length > 0
    ? [...prod.imagenes]
    : [prod.imagen || prod.emoji || "🐾"];
  renderizarPreviewGaleriaEditar();

  if (editProdImageFilesInput) editProdImageFilesInput.value = "";
  if (editProdImageUrlInput) editProdImageUrlInput.value = "";

  editProductModal.style.display = "flex";
}

async function alternarCarruselProducto(prod, nuevoEstado) {
  try {
    await window.db.collection(PROD_COLLECTION).doc(prod.id).update({
      destacado: nuevoEstado
    });
    showToast(nuevoEstado ? `⭐ "${prod.titulo}" añadido al carrusel` : `"${prod.titulo}" quitado del carrusel`);
  } catch (err) {
    showToast(`❌ Error: ${err.message}`);
  }
}

async function borrarProducto(prod) {
  if (confirm(`¿Eliminar permanentemente "${prod.titulo}"?`)) {
    try {
      await window.db.collection(PROD_COLLECTION).doc(prod.id).delete();
      showToast("🗑️ Producto eliminado");
    } catch (err) {
      showToast(`❌ Error: ${err.message}`);
    }
  }
}

// Modal Editar Producto - Eventos de Guardado y Cierre
if (closeEditProductBtn) {
  closeEditProductBtn.addEventListener("click", () => (editProductModal.style.display = "none"));
}
if (cancelEditProductBtn) {
  cancelEditProductBtn.addEventListener("click", () => (editProductModal.style.display = "none"));
}

if (editProductForm) {
  editProductForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = editProdId.value;
    if (!id) return;

    const titulo = editProdTitle.value.trim();
    const editBrandEl = document.getElementById("editProdBrand");
    const marca = (editBrandEl ? editBrandEl.value.trim() : "") || "Kira Pet Oficial";
    const categoria = editProdCategory.value;
    const precio = Number(editProdPrice.value);
    const precioCompra = Math.max(0, Number(editProdCostPrice ? editProdCostPrice.value : 0) || 0);
    const stock = Number(editProdStock.value);
    const descripcion = editProdDesc.value.trim();
    const editFeaturedEl = document.getElementById("editProdFeatured");
    const destacado = editFeaturedEl ? editFeaturedEl.checked : true;

    // Si escribió algo en el input de URL en edición sin presionar el botón añadir
    if (editProdImageUrlInput && editProdImageUrlInput.value.trim() && editProductImages.length < 5) {
      editProductImages.push(editProdImageUrlInput.value.trim());
      editProdImageUrlInput.value = "";
    }

    const imagenesFinales = editProductImages.length > 0 ? [...editProductImages] : ["🐾"];
    const imagenPrincipal = imagenesFinales[0];

    try {
      await window.db.collection(PROD_COLLECTION).doc(id).update({
        titulo,
        marca,
        categoria,
        precio,
        precioCompra,
        stock,
        imagenes: imagenesFinales,
        imagen: imagenPrincipal,
        emoji: imagenPrincipal,
        descripcion,
        destacado
      });
      showToast(`✅ "${titulo}" actualizado con ${imagenesFinales.length} foto(s)`);
      editProductModal.style.display = "none";
      editProductImages = [];
    } catch (err) {
      showToast(`❌ Error: ${err.message}`);
    }
  });
}

// ==============================================================
// 8. GESTIÓN DE USUARIOS Y ROLES (SOLO ADMINISTRADOR)
// ==============================================================
if (adminUserFilterInput) {
  adminUserFilterInput.addEventListener("input", renderizarTablaUsuariosAdmin);
}

function iniciarEscuchaUsuariosEnVivo() {
  window.db.collection(USERS_COLLECTION).orderBy("fechaRegistro", "desc").onSnapshot((snapshot) => {
    allUsers = [];
    snapshot.forEach((doc) => {
      allUsers.push({ id: doc.id, ...doc.data() });
    });
    renderizarTablaUsuariosAdmin();
  });
}

function renderizarTablaUsuariosAdmin() {
  if (!adminUsersTableBody) return;
  adminUsersTableBody.innerHTML = "";

  const filtro = (adminUserFilterInput ? adminUserFilterInput.value : "").trim().toLowerCase();

  const filtrados = allUsers.filter((u) => {
    if (!filtro) return true;
    const matchNombre = (u.nombre || "").toLowerCase().includes(filtro);
    const matchEmail = (u.email || "").toLowerCase().includes(filtro);
    const matchTel = (u.telefono || "").toLowerCase().includes(filtro);
    const matchRol = (u.rol || "").toLowerCase().includes(filtro);
    return matchNombre || matchEmail || matchTel || matchRol;
  });

  if (adminUsersCountBadge) {
    adminUsersCountBadge.textContent = filtrados.length;
  }

  if (filtrados.length === 0) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td colspan="5" style="text-align: center; padding: 24px; color: var(--text-muted);">
        🔍 No se encontraron usuarios que coincidan con "${escapeHtml(filtro)}"
      </td>
    `;
    adminUsersTableBody.appendChild(tr);
    return;
  }

  filtrados.forEach((u) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td><strong>${escapeHtml(u.nombre)}</strong></td>
      <td>${escapeHtml(u.email)}</td>
      <td>${escapeHtml(u.telefono || "-")}</td>
      <td>
        <span class="role-badge role-${u.rol || 'comprador'}">${u.rol || 'comprador'}</span>
      </td>
      <td class="text-right">
        <select class="role-select" data-id="${u.id}" style="padding:4px 8px; font-size:0.8rem; border-radius:4px;">
          <option value="comprador" ${u.rol === 'comprador' ? 'selected' : ''}>Comprador</option>
          <option value="vendedor" ${u.rol === 'vendedor' ? 'selected' : ''}>Vendedor</option>
          <option value="admin" ${u.rol === 'admin' ? 'selected' : ''}>Administrador</option>
        </select>
      </td>
    `;

    tr.querySelector(".role-select").addEventListener("change", async (e) => {
      const nuevoRol = e.target.value;
      try {
        await window.db.collection(USERS_COLLECTION).doc(u.id).update({
          rol: nuevoRol
        });
        showToast(`✅ Rol de "${u.nombre}" cambiado a ${nuevoRol.toUpperCase()}`);

        if (currentUser && currentUser.id === u.id) {
          currentUser.rol = nuevoRol;
          localStorage.setItem("kira_user", JSON.stringify(currentUser));
          actualizarUIUsuario();
        }
      } catch (err) {
        showToast(`❌ Error: ${err.message}`);
      }
    });

    adminUsersTableBody.appendChild(tr);
  });
}

// ==============================================================
// 9. CARRITO Y PEDIDOS EN TIEMPO REAL
// ==============================================================
function agregarAlCarrito(prod) {
  const mediaVal = prod.imagen || prod.emoji || "🐾";
  const existente = cart.find((item) => item.id === prod.id);
  if (existente) {
    existente.cantidad += 1;
  } else {
    cart.push({
      id: prod.id,
      titulo: prod.titulo,
      precio: prod.precio,
      emoji: mediaVal,
      imagen: mediaVal,
      cantidad: 1
    });
  }

  guardarCarrito();
  showToast(`🛒 "${prod.titulo}" agregado al carrito`);
}

function guardarCarrito() {
  if (!currentUser) {
    cart = [];
    localStorage.removeItem("kira_cart");
    actualizarBadgeCarrito();
    return;
  }
  localStorage.setItem(`kira_cart_${currentUser.email}`, JSON.stringify(cart));
  actualizarBadgeCarrito();
  renderizarCarrito();
}

function actualizarBadgeCarrito() {
  if (!currentUser) {
    cart = [];
    if (cartCount) cartCount.textContent = "0";
    if (floatingCartCount) floatingCartCount.textContent = "0";
    if (floatingCartTotal) floatingCartTotal.textContent = "$0";
    return;
  }
  const totalItems = cart.reduce((acc, item) => acc + item.cantidad, 0);
  const subtotal = cart.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  const isPickup = shippingOptPickup && shippingOptPickup.checked;
  const shippingCost = isPickup ? 0 : (Number(cartShippingCostInput ? cartShippingCostInput.value : 0) || 0);
  const total = subtotal + (cart.length > 0 ? shippingCost : 0);

  if (cartCount) cartCount.textContent = totalItems;
  if (floatingCartCount) floatingCartCount.textContent = totalItems;
  if (floatingCartTotal) floatingCartTotal.textContent = `$ ${Number(total).toLocaleString("es-AR")}`;
}

function renderizarCarrito() {
  cartItemsList.innerHTML = "";

  const isPickup = shippingOptPickup && shippingOptPickup.checked;
  if (cartDeliveryCostRow) {
    cartDeliveryCostRow.style.display = isPickup ? "none" : "flex";
  }

  const shippingCost = isPickup ? 0 : (Number(cartShippingCostInput ? cartShippingCostInput.value : 0) || 0);
  if (cartShippingDisplayVal) {
    cartShippingDisplayVal.textContent = isPickup ? "Gratis ($0)" : `$ ${shippingCost.toLocaleString("es-AR")}`;
  }

  if (cart.length === 0) {
    cartItemsList.innerHTML = `
      <div class="empty-state">
        <div style="font-size: 3rem;">🛒</div>
        <p>Tu carrito está vacío</p>
      </div>
    `;
    if (cartSubtotalVal) cartSubtotalVal.textContent = "$0";
    if (cartTotalPrice) cartTotalPrice.textContent = "$0";
    if (floatingCartTotal) floatingCartTotal.textContent = "$0";
    return;
  }

  let subtotal = 0;
  cart.forEach((item) => {
    const itemSubtotal = item.precio * item.cantidad;
    subtotal += itemSubtotal;

    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <div class="cart-item-emoji">${getProductMediaHtml(item.imagen || item.emoji, item.titulo)}</div>
      <div class="cart-item-details">
        <div class="cart-item-title">${escapeHtml(item.titulo)}</div>
        <div class="cart-item-price">$ ${Number(itemSubtotal).toLocaleString("es-AR")}</div>
        <div class="cart-qty-controls">
          <button class="qty-btn btn-minus" data-id="${item.id}">-</button>
          <span>${item.cantidad}</span>
          <button class="qty-btn btn-plus" data-id="${item.id}">+</button>
          <button style="background:none; border:none; color:red; cursor:pointer; margin-left:8px;" class="btn-remove" data-id="${item.id}">🗑️</button>
        </div>
      </div>
    `;

    div.querySelector(".btn-plus").addEventListener("click", () => {
      item.cantidad += 1;
      guardarCarrito();
    });

    div.querySelector(".btn-minus").addEventListener("click", () => {
      if (item.cantidad > 1) {
        item.cantidad -= 1;
      } else {
        cart = cart.filter((i) => i.id !== item.id);
      }
      guardarCarrito();
    });

    div.querySelector(".btn-remove").addEventListener("click", () => {
      cart = cart.filter((i) => i.id !== item.id);
      guardarCarrito();
    });

    cartItemsList.appendChild(div);
  });

  const total = subtotal + shippingCost;
  if (cartSubtotalVal) cartSubtotalVal.textContent = `$ ${Number(subtotal).toLocaleString("es-AR")}`;
  if (cartTotalPrice) cartTotalPrice.textContent = `$ ${Number(total).toLocaleString("es-AR")}`;
  if (floatingCartTotal) floatingCartTotal.textContent = `$ ${Number(total).toLocaleString("es-AR")}`;
}

// Oyentes para opciones de envío en carrito
if (shippingOptDelivery) shippingOptDelivery.addEventListener("change", renderizarCarrito);
if (shippingOptPickup) shippingOptPickup.addEventListener("change", renderizarCarrito);
if (cartShippingCostInput) cartShippingCostInput.addEventListener("input", renderizarCarrito);

// Abrir carrito desde botón superior tradicional o desde botón lateral flotante
function abrirModalCarrito() {
  if (!currentUser) {
    showToast("🐾 Creá tu cuenta o ingresá para ver tu carrito");
    registerModal.style.display = "flex";
    return;
  }
  renderizarCarrito();
  cartModal.style.display = "flex";
}

if (openCartBtn) openCartBtn.addEventListener("click", abrirModalCarrito);
if (floatingLeftCartBtn) floatingLeftCartBtn.addEventListener("click", abrirModalCarrito);

closeCartBtn.addEventListener("click", () => {
  cartModal.style.display = "none";
});

checkoutBtn.addEventListener("click", async () => {
  if (cart.length === 0) {
    showToast("⚠️ El carrito está vacío");
    return;
  }

  if (!currentUser) {
    showToast("⚠️ Ingresá o creá tu cuenta para finalizar tu compra");
    cartModal.style.display = "none";
    registerModal.style.display = "flex";
    return;
  }

  checkoutBtn.disabled = true;
  checkoutBtn.textContent = "Procesando pedido...";

  try {
    const isPickup = shippingOptPickup && shippingOptPickup.checked;
    const shippingCost = isPickup ? 0 : (Number(cartShippingCostInput ? cartShippingCostInput.value : 0) || 0);
    const subtotal = cart.reduce((acc, i) => acc + i.precio * i.cantidad, 0);
    const total = subtotal + shippingCost;

    await window.db.collection(ORDERS_COLLECTION).add({
      clienteNombre: currentUser.nombre,
      clienteEmail: currentUser.email,
      clienteTelefono: currentUser.telefono,
      productos: cart,
      subtotal: subtotal,
      costoEnvio: shippingCost,
      tipoEnvio: isPickup ? "retiro" : "delivery",
      total: total,
      estado: "Nuevo Pedido",
      fecha: firebase.firestore.FieldValue.serverTimestamp()
    });

    showToast("🎉 ¡Compra confirmada! El pedido fue enviado a la tienda");
    cart = [];
    guardarCarrito();
    cartModal.style.display = "none";
  } catch (err) {
    if (err.message && err.message.includes("exceeds the maximum allowed size")) {
      showToast("❌ Las fotos superan el límite de 1MB de Firebase. Sube menos fotos o fotos más ligeras.");
    } else {
      showToast(`❌ Error: ${err.message}`);
    }
  } finally {
    checkoutBtn.disabled = false;
    checkoutBtn.textContent = "Confirmar Compra";
  }
});

// Oyente de filtro en tiempo real para Pedidos
if (adminOrderFilterInput) {
  adminOrderFilterInput.addEventListener("input", renderizarTablaAdminPedidos);
}

// Escucha de Pedidos en Vivo
let allOrders = [];
function iniciarEscuchaPedidosEnVivo() {
  window.db.collection(ORDERS_COLLECTION).orderBy("fecha", "desc").onSnapshot((snapshot) => {
    if (adminBarOrdersCount) adminBarOrdersCount.textContent = snapshot.size;
    allOrders = [];

    if (snapshot.empty) {
      if (noOrdersMsg) noOrdersMsg.style.display = "block";
      if (adminOrdersTableBody) adminOrdersTableBody.innerHTML = "";
      if (adminOrdersCountBadge) adminOrdersCountBadge.textContent = "0";
      return;
    }

    if (noOrdersMsg) noOrdersMsg.style.display = "none";

    snapshot.forEach((doc) => {
      allOrders.push({ id: doc.id, ...doc.data() });
    });

    renderizarTablaAdminPedidos();
    renderizarMisCompras();
    if (analyticsManagementView && analyticsManagementView.style.display !== "none") {
      actualizarPanelMetricasYGanancias();
    }
  });
}

// Listeners para cerrar Modal de Nota de Entrega
if (closeDeliveryNoteBtn) {
  closeDeliveryNoteBtn.addEventListener("click", () => {
    if (deliveryNoteModal) deliveryNoteModal.style.display = "none";
  });
}
if (closeDeliveryNoteBottomBtn) {
  closeDeliveryNoteBottomBtn.addEventListener("click", () => {
    if (deliveryNoteModal) deliveryNoteModal.style.display = "none";
  });
}
if (deliveryNoteModal) {
  deliveryNoteModal.addEventListener("click", (e) => {
    if (e.target === deliveryNoteModal) {
      deliveryNoteModal.style.display = "none";
    }
  });
}

// Función principal para abrir y generar la Nota de Entrega oficial
function abrirNotaDeEntrega(order) {
  if (!order) return;

  const isDelivered = order.estado === "Entregado" || order.estado === "Completada";
  const isCancelled = order.estado === "Cancelada";
  const isAdminOrVendor = currentUser && (currentUser.rol === "admin" || currentUser.rol === "vendedor");

  // Al comprador NO le aparece WhatsApp ni el editor de notas: solo al admin
  if (dnShareWhatsAppBtn) {
    dnShareWhatsAppBtn.style.display = isAdminOrVendor ? "inline-flex" : "none";
  }
  if (dnOrderNotesEditor) {
    dnOrderNotesEditor.style.display = isAdminOrVendor ? "block" : "none";
  }

  // 1. Badge de Estado en el remito
  if (dnStatusBadge) {
    if (isDelivered) {
      dnStatusBadge.className = "dn-status-badge status-delivered";
      dnStatusBadge.innerHTML = "🟢 ENTREGADO / COMPLETADO";
    } else if (isCancelled) {
      dnStatusBadge.className = "dn-status-badge status-pending";
      dnStatusBadge.innerHTML = "❌ PEDIDO CANCELADO";
    } else {
      dnStatusBadge.className = "dn-status-badge status-pending";
      dnStatusBadge.innerHTML = `🔴 PENDIENTE DE ENTREGA (${order.estado || 'En Preparación'})`;
    }
  }

  // 2. Estado de Logística
  if (dnShippingStatus) {
    if (isDelivered) {
      dnShippingStatus.innerHTML = '<span style="color: #15803d; font-weight: 800;">🟢 Entregado con Éxito</span>';
    } else if (isCancelled) {
      dnShippingStatus.innerHTML = '<span style="color: #dc2626; font-weight: 800;">❌ Cancelado</span>';
    } else {
      dnShippingStatus.innerHTML = `<span style="color: #b91c1c; font-weight: 800;">🔴 Pendiente (${order.estado || 'En Gestión'})</span>`;
    }
  }

  // 3. ID de Nota de Entrega
  if (dnOrderId) {
    const rawId = order.id || "000000";
    dnOrderId.textContent = `#ORD-${rawId.slice(0, 8).toUpperCase()}`;
  }

  // 4. Fechas
  let orderDateStr = "-";
  if (order.fecha) {
    try {
      const d = order.fecha.toDate ? order.fecha.toDate() : new Date(order.fecha);
      orderDateStr = d.toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
    } catch (_) {}
  }
  if (dnOrderDate) dnOrderDate.textContent = orderDateStr;

  if (dnDeliveryDateRow && dnDeliveryDate) {
    if (isDelivered) {
      let delivDateStr = orderDateStr;
      if (order.fechaEntrega) {
        try {
          const dEnt = order.fechaEntrega.toDate ? order.fechaEntrega.toDate() : new Date(order.fechaEntrega);
          delivDateStr = dEnt.toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
        } catch (_) {}
      }
      dnDeliveryDate.textContent = delivDateStr;
      dnDeliveryDateRow.style.display = "flex";
    } else {
      dnDeliveryDateRow.style.display = "none";
    }
  }

  // 5. Datos del cliente
  if (dnClientName) dnClientName.textContent = order.clienteNombre || "Cliente";
  if (dnClientPhone) dnClientPhone.textContent = order.clienteTelefono || "Sin teléfono registrado";
  if (dnClientEmail) dnClientEmail.textContent = order.clienteEmail || "Sin email registrado";

  // 6. Artículos de la orden
  if (dnItemsTableBody) {
    dnItemsTableBody.innerHTML = "";
    let subtotalCalc = 0;

    (order.productos || []).forEach((p) => {
      const cant = Number(p.cantidad) || 1;
      const prec = Number(p.precio) || 0;
      const lineaSubtotal = cant * prec;
      subtotalCalc += lineaSubtotal;

      let thumbHtml = '<div style="font-size: 1.4rem; text-align: center;">📦</div>';
      if (p.imagen && (p.imagen.startsWith("data:") || p.imagen.startsWith("http"))) {
        thumbHtml = `<img src="${p.imagen}" alt="${escapeHtml(p.titulo)}" class="dn-thumb-img">`;
      } else if (p.imagenes && p.imagenes.length > 0) {
        thumbHtml = `<img src="${p.imagenes[0]}" alt="${escapeHtml(p.titulo)}" class="dn-thumb-img">`;
      } else if (p.emoji) {
        thumbHtml = `<div style="font-size: 1.4rem; text-align: center;">${p.emoji}</div>`;
      }

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${thumbHtml}</td>
        <td>
          <strong>${escapeHtml(p.titulo || "Producto")}</strong>
          ${p.id ? `<br><small style="color: #64748b;">ID: <code>${p.id.slice(0, 8)}</code></small>` : ""}
        </td>
        <td class="text-center" style="font-weight: 700;">${cant}</td>
        <td class="text-right">$ ${prec.toLocaleString("es-AR")}</td>
        <td class="text-right" style="font-weight: 800; color: #0f766e;">$ ${lineaSubtotal.toLocaleString("es-AR")}</td>
      `;
      dnItemsTableBody.appendChild(tr);
    });

    const costoEnvio = Number(order.costoEnvio) || 0;
    const tipoEnvio = order.tipoEnvio || (costoEnvio > 0 ? "delivery" : "retiro");
    const totalFinal = Number(order.total) || (subtotalCalc + costoEnvio);

    if (dnSubtotalVal) dnSubtotalVal.textContent = `$ ${subtotalCalc.toLocaleString("es-AR")}`;
    if (dnGrandTotal) dnGrandTotal.textContent = `$ ${totalFinal.toLocaleString("es-AR")}`;

    if (dnShippingCostVal) {
      if (costoEnvio > 0) {
        dnShippingCostVal.textContent = `$ ${costoEnvio.toLocaleString("es-AR")}`;
      } else if (tipoEnvio === "retiro") {
        dnShippingCostVal.textContent = "Retiro en Local ($0)";
      } else {
        dnShippingCostVal.textContent = "$ 0";
      }
    }

    if (dnEditShippingBtn) {
      dnEditShippingBtn.style.display = isAdminOrVendor ? "inline-block" : "none";
    }
    if (dnShippingEditorBox) {
      dnShippingEditorBox.style.display = "none";
    }

    if (dnEditShippingBtn && dnShippingEditorBox && dnShippingInput) {
      dnEditShippingBtn.onclick = () => {
        dnShippingEditorBox.style.display = "block";
        dnShippingInput.value = costoEnvio;
        dnShippingInput.focus();
      };
    }
    if (dnCancelShippingBtn && dnShippingEditorBox) {
      dnCancelShippingBtn.onclick = () => {
        dnShippingEditorBox.style.display = "none";
      };
    }
    if (dnSaveShippingBtn && dnShippingInput) {
      dnSaveShippingBtn.onclick = async () => {
        const nuevoCostoEnvio = Math.max(0, Number(dnShippingInput.value) || 0);
        const nuevoTotal = subtotalCalc + nuevoCostoEnvio;
        try {
          await window.db.collection(ORDERS_COLLECTION).doc(order.id).update({
            costoEnvio: nuevoCostoEnvio,
            tipoEnvio: nuevoCostoEnvio > 0 ? "delivery" : "retiro",
            total: nuevoTotal
          });
          order.costoEnvio = nuevoCostoEnvio;
          order.tipoEnvio = nuevoCostoEnvio > 0 ? "delivery" : "retiro";
          order.total = nuevoTotal;
          if (dnShippingCostVal) {
            dnShippingCostVal.textContent = nuevoCostoEnvio > 0 ? `$ ${nuevoCostoEnvio.toLocaleString("es-AR")}` : "Retiro en Local ($0)";
          }
          if (dnGrandTotal) {
            dnGrandTotal.textContent = `$ ${nuevoTotal.toLocaleString("es-AR")}`;
          }
          if (dnShippingEditorBox) {
            dnShippingEditorBox.style.display = "none";
          }
          showToast(`✅ Costo de delivery actualizado a $ ${nuevoCostoEnvio.toLocaleString("es-AR")}`);
          renderizarTablaAdminPedidos();
        } catch (err) {
          showToast(`❌ Error al actualizar delivery: ${err.message}`);
        }
      };
    }
  }

  // 6.5. Notas y Observaciones de Entrega
  if (dnOrderNotesDisplay) {
    dnOrderNotesDisplay.textContent = order.notas || "Sin observaciones especiales registradas.";
  }
  if (dnOrderNotesInput) {
    dnOrderNotesInput.value = order.notas || "";
  }
  if (dnSaveOrderNoteBtn) {
    dnSaveOrderNoteBtn.onclick = async () => {
      const notaTxt = (dnOrderNotesInput ? dnOrderNotesInput.value : "").trim();
      try {
        await window.db.collection(ORDERS_COLLECTION).doc(order.id).update({ notas: notaTxt });
        order.notas = notaTxt;
        if (dnOrderNotesDisplay) dnOrderNotesDisplay.textContent = notaTxt || "Sin observaciones especiales registradas.";
        showToast(`✅ Nota guardada en el pedido #${order.id.slice(0, 6)}`);
      } catch (err) {
        showToast(`❌ Error al guardar nota: ${err.message}`);
      }
    };
  }

  // 7. Acciones: WhatsApp al comprador e Impresión
  if (dnShareWhatsAppBtn) {
    dnShareWhatsAppBtn.onclick = () => {
      const totalNum = Number(order.total) || 0;
      const estadoEtiqueta = isDelivered ? "🟢 ENTREGADO" : "🔴 PENDIENTE DE ENTREGA";
      const idCorto = (order.id || "").slice(0, 8).toUpperCase();
      const msg = `🐾 ¡Hola ${order.clienteNombre || 'estimado cliente'}! Te escribimos desde *Kira PET love* respecto a tu compra *#ORD-${idCorto}*.\n\n` +
        `📦 *Estado:* ${estadoEtiqueta}\n` +
        `💰 *Total:* $ ${totalNum.toLocaleString("es-AR")}\n\n` +
        `¿En qué podemos ayudarte con tu entrega? ¡Estamos a tu entera disposición! 🐶🐱`;
      const telLimpio = formatearNumeroWhatsApp(order.clienteTelefono);
      if (telLimpio) {
        window.open(`https://api.whatsapp.com/send?phone=${telLimpio}&text=${encodeURIComponent(msg)}`, "_blank");
      } else {
        showToast("⚠️ El comprador no tiene teléfono registrado. Abriendo WhatsApp para seleccionar chat...");
        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, "_blank");
      }
    };
  }

  if (dnPrintBtn) {
    dnPrintBtn.onclick = () => {
      window.print();
    };
  }

  if (deliveryNoteModal) {
    deliveryNoteModal.style.display = "flex";
  }
}

function renderizarTablaAdminPedidos() {
  if (!adminOrdersTableBody) return;
  adminOrdersTableBody.innerHTML = "";

  const filtro = (adminOrderFilterInput ? adminOrderFilterInput.value : "").trim().toLowerCase();

  const filtrados = allOrders.filter((order) => {
    if (!filtro) return true;
    const matchId = (order.id || "").toLowerCase().includes(filtro);
    const matchCliente = (order.clienteNombre || "").toLowerCase().includes(filtro);
    const matchEmail = (order.clienteEmail || "").toLowerCase().includes(filtro);
    const matchTel = (order.clienteTelefono || "").toLowerCase().includes(filtro);
    const matchEstado = (order.estado || "").toLowerCase().includes(filtro);
    const matchProd = (order.productos || []).some((p) => (p.titulo || "").toLowerCase().includes(filtro));
    return matchId || matchCliente || matchEmail || matchTel || matchEstado || matchProd;
  });

  if (adminOrdersCountBadge) {
    adminOrdersCountBadge.textContent = filtrados.length;
  }

  if (filtrados.length === 0) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td colspan="6" style="text-align: center; padding: 24px; color: var(--text-muted);">
        🔍 No se encontraron pedidos que coincidan con "${escapeHtml(filtro)}"
      </td>
    `;
    adminOrdersTableBody.appendChild(tr);
    return;
  }

  filtrados.forEach((order) => {
    const tr = document.createElement("tr");
    const itemsStr = (order.productos || [])
      .map((p) => `${p.cantidad}x ${p.titulo}`)
      .join("<br>");

    const isDelivered = order.estado === "Entregado" || order.estado === "Completada";
    const statusClass = isDelivered ? "status-green" : "status-red";
    const badgeClass = isDelivered ? "badge-status-green" : "badge-status-red";
    const badgeLabel = isDelivered ? "🟢 Entregado" : (order.estado === "Cancelada" ? "❌ Cancelada" : "🔴 Pendiente");

    tr.innerHTML = `
      <td>
        <strong style="color: #0f766e;">#${order.id.slice(0, 6)}</strong>
      </td>
      <td>
        <strong>${escapeHtml(order.clienteNombre)}</strong><br>
        <div style="display:flex; align-items:center; gap:4px; margin-top:2px;">
          <small style="color: #64748b;">${escapeHtml(order.clienteTelefono || 'Sin tel')}</small>
          ${order.clienteTelefono ? `<a href="#" class="quick-wa-btn" title="Escribir por WhatsApp a ${escapeHtml(order.clienteNombre)}">📲</a>` : ''}
        </div>
      </td>
      <td><small>${itemsStr}</small></td>
      <td><strong>$ ${Number(order.total).toLocaleString("es-AR")}</strong></td>
      <td>
        <select class="order-status-select ${statusClass}" data-id="${order.id}">
          <option value="Nuevo Pedido" ${order.estado === 'Nuevo Pedido' ? 'selected' : ''}>🔴 ⏳ Nuevo Pedido</option>
          <option value="En Preparación" ${order.estado === 'En Preparación' ? 'selected' : ''}>🔴 👨‍🍳 En Preparación</option>
          <option value="En Camino" ${order.estado === 'En Camino' ? 'selected' : ''}>🔴 🚚 En Camino</option>
          <option value="Entregado" ${(order.estado === 'Entregado' || order.estado === 'Completada') ? 'selected' : ''}>🟢 ✅ Entregado</option>
          <option value="Cancelada" ${order.estado === 'Cancelada' ? 'selected' : ''}>❌ Cancelada</option>
        </select>
      </td>
      <td class="text-right">
        <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 6px;">
          <span class="${badgeClass}" id="adminOrderBadge_${order.id}">${badgeLabel}</span>
          <button type="button" class="btn btn-sm btn-secondary view-dn-btn" style="padding: 4px 10px; font-size: 0.78rem; font-weight: 700; display: inline-flex; align-items: center; gap: 4px; white-space: nowrap;">
            📄 Nota de Entrega
          </button>
        </div>
      </td>
    `;

    const statusSelect = tr.querySelector(".order-status-select");
    statusSelect.addEventListener("change", async (e) => {
      const nuevoEstado = e.target.value;
      const isNowDelivered = nuevoEstado === "Entregado" || nuevoEstado === "Completada";

      // Actualizar inmediatamente estilos de rojo a verde (o viceversa)
      statusSelect.className = `order-status-select ${isNowDelivered ? 'status-green' : 'status-red'}`;
      const badgeElem = tr.querySelector(`#adminOrderBadge_${order.id}`);
      if (badgeElem) {
        badgeElem.className = isNowDelivered ? "badge-status-green" : "badge-status-red";
        badgeElem.textContent = isNowDelivered ? "🟢 Entregado" : (nuevoEstado === "Cancelada" ? "❌ Cancelada" : "🔴 Pendiente");
      }

      order.estado = nuevoEstado;
      const updateData = { estado: nuevoEstado };
      if (isNowDelivered && !order.fechaEntrega) {
        updateData.fechaEntrega = firebase.firestore.FieldValue.serverTimestamp();
      }

      // Requisito: Cuando pase a entregado, registrar automáticamente en Mis Notas
      if (isNowDelivered && !order.notaEntregaGenerada) {
        try {
          const itemsList = (order.productos || [])
            .map(p => `• ${p.cantidad}x ${p.titulo} ($ ${Number(p.precio * p.cantidad).toLocaleString('es-AR')})`)
            .join('\n');
          const costoEnvioTxt = Number(order.costoEnvio) > 0 ? ` (Delivery: $ ${Number(order.costoEnvio).toLocaleString('es-AR')})` : ' (Retiro Local)';
          const notaEntrega = {
            titulo: `🟢 Entrega Pedido #${order.id.slice(0, 6)} - ${order.clienteNombre}`,
            categoria: "logistica",
            pedidoId: order.id,
            contenido: `Pedido #${order.id.slice(0, 8).toUpperCase()} entregado con éxito.\n👤 Cliente: ${order.clienteNombre} (${order.clienteTelefono || 'Sin teléfono'})\n💰 Total: $ ${Number(order.total).toLocaleString('es-AR')}${costoEnvioTxt}\n📦 Productos:\n${itemsList}${order.notas ? `\n📝 Observaciones: ${order.notas}` : ''}`,
            creador: currentUser ? currentUser.email : "admin",
            fecha: firebase.firestore.FieldValue.serverTimestamp()
          };
          await window.db.collection(NOTES_COLLECTION).add(notaEntrega);
          updateData.notaEntregaGenerada = true;
          order.notaEntregaGenerada = true;
        } catch (errNota) {
          console.warn("No se pudo agregar nota automática a Mis Notas:", errNota);
        }
      }

      try {
        await window.db.collection(ORDERS_COLLECTION).doc(order.id).update(updateData);
        showToast(`✅ Pedido #${order.id.slice(0, 6)} actualizado a: ${nuevoEstado}`);
      } catch (err) {
        showToast(`❌ Error: ${err.message}`);
      }
    });

    const dnBtn = tr.querySelector(".view-dn-btn");
    if (dnBtn) {
      dnBtn.addEventListener("click", () => {
        abrirNotaDeEntrega(order);
      });
    }

    const quickWa = tr.querySelector(".quick-wa-btn");
    if (quickWa) {
      quickWa.addEventListener("click", (e) => {
        e.preventDefault();
        const telLimpio = formatearNumeroWhatsApp(order.clienteTelefono);
        const idCorto = (order.id || "").slice(0, 8).toUpperCase();
        const msg = `🐾 ¡Hola ${order.clienteNombre || 'estimado cliente'}! Te contactamos de *Kira PET love* respecto a tu compra *#ORD-${idCorto}* ($ ${Number(order.total).toLocaleString('es-AR')}). ¿En qué podemos ayudarte? 🐶🐱`;
        if (telLimpio) {
          window.open(`https://api.whatsapp.com/send?phone=${telLimpio}&text=${encodeURIComponent(msg)}`, "_blank");
        } else {
          window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, "_blank");
        }
      });
    }

    adminOrdersTableBody.appendChild(tr);
  });
}

function renderizarMisCompras() {
  if (!currentUser) return;

  const misPedidos = allOrders.filter((o) => o.clienteEmail === currentUser.email);
  if (profileOrdersCount) profileOrdersCount.textContent = misPedidos.length;
  if (adminBarMyOrdersCount) adminBarMyOrdersCount.textContent = misPedidos.length;

  const ordenesActivas = misPedidos.filter((o) => o.estado !== "Entregado" && o.estado !== "Completada" && o.estado !== "Cancelada");
  const ordenesCompletadas = misPedidos.filter((o) => o.estado === "Entregado" || o.estado === "Completada" || o.estado === "Cancelada");

  // 1. Banner en la tienda si hay orden en curso
  if (buyerActiveOrderBanner && buyerActiveOrderStatus) {
    if (ordenesActivas.length > 0) {
      buyerActiveOrderStatus.textContent = ordenesActivas[0].estado || "En Preparación";
      buyerActiveOrderBanner.style.display = "flex";
    } else {
      buyerActiveOrderBanner.style.display = "none";
    }
  }

  // 2. Sección de Órdenes Activas en Curso (con pasos visuales en vivo)
  if (myActiveOrdersSection) {
    myActiveOrdersSection.innerHTML = "";
    if (ordenesActivas.length > 0) {
      ordenesActivas.forEach((order) => {
        const div = document.createElement("div");
        div.className = "active-order-card";

        const estado = order.estado || "Nuevo Pedido";
        const isP1 = true;
        const isP2 = estado === "En Preparación" || estado === "En Camino" || estado === "Entregado" || estado === "Completada";
        const isP3 = estado === "En Camino" || estado === "Entregado" || estado === "Completada";
        const isP4 = estado === "Entregado" || estado === "Completada";

        const items = (order.productos || []).map((p) => `${p.cantidad}x ${p.titulo}`).join(", ");

        div.innerHTML = `
          <div class="order-tracker-header">
            <div>
              <strong style="font-size: 1.1rem; color: #0f766e;">🚀 Orden en Curso #${order.id.slice(0, 6)}</strong>
              <p style="color: #64748b; font-size: 0.9rem; margin-top: 2px;">${items}</p>
            </div>
            <div style="text-align: right;">
              <span class="badge-status-red" style="font-size: 0.88rem; padding: 6px 14px;">
                🔴 Pendiente (${estado})
              </span>
              <div style="font-size: 1.25rem; font-weight: 800; color: #0f766e; margin-top: 4px;">
                $ ${Number(order.total).toLocaleString("es-AR")}
              </div>
            </div>
          </div>

          <!-- Barra de pasos de seguimiento -->
          <div class="tracker-steps">
            <div class="tracker-step ${isP1 ? (estado === 'Nuevo Pedido' ? 'current' : 'completed') : ''}">
              <div class="step-circle">1</div>
              <div class="step-label">Recibido</div>
            </div>
            <div class="tracker-step ${isP2 ? (estado === 'En Preparación' ? 'current' : 'completed') : ''}">
              <div class="step-circle">2</div>
              <div class="step-label">En Preparación</div>
            </div>
            <div class="tracker-step ${isP3 ? (estado === 'En Camino' ? 'current' : 'completed') : ''}">
              <div class="step-circle">3</div>
              <div class="step-label">En Camino</div>
            </div>
            <div class="tracker-step ${isP4 ? 'completed' : ''}">
              <div class="step-circle">4</div>
              <div class="step-label">Entregado</div>
            </div>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; margin-top: 14px; border-top: 1px solid #e2e8f0; padding-top: 10px;">
            <p style="font-size: 0.85rem; color: #0f766e; font-weight: 700; margin: 0;">
              ℹ️ Tu pedido pasará a verde cuando sea entregado por el repartidor.
            </p>
            <button type="button" class="btn btn-secondary btn-sm active-dn-btn" style="font-weight: 700; display: inline-flex; align-items: center; gap: 6px;">
              📄 Ver Nota de Entrega
            </button>
          </div>
        `;

        const btn = div.querySelector(".active-dn-btn");
        if (btn) {
          btn.addEventListener("click", () => {
            abrirNotaDeEntrega(order);
          });
        }

        myActiveOrdersSection.appendChild(div);
      });
    }
  }

  // 3. Historial de compras realizadas
  if (myOrdersListContainer) {
    myOrdersListContainer.innerHTML = "";

    if (misPedidos.length === 0) {
      myOrdersListContainer.innerHTML = `
        <div class="empty-state">
          <div style="font-size: 3rem;">🛍️</div>
          <p>Aún no has realizado ninguna compra en Kira PET love.</p>
        </div>
      `;
      return;
    }

    misPedidos.forEach((ped) => {
      const div = document.createElement("div");
      div.style.padding = "16px";
      div.style.borderBottom = "1px solid #e2e8f0";

      const items = (ped.productos || []).map((p) => `${p.cantidad}x ${p.titulo}`).join(", ");
      const isDelivered = ped.estado === "Entregado" || ped.estado === "Completada";
      const isCancelled = ped.estado === "Cancelada";

      let statusBadgeHtml = '<span class="badge-status-red">🔴 Pendiente de Entrega</span>';
      if (isDelivered) {
        statusBadgeHtml = '<span class="badge-status-green">🟢 Entregado con Éxito</span>';
      } else if (isCancelled) {
        statusBadgeHtml = '<span style="color:#dc2626; font-weight:800; font-size:0.82rem;">❌ Cancelado</span>';
      }

      div.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
          <div>
            <strong style="font-size: 1.05rem; color: #0f766e;">Pedido #${ped.id.slice(0, 6)}</strong>
            <p style="color: #64748b; font-size: 0.9rem; margin-top: 2px;">${items}</p>
          </div>
          <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 6px;">
            <div style="font-size: 1.15rem; font-weight: 800; color: #0f766e;">$ ${Number(ped.total).toLocaleString("es-AR")}</div>
            ${statusBadgeHtml}
            <button type="button" class="btn btn-sm btn-secondary history-dn-btn" style="padding: 4px 10px; font-size: 0.78rem; font-weight: 700; display: inline-flex; align-items: center; gap: 4px;">
              📄 Ver Nota de Entrega
            </button>
          </div>
        </div>
      `;

      const histBtn = div.querySelector(".history-dn-btn");
      if (histBtn) {
        histBtn.addEventListener("click", () => {
          abrirNotaDeEntrega(ped);
        });
      }

      myOrdersListContainer.appendChild(div);
    });
  }
}

// Botones de acceso a Mis Compras
if (viewActiveOrderBtn) {
  viewActiveOrderBtn.addEventListener("click", () => {
    abrirMisCompras();
  });
}

if (profileViewOrdersBtn) {
  profileViewOrdersBtn.addEventListener("click", () => {
    profileModal.style.display = "none";
    abrirMisCompras();
  });
}

// ==============================================================
// 8. PANEL DE GANANCIAS, MÉTRICAS Y GRÁFICAS (ANALYTICS)
// ==============================================================
let currentStatsOrders = [];
let currentStatsMargin = 35;

function formatearNumeroWhatsApp(telefono) {
  if (!telefono) return "";
  let clean = String(telefono).replace(/\D/g, "");
  if (!clean) return "";
  if (clean.startsWith("0")) clean = clean.substring(1);
  if (clean.length === 10) {
    clean = "549" + clean;
  } else if (clean.length === 8) {
    clean = "54911" + clean;
  } else if (clean.startsWith("54") && !clean.startsWith("549") && clean.length === 12) {
    clean = "549" + clean.substring(2);
  }
  return clean;
}

function inicializarFechasAnalytics() {
  const ahora = new Date();
  const yyyy = ahora.getFullYear();
  const mm = String(ahora.getMonth() + 1).padStart(2, "0");

  const tresMesesAtras = new Date(ahora.getFullYear(), ahora.getMonth() - 2, 1);
  const yyyyDesde = tresMesesAtras.getFullYear();
  const mmDesde = String(tresMesesAtras.getMonth() + 1).padStart(2, "0");

  if (statsMonthFrom && !statsMonthFrom.value) {
    statsMonthFrom.value = `${yyyyDesde}-${mmDesde}`;
  }
  if (statsMonthTo && !statsMonthTo.value) {
    statsMonthTo.value = `${yyyy}-${mm}`;
  }
  if (statsProfitMargin && !statsProfitMargin.value) {
    statsProfitMargin.value = "35";
  }
}

function actualizarPanelMetricasYGanancias() {
  inicializarFechasAnalytics();

  const mesDesdeStr = statsMonthFrom ? statsMonthFrom.value : "";
  const mesHastaStr = statsMonthTo ? statsMonthTo.value : "";
  currentStatsMargin = Number(statsProfitMargin ? statsProfitMargin.value : 35) || 35;

  let fechaInicio = null;
  let fechaFin = null;

  if (mesDesdeStr) {
    const parts = mesDesdeStr.split("-").map(Number);
    if (parts.length === 2) {
      fechaInicio = new Date(parts[0], parts[1] - 1, 1, 0, 0, 0, 0);
    }
  }
  if (mesHastaStr) {
    const parts = mesHastaStr.split("-").map(Number);
    if (parts.length === 2) {
      fechaFin = new Date(parts[0], parts[1], 0, 23, 59, 59, 999);
    }
  }

  // Filtrar allOrders en el rango de meses seleccionado
  currentStatsOrders = allOrders.filter((order) => {
    if (!order.fecha) return true;
    let fechaOrden = null;
    try {
      fechaOrden = order.fecha.toDate ? order.fecha.toDate() : new Date(order.fecha);
    } catch (_) {
      return true;
    }
    if (fechaInicio && fechaOrden < fechaInicio) return false;
    if (fechaFin && fechaOrden > fechaFin) return false;
    return true;
  });

  // Calcular KPIs
  let totalVentas = 0;
  let totalVentasEntregadas = 0;
  let pedidosEntregados = 0;
  let pedidosPendientes = 0;
  let pedidosCancelados = 0;
  let totalUnidadesVendidas = 0;
  let totalCostoProductos = 0;
  const mapaProductos = {};
  const mapaMensual = {};

  if (fechaInicio && fechaFin) {
    let cursor = new Date(fechaInicio.getFullYear(), fechaInicio.getMonth(), 1);
    while (cursor <= fechaFin) {
      const key = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, "0")}`;
      const nombreMes = cursor.toLocaleDateString("es-AR", { month: "short", year: "numeric" });
      mapaMensual[key] = { label: nombreMes, ventas: 0, ganancia: 0, pedidos: 0 };
      cursor.setMonth(cursor.getMonth() + 1);
    }
  }

  currentStatsOrders.forEach((order) => {
    const total = Number(order.total) || 0;
    const isDelivered = order.estado === "Entregado" || order.estado === "Completada";
    const isCancelled = order.estado === "Cancelada";

    if (isCancelled) {
      pedidosCancelados++;
    } else {
      totalVentas += total;
      if (isDelivered) {
        pedidosEntregados++;
        totalVentasEntregadas += total;
      } else {
        pedidosPendientes++;
      }
    }

    // Unidades y productos vendidos con costo de compra
    (order.productos || []).forEach((p) => {
      const qty = Number(p.cantidad) || 1;
      const sub = Number(p.precio) * qty || 0;
      totalUnidadesVendidas += qty;

      const prodOriginal = storeProducts.find((sp) => sp.id === p.id || (sp.titulo && sp.titulo.toLowerCase() === (p.titulo || "").toLowerCase()));
      const costoUnitario = Number(p.precioCompra || (prodOriginal ? prodOriginal.precioCompra : 0)) || 0;
      const costoLinea = costoUnitario > 0 ? (costoUnitario * qty) : (sub * (1 - (currentStatsMargin / 100)));
      totalCostoProductos += costoLinea;

      const tit = p.titulo || "Producto";
      if (!mapaProductos[tit]) {
        mapaProductos[tit] = {
          titulo: tit,
          cantidad: 0,
          total: 0,
          costoTotal: 0,
          imagen: p.imagen || (p.imagenes && p.imagenes[0]) || "",
          emoji: p.emoji || "🐾",
          id: p.id || ""
        };
      }
      mapaProductos[tit].cantidad += qty;
      mapaProductos[tit].total += sub;
      mapaProductos[tit].costoTotal += costoLinea;
    });

    // Agrupación mensual
    if (!isCancelled && order.fecha) {
      try {
        const d = order.fecha.toDate ? order.fecha.toDate() : new Date(order.fecha);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        if (!mapaMensual[key]) {
          const nombreMes = d.toLocaleDateString("es-AR", { month: "short", year: "numeric" });
          mapaMensual[key] = { label: nombreMes, ventas: 0, ganancia: 0, pedidos: 0 };
        }
        mapaMensual[key].ventas += total;
        mapaMensual[key].pedidos++;
        mapaMensual[key].ganancia += total * (currentStatsMargin / 100);
      } catch (_) {}
    }
  });

  const gananciaReal = Math.max(0, totalVentas - totalCostoProductos);
  const rentabilidadReal = totalVentas > 0 ? Math.round((gananciaReal / totalVentas) * 100) : currentStatsMargin;
  const ticketPromedio = currentStatsOrders.length > 0 ? (totalVentas / currentStatsOrders.length) : 0;

  if (kpiTotalSales) kpiTotalSales.textContent = `$ ${Math.round(totalVentas).toLocaleString("es-AR")}`;
  if (kpiSalesSub) kpiSalesSub.textContent = `Ventas Entregadas: $ ${Math.round(totalVentasEntregadas).toLocaleString("es-AR")}`;
  if (kpiTotalProfit) kpiTotalProfit.textContent = `$ ${Math.round(gananciaReal).toLocaleString("es-AR")}`;
  if (kpiProfitSub) kpiProfitSub.textContent = `Costo mercadería: $ ${Math.round(totalCostoProductos).toLocaleString("es-AR")} • Rentabilidad: ${rentabilidadReal}%`;
  if (kpiTotalOrders) kpiTotalOrders.textContent = currentStatsOrders.length;
  if (kpiOrdersSub) kpiOrdersSub.textContent = `🟢 ${pedidosEntregados} Entregados • 🔴 ${pedidosPendientes} Pendientes${pedidosCancelados ? ` • ❌ ${pedidosCancelados} Cancelados` : ''}`;
  if (kpiAverageTicket) kpiAverageTicket.textContent = `$ ${Math.round(ticketPromedio).toLocaleString("es-AR")}`;
  if (kpiUnitsSub) kpiUnitsSub.textContent = `${totalUnidadesVendidas} productos vendidos en total`;

  dibujarGraficaVentasMensuales(mapaMensual);
  renderizarTopProductos(mapaProductos);
  renderizarTablaAnalyticsOrdenes();
}

function dibujarGraficaVentasMensuales(mapaMensual) {
  if (!salesChartCanvas) return;
  const ctx = salesChartCanvas.getContext("2d");
  if (!ctx) return;

  const keys = Object.keys(mapaMensual).sort();
  const rect = salesChartCanvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  const w = rect.width || 600;
  const h = 260;

  salesChartCanvas.width = w * dpr;
  salesChartCanvas.height = h * dpr;
  ctx.scale(dpr, dpr);

  ctx.clearRect(0, 0, w, h);

  if (keys.length === 0) {
    ctx.fillStyle = "#94a3b8";
    ctx.font = "14px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("No hay datos de ventas registrados en este período", w / 2, h / 2);
    return;
  }

  let maxVal = 1000;
  keys.forEach((k) => {
    if (mapaMensual[k].ventas > maxVal) maxVal = mapaMensual[k].ventas;
  });
  maxVal = Math.ceil(maxVal * 1.15);

  const paddingLeft = 55;
  const paddingRight = 20;
  const paddingTop = 25;
  const paddingBottom = 40;
  const plotWidth = w - paddingLeft - paddingRight;
  const plotHeight = h - paddingTop - paddingBottom;

  ctx.strokeStyle = "#e2e8f0";
  ctx.lineWidth = 1;
  ctx.fillStyle = "#94a3b8";
  ctx.font = "10px monospace";
  ctx.textAlign = "right";

  const numGridLines = 4;
  for (let i = 0; i <= numGridLines; i++) {
    const val = (maxVal / numGridLines) * i;
    const y = paddingTop + plotHeight - (plotHeight / numGridLines) * i;
    ctx.beginPath();
    ctx.moveTo(paddingLeft, y);
    ctx.lineTo(w - paddingRight, y);
    ctx.stroke();
    ctx.fillText(`$${(val >= 1000 ? (val / 1000).toFixed(0) + "k" : Math.round(val))}`, paddingLeft - 6, y + 3);
  }

  const groupWidth = plotWidth / keys.length;
  const barWidth = Math.max(8, Math.min(28, (groupWidth - 14) / 2));

  keys.forEach((k, index) => {
    const mes = mapaMensual[k];
    const groupCenterX = paddingLeft + groupWidth * index + groupWidth / 2;

    const xVentas = groupCenterX - barWidth - 2;
    const hVentas = Math.max(2, (mes.ventas / maxVal) * plotHeight);
    const yVentas = paddingTop + plotHeight - hVentas;

    const xGanancia = groupCenterX + 2;
    const hGanancia = Math.max(2, (mes.ganancia / maxVal) * plotHeight);
    const yGanancia = paddingTop + plotHeight - hGanancia;

    ctx.fillStyle = "#0f766e";
    if (ctx.roundRect) {
      ctx.beginPath();
      ctx.roundRect(xVentas, yVentas, barWidth, hVentas, [4, 4, 0, 0]);
      ctx.fill();
    } else {
      ctx.fillRect(xVentas, yVentas, barWidth, hVentas);
    }

    ctx.fillStyle = "#10b981";
    if (ctx.roundRect) {
      ctx.beginPath();
      ctx.roundRect(xGanancia, yGanancia, barWidth, hGanancia, [4, 4, 0, 0]);
      ctx.fill();
    } else {
      ctx.fillRect(xGanancia, yGanancia, barWidth, hGanancia);
    }

    ctx.fillStyle = "#475569";
    ctx.font = "11px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(mes.label || k, groupCenterX, h - 14);

    if (mes.ventas > 0 && keys.length <= 8) {
      ctx.fillStyle = "#0f766e";
      ctx.font = "9px monospace";
      ctx.fillText(`$${(mes.ventas / 1000).toFixed(0)}k`, groupCenterX, Math.min(yVentas, yGanancia) - 5);
    }
  });

  if (salesChartSummaryText) {
    salesChartSummaryText.textContent = `Mostrando ${keys.length} meses analizados con margen estimado del ${currentStatsMargin}%`;
  }
}

function renderizarTopProductos(mapaProductos) {
  if (!topProductsContainer) return;
  topProductsContainer.innerHTML = "";

  const prods = Object.values(mapaProductos).sort((a, b) => b.cantidad - a.cantidad);
  if (prods.length === 0) {
    topProductsContainer.innerHTML = `
      <div style="text-align: center; padding: 24px; color: #94a3b8;">
        📦 No hay ventas de productos registradas en este período.
      </div>
    `;
    return;
  }

  const top10 = prods.slice(0, 10);
  const maxQty = top10[0].cantidad || 1;

  top10.forEach((p, idx) => {
    const pct = Math.round((p.cantidad / maxQty) * 100);
    const div = document.createElement("div");
    div.className = "top-prod-item";

    let imgHtml = '<span style="font-size: 1.2rem;">🐾</span>';
    if (p.imagen && (p.imagen.startsWith("data:") || p.imagen.startsWith("http"))) {
      imgHtml = `<img src="${p.imagen}" alt="${escapeHtml(p.titulo)}" class="top-prod-thumb">`;
    } else if (p.emoji) {
      imgHtml = `<span style="font-size: 1.2rem;">${p.emoji}</span>`;
    }

    div.innerHTML = `
      <div class="top-prod-row">
        <div class="top-prod-title">
          <span style="font-weight: 800; color: #0f766e; width: 16px;">#${idx + 1}</span>
          ${imgHtml}
          <span>${escapeHtml(p.titulo)}</span>
        </div>
        <div class="top-prod-meta">
          <strong>${p.cantidad} u.</strong> • $ ${Math.round(p.total).toLocaleString("es-AR")}
        </div>
      </div>
      <div class="top-prod-bar-bg">
        <div class="top-prod-bar-fill" style="width: ${pct}%;"></div>
      </div>
    `;
    topProductsContainer.appendChild(div);
  });
}

function renderizarTablaAnalyticsOrdenes() {
  if (!analyticsOrdersTableBody) return;
  analyticsOrdersTableBody.innerHTML = "";

  const filtro = (analyticsTableSearch ? analyticsTableSearch.value : "").trim().toLowerCase();
  const filtradas = currentStatsOrders.filter((order) => {
    if (!filtro) return true;
    const matchId = (order.id || "").toLowerCase().includes(filtro);
    const matchNom = (order.clienteNombre || "").toLowerCase().includes(filtro);
    const matchTel = (order.clienteTelefono || "").toLowerCase().includes(filtro);
    const matchProd = (order.productos || []).some((p) => (p.titulo || "").toLowerCase().includes(filtro));
    return matchId || matchNom || matchTel || matchProd;
  });

  if (analyticsOrdersCount) analyticsOrdersCount.textContent = filtradas.length;

  if (filtradas.length === 0) {
    if (analyticsNoOrdersMsg) analyticsNoOrdersMsg.style.display = "block";
    return;
  }
  if (analyticsNoOrdersMsg) analyticsNoOrdersMsg.style.display = "none";

  filtradas.forEach((order) => {
    const tr = document.createElement("tr");
    const itemsStr = (order.productos || []).map((p) => `${p.cantidad}x ${p.titulo}`).join("<br>");
    const totalNum = Number(order.total) || 0;
    const gananciaEst = totalNum * (currentStatsMargin / 100);

    const isDelivered = order.estado === "Entregado" || order.estado === "Completada";
    const badgeClass = isDelivered ? "badge-status-green" : (order.estado === "Cancelada" ? "" : "badge-status-red");
    const badgeLabel = isDelivered ? "🟢 Entregado" : (order.estado === "Cancelada" ? "❌ Cancelada" : `🔴 ${order.estado || 'Pendiente'}`);

    let fechaStr = "-";
    if (order.fecha) {
      try {
        const d = order.fecha.toDate ? order.fecha.toDate() : new Date(order.fecha);
        fechaStr = d.toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" });
      } catch (_) {}
    }

    tr.innerHTML = `
      <td><strong style="color: #0f766e;">#${(order.id || "").slice(0, 6)}</strong></td>
      <td><small>${fechaStr}</small></td>
      <td>
        <strong>${escapeHtml(order.clienteNombre)}</strong><br>
        <div style="display:flex; align-items:center; gap:4px; margin-top:2px;">
          <small style="color: #64748b;">${escapeHtml(order.clienteTelefono || 'Sin tel')}</small>
          ${order.clienteTelefono ? `<a href="#" class="quick-wa-btn" title="Contactar por WhatsApp">📲</a>` : ''}
        </div>
      </td>
      <td><small>${itemsStr}</small></td>
      <td class="text-right"><strong>$ ${Math.round(totalNum).toLocaleString("es-AR")}</strong></td>
      <td class="text-right" style="color: #15803d; font-weight: 800;">$ ${Math.round(gananciaEst).toLocaleString("es-AR")}</td>
      <td><span class="${badgeClass}">${badgeLabel}</span></td>
      <td class="text-right">
        <button type="button" class="btn btn-sm btn-secondary view-dn-analytics-btn" style="padding: 4px 10px; font-size: 0.78rem; font-weight: 700; white-space: nowrap;">
          📄 Ver Nota
        </button>
      </td>
    `;

    const waBtn = tr.querySelector(".quick-wa-btn");
    if (waBtn) {
      waBtn.addEventListener("click", (e) => {
        e.preventDefault();
        const telLimpio = formatearNumeroWhatsApp(order.clienteTelefono);
        const msg = `🐾 ¡Hola ${order.clienteNombre || 'estimado cliente'}! Te escribimos de *Kira PET love* sobre tu compra *#ORD-${(order.id||'').slice(0,8).toUpperCase()}*. ¿En qué podemos ayudarte? 🐶🐱`;
        if (telLimpio) {
          window.open(`https://api.whatsapp.com/send?phone=${telLimpio}&text=${encodeURIComponent(msg)}`, "_blank");
        } else {
          window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, "_blank");
        }
      });
    }

    const dnBtn = tr.querySelector(".view-dn-analytics-btn");
    if (dnBtn) {
      dnBtn.addEventListener("click", () => {
        abrirNotaDeEntrega(order);
      });
    }

    analyticsOrdersTableBody.appendChild(tr);
  });
}

function exportarOrdenesExcel() {
  if (currentStatsOrders.length === 0) {
    showToast("⚠️ No hay órdenes en el período seleccionado para exportar.");
    return;
  }

  const desde = statsMonthFrom ? statsMonthFrom.value : "inicio";
  const hasta = statsMonthTo ? statsMonthTo.value : "fin";

  let csv = "\uFEFF";
  csv += "N° Pedido;Fecha Compra;Cliente;Telefono;Email;Productos Comprados;Cantidad Total;Total Venta ($);Margen (%);Ganancia Estimada ($);Estado;Notas\n";

  currentStatsOrders.forEach((order) => {
    let fechaStr = "";
    if (order.fecha) {
      try {
        const d = order.fecha.toDate ? order.fecha.toDate() : new Date(order.fecha);
        fechaStr = d.toLocaleDateString("es-AR") + " " + d.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });
      } catch (_) {}
    }

    const totalNum = Number(order.total) || 0;
    const ganancia = totalNum * (currentStatsMargin / 100);
    const productosTxt = (order.productos || []).map((p) => `${p.cantidad}x ${p.titulo}`).join(" | ").replace(/;/g, ",");
    const totalUnidades = (order.productos || []).reduce((acc, p) => acc + (Number(p.cantidad) || 1), 0);
    const notasTxt = (order.notas || "").replace(/(\r\n|\n|\r)/gm, " ").replace(/;/g, ",");

    const row = [
      `#ORD-${(order.id || "").slice(0, 8).toUpperCase()}`,
      `"${fechaStr}"`,
      `"${(order.clienteNombre || '').replace(/"/g, '""')}"`,
      `"${(order.clienteTelefono || '').replace(/"/g, '""')}"`,
      `"${(order.clienteEmail || '').replace(/"/g, '""')}"`,
      `"${productosTxt}"`,
      totalUnidades,
      Math.round(totalNum),
      `${currentStatsMargin}%`,
      Math.round(ganancia),
      `"${order.estado || 'Nuevo Pedido'}"`,
      `"${notasTxt}"`
    ];
    csv += row.join(";") + "\n";
  });

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Kira_PET_love_Reporte_Ventas_${desde}_a_${hasta}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast("📗 Reporte exportado a Excel con éxito.");
}

function imprimirReportePdf() {
  if (!printableAnalyticsReport) {
    window.print();
    return;
  }

  const desde = statsMonthFrom ? statsMonthFrom.value : "-";
  const hasta = statsMonthTo ? statsMonthTo.value : "-";
  const ahora = new Date();

  if (prPeriodText) prPeriodText.textContent = `${desde} al ${hasta}`;
  if (prPrintDate) prPrintDate.textContent = ahora.toLocaleDateString("es-AR") + " " + ahora.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });
  if (prMarginText) prMarginText.textContent = `${currentStatsMargin}%`;

  if (kpiTotalSales && prTotalSales) prTotalSales.textContent = kpiTotalSales.textContent;
  if (kpiTotalProfit && prTotalProfit) prTotalProfit.textContent = kpiTotalProfit.textContent;
  if (kpiTotalOrders && prTotalOrders) prTotalOrders.textContent = kpiTotalOrders.textContent;
  if (kpiAverageTicket && prAvgTicket) prAvgTicket.textContent = kpiAverageTicket.textContent;

  if (prTopProductsTableWrapper) {
    const mapaProductos = {};
    currentStatsOrders.forEach((o) => {
      (o.productos || []).forEach((p) => {
        const tit = p.titulo || "Producto";
        if (!mapaProductos[tit]) mapaProductos[tit] = { titulo: tit, cantidad: 0, total: 0 };
        mapaProductos[tit].cantidad += (Number(p.cantidad) || 1);
        mapaProductos[tit].total += (Number(p.precio) * (Number(p.cantidad) || 1)) || 0;
      });
    });
    const prods = Object.values(mapaProductos).sort((a, b) => b.cantidad - a.cantidad).slice(0, 5);
    let html = `
      <table class="dn-items-table" style="width:100%; border-collapse:collapse; margin-bottom:12px;">
        <thead>
          <tr style="background:#f1f5f9;">
            <th style="padding:6px; text-align:left;">Ranking / Producto</th>
            <th style="padding:6px; text-align:center; width:90px;">Unidades</th>
            <th style="padding:6px; text-align:right; width:120px;">Total Venta</th>
          </tr>
        </thead>
        <tbody>
    `;
    prods.forEach((p, idx) => {
      html += `
        <tr>
          <td style="padding:6px; border-bottom:1px solid #e2e8f0;"><strong>#${idx + 1}</strong> ${escapeHtml(p.titulo)}</td>
          <td style="padding:6px; border-bottom:1px solid #e2e8f0; text-align:center;">${p.cantidad} u.</td>
          <td style="padding:6px; border-bottom:1px solid #e2e8f0; text-align:right;">$ ${Math.round(p.total).toLocaleString('es-AR')}</td>
        </tr>
      `;
    });
    html += `</tbody></table>`;
    prTopProductsTableWrapper.innerHTML = html;
  }

  if (prOrdersTableWrapper) {
    let html = `
      <table class="dn-items-table" style="width:100%; border-collapse:collapse;">
        <thead>
          <tr style="background:#f1f5f9;">
            <th style="padding:6px; text-align:left;">N° Pedido</th>
            <th style="padding:6px; text-align:left;">Fecha</th>
            <th style="padding:6px; text-align:left;">Cliente</th>
            <th style="padding:6px; text-align:right;">Total</th>
            <th style="padding:6px; text-align:right;">Ganancia Est.</th>
            <th style="padding:6px; text-align:center;">Estado</th>
          </tr>
        </thead>
        <tbody>
    `;
    currentStatsOrders.forEach((o) => {
      const tot = Number(o.total) || 0;
      const gan = tot * (currentStatsMargin / 100);
      let fechaStr = "-";
      if (o.fecha) {
        try {
          const d = o.fecha.toDate ? o.fecha.toDate() : new Date(o.fecha);
          fechaStr = d.toLocaleDateString("es-AR");
        } catch (_) {}
      }
      html += `
        <tr>
          <td style="padding:6px; border-bottom:1px solid #e2e8f0;">#${(o.id||'').slice(0,6)}</td>
          <td style="padding:6px; border-bottom:1px solid #e2e8f0;">${fechaStr}</td>
          <td style="padding:6px; border-bottom:1px solid #e2e8f0;">${escapeHtml(o.clienteNombre)}</td>
          <td style="padding:6px; border-bottom:1px solid #e2e8f0; text-align:right;">$ ${Math.round(tot).toLocaleString('es-AR')}</td>
          <td style="padding:6px; border-bottom:1px solid #e2e8f0; text-align:right; color:#15803d;">$ ${Math.round(gan).toLocaleString('es-AR')}</td>
          <td style="padding:6px; border-bottom:1px solid #e2e8f0; text-align:center;">${o.estado || 'Nuevo'}</td>
        </tr>
      `;
    });
    html += `</tbody></table>`;
    prOrdersTableWrapper.innerHTML = html;
  }

  window.print();
}

// Oyentes de Analytics
if (applyStatsFilterBtn) {
  applyStatsFilterBtn.addEventListener("click", actualizarPanelMetricasYGanancias);
}
if (analyticsExportExcelBtn) {
  analyticsExportExcelBtn.addEventListener("click", exportarOrdenesExcel);
}
if (analyticsPrintPdfBtn) {
  analyticsPrintPdfBtn.addEventListener("click", imprimirReportePdf);
}
if (analyticsTableSearch) {
  analyticsTableSearch.addEventListener("input", renderizarTablaAnalyticsOrdenes);
}
document.querySelectorAll(".quick-preset-pill").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".quick-preset-pill").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    const preset = btn.getAttribute("data-preset");
    const ahora = new Date();
    const yyyy = ahora.getFullYear();
    const mm = String(ahora.getMonth() + 1).padStart(2, "0");
    if (preset === "thisMonth") {
      statsMonthFrom.value = `${yyyy}-${mm}`;
      statsMonthTo.value = `${yyyy}-${mm}`;
    } else if (preset === "last3") {
      const d = new Date(yyyy, ahora.getMonth() - 2, 1);
      statsMonthFrom.value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      statsMonthTo.value = `${yyyy}-${mm}`;
    } else if (preset === "last6") {
      const d = new Date(yyyy, ahora.getMonth() - 5, 1);
      statsMonthFrom.value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      statsMonthTo.value = `${yyyy}-${mm}`;
    } else if (preset === "thisYear") {
      statsMonthFrom.value = `${yyyy}-01`;
      statsMonthTo.value = `${yyyy}-12`;
    } else if (preset === "all") {
      statsMonthFrom.value = "2024-01";
      statsMonthTo.value = `${yyyy + 1}-12`;
    }
    actualizarPanelMetricasYGanancias();
  });
});

// ==============================================================
// 9. BLOC DE NOTAS DEL NEGOCIO (KIRA NOTAS)
// ==============================================================
let allAdminNotes = [];
const NOTES_COLLECTION = "kira_notas";

function iniciarEscuchaNotasAdmin() {
  try {
    window.db.collection(NOTES_COLLECTION).orderBy("fecha", "desc").onSnapshot((snapshot) => {
      allAdminNotes = [];
      snapshot.forEach((doc) => {
        allAdminNotes.push({ id: doc.id, ...doc.data() });
      });
      actualizarContadorNotas();
      renderizarTableroNotas();
    }, (err) => {
      console.warn("Firestore notas fallback local:", err);
      cargarNotasLocal();
    });
  } catch (e) {
    cargarNotasLocal();
  }
}

function cargarNotasLocal() {
  try {
    const raw = localStorage.getItem("kira_admin_notes");
    allAdminNotes = raw ? JSON.parse(raw) : [];
  } catch (_) {
    allAdminNotes = [];
  }
  actualizarContadorNotas();
  renderizarTableroNotas();
}

function guardarNotasLocal() {
  try {
    localStorage.setItem("kira_admin_notes", JSON.stringify(allAdminNotes));
  } catch (_) {}
  actualizarContadorNotas();
}

function actualizarContadorNotas() {
  const count = allAdminNotes.length;
  if (notesCountBadge) notesCountBadge.textContent = count;
  if (adminBarNotesCount) adminBarNotesCount.textContent = count;
}

function renderizarTableroNotas() {
  if (!adminNotesListContainer) return;
  adminNotesListContainer.innerHTML = "";

  const query = (notesSearchInput ? notesSearchInput.value : "").trim().toLowerCase();
  const filtradas = allAdminNotes.filter((n) => {
    if (!query) return true;
    return (n.titulo || "").toLowerCase().includes(query) || (n.contenido || "").toLowerCase().includes(query) || (n.categoria || "").toLowerCase().includes(query);
  });

  if (filtradas.length === 0) {
    if (noNotesMsg) noNotesMsg.style.display = "block";
    return;
  }
  if (noNotesMsg) noNotesMsg.style.display = "none";

  filtradas.forEach((note) => {
    const card = document.createElement("div");
    card.className = `note-card note-${note.categoria || 'general'}`;

    let fechaStr = "Hoy";
    if (note.fecha) {
      try {
        const d = note.fecha.toDate ? note.fecha.toDate() : new Date(note.fecha);
        fechaStr = d.toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
      } catch (_) {}
    }

    const catLabels = {
      urgente: "📌 Urgente",
      logistica: "🚚 Logística",
      proveedor: "🐾 Proveedor",
      ideas: "💡 Idea",
      general: "📝 General"
    };

    card.innerHTML = `
      <div class="note-header">
        <h4>${escapeHtml(note.titulo)}</h4>
        <span class="note-tag tag-${note.categoria || 'general'}">${catLabels[note.categoria] || 'Nota'}</span>
      </div>
      <div class="note-body">${escapeHtml(note.contenido)}</div>
      <div class="note-footer">
        <span class="note-date">🕒 ${fechaStr}</span>
        <button type="button" class="note-del-btn" title="Eliminar nota" data-id="${note.id}">🗑️ Eliminar</button>
      </div>
    `;

    card.querySelector(".note-del-btn").addEventListener("click", async () => {
      if (!confirm(`¿Eliminar la nota "${note.titulo}"?`)) return;
      try {
        await window.db.collection(NOTES_COLLECTION).doc(note.id).delete();
        showToast("🗑️ Nota eliminada");
      } catch (_) {
        allAdminNotes = allAdminNotes.filter((n) => n.id !== note.id);
        guardarNotasLocal();
        renderizarTableroNotas();
        showToast("🗑️ Nota eliminada");
      }
    });

    adminNotesListContainer.appendChild(card);
  });
}

if (notesSearchInput) {
  notesSearchInput.addEventListener("input", renderizarTableroNotas);
}

if (newAdminNoteForm) {
  newAdminNoteForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const titulo = noteTitleInput ? noteTitleInput.value.trim() : "";
    const categoria = noteCategorySelect ? noteCategorySelect.value : "general";
    const contenido = noteContentInput ? noteContentInput.value.trim() : "";
    if (!titulo || !contenido) return;

    const nuevaNota = {
      titulo,
      categoria,
      contenido,
      creador: currentUser ? currentUser.email : "admin",
      fecha: firebase.firestore.FieldValue.serverTimestamp()
    };

    try {
      await window.db.collection(NOTES_COLLECTION).add(nuevaNota);
      showToast("✅ Nota guardada en el tablero");
      newAdminNoteForm.reset();
    } catch (_) {
      nuevaNota.id = "local_" + Date.now();
      nuevaNota.fecha = new Date().toISOString();
      allAdminNotes.unshift(nuevaNota);
      guardarNotasLocal();
      renderizarTableroNotas();
      showToast("✅ Nota guardada localmente");
      newAdminNoteForm.reset();
    }
  });
}

// ==============================================================
// 10. UTILIDADES
// ==============================================================
let toastTimer;
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 3500);
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
