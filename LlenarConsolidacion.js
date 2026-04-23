
  ============================================================
   llenarConsolidacion(data)
  Llena el formato HTML del mecanismo de CONSOLIDACIÓN.
 
   CÓMO LLAMARLA:
     llenarConsolidacion(data);
     document.getElementById('modalconsolidacion').showModal();
 
  ============================================================
   ESTRUCTURA COMPLETA DEL OBJETO data:
  {
    // ── FECHA (si se omite usa la fecha actual) ──────────────
    fecha: "2025-04-22",          // string ISO o Date object (opcional)
 
   // ── OFICINA ──────────────────────────────────────────────
    codOficina:    "0000",
    nombreOficina: "OFICINA PRINCIPAL",
    cuentaPago:    "Pago a producto",
    funcionario:   "Brayan David Roldan Vargas",
 
    // ── CLIENTE ──────────────────────────────────────────────
    nombreCliente: "María García López",
   tipoDoc:       "CC",
    numDoc:        "1019044759",
    lugarExp:      "BOGOTA D.C. - BOGOTA D.C.",
    fechaExp:      "2000-02-02",
 
   // ── ACTIVIDAD E INGRESOS ─────────────────────────────────
    diasMora:             120,
    descripcionActividad: "Empleado",
    ingresoMensual:       3500000,
    ocupacionAdicional:   "Independiente",
    ingresosAdicionales:  500000,
 
    // ── OBLIGACIONES ACTIVAS (toggle ON) — máx. 5 ────────────
    obligaciones: [
      { numero: "4551", saldoTotal: 4373652.53, intCorrientes: 193017.51, intMora: 19343.71, intExtraC: 145.76 },
      { numero: "9784", saldoTotal: 10648103,   intCorrientes: 721501,    intMora: 20994,    intExtraC: 0      }
   ],
 
    // ── CONDICIONES BAJA EN CUENTA ───────────────────────────
    pctBenIntCorr:          100,
    pctBenIntMora:          100,
    pctBenIntExtra:         100,
    nuevoPlazo:             48,
   saldoTotalConsolidado:  13921135.31,
    valCuotaProyectada:     450000,
    pagoNegociacion:        200000,
    amortizacion:           "Francesa",
    tasaIntEA:              "18.5%",
 
   // ── PREGUNTAS DECLARACIÓN FISCAL ─────────────────────────
    pregunta1: "NO",
    pregunta2: "NO",
   pregunta3: "NO",
    pregunta4: "NO",
 
    // ── GARANTÍAS ────────────────────────────────────────────
   garantiaFAG: "NO",
    garantiaFNG: "NO",
 
    // ── OBSERVACIONES ────────────────────────────────────────
    observaciones: "",
 
 
 // ── LUGAR DE FIRMA ───────────────────────────────────────
   lugarFirma: "Bogotá D.C."
  }
 


