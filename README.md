# 🐾 Kira PET love - Tienda Online y Gestión de Roles

Plataforma de e-commerce de mascotas estilo Mercado Libre con **inicio de sesión seguro**, **roles administrados por el Administrador** y **sección de Mi Perfil**.

---

## 🔒 Acceso y Jerarquía de Roles

### 1. 🛍️ Registro de Usuarios Públicos
* Cuando una persona se registra en **"Creá tu cuenta"**, se registra automáticamente como **Comprador** (no puede elegirse a sí mismo como vendedor ni admin).
* Puede ver el catálogo, agregar al carrito y comprar.

---

### 2. 👑 El Administrador Asigna Roles
* **Solo el Administrador** tiene el poder de decidir quién es Vendedor o Administrador.
* Desde el panel de administración (**Gestión de Usuarios y Roles**), el Admin ve a todas las personas registradas y puede:
  * Cambiar a un usuario de **Comprador** a **Vendedor** (para que pueda publicar productos y gestionar pedidos).
  * Promover a alguien a **Administrador**.
* Los cambios se aplican en **tiempo real en Firebase**.

---

### 3. 👤 Sección "Mi Perfil y Seguridad"
* Cualquier usuario conectado puede hacer clic en **"👤 Mi Perfil"** arriba para cambiar su correo, contraseña y datos.

---

### 🔑 Credenciales Iniciales del Administrador:
* **E-mail:** `admin@kirapetlove.com`
* **Contraseña:** `admin123`
