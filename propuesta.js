// =============================================================================
// POLÍTICA VIGENTE — Mora de Contado (>30 días)
// -----------------------------------------------------------------------------
//  Rango días  │ % Corriente │ % ExtraC TC │ % Mora
//  ────────────┼─────────────┼─────────────┼────────
//  0–30        │     0%      │     0%      │   0%
//  31–60       │    35%      │    35%      │  100%
//  61–120      │    50%      │    50%      │  100%
//  >120        │    75%      │    75%      │  100%
//
// REGLAS:
//  1. % ExtraC TC == % Corriente siempre (misma columna: PorcPagoMoraIntCte)
//  2. % Mora viene de PorcentajePagomora (columna independiente en BD)
//  3. PorcPagoMoraIntExtraC de BD tiene valores incorrectos — NUNCA se usa
//  4. En campaña PAGOMORA:
//       % Corriente = DtoInteresesCampana
//       % Mora      = DtoInteresesMoraCampana
//       % ExtraC TC = DtoInteresesCampana  (igual a corriente, política)
//
// SESSIONSTORAGE — claves (nombres originales, sin cambiar):
//   InteresesExtracontablesObl   número en PESOS (valor traído de BD)
//   PorcPagoMoraIntCte1          % descuento corriente (= % ExtraC TC)
//   PorcentajePagomora1          % descuento mora
//   porcDescIntExtraCTC1         % descuento ExtraC TC (= PorcPagoMoraIntCte1)
//   campanamora                  'si' | 'no'
//   Obl                          identificador obligación
// =============================================================================


// =============================================================================
// UTILIDAD COMPARTIDA
// =============================================================================
function safeNumber(val) {
    if (val === null || val === undefined || val === '') return 0;
    const n = parseFloat(val);
    return isNaN(n) ? 0 : n;
}

// Función interna que aplica los porcentajes de tasas o campaña al sessionStorage
// y actualiza todos los campos. Usada por CalculosMora y RecalculoPorEdadMora.
function _aplicarTasasYRecalcular(tasas, tieneCampana, tarjeta, dataItem) {
    let porcDescIntCteIcs  = 0;
    let porcDescIntMoraIcs = 0;

    if (tieneCampana) {
        porcDescIntCteIcs  = safeNumber(dataItem.DtoInteresesCampana);
        porcDescIntMoraIcs = safeNumber(dataItem.DtoInteresesMoraCampana);
        sessionStorage.campanamora = 'si';
    } else {
        porcDescIntCteIcs  = safeNumber(tasas.PorcPagoMoraIntCte);
        porcDescIntMoraIcs = safeNumber(tasas.PorcentajePagomora);
        sessionStorage.campanamora = 'no';
    }

    // % ExtraC TC == % Corriente (política). PorcPagoMoraIntExtraC nunca se usa.
    const porcDescIntExtraCTC = tarjeta ? porcDescIntCteIcs : 0;

    // Guardar porcentajes definitivos en sessionStorage
    sessionStorage.PorcPagoMoraIntCte1  = porcDescIntCteIcs;
    sessionStorage.PorcentajePagomora1  = porcDescIntMoraIcs;
    sessionStorage.porcDescIntExtraCTC1 = porcDescIntExtraCTC;

    // Con sessionStorage poblado, RecalculosMora calcula y pinta todo
    RecalculosMora();
}