function llenarConsolidacion(data) {

    // ── helpers ──────────────────────────────────────────────────────────────

    /** Coloca texto en un elemento por ID */
    function set(id, valor) {
        const el = document.getElementById(id);
        if (el) el.textContent = (valor !== undefined && valor !== null) ? valor : '';
    }

    /** Formatea número como moneda colombiana: 4373652.53 → "$4,373,652.53" */
    function moneda(valor) {
        if (valor === undefined || valor === null || valor === '' || valor === 0) return '';
        return '$' + Number(valor).toLocaleString('es-CO', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    /** Formatea porcentaje: 100 → "100.00%" */
    function pct(valor) {
        if (valor === undefined || valor === null || valor === '') return '';
        return Number(valor).toFixed(2) + '%';
    }

    /** Parsea fecha y devuelve {dia, mes, anio} */
    function parsearFecha(f) {
        let d = (!f) ? new Date() : (f instanceof Date ? f : new Date(f + 'T00:00:00'));
        const meses = ['ENERO','FEBRERO','MARZO','ABRIL','MAYO','JUNIO',
                       'JULIO','AGOSTO','SEPTIEMBRE','OCTUBRE','NOVIEMBRE','DICIEMBRE'];
        return {
            dia:  String(d.getDate()).padStart(2, '0'),
            mes:  meses[d.getMonth()],
            anio: d.getFullYear()
        };
    }

    /** Formatea fecha para campos de texto */
    function formatearFecha(f) {
        if (!f) return '';
        if (f instanceof Date) return f.toISOString().split('T')[0];
        return f;
    }

    // ── FECHA DEL DOCUMENTO ──────────────────────────────────────────────────
    // Hay IDs duplicados (header + declaración final), se actualizan todos
    const fecha = parsearFecha(data.fecha);
    document.querySelectorAll('#day_consolidacion').forEach(el => el.textContent = fecha.dia);
    document.querySelectorAll('#month_consolidacion').forEach(el => el.textContent = fecha.mes);
    document.querySelectorAll('#year_consolidacion').forEach(el => el.textContent = fecha.anio);

    // ── OFICINA ──────────────────────────────────────────────────────────────
    set('codOficina_consolidacion',    data.codOficina);
    set('nombreOficina_consolidacion', data.nombreOficina);
    set('cuentaPago_consolidacion',    data.cuentaPago);
    set('funcionario_consolidacion',   data.funcionario);

    // ── CLIENTE ──────────────────────────────────────────────────────────────
    set('nombreCliente_consolidacion', data.nombreCliente);
    set('tipoDoc_consolidacion',       data.tipoDoc);
    set('numDoc_consolidacion',        data.numDoc);
    set('lugarExp_consolidacion',      data.lugarExp);
    set('fechaExp_consolidacion',      formatearFecha(data.fechaExp));

    // Nombre y doc también en el párrafo de términos
    set('nombreClienteTerd_Ampliacion', data.nombreCliente);
    set('numDocTerd_Ampliacion',        data.numDoc);

    // ── ACTIVIDAD E INGRESOS ─────────────────────────────────────────────────
    set('diasMora_consolidacion',             data.diasMora);
    set('descripcionActividad_consolidacion', data.descripcionActividad);
    set('ingresoMensual_consolidacion',       moneda(data.ingresoMensual));
    set('ocupacionAdicional_consolidacion',   data.ocupacionAdicional);
    set('ingresosAdicionales_consolidacion',  moneda(data.ingresosAdicionales));

    // ── OBLIGACIONES INDIVIDUALES (solo las activas, máx 5) ─────────────────
    const obligaciones = Array.isArray(data.obligaciones) ? data.obligaciones : [];

    for (let i = 1; i <= 5; i++) {
        const ob = obligaciones[i - 1];
        if (ob) {
            set(`numObligacion_${i}_consolidacion`,  ob.numero);
            set(`saldoTotal_${i}_consolidacion`,     moneda(ob.saldoTotal));
            set(`intCorrientes_${i}_consolidacion`,  moneda(ob.intCorrientes));
            set(`intMora_${i}_consolidacion`,        moneda(ob.intMora));
            set(`intExtraC_${i}_consolidacion`,      ob.intExtraC ? moneda(ob.intExtraC) : '');
        } else {
            set(`numObligacion_${i}_consolidacion`,  '');
            set(`saldoTotal_${i}_consolidacion`,     '');
            set(`intCorrientes_${i}_consolidacion`,  '');
            set(`intMora_${i}_consolidacion`,        '');
            set(`intExtraC_${i}_consolidacion`,      '');
        }
    }

    // ── CONDICIONES BAJA EN CUENTA ───────────────────────────────────────────
    set('pctBenIntCorr_consolidacion',      pct(data.pctBenIntCorr));
    set('pctBenIntMora_consolidacion',      pct(data.pctBenIntMora));
    set('pctBenIntExtra_consolidacion',     pct(data.pctBenIntExtra));
    set('nuevoPlazo_consolidacion',         data.nuevoPlazo);
    set('saldoTotal_consolidacion',         moneda(data.saldoTotalConsolidado));
    set('valCuotaProyectada_consolidacion', moneda(data.valCuotaProyectada));
    set('pagoNegociacionNew_consolidacion', moneda(data.pagoNegociacion));
    set('amortizacion_consolidacion',       data.amortizacion);
    set('tasaIntEA_consolidacion',          data.tasaIntEA);

    // ── PREGUNTAS DECLARACIÓN FISCAL ─────────────────────────────────────────
    set('pregunta1_consolidacion', data.pregunta1 || 'NO');
    set('pregunta2_consolidacion', data.pregunta2 || 'NO');
    set('pregunta3_consolidacion', data.pregunta3 || 'NO');
    set('pregunta4_consolidacion', data.pregunta4 || 'NO');

    // ── GARANTÍAS ────────────────────────────────────────────────────────────
    set('garantiaFAG_consolidacion', data.garantiaFAG || 'NO');
    set('garantiaFNG_consolidacion', data.garantiaFNG || 'NO');

    // ── OBSERVACIONES ────────────────────────────────────────────────────────
    set('observaciones_consolidacion', data.observaciones || '');

    // ── LUGAR DE FIRMA ───────────────────────────────────────────────────────
    set('lugarFirma_consolidacion', data.lugarFirma || '');
}


// ============================================================
//  EJEMPLO DE USO — descomentar para probar
// ============================================================
llenarConsolidacion({
    fecha:            new Date(),
    codOficina:       "0000",
    nombreOficina:    "OFICINA PRINCIPAL",
    cuentaPago:       "Pago a producto",
    funcionario:      "Brayan David Roldan Vargas",

    nombreCliente:    "María García López",
    tipoDoc:          "CC",
    numDoc:           "1019044759",
    lugarExp:         "BOGOTA D.C. - BOGOTA D.C.",
    fechaExp:         "2000-02-02",

    diasMora:             120,
    descripcionActividad: "Empleado",
    ingresoMensual:       3500000,
    ocupacionAdicional:   "Independiente",
    ingresosAdicionales:  500000,

    obligaciones: [
        { numero: "4551", saldoTotal: 4373652.53, intCorrientes: 193017.51, intMora: 19343.71, intExtraC: 145.76 },
        { numero: "9784", saldoTotal: 10648103,   intCorrientes: 721501,    intMora: 20994,    intExtraC: 0      },
        { numero: "1811", saldoTotal: 2629356.68, intCorrientes: 119377.82, intMora: 10722.17, intExtraC: 45.63  },
    ],

    pctBenIntCorr:         100,
    pctBenIntMora:         100,
    pctBenIntExtra:        100,
    nuevoPlazo:            48,
    saldoTotalConsolidado: 13921135.31,
    valCuotaProyectada:    450000,
    pagoNegociacion:       200000,
    amortizacion:          "Francesa",
    tasaIntEA:             "18.5%",

    pregunta1:    "NO",
    pregunta2:    "NO",
    pregunta3:    "NO",
    pregunta4:    "NO",

    garantiaFAG:  "NO",
    garantiaFNG:  "NO",

    observaciones: "",
    lugarFirma:   "Bogotá D.C."
});

document.getElementById('modalconsolidacion').showModal();
