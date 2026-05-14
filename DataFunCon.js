/**
 * FUNCIÓN PRINCIPAL
 * Orquesta la recolección de datos del formulario y la renderización en el FUN (formato)
 */
function DataFunConsolidacion(mecanismo) {

    // =========================================================
    // 1. CAPTURA DE DATOS GENERALES DEL FORMULARIO
    // =========================================================
    function dataConsolidacion() {

        /**
         * Helper para obtener el texto de un <select>
         * Evita errores si el elemento no existe
         */
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

        /**
         * Aquí empieza la extracción de datos del DOM
         * Se usan optional chaining (?.) para evitar errores si no existen elementos
         */

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

        // Datos financieros del acuerdo
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
                ?.selectedOptions[0]?.text || "";

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

        const observacionesPag4 =
            document.getElementById("4b025de3-4404-41f3-8ba8-ac9b0988391e")
                ?.value || "";

        // Preguntas tipo sí/no
        const pregunta1  = getSelectText("pregunta1");
        const pregunta2  = getSelectText("pregunta2");
        const pregunta3  = getSelectText("pregunta3");
        const pregunta4  = getSelectText("pregunta4");

        const garantiaFAG = getSelectText("garantiaFAG");
        const garantiaFNG = getSelectText("garantiaFNG");

        /**
         * Retorna un objeto consolidado con todos los datos
         */
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

    // =========================================================
    // 2. OBTENER OBLIGACIONES ACTIVAS (CARDS CHECKEADAS)
    // =========================================================
    function getObligacionesActivas() {

        const obligaciones = [];

        // Selecciona todas las cards del módulo
        const cards = document.querySelectorAll("#consolidacion .card1");

        cards.forEach((card) => {

            // Verifica si el toggle está activo
            const toggle = card.querySelector("input[type='checkbox']");
            if (!toggle || !toggle.checked) return;

            /**
             * Obtención del nombre de la obligación
             * Prioridad:
             * 1. Atributo (BD)
             * 2. Input dinámico
             * 3. ID del toggle (fallback)
             */
            const nombreDesdeAttr =
                card.querySelector("[data-obligacion-nombre]")
                    ?.getAttribute("data-obligacion-nombre");

            const nombreDesdeInput =
                card.querySelector("input[data-label*='Obligación']")?.value ||
                card.querySelector("input.nombre-obligacion")?.value ||
                card.querySelector("input[placeholder*='obligación']")?.value;

            const numObligacion =
                nombreDesdeAttr ||
                nombreDesdeInput ||
                toggle.id.replace("toggle-", "");

            /**
             * Helper para obtener valores numéricos de inputs
             */
            function getRaw(label) {
                const inputs = card.querySelectorAll("input[data-label]");

                for (let input of inputs) {
                    if (input.getAttribute("data-label")?.includes(label)) {
                        return input.getAttribute("data-raw-value")
                            || input.value
                            || "0";
                    }
                }
                return "0";
            }

            const selectMarca = card.querySelector("select.marca-obligacion");

            const marcaTexto =
                selectMarca?.options[selectMarca.selectedIndex]?.text || "";

            // Se construye el objeto obligación
            obligaciones.push({
                numObligacion,
                saldoTotal:    getRaw("Saldo Total *"),
                intCorrientes: getRaw("Interes Corriente *"),
                intMora:       getRaw("Interes Mora *"),
                intExtraC:     getRaw("Int Extracontables"),
                marcaObligacion: marcaTexto,
                fuente: nombreDesdeAttr ? "BD" : "dinamica"
            });
        });

        return obligaciones;
    }

    // =========================================================
    // 3. HELPER PARA SETEAR DATOS EN EL DOM
    // =========================================================
    function setCell(id, value) {
        const el = document.getElementById(id);

        if (el) {
            el.textContent = value ?? "";
        } else {
            console.warn(`Celda no encontrada: #${id}`);
        }
    }

    // =========================================================
    // 4. RENDER DINÁMICO DE FILAS (TABLA)
    // =========================================================
    function llenarFilasObligaciones(obligaciones) {

        const contenedor =
            document.getElementById(`filas-obligaciones-${mecanismo}`);

        if (!contenedor) {
            console.warn("Contenedor no encontrado");
            return;
        }

        // Limpia antes de renderizar
        contenedor.innerHTML = "";

        // Caso sin datos
        if (obligaciones.length === 0) {
            contenedor.innerHTML = `
                <div class="grid-data-row_con vacia">
                    <div class="grid-cell_con">—</div>
                    <div class="grid-cell_con">—</div>
                    <div class="grid-cell_con">—</div>
                    <div class="grid-cell_con">—</div>
                    <div class="grid-cell_con">—</div>
                </div>`;
            return;
        }

        // Formateador moneda
        const formateador = new Intl.NumberFormat("es-CO", {
            style: "currency",
            currency: "COP",
            minimumFractionDigits: 0,
        });

        // Render de filas
        obligaciones.forEach((obl, index) => {

            const fila = document.createElement("div");
            fila.className = "grid-data-row_con";

            fila.innerHTML = `
                <div class="grid-cell_con">${obl.numObligacion}</div>
                <div class="grid-cell_con">${formateador.format(obl.saldoTotal)}</div>
                <div class="grid-cell_con">${formateador.format(obl.intCorrientes)}</div>
                <div class="grid-cell_con">${formateador.format(obl.intMora)}</div>
                <div class="grid-cell_con">${formateador.format(obl.intExtraC)}</div>
            `;

            contenedor.appendChild(fila);
        });
    }

    // =========================================================
    // 5. CARGAR DATOS GENERALES EN EL FORMATO
    // =========================================================
    function loadFormData(data) {

        const formateador = new Intl.NumberFormat("es-CO", {
            style: "currency",
            currency: "COP",
            minimumFractionDigits: 0,
        });

        setCell(`descripcionActividad_${mecanismo}`, data.descripcionActividad);
        setCell(`ingresoMensual_${mecanismo}`, formateador.format(data.ingresoMensual));
        setCell(`ocupacionAdicional_${mecanismo}`, data.ocupacionAdicional);
        setCell(`ingresosAdicionales_${mecanismo}`, formateador.format(data.ingresosAdicionales));

        setCell(`pctBenIntCorr_${mecanismo}`, formateador.format(data.totalBajaEnCuentaIntCte));
        setCell(`pctBenIntMora_${mecanismo}`, formateador.format(data.totalBajaEnCuentaIntMora));
        setCell(`pctBenIntExtra_${mecanismo}`, formateador.format(data.totalBajaEnCuentaExtraContables));

        setCell(`saldoTotal_${mecanismo}`, formateador.format(data.saldoTotalDesembolsar));
        setCell(`amortizacion_${mecanismo}`, data.amortizacion);
        setCell(`nuevoPlazo_${mecanismo}`, data.plazo);
        setCell(`tasaIntEA_${mecanismo}`, data.tasaIntEA);
        setCell(`valCuotaProyectada_${mecanismo}`, formateador.format(data.cuotaProyectada));
        setCell(`pagoNegociacionNew_${mecanismo}`, formateador.format(data.pagoNegociacion));

        setCell(`observaciones_${mecanismo}`, data.observacionesPag4);

        setCell(`pregunta1_${mecanismo}`, data.pregunta1);
        setCell(`pregunta2_${mecanismo}`, data.pregunta2);
        setCell(`pregunta3_${mecanismo}`, data.pregunta3);
        setCell(`pregunta4_${mecanismo}`, data.pregunta4);

        setCell(`garantiaFAG_${mecanismo}`, data.garantiaFAG);
        setCell(`garantiaFNG_${mecanismo}`, data.garantiaFNG);
    }

    // =========================================================
    // 6. EJECUCIÓN FINAL
    // =========================================================
    setTimeout(() => {

        const data = dataConsolidacion();
        const obligaciones = getObligacionesActivas();

        loadFormData(data);
        llenarFilasObligaciones(obligaciones);

        console.log("Datos generales:", data);
        console.log("Obligaciones:", obligaciones);

    }, 500);
}