// =============================================================================
// FUNCIÓN 1: CalculosMora
// Dispara al seleccionar una obligación desde la grilla (e.dataItem).
// =============================================================================
function CalculosMora(){

    // Limpiar sessionStorage para evitar contaminación de sesión anterior
    sessionStorage.removeItem('InteresesExtracontablesObl');
    sessionStorage.removeItem('PorcPagoMoraIntCte1');
    sessionStorage.removeItem('PorcentajePagomora1');
    sessionStorage.removeItem('porcDescIntExtraCTC1');
    sessionStorage.removeItem('campanamora');
    sessionStorage.removeItem('Obl');

    const colchon = 20000;
    const tarjeta = (e.dataItem.Producto === 'TARJETA');

    setFieldValue('7a5c89e8-a431-4b76-b3bc-24f6a187978c', tarjeta ? 'Si' : 'No');

    if (tarjeta) {
        disableField('aef7fd98-0a00-4ec8-95d9-37840df1fe67', false);
        disableField('de744073-f3bd-4c05-ac6f-9ca493664262', false);
        disableField('a01eeadb-b99e-4e08-9d93-3fe44b9e1cf8', false);
        disableField('0456eeb3-8809-48a5-8726-87e416efdcb3', false);
    } else {
        setFieldValue('aef7fd98-0a00-4ec8-95d9-37840df1fe67', 0);
        setFieldValue('de744073-f3bd-4c05-ac6f-9ca493664262', 0);
        setFieldValue('a01eeadb-b99e-4e08-9d93-3fe44b9e1cf8', 0);
        setFieldValue('0456eeb3-8809-48a5-8726-87e416efdcb3', 0);
        disableField('aef7fd98-0a00-4ec8-95d9-37840df1fe67', true);
        disableField('de744073-f3bd-4c05-ac6f-9ca493664262', true);
        disableField('a01eeadb-b99e-4e08-9d93-3fe44b9e1cf8', true);
        disableField('0456eeb3-8809-48a5-8726-87e416efdcb3', true);
    }

    // Valores en pesos desde dataItem
    const PagoMinObl     = safeNumber(e.dataItem.PagoMinObl);
    const InteresCteObl  = safeNumber(e.dataItem.InteresCteObl);
    const InteresMoraObl = safeNumber(e.dataItem.InteresMoraObl);
    // InteresesExtracontablesObl: valor en PESOS del interés extracontable TC
    const InteresesExtracontablesObl = tarjeta
        ? safeNumber(e.dataItem.InteresesExtracontablesObl)
        : 0;

    setFieldValue('af9911f8-4a06-4483-b25d-6bec9e1647fe', PagoMinObl);
    setFieldValue('9b3ac68c-68ff-4928-864d-906e9d851621', InteresCteObl);
    setFieldValue('c13b3910-1960-422f-835d-7ea89982f8b6', InteresMoraObl);
    if (tarjeta) {
        setFieldValue('aef7fd98-0a00-4ec8-95d9-37840df1fe67', InteresesExtracontablesObl);
    }

    // Guardar pesos antes del query; porcentajes en 0 hasta que query resuelva
    sessionStorage.InteresesExtracontablesObl = InteresesExtracontablesObl;
    sessionStorage.PorcPagoMoraIntCte1        = 0;
    sessionStorage.PorcentajePagomora1        = 0;
    sessionStorage.porcDescIntExtraCTC1       = 0;
    sessionStorage.Obl                        = e.dataItem.Obligacion;

    const edadMora = e.dataItem.EdadMoraCl;

    if (edadMora === null || edadMora === undefined || edadMora === '') {
        RecalculosMora();
        return;
    }

    const tieneCampana = Boolean(
        e.dataItem.MecanismoAplicaCampana &&
        e.dataItem.MecanismoAplicaCampana.includes('PAGOMORA')
    );

    execQuery(
        `SELECT PorcentajePagomora, PorcPagoMoraIntCte
         FROM SimiladorDNC_Lappiz_TasasVigentes
         WHERE RangoDias3 = '${edadMora}'`
    )
    .then((response) => {
        if (!response || !response[0] || !response[0][0]) {
            console.warn('CalculosMora: sin tasas para EdadMoraCl =', edadMora);
            RecalculosMora();
            return;
        }
        _aplicarTasasYRecalcular(response[0][0], tieneCampana, tarjeta, e.dataItem);
    })
    .catch((err) => {
        console.error('CalculosMora: error en execQuery:', err);
        RecalculosMora();
    });
}


