# Stack — calculadoras.tools

## Descripción general

**calculadoras.tools** es una plataforma de calculadoras en español construida para rendimiento, SEO y escalabilidad. La arquitectura prioriza la generación estática y la lógica del lado del cliente, reservando los servicios de backend únicamente para los casos que realmente requieren procesamiento en el servidor.

---

## Frontend

| Capa | Tecnología | Notas |
|---|---|---|
| Framework | [Astro](https://astro.build/) | Generación de sitio estático (SSG) por defecto |
| Estilos | [Tailwind CSS](https://tailwindcss.com/) | Framework CSS de utilidades |
| Lenguaje | TypeScript / JavaScript | La lógica de las calculadoras corre en el cliente |
| Estrategia de renderizado | Estático primero | La mayoría de las calculadoras son completamente estáticas; sin llamadas al servidor |

### Principios guía
- La gran mayoría de las calculadoras corren completamente en el navegador (sin llamadas a API).
- La arquitectura de islas de Astro se usa de forma selectiva para hidratar componentes interactivos solo donde sea necesario.
- Las páginas se pre-renderizan en tiempo de build para máximo rendimiento y SEO.

---

## Backend

| Capa | Tecnología | Notas |
|---|---|---|
| Framework | [Spring Boot](https://spring.io/projects/spring-boot) | Microservicios basados en Java |
| Arquitectura | Microservicios | Un servicio por dominio cuando se requiere backend |
| Lenguaje | Java | |
| Estilo de API | REST | JSON sobre HTTP |

### Principios guía
- Los microservicios de backend se introducen únicamente cuando una calculadora no puede manejarse del lado del cliente (p. ej., datos en tiempo real, cómputos sensibles, integraciones con terceros).
- Cada microservicio es desplegable de forma independiente y tiene una única responsabilidad.

---

## Base de datos

| Aspecto | Decisión |
|---|---|
| Por defecto | Relacional (SQL) |
| Alternativa | No relacional (NoSQL) — se evalúa caso por caso |
| Estrategia | Sin base de datos global definida en el lanzamiento; cada microservicio gestiona su propio almacenamiento cuando sea necesario |

### Principios guía
- El punto de partida por defecto es una base de datos relacional para cualquier necesidad de persistencia.
- Las bases de datos no relacionales se consideran caso por caso según la forma de los datos y los patrones de acceso.

---

## Infraestructura y despliegue

| Capa | Tecnología | Notas |
|---|---|---|
| Fase 1 — Frontend | Cloudflare CDN | Sitio 100% estático; entrega global desde el edge |
| Fase 2+ — Backend | AWS | Servicios cloud que se incorporan conforme crece la complejidad del backend |
| Salida del build | HTML/CSS/JS estático | Generado por Astro en tiempo de build |

### Fases de despliegue
1. **Lanzamiento** — Sitio completamente estático desplegado en Cloudflare CDN. Sin backend requerido.
2. **Crecimiento** — Microservicios de Spring Boot introducidos para calculadoras que requieren lógica del lado del servidor.
3. **Escala** — Servicios de AWS (cómputo, almacenamiento, bases de datos gestionadas) adoptados progresivamente conforme el tráfico y la complejidad lo demanden.

---

## Analytics y monitoreo

| Herramienta | Propósito |
|---|---|
| [Plausible Analytics](https://plausible.io/) | Analítica web privacy-friendly, sin cookies; impacto mínimo en el rendimiento |
| [Google Search Console](https://search.google.com/search-console) | Monitoreo de tráfico orgánico y seguimiento del rendimiento SEO |
| [Sentry](https://sentry.io/) | Captura de errores tanto en el frontend como en los microservicios de Spring Boot |

---

## Testing

| Capa | Herramienta | Propósito |
|---|---|---|
| Frontend — unitario | [Vitest](https://vitest.dev/) | Pruebas unitarias de la lógica de las calculadoras (fórmulas, validaciones, casos borde) |
| Frontend — E2E | [Playwright](https://playwright.dev/) | Pruebas end-to-end que simulan interacciones reales del usuario en el navegador |
| Backend — unitario | [JUnit 5](https://junit.org/junit5/) | Pruebas unitarias y de integración para los microservicios de Spring Boot |

### Filosofía de testing
- **Vitest** valida que las matemáticas sean correctas (nivel de fórmula).
- **Playwright** valida que la interfaz se comporte correctamente (nivel de interacción).
- **JUnit** valida que los servicios de backend retornen resultados correctos y manejen errores adecuadamente.

---

## Idioma y localización

| Aspecto | Decisión |
|---|---|
| Idioma | Español (es) |
| i18n | No implementado en el lanzamiento |
| Alcance | Mercado hispanohablante exclusivamente en el lanzamiento |

---

## Resumen

```
Navegador
  └── Astro (SSG) + Tailwind CSS
        ├── Calculadoras estáticas (lógica JS del lado del cliente) — mayoría
        └── Calculadoras dinámicas (llaman a microservicios Spring Boot) — minoría

Edge
  └── Cloudflare CDN (Fase 1)

Backend (según necesidad)
  └── Microservicios Spring Boot (REST)
        └── Base de datos (SQL por defecto, NoSQL caso por caso)

Cloud (Fase 2+)
  └── AWS
```
