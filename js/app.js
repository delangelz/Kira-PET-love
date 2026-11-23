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
const catPills = document.querySelectorAll(".cat-pill");
const connectionStatus = document.getElementById("connectionStatus");
const statusText = document.getElementById("statusText");
const toast = document.getElementById("toast");

// Carrito
const cartCount = document.getElementById("cartCount");
const openCartBtn = document.getElementById("openCartBtn");
const closeCartBtn = document.getElementById("closeCartBtn");
const cartModal = document.getElementById("cartModal");
const cartItemsList = document.getElementById("cartItemsList");
const cartTotalPrice = document.getElementById("cartTotalPrice");
const checkoutBtn = document.getElementById("checkoutBtn");

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

const exitProductsBtn = document.getElementById("exitProductsBtn");
const exitOrdersBtn = document.getElementById("exitOrdersBtn");
const exitUsersBtn = document.getElementById("exitUsersBtn");

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
window.addEventListener("DOMContentLoaded", async () => {
  actualizarUIUsuario();
  actualizarBadgeCarrito();

  if (typeof isFirebaseConfigured === "function" && isFirebaseConfigured() && window.db) {
    connectionStatus.className = "status-indicator connected";
    statusText.textContent = "🟢 Conectado con Kira PET love en tiempo real";
    
    // Asegurar cuenta admin inicial sólo si no existe ningún admin
    await asegurarCuentaAdminPorDefecto();

    // Oyentes en vivo
    iniciarEscuchaAjustesTienda();
    iniciarEscuchaProductosEnVivo();
    iniciarEscuchaPedidosEnVivo();
    iniciarEscuchaUsuariosEnVivo();
  } else {
    connectionStatus.className = "status-indicator error";
    statusText.textContent = "Revisa las claves en firebase-config.js";
  }
});

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
  const search = storeSearchInput.value.trim().toLowerCase();

  const filtrados = storeProducts.filter((item) => {
    if (currentCategory !== "todos" && item.categoria !== currentCategory) {
      return false;
    }
    const titleMatch = item.titulo ? item.titulo.toLowerCase().includes(search) : false;
    const catMatch = item.categoria ? item.categoria.toLowerCase().includes(search) : false;
    return titleMatch || catMatch;
  });

  productsCount.textContent = `${filtrados.length} productos`;
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
    currentCategory = btn.getAttribute("data-cat");
    currentCategoryTitle.textContent = btn.textContent;
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
  if (imageLightboxModal) imageLightboxModal.style.display = "none";
}