// =============================================================================
// FUNCIÓN 2: RecalculoPorEdadMora
// Dispara cuando el usuario cambia manualmente el campo Edad de Mora
// en el formulario (onChange del campo correspondiente).
// Hace un nuevo execQuery y actualiza porcentajes + todos los cálculos.
// NO toca los valores en pesos ya cargados.
// =============================================================================
function RecalculoPorEdadMora(){

    // Leer la nueva edad de mora desde el campo del formulario
    // (reemplazar 'CAMPO_EDAD_MORA_ID' por el ID real del campo)
    const edadMora = getFieldValue('CAMPO_EDAD_MORA_ID');

    if (edadMora === null || edadMora === undefined || edadMora === '') {
        // Sin edad de mora: limpiar porcentajes y recalcular en cero
        sessionStorage.PorcPagoMoraIntCte1  = 0;
        sessionStorage.PorcentajePagomora1  = 0;
        sessionStorage.porcDescIntExtraCTC1 = 0;
        RecalculosMora();
        return;
    }

    const tarjeta      = (getFieldValue('7a5c89e8-a431-4b76-b3bc-24f6a187978c') === 'Si');
    const tieneCampana = (sessionStorage.campanamora === 'si');

    // Limpiar porcentajes mientras el query resuelve para evitar valores rancios
    sessionStorage.PorcPagoMoraIntCte1  = 0;
    sessionStorage.PorcentajePagomora1  = 0;
    sessionStorage.porcDescIntExtraCTC1 = 0;

    execQuery(
        `SELECT PorcentajePagomora, PorcPagoMoraIntCte
         FROM SimiladorDNC_Lappiz_TasasVigentes
         WHERE RangoDias3 = '${edadMora}'`
    )
    .then((response) => {
        if (!response || !response[0] || !response[0][0]) {
            console.warn('RecalculoPorEdadMora: sin tasas para EdadMoraCl =', edadMora);
            RecalculosMora();
            return;
        }

        // En campaña activa: se respetan los % de campaña almacenados,
        // el cambio de edad no los altera (la campaña tiene sus propios dto fijos).
        // En tasas normales: se usan los nuevos % según el nuevo rango.
        if (tieneCampana) {
            // Porcentajes de campaña ya están en sessionStorage desde CalculosMora.
            // Solo actualizar porcDescIntExtraCTC1 para mantener consistencia.
            const porcCteActual = safeNumber(sessionStorage.PorcPagoMoraIntCte1);
            sessionStorage.porcDescIntExtraCTC1 = tarjeta ? porcCteActual : 0;
            RecalculosMora();
        } else {
            _aplicarTasasYRecalcular(response[0][0], false, tarjeta, {});
        }
    })
    .catch((err) => {
        console.error('RecalculoPorEdadMora: error en execQuery:', err);
        RecalculosMora();
    });
}


