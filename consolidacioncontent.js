function DataFunConsolidacion(mecanismo) {
    // ─────────────────────────────────────────────────────────
    // 1. DATOS GENERALES DEL FORMULARIO
    // ─────────────────────────────────────────────────────────
    function dataConsolidacion() {

        function getSelectText(id, defaultValue = "NO") {
            const el = document.getElementById(id);
            if (!el) {
                console.warn(`Elemento no encontrado: ${id}`);
                return defaultValue;
            }
            return el.selectedIndex >= 0
                ? el.options[el.selectedIndex].innerText.trim()
                : defaultValue;
        }

        // — Actividad económica —
        const descripcionActividad =
            document.getElementById("c852f2a7-6f9c-48f6-96b5-6fdc26c399ef")
                ?.selectedOptions[0]?.innerText === "Seleccione un registro..."
                ? ""
                : document.getElementById("c852f2a7-6f9c-48f6-96b5-6fdc26c399ef")
                      ?.selectedOptions[0]?.innerText || "";

        const ingresoMensual =
            document.getElementById("67631aed-75e4-4b23-8601-17cadd1c7003")
                ?.getAttribute("aria-valuenow") || "0";

        const ocupacionAdicional =
            document.getElementById("b54af750-167e-4831-bb8c-c374e7f45202")
                ?.selectedOptions[0]?.innerText === "Seleccione un registro..."
                ? ""
                : document.getElementById("b54af750-167e-4831-bb8c-c374e7f45202")
                      ?.selectedOptions[0]?.innerText || "";

        const ingresosAdicionales =
            document.getElementById("1a47c2c1-4551-4d13-89ca-82e89ce655c0")
                ?.getAttribute("aria-valuenow") || "0";

        // — Condiciones baja en cuenta —
        const totalBajaEnCuentaIntCte =
            document.getElementById("04dbcb19-8f74-4eac-81f3-6bcc76cd7f9a")
                ?.getAttribute("aria-valuenow") || "0";

        const totalBajaEnCuentaIntMora =
            document.getElementById("f848cad9-f94d-4e56-9468-863a2a55e402")
                ?.getAttribute("aria-valuenow") || "0";

        const totalBajaEnCuentaExtraContables =
            document.getElementById("dc9166ce-a5c8-4fc7-ad2b-4c6479d63f12")
                ?.getAttribute("aria-valuenow") || "0";

        const saldoTotalDesembolsar =
            document.getElementById("69b7fc43-675b-4984-bd64-9fd68799a97b")
                ?.getAttribute("aria-valuenow") || "0";

        const amortizacion =
            document.getElementById("03011879-0560-4a41-826b-888c89f6ab83")
                ?.getAttribute("aria-valuenow") || "0";

        const plazo =
            document.getElementById("aa4de771-cbaf-486d-8de2-06941dc220d5")
                ?.getAttribute("aria-valuenow") || "0";

        const tasaIntEA =
            document.getElementById("c9f5317e-9099-43f1-9b7f-78b93d99aa6a")
                ?.getAttribute("aria-valuenow") || "0";

        const cuotaProyectada =
            document.getElementById("e74b2587-dccc-4395-8333-f6c2f34338aa")
                ?.getAttribute("aria-valuenow") || "0";

        const pagoNegociacion =
            document.getElementById("0ee03528-b018-47d1-856b-9e30dbae2ddf")
                ?.getAttribute("aria-valuenow") || "0";

        // — Página 4 —
        const observacionesPag4 =
            document.getElementById("be70a202-71a9-40ea-851b-945702693b51")
                ?.value || "";

        const pregunta1  = getSelectText("pregunta1");
        const pregunta2  = getSelectText("pregunta2");
        const pregunta3  = getSelectText("pregunta3");
        const pregunta4  = getSelectText("pregunta4");
        const garantiaFAG = getSelectText("garantiaFAG");
        const garantiaFNG = getSelectText("garantiaFNG");

        return {
            descripcionActividad,
            ingresoMensual,
            ocupacionAdicional,
            ingresosAdicionales,
            totalBajaEnCuentaIntCte,
            totalBajaEnCuentaIntMora,
            totalBajaEnCuentaExtraContables,
            saldoTotalDesembolsar,
            amortizacion,
            plazo,
            tasaIntEA,
            cuotaProyectada,
            pagoNegociacion,
            observacionesPag4,
            pregunta1,
            pregunta2,
            pregunta3,
            pregunta4,
            garantiaFAG,
            garantiaFNG,
        };
    }

    // ─────────────────────────────────────────────────────────
    // 2. CAPTURA DE OBLIGACIONES DESDE TOGGLES ACTIVOS
    //    Lee el DOM generado por obligacionConsolidacion()
    // ─────────────────────────────────────────────────────────
    function getObligacionesActivas() {
        const obligaciones = [];

        // Todas las cards viven en #consolidacion, generadas por obligacionConsolidacion()
        const cards = document.querySelectorAll("#consolidacion .card1");
        console.log("CARDS ENCONTRADAS:", cards.length);
        cards.forEach((card) => {
            const toggle = card.querySelector("input[type='checkbox']");

            // Solo cards con toggle activo
            if (!toggle || !toggle.checked) return;

            // "toggle-XXXX" → "XXXX"
            const numObligacion = toggle.id.replace("toggle-", "");

            // Lee data-raw-value para obtener el número limpio (sin formato de miles)
            function getRaw(label) {
            const inputs = card.querySelectorAll("input[data-label]");
            for (let input of inputs) {
                const attr = input.getAttribute("data-label");

                if (attr && attr.includes(label)) {
                    return input.getAttribute("data-raw-value") || "0";
                }
            }
            return "0";
}

            // Marca desde el select de la card
            const selectMarca = card.querySelector("select.marca-obligacion");
            const marcaTexto  = selectMarca
                ? (selectMarca.options[selectMarca.selectedIndex]?.text || "")
                : "";

            obligaciones.push({
                numObligacion,
                saldoTotal:      getRaw("Saldo Total *"),
                intCorrientes:   getRaw("Interes Corriente *"),
                intMora:         getRaw("Interes Mora *"),
                intExtraC:       getRaw("Int Extracontables"),
                marcaObligacion: marcaTexto,
            });
        });
        console.log("OBLIGACIONES:", obligaciones);
        return obligaciones; // Máximo 6 según el FUN
    }

    // ─────────────────────────────────────────────────────────
    // 3. HELPER — evita repetir getElementById + null-check
    // ─────────────────────────────────────────────────────────
    function setCell(id, value) {
        const el = document.getElementById(id);
        if (el) {
            el.textContent = value ?? "";
        } else {
            console.warn(`Celda no encontrada en FUN: #${id}`);
        }
    }

    // ─────────────────────────────────────────────────────────
    // 4. INSERCIÓN DINÁMICA EN LA TABLA DEL FUN
    //    IDs fijos del HTML: numObligacion_1_consolidacion … _6_
    // ─────────────────────────────────────────────────────────
    function llenarFilasObligaciones(obligaciones) {
        const MAX_FILAS = 6;

        for (let i = 1; i <= MAX_FILAS; i++) {
            const obl = obligaciones[i - 1]; // undefined si no hay más activos

            if (obl) {
                // Fila con datos
                setCell(`numObligacion_${i}_${mecanismo}`, obl.numObligacion);
                setCell(`saldoTotal_${i}_${mecanismo}`,    formateador.format(obl.saldoTotal));
                setCell(`intCorrientes_${i}_${mecanismo}`, formateador.format(obl.intCorrientes));
                setCell(`intMora_${i}_${mecanismo}`,       formateador.format(obl.intMora));
                setCell(`intExtraC_${i}_${mecanismo}`,     formateador.format(obl.intExtraC));
            }else {
                // LIMPIEZA DIRECTA (sin depender de otra función)
                setCell(`numObligacion_${i}_${mecanismo}`, "");
                setCell(`saldoTotal_${i}_${mecanismo}`, "");
                setCell(`intCorrientes_${i}_${mecanismo}`, "");
                setCell(`intMora_${i}_${mecanismo}`, "");
                setCell(`intExtraC_${i}_${mecanismo}`, "");
            }
        }
    }

    // ─────────────────────────────────────────────────────────
    // 5. CARGA DE DATOS GENERALES EN EL FUN
    // ─────────────────────────────────────────────────────────
    const formateador = new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        minimumFractionDigits: 0,
    });

    function loadFormData(data) {
        // — Actividad económica —
        setCell(`descripcionActividad_${mecanismo}`, data.descripcionActividad);
        setCell(`ingresoMensual_${mecanismo}`,        formateador.format(data.ingresoMensual));
        setCell(`ocupacionAdicional_${mecanismo}`,    data.ocupacionAdicional);
        setCell(`ingresosAdicionales_${mecanismo}`,   formateador.format(data.ingresosAdicionales));

        // — Condiciones baja en cuenta —
        setCell(`pctBenIntCorr_${mecanismo}`,         formateador.format(data.totalBajaEnCuentaIntCte));
        setCell(`pctBenIntMora_${mecanismo}`,         formateador.format(data.totalBajaEnCuentaIntMora));
        setCell(`pctBenIntExtra_${mecanismo}`,        formateador.format(data.totalBajaEnCuentaExtraContables));
        setCell(`saldoTotal_${mecanismo}`,            formateador.format(data.saldoTotalDesembolsar));
        setCell(`amortizacion_${mecanismo}`,          data.amortizacion);
        setCell(`nuevoPlazo_${mecanismo}`,            data.plazo);
        setCell(`tasaIntEA_${mecanismo}`,             data.tasaIntEA); // Sin formato moneda: es un porcentaje
        setCell(`valCuotaProyectada_${mecanismo}`,    formateador.format(data.cuotaProyectada));
        setCell(`pagoNegociacionNew_${mecanismo}`,    formateador.format(data.pagoNegociacion));

        // — Página 4 —
        setCell(`observaciones_${mecanismo}`,  data.observacionesPag4);
        setCell(`pregunta1_${mecanismo}`,      data.pregunta1);
        setCell(`pregunta2_${mecanismo}`,      data.pregunta2);
        setCell(`pregunta3_${mecanismo}`,      data.pregunta3);
        setCell(`pregunta4_${mecanismo}`,      data.pregunta4);
        setCell(`garantiaFAG_${mecanismo}`,    data.garantiaFAG);
        setCell(`garantiaFNG_${mecanismo}`,    data.garantiaFNG);
    }

    // ─────────────────────────────────────────────────────────
    // 6. PUNTO DE ENTRADA
    //    500 ms para que el DOM del simulador esté disponible
    // ─────────────────────────────────────────────────────────
    setTimeout(() => {
        const data          = dataConsolidacion();
        const obligActivas  = getObligacionesActivas();

        loadFormData(data);
        llenarFilasObligaciones(obligActivas);

        console.log("DataFunConsolidacion — generales:", data);
        console.log("DataFunConsolidacion — obligaciones activas:", obligActivas);
    }, 500);
}