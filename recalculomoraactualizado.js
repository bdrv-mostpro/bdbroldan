function RecalculosMora() {
  setTimeout(() => {
    const colchon = 20000;
    const safeNumber = val => isNaN(parseFloat(val)) ? 0 : parseFloat(val);

    const esTarjeta = getFieldValue('7a5c89e8-a431-4b76-b3bc-24f6a187978c') === 'Si';

    const InteresCteObl  = safeNumber(getFieldValue('9b3ac68c-68ff-4928-864d-906e9d851621'));
    const InteresMoraObl = safeNumber(getFieldValue('c13b3910-1960-422f-835d-7ea89982f8b6'));
    const PagoMinObl     = safeNumber(getFieldValue('af9911f8-4a06-4483-b25d-6bec9e1647fe'));
    const PagoSNR        = safeNumber(getFieldValue('3539dba8-0c22-491e-a05b-84642d675d59'));

    // ← CAMBIO: se lee desde sessionStorage, no del campo deshabilitado
    const InteresesExtraObl = esTarjeta
      ? safeNumber(sessionStorage.InteresesExtracontablesObl)
      : 0;

    const PorcPagoMoraIntCte1  = safeNumber(sessionStorage.PorcPagoMoraIntCte1);
    const PorcentajePagomora1  = safeNumber(sessionStorage.PorcentajePagomora1);
    const porcDescIntExtraCTC1 = safeNumber(sessionStorage.porcDescIntExtraCTC1);

    const maxcte  = InteresCteObl     * (PorcPagoMoraIntCte1  / 100);
    const maxmora = InteresMoraObl    * (PorcentajePagomora1  / 100);
    const maxExtC = esTarjeta ? InteresesExtraObl * (porcDescIntExtraCTC1 / 100) : 0;

    const totalMaxDctos = maxcte + maxmora + (esTarjeta ? maxExtC : 0);
    const abonoMinimo   = PagoMinObl - totalMaxDctos + colchon;
    setFieldValue('8f7266d7-dfc0-4ff4-afad-c50fbfa67062', abonoMinimo);

    const pagoExtra = Math.max(0, PagoSNR - abonoMinimo);

    let dctoMora   = maxmora;
    let dctoExtraC = esTarjeta ? maxExtC : 0;
    let dctoCte    = maxcte;
    let exceso     = pagoExtra;

    if (exceso > 0) {
      const r = Math.min(maxmora, exceso);
      dctoMora = maxmora - r;
      exceso  -= r;
    }

    if (exceso > 0 && esTarjeta) {
      const r = Math.min(maxExtC, exceso);
      dctoExtraC = maxExtC - r;
      exceso    -= r;
    }

    if (exceso > 0) {
      const r = Math.min(maxcte, exceso);
      dctoCte = maxcte - r;
    }

    const porcMoraReal   = InteresMoraObl    > 0 ? (dctoMora   / InteresMoraObl)    * 100 : 0;
    const porcExtraCReal = InteresesExtraObl > 0 ? (dctoExtraC / InteresesExtraObl) * 100 : 0;
    const porcCteReal    = InteresCteObl     > 0 ? (dctoCte    / InteresCteObl)     * 100 : 0;

    setFieldValue('36329717-6123-40c7-b4c9-d5f447a3cac4', maxcte);
    setFieldValue('49ed37fa-10f7-46d1-b2d3-bd4e28bef0db', dctoCte);
    setFieldValue('e076d650-c5d6-48b1-920b-295d431604b0', porcCteReal);

    setFieldValue('24a29872-6b5f-40fd-bae7-cb072e972ff5', maxmora);
    setFieldValue('db8c0e77-0029-4bf9-ba9a-ebc141721c33', dctoMora);
    setFieldValue('64fcdf9f-c6b3-4742-b4b2-e259759290d9', porcMoraReal);

    if (esTarjeta) {
      setFieldValue('de744073-f3bd-4c05-ac6f-9ca493664262', maxExtC);
      setFieldValue('a01eeadb-b99e-4e08-9d93-3fe44b9e1cf8', dctoExtraC);
      setFieldValue('0456eeb3-8809-48a5-8726-87e416efdcb3', porcExtraCReal);
    }

    setFieldValue('6cfd4b2c-6ef4-4821-95d5-364657fda787', totalMaxDctos);

    const totalAplicado = dctoMora + dctoExtraC + dctoCte;
    setFieldValue('6af98cad-1f96-4ad5-b33c-b0ddc8f68133', totalAplicado);

  }, 100);
}