function actualizarContenidoLightbox() {
  if (!lightboxMediaContainer) return;
  const currentImg = currentDetailImages[lightboxCurrentIndex] || "🐾";
  const isUrl = currentImg.startsWith("http://") || currentImg.startsWith("https://") || currentImg.startsWith("data:image");

  if (isUrl) {
    lightboxMediaContainer.innerHTML = `<img src="${escapeHtml(currentImg)}" alt="Foto ampliada" id="lightboxImgEl" title="Haz clic para alternar zoom">`;
    const imgEl = document.getElementById("lightboxImgEl");
    if (imgEl) {
      imgEl.addEventListener("click", () => {
        imgEl.classList.toggle("zoomed");
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
    storeSettingsModal.style.display = "flex";
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

    const rol = currentUser.rol || "comprador";
    userRoleBadge.textContent = rol;
    userRoleBadge.className = `role-badge role-${rol}`;

    // Si es Admin o Vendedor, se activan sus botones directamente en la barra superior señalada
    if (rol === "admin") {
      buyerCategoriesBar.style.display = "none";
      adminNavHeaderBar.style.display = "flex";
      adminBarUsersBtn.style.display = "inline-flex";
      if (adminBarSettingsBtn) adminBarSettingsBtn.style.display = "inline-flex";
      openMyOrdersBtn.style.display = "none";
    } else if (rol === "vendedor") {
      buyerCategoriesBar.style.display = "none";
      adminNavHeaderBar.style.display = "flex";
      adminBarUsersBtn.style.display = "none";
      if (adminBarSettingsBtn) adminBarSettingsBtn.style.display = "none";
      openMyOrdersBtn.style.display = "none";
    } else {
      buyerCategoriesBar.style.display = "flex";
      adminNavHeaderBar.style.display = "none";
      if (adminBarSettingsBtn) adminBarSettingsBtn.style.display = "none";
      openMyOrdersBtn.style.display = "inline-flex";
    }
    renderizarMisCompras();
  } else {
    userLoggedOut.style.display = "flex";
    userLoggedIn.style.display = "none";
    buyerCategoriesBar.style.display = "flex";
    adminNavHeaderBar.style.display = "none";
    if (adminBarSettingsBtn) adminBarSettingsBtn.style.display = "none";
    if (buyerActiveOrderBanner) buyerActiveOrderBanner.style.display = "none";
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
}

function marcarBotonAdminActivo(btn) {
  [adminBarStoreBtn, adminBarProductsBtn, adminBarOrdersBtn, adminBarUsersBtn].forEach((b) => {
    if (b) b.classList.remove("active");
  });
  if (btn) btn.classList.add("active");
}

function mostrarTienda() {
  ocultarTodasLasVistas();
  storeView.style.display = "block";
  marcarBotonAdminActivo(adminBarStoreBtn);
}

function mostrarMisProductos() {
  ocultarTodasLasVistas();
  productsManagementView.style.display = "block";
  marcarBotonAdminActivo(adminBarProductsBtn);
  renderizarTablaAdminProductos();
}

function mostrarPedidosClientes() {
  ocultarTodasLasVistas();
  ordersManagementView.style.display = "block";
  marcarBotonAdminActivo(adminBarOrdersBtn);
  renderizarTablaAdminPedidos();
}

function mostrarGestionUsuarios() {
  ocultarTodasLasVistas();
  usersManagementView.style.display = "block";
  marcarBotonAdminActivo(adminBarUsersBtn);
  renderizarTablaUsuariosAdmin();
}

function abrirMisCompras() {
  if (!currentUser) {
    showToast("🐾 Creá tu cuenta o ingresá para ver tus compras");
    registerModal.style.display = "flex";
    return;
  }
  ocultarTodasLasVistas();
  myOrdersView.style.display = "block";
  renderizarMisCompras();
}

// Botones de la barra superior
if (adminBarStoreBtn) adminBarStoreBtn.addEventListener("click", mostrarTienda);
if (adminBarProductsBtn) adminBarProductsBtn.addEventListener("click", mostrarMisProductos);
if (adminBarOrdersBtn) adminBarOrdersBtn.addEventListener("click", mostrarPedidosClientes);
if (adminBarUsersBtn) adminBarUsersBtn.addEventListener("click", mostrarGestionUsuarios);

if (exitProductsBtn) exitProductsBtn.addEventListener("click", mostrarTienda);
if (exitOrdersBtn) exitOrdersBtn.addEventListener("click", mostrarTienda);
if (exitUsersBtn) exitUsersBtn.addEventListener("click", mostrarTienda);
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

function renderizarTablaAdminProductos() {
  if (!adminProductsTableBody) return;
  adminProductsTableBody.innerHTML = "";

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
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td colspan="5" style="text-align: center; padding: 24px; color: var(--text-muted);">
        🔍 No se encontraron productos que coincidan con "${escapeHtml(filtro)}"
      </td>
    `;
    adminProductsTableBody.appendChild(tr);
    return;
  }

  filtrados.forEach((prod) => {
    const tr = document.createElement("tr");
    const mediaVal = prod.imagen || prod.emoji || "🐾";
    const isUrl = mediaVal.startsWith("http://") || mediaVal.startsWith("https://") || mediaVal.startsWith("data:image");
    const mediaHtml = isUrl
      ? `<img src="${escapeHtml(mediaVal)}" style="width:40px; height:40px; object-fit:cover; border-radius:6px; border:1px solid #cbd5e1; vertical-align:middle; margin-right:10px;">`
      : `<span style="font-size:1.5rem; vertical-align:middle; margin-right:10px;">${escapeHtml(mediaVal)}</span>`;

    const isFeatured = prod.destacado !== false;
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
      <td><strong>$ ${Number(prod.precio).toLocaleString("es-AR")}</strong></td>
      <td>${prod.stock} u.</td>
      <td class="text-right">
        <button class="btn btn-sm btn-secondary btn-toggle-feat" data-id="${prod.id}" title="${isFeatured ? 'Quitar del carrusel' : 'Destacar en carrusel'}" style="margin-right:4px;">
          ${isFeatured ? '⭐' : '☆'}
        </button>
        <button class="btn btn-sm btn-secondary btn-edit-prod" data-id="${prod.id}">✏️ Editar</button>
        <button class="btn btn-sm btn-secondary btn-del-prod" data-id="${prod.id}" style="color:red; margin-left:4px;">🗑️</button>
      </td>
    `;

    // Botón para copiar ID rápido en la tabla
    const copyIdMiniBtn = tr.querySelector(".btn-copy-mini-id");
    if (copyIdMiniBtn) {
      copyIdMiniBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        copiarTextoPortapapeles(prod.id, "📋 ID de producto copiado");
      });
    }

    // Alternar si está destacado en carrusel
    const toggleFeatBtn = tr.querySelector(".btn-toggle-feat");
    if (toggleFeatBtn) {
      toggleFeatBtn.addEventListener("click", async () => {
        const nuevoEstado = !isFeatured;
        try {
          await window.db.collection(PROD_COLLECTION).doc(prod.id).update({
            destacado: nuevoEstado
          });
          showToast(nuevoEstado ? `⭐ "${prod.titulo}" añadido al carrusel` : `"${prod.titulo}" quitado del carrusel`);
        } catch (err) {
          showToast(`❌ Error: ${err.message}`);
        }
      });
    }

    tr.querySelector(".btn-edit-prod").addEventListener("click", () => {
      editProdId.value = prod.id;
      editProdTitle.value = prod.titulo || "";
      const editBrandEl = document.getElementById("editProdBrand");
      if (editBrandEl) editBrandEl.value = prod.marca || "Kira Pet Oficial";
      editProdCategory.value = prod.categoria || "Alimentos";
      editProdPrice.value = prod.precio || 0;
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
    });

    tr.querySelector(".btn-del-prod").addEventListener("click", async () => {
      if (confirm(`¿Eliminar permanentemente "${prod.titulo}"?`)) {
        await window.db.collection(PROD_COLLECTION).doc(prod.id).delete();
        showToast("🗑️ Producto eliminado");
      }
    });

    adminProductsTableBody.appendChild(tr);
  });
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
    cartCount.textContent = "0";
    return;
  }
  const totalItems = cart.reduce((acc, item) => acc + item.cantidad, 0);
  cartCount.textContent = totalItems;
}

