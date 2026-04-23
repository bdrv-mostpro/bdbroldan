//En este documento haremos la gestion de datos fun consolidacion
// generamos la relacion de los ids comparado con campos del FUN real
function DataFunConsolidacion(mecanismo) {
    function dataAmpliacion() {
        function getSelectText(id, defaultValue = "NO") {
            const el = document.getElementById(id);
                if (!el) {
                    console.warn(`Elemento no encontrado: ${id}`);
                    return defaultValue;
                }
                if (el.selectedIndex >= 0) {
                    return el.options[el.selectedIndex].innerText.trim();
                }
                return defaultValue;
            }
        //informacion Información Cliente Actividad Económica
        var cuotasFinancieras = document.getElementById("bae90b7e-42e0-40a3-a806-9f9a6227b20e").getAttribute("aria-valuenow") || "$";
        var descripcionActividad = document.getElementById("c852f2a7-6f9c-48f6-96b5-6fdc26c399ef").selectedOptions[0].innerText === "Seleccione un registro..." ? "" : document.getElementById("c852f2a7-6f9c-48f6-96b5-6fdc26c399ef").selectedOptions[0].innerText || "";
        var ingresoMensual = document.getElementById("67631aed-75e4-4b23-8601-17cadd1c7003").getAttribute("aria-valuenow") || "$";
        var ocupacionAdicional = document.getElementById("b54af750-167e-4831-bb8c-c374e7f45202").selectedOptions[0].innerText === "Seleccione un registro..." ? "" : document.getElementById("b54af750-167e-4831-bb8c-c374e7f45202").selectedOptions[0].innerText || "";
        var ingresosAdicionales = document.getElementById("1a47c2c1-4551-4d13-89ca-82e89ce655c0").getAttribute("aria-valuenow") || "$";


        //Consolidacion pag 2
        var totalBajaEnCuentaIntCte = document.getElementById("04dbcb19-8f74-4eac-81f3-6bcc76cd7f9a").getAttribute("aria-valuenow") || "$";
        var totalBajaEnCuentaIntMora = document.getElementById("f848cad9-f94d-4e56-9468-863a2a55e402").getAttribute("aria-valuenow") || "$";
        var totalBajaEnCuentaExtraContables = document.getElementById("dc9166ce-a5c8-4fc7-ad2b-4c6479d63f12").getAttribute("aria-valuenow") || "$";
        var bajaEnCuentaIntCte = document.getElementById("b42b41d8-cd57-4233-9bff-8a5ceec5af03").getAttribute("aria-valuenow") || "$";
        var bajaEnCuentaIntMoraIcsConsolidacion = document.getElementById("e079d101-5148-42ed-854e-9be982adc01e").getAttribute("aria-valuenow") || "$";
        var bajaEnCuentaIntExtrac = document.getElementById("e970af6e-de8d-47b3-97d0-98e4950c9bdf").getAttribute("aria-valuenow") || "$";
        var saldoTotalDesembolsar = document.getElementById("69b7fc43-675b-4984-bd64-9fd68799a97b").getAttribute("aria-valuenow") || "$";
        var marcaObligacion = document.getElementById("183f4194-c998-41a4-9a8c-1436cc78132f").getAttribute("aria-valuenow") || "$";
        var amortizacion = document.getElementById("03011879-0560-4a41-826b-888c89f6ab83").getAttribute("aria-valuenow") || "$";
        var plazo = document.getElementById("aa4de771-cbaf-486d-8de2-06941dc220d5").getAttribute("aria-valuenow") || "$";
        var tasaIntEA = document.getElementById("c9f5317e-9099-43f1-9b7f-78b93d99aa6a").getAttribute("aria-valuenow") || "$";
        var cuotaProyectada = document.getElementById("e74b2587-dccc-4395-8333-f6c2f34338aa").getAttribute("aria-valuenow") || "$";
        var pagoNegociacion = document.getElementById("0ee03528-b018-47d1-856b-9e30dbae2ddf").getAttribute("aria-valuenow") || "$";
        let fechaPago = document.querySelector("#\\33 9505284-3650-4303-b564-747e7dd3a8e9 > div.dx-dropdowneditor-input-wrapper > div > div.dx-texteditor-input-container > input").value
        fechaPago = fechaPago.replaceAll('-', '')
        var requiereTramite = document.getElementById("48dfc177-18ab-4c7c-91a9-e2a63c92dc15").getAttribute("aria-valuenow") || "$";



        //pagina cuatro
        var observacionesPag4 = document.getElementById("be70a202-71a9-40ea-851b-945702693b51").value || "";
        var pregunta1 = getSelectText("pregunta1");
        var pregunta2 = getSelectText("pregunta2");
        var pregunta3 = getSelectText("pregunta3");
        var pregunta4 = getSelectText("pregunta4");
        var garantiaFAG = getSelectText("garantiaFAG");
        var garantiaFNG = getSelectText("garantiaFNG");

        return {

            cuotasFinancieras,
            descripcionActividad,
            ingresoMensual,
            ocupacionAdicional,
            ingresosAdicionales,
            totalBajaEnCuentaIntCte,
            totalBajaEnCuentaIntMora,
            totalBajaEnCuentaExtraContables,
            bajaEnCuentaIntCte,
            bajaEnCuentaIntMoraIcsConsolidacion,
            bajaEnCuentaIntExtrac,
            saldoTotalDesembolsar,
            marcaObligacion,
            amortizacion,
            plazo,
            tasaIntEA,
            cuotaProyectada,
            pagoNegociacion,
            fechaPago,
            requiereTramite,
            observacionesPag4,
            pregunta1,
            pregunta2,
            pregunta3,
            pregunta4,
            garantiaFAG,
            garantiaFNG,

        }
    }

    const formateador = new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
    });
    function loadFormData(data) {

        document.getElementById("" + mecanismo).textContent = data.cuotasFinancieras;
        document.getElementById("descripcionActividad_consolidacion" + mecanismo).textContent = data.descripcionActividad;
        document.getElementById("ingresoMensual_consolidacion" + mecanismo).textContent = formateador.format(data.ingresoMensual);
        document.getElementById("ocupacionAdicional_consolidacion" + mecanismo).textContent = data.ocupacionAdicional;
        document.getElementById("ingresosAdicionales_consolidacion" + mecanismo).textContent = formateador.format(data.ingresosAdicionales);
        document.getElementById("pctBenIntCorr_consolidacion" + mecanismo).textContent = formateador.format(data.totalBajaEnCuentaIntCte);
        document.getElementById("pctBenIntMora_consolidacion" + mecanismo).textContent = formateador.format(data.totalBajaEnCuentaIntMora);
        document.getElementById("pctBenIntExtra_consolidacion" + mecanismo).textContent = formateador.format(data.totalBajaEnCuentaExtraContables);

        document.getElementById("saldoTotalCap_consolidacion" + mecanismo).textContent = data.saldoTotalDesembolsar;       
        document.getElementById("amortizacion_consolidacion" + mecanismo).textContent = data.amortizacion;
        document.getElementById("nuevoPlazo_consolidacion" + mecanismo).textContent = data.plazo;
        document.getElementById("tasaNegociacion_consolidacion" + mecanismo).textContent = formateador.format(data.tasaIntEA);
        document.getElementById("valCuotaProyectada_consolidacion" + mecanismo).textContent = formateador.format(data.cuotaProyectada);
        document.getElementById("pagoNegociacionNew_consolidacion" + mecanismo).textContent = formateador.format(data.pagoNegociacion);


        document.getElementById("observaciones_consolidacion" + mecanismo).textContent = data.observacionesPag4;

        document.getElementById("pregunta1_consolidacion" + mecanismo).textContent = data.pregunta1;
        document.getElementById("pregunta2_consolidacion" + mecanismo).textContent = data.pregunta2;
        document.getElementById("pregunta3_consolidacion" + mecanismo).textContent = data.pregunta3;
        document.getElementById("pregunta4_consolidacion" + mecanismo).textContent = data.pregunta4;
        document.getElementById("garantiaFAG_consolidacion" + mecanismo).textContent = data.garantiaFAG;
        document.getElementById("garantiaFNG_consolidacion" + mecanismo).textContent = data.garantiaFNG;

        
        document.getElementById("" + mecanismo).textContent = data.fechaPago;
        document.getElementById("" + mecanismo).textContent = data. requiereTramite;
        document.getElementById("" + mecanismo).textContent = data.bajaEnCuentaIntCte;
        document.getElementById("" + mecanismo).textContent = data.bajaEnCuentaIntMoraIcsConsolidacion;
        document.getElementById("" + mecanismo).textContent = data.bajaEnCuentaIntExtrac;
        document.getElementById("" + mecanismo).textContent = data.marcaObligacion;

    }

    //crear funcion que determine el valor de cada una de las obligaciones

    setTimeout(() => {
        loadFormData(dataAmpliacion());
        console.log("Datos para novacion cargados");
        console.log("Datos:", dataAmpliacion());

    }, 500);
}



