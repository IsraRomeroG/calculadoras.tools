# Especificacion v2 - Calculadora de entropia de contrasena

## Descripcion general

Herramienta para estimar la entropia teorica de una contrasena y convertirla en
un diagnostico practico de fortaleza. Debe ayudar al usuario a entender por que
una contrasena puede ser facil o dificil de adivinar, sin enviar, guardar ni
registrar el valor introducido.

**Arquitectura:** todo el calculo ocurre en el cliente. No requiere backend,
base de datos ni llamadas a APIs externas. La contrasena nunca debe guardarse ni
salir del navegador.

**Principio de producto:** la entropia por conjunto de caracteres es una
aproximacion util, pero no debe presentarse como garantia de seguridad. La
interfaz debe separar el calculo teorico del riesgo practico por patrones,
palabras comunes, filtraciones conocidas, phishing, reutilizacion y contexto de
ataque.

---

## Objetivo de producto

- Estimar bits de entropia teorica por longitud y conjunto de caracteres.
- Mostrar una interpretacion orientativa de fortaleza y riesgo practico.
- Detectar senales comunes: longitud corta, repeticion, secuencias, teclado,
  fechas, palabras frecuentes, sustituciones obvias y contrasenas comunes.
- Ofrecer recomendaciones accionables sin mostrar ni copiar la contrasena.
- Explicar limitaciones del calculo y promover buenas practicas actuales:
  frases largas, gestores de contrasenas, MFA/passkeys y no reutilizar claves.
- Generar una pagina estatica optimizada para SEO en Astro.

---

## Alcance recomendado

### MVP

- Campo de contrasena con opcion mostrar/ocultar.
- Aviso visible de privacidad local junto al input.
- Deteccion de conjuntos: minusculas, mayusculas, digitos, simbolos ASCII,
  espacios y otros caracteres Unicode.
- Conteo de longitud por puntos de codigo Unicode, no por unidades UTF-16.
- Entropia teorica en bits.
- Diagnostico practico separado de la entropia teorica.
- Espacio de busqueda estimado.
- Tiempo estimado de busqueda con escenarios predefinidos y velocidad manual.
- Blocklist local pequena de contrasenas comunes y variantes muy obvias.
- Deteccion local de patrones simples: repeticion, secuencias, teclado, fechas,
  palabras frecuentes y sustituciones tipo `a -> @`, `o -> 0`, `i -> 1`.
- Recomendaciones accionables por senal detectada.
- Limpiar formulario.

### Fase 2

- Estimacion tipo zxcvbn si se decide agregar libreria.
- Generador local de contrasenas y frases de paso.
- Comparacion local contra una blocklist mas amplia si el peso del bundle sigue
  siendo razonable.
- Modo educativo para comparar "corta con simbolos" vs "frase larga".
- Exportar resumen sin contrasena, solo con metrica y recomendaciones.

---

## Ruta y archivos sugeridos

| Elemento | Valor |
|----------|-------|
| URL canonica | `/programacion/calculadora-entropia-contrasena` |
| Archivo Astro recomendado | `src/pages/programacion/calculadora-entropia-contrasena.astro` |
| Logica de calculo | `src/lib/calculators/programacion/calculadora-entropia-contrasena/passwordEntropy.ts` |
| Pruebas unitarias | `src/lib/calculators/programacion/calculadora-entropia-contrasena/passwordEntropy.test.ts` |
| Categoria | `programacion` |
| Locale base | `es-MX` |

### Migracion de ruta

La spec v1 proponia `/matematicas/calculadora-entropia-contrasena` como ruta
inmediata y `/programacion/calculadora-entropia-contrasena` como ruta futura.
Como la categoria `programacion` ya existe, la implementacion debe publicar solo
la ruta canonica en `programacion`.

Si en produccion llegara a existir la ruta anterior, agregar redireccion Apache
301:

```apache
RewriteRule ^matematicas/calculadora-entropia-contrasena/?$ /programacion/calculadora-entropia-contrasena [R=301,L]
```

