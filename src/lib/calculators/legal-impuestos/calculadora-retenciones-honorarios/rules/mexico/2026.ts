export type HonorariosRegime = "professional-services" | "resico" | "undefined";

export interface WithholdingSource {
  id: string;
  authority: string;
  title: string;
  url: string;
  appliesTo: string;
}

export const MEXICO_HONORARIOS_2026 = {
  country: "México",
  countryCode: "MX",
  period: "2026",
  effectiveFrom: "2026-01-01",
  effectiveTo: "2026-12-31",
  reviewedAt: "2026-09-23",
  status: "current" as const,
  currency: "MXN",
  defaultTransferredTaxPercent: 16,
  ivaWithholdingShareOfTransferredTax: 2 / 3,
  incomeTaxWithholdingPercent: {
    "professional-services": 10,
    resico: 1.25,
  } satisfies Record<Exclude<HonorariosRegime, "undefined">, number>,
  conditions: {
    incomeTax: "Persona física que presta servicios profesionales a una persona moral; en RESICO, la persona física debe tributar válidamente en ese régimen.",
    iva: "La persona moral recibe de una persona física un servicio personal independiente gravado con IVA; la retención se calcula sobre el IVA trasladado efectivamente pagado.",
  },
  sources: [
    {
      id: "mx-sat-lisr-106",
      authority: "Servicio de Administración Tributaria",
      title: "Ley del ISR, artículo 106",
      url: "https://wwwmat.sat.gob.mx/articulo/36658/articulo-106",
      appliesTo: "Retención de ISR del 10% en pagos de servicios profesionales a personas físicas por personas morales.",
    },
    {
      id: "mx-sat-lisr-113-j",
      authority: "Servicio de Administración Tributaria",
      title: "Ley del ISR, artículo 113-J",
      url: "https://wwwmat.sat.gob.mx/articulo/59511/articulo-113-j",
      appliesTo: "Retención de ISR del 1.25% a personas físicas RESICO por pagos de personas morales, sin incluir IVA.",
    },
    {
      id: "mx-sat-liva-1-a",
      authority: "Servicio de Administración Tributaria",
      title: "Ley del IVA, artículo 1o.-A",
      url: "https://wwwmat.sat.gob.mx/articulo/18243/articulo-1-a",
      appliesTo: "Obligación de las personas morales de retener IVA en servicios personales independientes recibidos de personas físicas.",
    },
    {
      id: "mx-sat-riva-3",
      authority: "Servicio de Administración Tributaria",
      title: "Reglamento de la Ley del IVA, artículo 3",
      url: "https://www.sat.gob.mx/cs/Satellite?blobcol=urldata&blobkey=id&blobtable=MungoBlobs&blobwhere=1461172547591&ssbinary=true",
      appliesTo: "Retención de dos terceras partes del IVA trasladado y efectivamente pagado por servicios personales independientes.",
    },
    {
      id: "mx-sat-liva-1",
      authority: "Servicio de Administración Tributaria",
      title: "Ley del IVA, artículo 1o",
      url: "https://wwwmat.sat.gob.mx/articulo/19848/articulo-1",
      appliesTo: "Tasa general del 16%; hay operaciones con tasa cero, exentas y tratamientos especiales.",
    },
    {
      id: "mx-sat-criterio-3-iva-n",
      authority: "Servicio de Administración Tributaria",
      title: "Anexo 7 RMF 2026, criterio 3/IVA/N",
      url: "https://www.sat.gob.mx/minisitio/NormatividadRMFyRGCE/documentos2026/rmf/anexos/Anexo_7_RMF2026-09012026.pdf",
      appliesTo: "La retención de IVA por servicios solo aplica si son personales, es decir, no tienen característica de actividad empresarial.",
    },
  ] satisfies WithholdingSource[],
} as const;