// =============================================================================
// FUNCIÓN 3: RecalculosMora
// Dispara al modificar cualquier campo editable del formulario:
// Interés Corriente, Interés Mora, Int Extracontables TC, Pago mínimo, Pago SNR.
// Lee sessionStorage (porcentajes) y campos (pesos) y pinta todos los resultados.
// NO consulta BD. NO modifica sessionStorage.
// =============================================================================
function RecalculosMora(){

    const colchon = 20000;

    const esTarjeta = (getFieldValue('7a5c89e8-a431-4b76-b3bc-24f6a187978c') === 'Si');

    // Valores en pesos desde campos del formulario
    const InteresCteObl  = safeNumber(getFieldValue('9b3ac68c-68ff-4928-864d-906e9d851621'));
    const InteresMoraObl = safeNumber(getFieldValue('c13b3910-1960-422f-835d-7ea89982f8b6'));
    const PagoMinObl     = safeNumber(getFieldValue('af9911f8-4a06-4483-b25d-6bec9e1647fe'));
    const PagoSNR        = safeNumber(getFieldValue('3539dba8-0c22-491e-a05b-84642d675d59'));

    // Intereses extracontables en PESOS.
    // Fuente 1: campo visual aef7fd98 (editable para TC, el usuario pudo cambiarlo).
    // Fuente 2: sessionStorage (valor original de BD como respaldo).
    // Cartera: siempre 0.
    let InteresesExtraObl = 0;
    if (esTarjeta) {
        const delCampo = safeNumber(getFieldValue('aef7fd98-0a00-4ec8-95d9-37840df1fe67'));
        const deSesion = safeNumber(sessionStorage.InteresesExtracontablesObl);
        InteresesExtraObl = delCampo > 0 ? delCampo : deSesion;
    }

    // Porcentajes desde sessionStorage.
    // porcDescIntExtraCTC1 fallback a PorcPagoMoraIntCte1 para cubrir formulario
    // manual donde el usuario ingresa datos sin pasar por CalculosMora.
    const PorcPagoMoraIntCte1  = safeNumber(sessionStorage.PorcPagoMoraIntCte1);
    const PorcentajePagomora1  = safeNumber(sessionStorage.PorcentajePagomora1);
    const porcDescIntExtraCTC1 = esTarjeta
        ? (safeNumber(sessionStorage.porcDescIntExtraCTC1) || PorcPagoMoraIntCte1)
        : 0;

    // Descuentos máximos posibles
    const maxcte  = InteresCteObl    * (PorcPagoMoraIntCte1  / 100);
    const maxmora = InteresMoraObl   * (PorcentajePagomora1  / 100);
    const maxExtC = esTarjeta
        ? InteresesExtraObl * (porcDescIntExtraCTC1 / 100)
        : 0;

    const totalMaxDctos = maxcte + maxmora + maxExtC;
    const abonoMinimo   = PagoMinObl - totalMaxDctos + colchon;
    setFieldValue('8f7266d7-dfc0-4ff4-afad-c50fbfa67062', abonoMinimo);

    // Distribución del exceso: PagoSNR > abonoMinimo reduce descuentos aplicados
    // en orden: 1. Mora → 2. ExtraC TC → 3. Corriente
    const excesoPago = Math.max(0, PagoSNR - abonoMinimo);

    let dctoCte    = maxcte;
    let dctoMora   = maxmora;
    let dctoExtraC = maxExtC;
    let exceso     = excesoPago;

    if (exceso > 0) {
        const r  = Math.min(maxmora, exceso);
        dctoMora = maxmora - r;
        exceso  -= r;
    }

    if (exceso > 0 && esTarjeta) {
        const r    = Math.min(maxExtC, exceso);
        dctoExtraC = maxExtC - r;
        exceso    -= r;
    }

    if (exceso > 0) {
        const r = Math.min(maxcte, exceso);
        dctoCte = maxcte - r;
    }

    // Porcentajes reales aplicados post-distribución (sin división por cero)
    const porcCteReal    = InteresCteObl    > 0 ? (dctoCte    / InteresCteObl)    * 100 : 0;
    const porcMoraReal   = InteresMoraObl   > 0 ? (dctoMora   / InteresMoraObl)   * 100 : 0;
    const porcExtraCReal = InteresesExtraObl > 0 ? (dctoExtraC / InteresesExtraObl) * 100 : 0;

    // -- Corriente --
    setFieldValue('36329717-6123-40c7-b4c9-d5f447a3cac4', maxcte);       // Max Baja en cuenta Int Cte
    setFieldValue('e076d650-c5d6-48b1-920b-295d431604b0', porcCteReal);  // %Baja en cuenta Int Cte
    setFieldValue('49ed37fa-10f7-46d1-b2d3-bd4e28bef0db', dctoCte);      // Baja en cuenta Int Cte (aplicada)

    // -- Mora --
    setFieldValue('24a29872-6b5f-40fd-bae7-cb072e972ff5', maxmora);      // Max Baja en cuenta Int Mora
    setFieldValue('64fcdf9f-c6b3-4742-b4b2-e259759290d9', porcMoraReal); // %Baja en cuenta Int Mora
    setFieldValue('db8c0e77-0029-4bf9-ba9a-ebc141721c33', dctoMora);     // Baja en cuenta Int Mora (aplicada)

    // -- TC Extracontable --
    if (esTarjeta) {
        setFieldValue('de744073-f3bd-4c05-ac6f-9ca493664262', maxExtC);        // Max Baja ExtraC TC
        setFieldValue('0456eeb3-8809-48a5-8726-87e416efdcb3', porcExtraCReal); // %Baja ExtraC TC
        setFieldValue('a01eeadb-b99e-4e08-9d93-3fe44b9e1cf8', dctoExtraC);     // Desc Int ExtraC TC (aplicado)
    } else {
        setFieldValue('de744073-f3bd-4c05-ac6f-9ca493664262', 0);
        setFieldValue('0456eeb3-8809-48a5-8726-87e416efdcb3', 0);
        setFieldValue('a01eeadb-b99e-4e08-9d93-3fe44b9e1cf8', 0);
    }

    // -- Totales --
    setFieldValue('6cfd4b2c-6ef4-4821-95d5-364657fda787', totalMaxDctos);

    const totalAplicado = dctoCte + dctoMora + (esTarjeta ? dctoExtraC : 0);
    setFieldValue('6af98cad-1f96-4ad5-b33c-b0ddc8f68133', totalAplicado);
}