function renderizarCarrito() {
  cartItemsList.innerHTML = "";

  if (cart.length === 0) {
    cartItemsList.innerHTML = `
      <div class="empty-state">
        <div style="font-size: 3rem;">🛒</div>
        <p>Tu carrito está vacío</p>
      </div>
    `;
    cartTotalPrice.textContent = "$0";
    return;
  }

  let total = 0;
  cart.forEach((item) => {
    const subtotal = item.precio * item.cantidad;
    total += subtotal;

    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <div class="cart-item-emoji">${getProductMediaHtml(item.imagen || item.emoji, item.titulo)}</div>
      <div class="cart-item-details">
        <div class="cart-item-title">${escapeHtml(item.titulo)}</div>
        <div class="cart-item-price">$ ${Number(subtotal).toLocaleString("es-AR")}</div>
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

  cartTotalPrice.textContent = `$ ${Number(total).toLocaleString("es-AR")}`;
}

openCartBtn.addEventListener("click", () => {
  if (!currentUser) {
    showToast("🐾 Creá tu cuenta o ingresá para ver tu carrito");
    registerModal.style.display = "flex";
    return;
  }
  renderizarCarrito();
  cartModal.style.display = "flex";
});

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
    const total = cart.reduce((acc, i) => acc + i.precio * i.cantidad, 0);

    await window.db.collection(ORDERS_COLLECTION).add({
      clienteNombre: currentUser.nombre,
      clienteEmail: currentUser.email,
      clienteTelefono: currentUser.telefono,
      productos: cart,
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
  });
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

    tr.innerHTML = `
      <td><small>#${order.id.slice(0, 6)}</small></td>
      <td><strong>${escapeHtml(order.clienteNombre)}</strong><br><small>${escapeHtml(order.clienteTelefono)}</small></td>
      <td><small>${itemsStr}</small></td>
      <td><strong>$ ${Number(order.total).toLocaleString("es-AR")}</strong></td>
      <td>
        <select class="order-status-select" data-id="${order.id}">
          <option value="Nuevo Pedido" ${order.estado === 'Nuevo Pedido' ? 'selected' : ''}>⏳ Nuevo Pedido</option>
          <option value="En Preparación" ${order.estado === 'En Preparación' ? 'selected' : ''}>👨‍🍳 En Preparación</option>
          <option value="En Camino" ${order.estado === 'En Camino' ? 'selected' : ''}>🚚 En Camino</option>
          <option value="Completada" ${order.estado === 'Completada' ? 'selected' : ''}>✅ Completada</option>
          <option value="Cancelada" ${order.estado === 'Cancelada' ? 'selected' : ''}>❌ Cancelada</option>
        </select>
      </td>
      <td class="text-right">
        <span style="font-size:0.78rem; font-weight:700; color:#0f766e;">Auto-guardado</span>
      </td>
    `;

    tr.querySelector(".order-status-select").addEventListener("change", async (e) => {
      const nuevoEstado = e.target.value;
      try {
        await window.db.collection(ORDERS_COLLECTION).doc(order.id).update({ estado: nuevoEstado });
        showToast(`✅ Pedido #${order.id.slice(0, 6)} actualizado a: ${nuevoEstado}`);
      } catch (err) {
        showToast(`❌ Error: ${err.message}`);
      }
    });

    adminOrdersTableBody.appendChild(tr);
  });
}