---

## Comportamiento mobile-first

- Primer viewport movil: input, aviso de privacidad, boton mostrar/ocultar,
  resultado principal y estado de fortaleza.
- El aviso de privacidad debe estar cerca del input y decir claramente que el
  calculo ocurre en el navegador.
- El resultado principal debe priorizar la lectura practica:
  "Fuerte", "Aceptable", "Debil" o "Muy debil".
- Mostrar bits de entropia como metrica secundaria visible, no como unica
  conclusion.
- Las senales detectadas deben aparecer como chips o filas compactas.
- Las recomendaciones deben ser cortas y accionables.
- La formula y el detalle tecnico deben ir en una seccion secundaria o acordeon
  "Ver calculo".
- No copiar ni persistir la contrasena.
- No usar `localStorage`, `sessionStorage`, cookies ni parametros de URL para el
  valor de contrasena.
- No incluir la contrasena en atributos `data-*`, eventos analiticos, logs,
  errores, resumen copiable ni historial de navegacion.

---

## Flujo principal MVP

**Ejemplo:** ingreso una contrasena de 12 caracteres con mayusculas, minusculas,
numeros y simbolos. Quiero saber no solo cuantos bits teoricos tiene, sino si
incluye patrones obvios que la vuelven predecible.

### Inputs del MVP

| Campo | Tipo | Rango valido | Valor por defecto |
|-------|------|--------------|-------------------|
| Contrasena | Password/text | 0-256 puntos de codigo | vacio |
| Escenario de ataque | Selector | presets | `Hash rapido filtrado` |
| Velocidad personalizada | Texto numerico opcional | `> 0` intentos/s | vacio |

### Presets de velocidad

| Preset | Intentos por segundo | Uso orientativo |
|--------|----------------------|-----------------|
| Online con limite | `0.1667` | 10 intentos/minuto por rate limit |
| Hash lento | `1e5` | bcrypt, Argon2 o similar con costo alto |
| Hash rapido filtrado | `1e9` | hash filtrado con hardware comun |
| GPU/farm agresiva | `1e12` | ataque offline con hardware especializado |
| Personalizado | Usuario | Permite modelar otro contexto |

### Outputs principales

- Estado practico: muy debil, debil, aceptable, fuerte o muy fuerte.
- Bits de entropia teorica.
- Tamaño del conjunto de caracteres.
- Espacio de busqueda estimado.
- Tiempo estimado de busqueda exhaustiva en peor caso y promedio.
- Escenario de ataque usado para la estimacion.
- Senales detectadas: longitud, variedad, repeticion, secuencia, teclado,
  fecha, palabra comun, contrasena comun, sustituciones obvias y Unicode.
- Recomendaciones accionables, sin repetir ni mostrar la contrasena.

---

## Formulas y algoritmo

### Conteo de longitud

Contar la longitud con puntos de codigo Unicode:

```ts
const length = Array.from(password).length;
```

No usar `password.length` como unica fuente, porque cuenta unidades UTF-16 y
puede sobrecontar caracteres fuera del plano basico multilingue.

### Tamaño del conjunto

```text
charset = 0
si contiene minusculas ASCII: charset += 26
si contiene mayusculas ASCII: charset += 26
si contiene digitos ASCII: charset += 10
si contiene simbolos ASCII comunes: charset += cantidad_simbolos_soportados
si contiene espacio: charset += 1
si contiene otros Unicode: charset += estimacion conservadora documentada
```

La estimacion de Unicode debe ser conservadora y explicita. Recomendacion para
MVP: sumar un bucket fijo de `100` cuando existan caracteres no ASCII, y mostrar
la senal "Unicode detectado" con nota de compatibilidad entre sistemas.

### Entropia teorica

```text
entropia_bits = longitud * log2(charset)
```

Si `longitud = 0` o `charset = 0`, la entropia es `0`.

### Tiempo estimado