////////////////////////////////////////////////////////////////////////////////////////////////////////////


function obligacionConsolidacionvacia(data) {}
async function obligacionConsolidacion(data) {
    const consolidacionDiv = document.getElementById("consolidacion");
    consolidacionDiv.innerHTML = "";
    // Ejecutar consulta para obtener el response
    let response = await execQuery(`EXEC SimiladorDNC_Lappiz_EmailConfirmed @sw = 11`);

    // Obtener el listado de data items del response
    const dataItems = response[0]; // Se asume que esto contiene un arreglo con los elementos

    // Variables para el cálculo
    sessionStorage.PorcentajeConsolidacionMora = data[0].PorcentajeConsolidacionMora;
    sessionStorage.PorcentajeConsolidacionExtraC = data[0].PorcentajeConsolidacionExtraC;
    sessionStorage.PorcentajeConsolidacionCorriente = data[0].PorcentajeConsolidacionCorriente;

    if (data[0].MecanismoAplicaCampana && data[0].MecanismoAplicaCampana.includes("CONSOLIDACION")) {
        console.log("si tiene");
        sessionStorage.PorcentajeConsolidacionMora = data[0].DtoInteresesMoraCampana;
        sessionStorage.PorcentajeConsolidacionExtraC = data[0].DtoInteresExtracontablesCampana;
        sessionStorage.PorcentajeConsolidacionCorriente = data[0].DtoInteresesCampana;
        setFieldValue("c9f5317e-9099-43f1-9b7f-78b93d99aa6a", data[0].TasaCampana);
    }

    // Crear dinámicamente las cards
    data.forEach((item) => {
        const card1 = document.createElement("div");
        card1.className = "card1";

        // Título
        const title = document.createElement("h3");
        title.textContent = `Obligación: ${item.Obl}`;
        card1.appendChild(title);

        // Toggle Switch
        const toggleContainer = document.createElement("div");
        toggleContainer.className = "toggle-switch";

        const toggleInput = document.createElement("input");
        toggleInput.type = "checkbox";
        toggleInput.id = `toggle-${item.Obl}`;

        // Activar el toggle si SecuenciaObl es igual a 1
        toggleInput.checked = item.SecuenciaObl === "1";

        const toggleLabel = document.createElement("label");
        toggleLabel.htmlFor = `toggle-${item.Obl}`;
        toggleContainer.appendChild(toggleInput);
        toggleContainer.appendChild(toggleLabel);
        card1.appendChild(toggleContainer);

        // Campos
        const fields = [
            { label: "Saldo Total *", value: item.SaldoTotalObl },
            { label: "Interes Corriente *", value: item.InteresCteObl },
            { label: "Interes Mora *", value: item.InteresMoraObl },
            { label: 'Int Extracontables "TC"', value: item.InteresesExtracontablesObl },
        ];

        fields.forEach((field) => {
            const fieldContainer = document.createElement("div");
            fieldContainer.className = "field-container";

            const label = document.createElement("label");
            label.textContent = field.label;

            const input = document.createElement("input");
            input.type = "text";
            input.classList.add("input");
            input.setAttribute("data-label", field.label);
            input.value = formatNumber2(field.value); // Mostrar formateado
            input.setAttribute("data-raw-value", field.value); // Guardar el valor original sin formato

            // Habilitar o deshabilitar el input según el estado inicial del toggle
            input.disabled = item.SecuenciaObl !== "1";

            // Formatear al escribir
            input.addEventListener("input", (e) => {
                const rawValue = e.target.value.replace(/\D/g, ""); // Quitar todo excepto números
                e.target.setAttribute("data-raw-value", rawValue); // Actualizar el valor sin formato
                e.target.value = formatNumber2(rawValue); // Mostrar formateado
            });

            fieldContainer.appendChild(label);
            fieldContainer.appendChild(input);
            card1.appendChild(fieldContainer);

            // Habilitar/deshabilitar campos cuando cambie el estado del toggle
            toggleInput.addEventListener("change", () => {
                input.disabled = !toggleInput.checked;
            });
        });

        // Campo "Marca Obligación" como lista desplegable
        const marcaFieldContainer = document.createElement("div");
        marcaFieldContainer.className = "field-container";

        const marcaLabel = document.createElement("label");
        marcaLabel.textContent = "Marca Obligación";

        const select = document.createElement("select");
        select.classList.add("marca-obligacion");

        // Rellenar el select con las opciones del response[0]
        dataItems.forEach((dataItem) => {
            const option = document.createElement("option");
            option.value = dataItem.Id;
            option.textContent = dataItem.Title;

            // Agregar los nuevos atributos PeorMarca y MarcaLetra a cada opción
            option.setAttribute("data-peorMarca", dataItem.PeorMarca);
            option.setAttribute("data-marcaLetra", dataItem.MarcaLetra);

            select.appendChild(option);

            // Seleccionar la opción correcta si contiene el texto del item.MarcaObl026
            if (dataItem.Title.includes(item.MarcaObl026)) {
                option.selected = true;
            }
        });

        // Deshabilitar el select si el toggle no está activado
        select.disabled = item.SecuenciaObl !== "1";

        marcaFieldContainer.appendChild(marcaLabel);
        marcaFieldContainer.appendChild(select);
        card1.appendChild(marcaFieldContainer);

        // Habilitar/deshabilitar el select cuando cambie el estado del toggle
        toggleInput.addEventListener("change", () => {
            select.disabled = !toggleInput.checked;
        });

        // Agregar la card1 al contenedor principal
        consolidacionDiv.appendChild(card1);
    });
}

// Función para formatear números con separadores de miles
function formatNumber2(value) {
    if (!value) return "";
    return parseFloat(value).toLocaleString("es-CO");
}