function renderizarMisCompras() {
  if (!currentUser) return;

  const misPedidos = allOrders.filter((o) => o.clienteEmail === currentUser.email);
  if (profileOrdersCount) profileOrdersCount.textContent = misPedidos.length;

  const ordenesActivas = misPedidos.filter((o) => o.estado !== "Completada" && o.estado !== "Cancelada");
  const ordenesCompletadas = misPedidos.filter((o) => o.estado === "Completada" || o.estado === "Cancelada");

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
        const isP2 = estado === "En Preparación" || estado === "En Camino" || estado === "Completada";
        const isP3 = estado === "En Camino" || estado === "Completada";
        const isP4 = estado === "Completada";

        const items = (order.productos || []).map((p) => `${p.cantidad}x ${p.titulo}`).join(", ");

        div.innerHTML = `
          <div class="order-tracker-header">
            <div>
              <strong style="font-size: 1.1rem; color: #0f766e;">🚀 Orden en Curso #${order.id.slice(0, 6)}</strong>
              <p style="color: #64748b; font-size: 0.9rem; margin-top: 2px;">${items}</p>
            </div>
            <div style="text-align: right;">
              <span class="role-badge" style="background:#ccfbf1; color:#0f766e; font-size:0.9rem; padding:6px 14px;">
                Estado: ${estado}
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
              <div class="step-label">Completada</div>
            </div>
          </div>
          <p style="font-size: 0.85rem; color: #0f766e; font-weight: 700; text-align: center; margin-top: 8px;">
            ℹ️ Tu pedido estará aquí hasta que el administrador lo marque como completado.
          </p>
        `;
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
      const isCompletada = ped.estado === "Completada";

      div.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
          <div>
            <strong>Pedido #${ped.id.slice(0, 6)}</strong>
            <p style="color: #64748b; font-size: 0.9rem; margin-top: 2px;">${items}</p>
          </div>
          <div style="text-align:right;">
            <div style="font-size: 1.15rem; font-weight:800; color:#0f766e;">$ ${Number(ped.total).toLocaleString("es-AR")}</div>
            <span style="font-size: 0.82rem; font-weight:700; color: ${isCompletada ? '#059669' : '#0f766e'};">
              ${isCompletada ? '✅ Completada' : '⏳ ' + (ped.estado || 'Procesando')}
            </span>
          </div>
        </div>
      `;
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
