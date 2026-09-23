# Presentación, mensajes y localización de fase 2

## Problemas

Con calendario o política avanzada, la presentación cambia a mensajes genéricos,
por ejemplo `posible: 6 / 10`. Se pierden las condiciones de la spec base, la
pluralización y parte de la explicación de recuperación. El detalle avanzado
redondea el mínimo a dos decimales aunque se haya introducido con más precisión.
En la versión auditada, la copia podía describir otro contexto aunque conservara
la precisión del mínimo introducido.
Además, el listado de eventos muestra estados internos en inglés incluso en ES.

## Fuente de presentación

La presentación de fase 2 debe reutilizar el mismo contrato de estados y mensajes
de la calculadora base, extendiéndolo solo cuando sea necesario para explicar la
política efectiva. Debe incluir:

- situación actual separada de proyección final;
- estado `unknown`, `finished_meets`, `finished_below`, `impossible`, `guaranteed`
  o `possible`;
- necesidad real `Q`, disponibilidad `B`, excedente `E` y máximo final;
- condición de garantía y condición de margen temporal;
- recuperación teórica con sus límites y estado;
- mínimo con toda su precisión significativa, hasta cuatro decimales;
- porcentaje real y porcentaje evaluado cuando hay redondeo institucional.

Un resultado imposible debe explicar cuántas asistencias se requieren y cuántas
clases quedan, sin truncar `Q` a `R`. Un resultado posible debe diferenciar si la
persona está debajo, si tiene margen o si debe asistir a todas.

## Localización

Todos los valores internos de eventos deben tener etiquetas localizadas:

| Estado interno | ES | EN |
| --- | --- | --- |
| `attended` | Asistida | Attended |
| `absence` | Falta | Absence |
| `justified` | Justificada | Justified |
| `tardy` | Retardo | Tardy |
| `scheduled` | Programada | Scheduled |
| `cancelled` | Cancelada | Cancelled |

No mostrar claves internas de eventos en listas, mensajes o historial visible.
En el CSV, conservar las cabeceras y los códigos de estado estables del contrato
de exportación; no traducirlos ni sustituirlos por etiquetas de interfaz. Los
números y estados calculados deben ser iguales entre ES y EN.

## Aceptación

1. El caso `T=40,A=25,p=80,R=5` muestra `Q=11`, máximo 66.67% y excedente 6;
   no muestra solo `5` como necesidad.
2. El caso `T=40,A=34,p=80,R=10` muestra que se necesitan 6 y permite 4 bajo la
   condición de asistir a las otras 6.
3. Con política avanzada, el mínimo `80.125` aparece como `80.125%`, no como
   `80.13%`, en la presentación visible. La copia conserva ese mínimo y describe
   la misma política y el mismo resultado activo.
4. Los mensajes de recuperación pluralizan correctamente en ES y EN.
5. Un listado de eventos en ES no contiene `attended`, `absence`, `scheduled` ni
   las demás claves internas.
6. El CSV de un mismo escenario mantiene cabeceras, códigos de estado y cifras
   estables en ES y EN; las etiquetas visibles de eventos sí se localizan.
