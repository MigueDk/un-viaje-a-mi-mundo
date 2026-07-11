# Un Viaje a Mi Mundo — Proyecto de Desarrollo Humano

## Cómo usarlo
1. Descomprime la carpeta completa (debe mantener esta estructura: `index.html`, `style.css`, `script.js`, `/img`, `/videos`, `/assets`).
2. Abre `index.html` haciendo doble clic — funciona sin servidor ni instalación.
3. Reemplaza cada texto marcado como `[FALTA: ...]` con tu información real.
4. Coloca tus imágenes en `/img` con los nombres indicados en `img/LEEME.txt`.
5. Pega tus enlaces de YouTube en los atributos `data-youtube=""` (ver `videos/LEEME.txt`).
6. Completa la lista de referencias en la sección "Referencias y Fuentes" en formato APA 7 — el script las ordena alfabéticamente de forma automática.

## Qué ya está construido
- Estructura completa de las 6 secciones exigidas por el examen, con todas las subsecciones.
- Barra de navegación fija con indicador de sección activa.
- Botón "volver arriba", scroll suave, barra de progreso de lectura.
- Animaciones de aparición al hacer scroll (fade + slide up) y hover effects.
- Línea de tiempo visual para "¿Cuál es mi historia?" y para "¿Qué deseo para el futuro?" (corto/mediano/largo plazo).
- Tarjetas para Top 3 de humor, playlist, héroes y aprendizajes.
- Galería tipo masonry para la Bitácora de clase, con modal para ampliar imágenes.
- Reproductores de YouTube responsivos que se activan automáticamente al pegar el enlace.
- Manejo elegante de imágenes faltantes: mientras no subas la foto real, se ve una caja indicando exactamente qué falta (no un ícono de error roto).
- Diseño responsive probado en los breakpoints de escritorio, tablet (980px) y celular (640px).

## Sistema de diseño (por si quieres ajustar colores/tipografías)
Todo el sistema vive como variables CSS al inicio de `style.css` (`:root`):
- Colores: `--bg`, `--surface`, `--amber` (acento cálido), `--teal` (acento frío), `--cream` (texto), `--muted` (texto secundario).
- Tipografías: `--font-display` (Fraunces, títulos), `--font-body` (Inter, cuerpo), `--font-mono` (JetBrains Mono, fechas/etiquetas).
- El concepto visual es un "atlas de viaje personal": brújula animada en el hero, línea punteada tipo ruta en la línea de tiempo, y etiquetas "Ruta 01, 02..." en cada sección.

## Antes de entregar, revisa
- [ ] Todos los `[FALTA: ...]` fueron reemplazados.
- [ ] Todas las imágenes tienen su archivo correspondiente en `/img`.
- [ ] Todos los videos tienen su enlace de YouTube.
- [ ] Las referencias están completas y en formato APA 7.
- [ ] Probaste el sitio en el celular (o achicando la ventana del navegador).
