# Mater Iuris - Página Web

Página web para el Círculo de Estudios de Derecho Civil UCV "Mater Iuris".

## Estructura de Archivos

```
/ (raíz del proyecto)
├── index.html          # Página principal
├── upload.html         # Panel de administración para subir artículos
├── css/
│   ├── styles.css      # Estilos principales
│   └── uploadstyled.css # Estilos específicos de upload.html
├── js/
│   ├── firebase-config.js  # Configuración de Firebase
│   ├── script.js           # Lógica de index.html
│   └── upload.js           # Lógica de upload.html
├── img/                # Imágenes del sitio
└── README.md          # Este archivo
```

## Funcionalidades

### Página Principal (index.html)
- Landing page con secciones informativas
- Muestra artículos destacados y todos los artículos
- Formulario de contacto
- Búsqueda y paginación de artículos

### Panel de Administración (upload.html)
- Login con contraseña ("admin123")
- Subir nuevos artículos con título, contenido, imagen y PDF
- Editar artículos existentes
- Eliminar artículos
- Marcar/desmarcar artículos como destacados

### Base de Datos
- Usa Firebase Firestore para almacenar artículos
- Los artículos se guardan con: título, contenido, fecha, imagen, PDF, destacado
- Lectura pública, escritura solo para administradores

## Configuración de Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un proyecto nuevo
3. Habilita Firestore Database
4. Copia la configuración en `js/firebase-config.js`
5. Configura reglas de seguridad en Firestore

## Despliegue

Puedes subir esta página a:
- **GitHub Pages**: Gratuito, conecta tu repo
- **Netlify**: Gratuito, drag & drop
- **Vercel**: Similar a Netlify

## Seguridad

- Configura reglas de Firestore para producción
- Usa HTTPS (incluido en hosting mencionados)
- La contraseña de admin es básica; considera implementar Firebase Auth para más seguridad

## Desarrollo Local

Para probar localmente:
```bash
python -m http.server 8000
```

Abre `http://localhost:8000/index.html` en tu navegador.

## Tecnologías Usadas

- HTML5, CSS3, JavaScript (ES6+)
- Bootstrap 5 para responsive design
- Firebase (Firestore) para backend
- Font Awesome para íconos
- Google Fonts

---

Desarrollado para Mater Iuris - Universidad César Vallejo
