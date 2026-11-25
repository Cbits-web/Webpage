# Sitio Cbits (versión por páginas)

Basado en el borrador de Carlos. El sitio pasa de una sola página a seis, cada una con el mismo encabezado (menú) y el mismo pie (contacto).

## Páginas
- `index.html` — Inicio (resumen, diagnóstico, planes, alianzas)
- `saber.html`, `resolver.html`, `prevenir.html` — una página por capa
- `planes.html` — planes con precios "desde", tabla de capas y ejemplo de 10 PC
- `contacto.html` — formulario y datos de contacto
- `404.html` — página para ligas que no existen

Los anuncios pueden apuntar directo a cada página: `cbits.mx/prevenir`, `cbits.mx/saber`, `cbits.mx/resolver`, `cbits.mx/planes`, `cbits.mx/contacto`.

## Seguimiento de anuncios
Agrega `?origen=nombre` a la liga (por ejemplo `cbits.mx/prevenir?origen=capas`). El sitio recuerda el origen y el formulario lo manda en el correo (líneas "Origen" y "Página"). Solo letras, números, guion y guion bajo, hasta 40 caracteres.

## Cómo publicar (importante)
1. El workflow de este paquete usa el MISMO nombre de archivo y el MISMO secreto que el repo actual (`azure-static-web-apps-blue-ground-017c5540f.yml` y `AZURE_STATIC_WEB_APPS_API_TOKEN_BLUE_GROUND_017C5540F`). No agregues otro workflow: el del borrador original usaba un secreto que no existe en el repo.
2. Súbelo primero a una rama aparte (no a `main`) y abre un Pull Request. Azure genera una liga de vista previa para revisarlo antes de publicar.
3. Al hacer merge a `main` se publica solo.
4. Las imágenes y archivos del sitio anterior que queden en la raíz del repo ya no se usan; se pueden borrar después.

## Formulario de contacto
Envía por Microsoft Graph desde el buzón compartido info@cbits.mx. Variables en Azure (Static Web App, variables de entorno): `MS_TENANT_ID`, `MS_CLIENT_ID`, `MS_CLIENT_SECRET`, `MS_SENDER_MAILBOX`, `CONTACT_TO_ADDRESS`. El correo llega con "Responder a" del visitante. Incluye un campo oculto contra spam y límites de longitud.

## Pendientes antes de publicar
- [x] "Atendemos 1 o 2 empresas nuevas por semana": confirmada por Mónica (máximo 2). Actualizar si se contrata ayuda
- [x] Cobro único de $300 en Crecimiento: concepto nuevo del catálogo "Configuración respaldo en la nube" ($300 por equipo)
- [ ] Póliza Servidor $900 al mes: se muestra como precio base junto a PC y Mac
- [ ] Revisar los textos de Saber, Resolver y Prevenir
- [ ] Confirmar que la terminal del inicio describe solo lo que Cbits sí hace (`TERMINAL_LINES` en `script.js`)
- [ ] Logos de partners: por ahora solo nombres, hasta revisar las reglas de uso de marca
- [ ] Probar en celular y enviar un formulario de prueba ya publicado
- [ ] Definir con Mónica el texto final de "urgente" y tiempo de respuesta (propuesta: contacto en máximo 2 horas para urgentes; no significa solución) (las reuniones de estrategia ya están definidas: máximo 1 en persona y 1 por Zoom; falta definir si es por mes, trimestre o año)

Testimonios: no incluidos por ahora.