```text
combinaciones = 2 ^ entropia_bits
segundos_peor_caso = combinaciones / intentos_por_segundo
segundos_promedio = segundos_peor_caso / 2
```

Para valores muy grandes, formatear combinaciones y tiempos con notacion
cientifica o unidades legibles. Evitar numeros enormes sin separadores.

### Diagnostico practico

Calcular un puntaje practico separado de la entropia teorica. El MVP puede usar
penalizaciones orientativas sin alterar el valor de bits mostrado:

```text
score = score_base_por_bits(entropia_bits)
si longitud < 8: penalizar fuerte
si longitud < 12: penalizar moderado
si longitud >= 15: bonificar
si esta en blocklist local: marcar muy debil
si contiene palabra comun: penalizar
si contiene secuencia: penalizar
si contiene patron de teclado: penalizar
si contiene repeticion fuerte: penalizar
si contiene fecha probable: penalizar
si contiene sustituciones obvias: penalizar
```

El output debe explicar las razones: por ejemplo, "Incluye una secuencia
numerica" o "Parece una palabra comun con sustituciones".

---

## Detecciones locales recomendadas

### Blocklist local MVP

Incluir una lista pequena versionada en codigo, no descargada en runtime. Debe
contener valores frecuentes y variantes esperables en espanol e ingles:

- `password`, `password1`, `password1!`, `Password1!`
- `123456`, `123456789`, `12345678`, `111111`, `000000`
- `qwerty`, `qwerty123`, `abc123`
- `admin`, `admin123`, `letmein`, `welcome`
- `contraseña`, `contrasena`, `contrasena123`, `Contraseña1!`
- `mexico`, `mexico123`, `guadalajara`, `monterrey`

La comparacion debe normalizar a minusculas y, para deteccion auxiliar, convertir
acentos comunes. La UI debe decir "aparece en una lista local de contrasenas
comunes", no afirmar que fue filtrada si solo esta en la lista local.

### Patrones

- Repeticion fuerte: un mismo caracter repetido, grupos repetidos (`abcabc`) o
  baja diversidad real.
- Secuencias: `abc`, `abcd`, `123`, `2345`, ascendente y descendente.
- Teclado: `qwerty`, `asdf`, `zxcv`, y variantes parciales.
- Fechas probables: anos `19xx`, `20xx`, fechas `ddmmaa`, `ddmmaaaa`,
  `yyyy-mm-dd`.
- Sustituciones obvias: `@` por `a`, `0` por `o`, `1` por `i/l`, `3` por `e`,
  `$` por `s`.
- Palabras frecuentes: lista local pequena; no intentar inferir datos personales.

---

## Recomendaciones al usuario

Las recomendaciones deben ser especificas y no depender de reglas rigidas de
composicion. Evitar mensajes tipo "agrega un simbolo" como unica solucion.

Ejemplos:

- "Hazla mas larga: apunta a 15 o mas caracteres si sera una contrasena
  memorable."
- "Usa una frase de varias palabras si necesitas recordarla."
- "Evita secuencias como `123`, `abcd` o patrones de teclado."
- "No reutilices esta contrasena en otros servicios."
- "Para cuentas importantes, combina contrasena fuerte con MFA o passkeys."
- "Un gestor de contrasenas puede generar claves largas y unicas."

---

## Validaciones y estados

- Contrasena vacia muestra estado inicial sin calculo.
- Longitud maxima UI: 256 puntos de codigo.
- Si el usuario excede 256, bloquear entrada adicional o recortar de forma
  visible sin guardar el excedente.
- Velocidad personalizada debe aceptar notacion decimal y cientifica (`1e9`).
- Velocidad personalizada invalida muestra error inline y conserva los ultimos
  resultados validos o vuelve a estado pendiente.
- Si entropia es muy alta, formatear espacio de busqueda en notacion cientifica.
- No prometer seguridad real; explicar que filtraciones, phishing, malware,
  reutilizacion y politicas del servicio cambian el riesgo.
- Evitar mostrar la contrasena en resumen copiable, breadcrumbs, titulo,
  atributos, analytics o mensajes de error.
- Si se detecta Unicode, mostrar nota breve: algunos sistemas pueden normalizar o
  representar ciertos caracteres de forma distinta.

---

## Seguridad, privacidad y accesibilidad

- Todo debe ejecutarse localmente en el navegador.
- No debe haber llamadas de red al evaluar la contrasena.
- No persistir el valor en storage, cookies, URL, historial ni estado global
  compartido.
- El boton mostrar/ocultar debe ser accesible con teclado y lector de pantalla.
- El estado de fortaleza debe comunicarse con texto, no solo color.
- No usar autocompletado que guarde la contrasena introducida para esta
  herramienta educativa. Recomendacion: `autocomplete="off"`.
- Permitir pegar texto para que usuarios de gestores de contrasenas puedan
  evaluar valores generados, pero no fomentar pegar contrasenas reales de cuentas
  criticas.

---

## SEO y contenido

| Elemento | Valor sugerido |
|----------|----------------|
| Title | `Calculadora de entropia de contrasena` |
| Meta description | `Estima bits de entropia, espacio de busqueda, patrones y tiempo aproximado de ataque de una contrasena procesada localmente en tu navegador.` |
| H1 | `Calculadora de entropia de contrasena` |
| Keyword principal | `calculadora entropia contrasena` |
| Keywords secundarias | `password entropy`, `fortaleza contrasena`, `bits de entropia`, `seguridad de contrasenas` |
| Canonical | `/programacion/calculadora-entropia-contrasena` |

### FAQs sugeridas

- ¿La contrasena se envia a algun servidor?
- ¿Que son bits de entropia?
- ¿Por que una contrasena larga puede ser debil?
- ¿Por que una frase larga puede ser mas util que una clave corta con simbolos?
- ¿La entropia garantiza seguridad?
- ¿Que diferencia hay entre ataque online y ataque offline?
- ¿Conviene usar gestor de contrasenas, MFA o passkeys?

### Contenido educativo recomendado

- Diferencia entre entropia teorica y facilidad real de adivinanza.
- Por que las reglas de composicion rigidas pueden crear patrones predecibles.
- Por que longitud y unicidad suelen importar mas que cambiar `a` por `@`.
- Limitaciones: phishing, malware, reutilizacion, filtraciones y politicas de
  bloqueo del servicio no se resuelven con entropia.

---

## Referencias tecnicas

- NIST SP 800-63B: recomienda blocklists para valores comunes, esperados o
  comprometidos; no imponer reglas de composicion rigidas; permitir Unicode y
  contar cada punto de codigo como un caracter al evaluar longitud.
  https://pages.nist.gov/800-63-4/sp800-63b.html

---

## Pruebas sugeridas

- `aaaaaaaa` detecta minusculas y repeticion fuerte.
- `Abc123!@#` detecta cuatro conjuntos principales.
- `Password1!` se marca como comun o muy predecible.
- `Contraseña1!` se detecta como variante comun local.
- `abcd1234` detecta secuencia alfabetica y numerica.
- `qwerty123` detecta patron de teclado.
- `abcabcabc` detecta grupo repetido.
- `2024-01-01` detecta fecha probable.
- `correct horse battery staple` reconoce espacios, longitud y frase.
- `niño2026` maneja Unicode y cuenta puntos de codigo correctamente.
- Contrasena vacia muestra estado inicial.
- No se generan parametros de URL con contrasena.
- No se usa `localStorage` ni `sessionStorage` para la contrasena.
- Entropia teorica usa `longitud * log2(charset)`.
- El diagnostico practico puede bajar la clasificacion sin modificar los bits
  teoricos mostrados.
- Velocidad personalizada acepta `1e9` y rechaza valores `<= 0`.
- El resumen copiable nunca incluye la contrasena.
