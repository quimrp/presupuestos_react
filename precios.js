import VentanaCanvas from './src/ventanaCanvas2.js';

// Crear instancia de VentanaCanvas
const ventanaCanvas = new VentanaCanvas();

// Datos de prueba para las ventanas
const ventanasPrueba = [
    {
        referencia: "V001",
        ancho: 1000,
        alto: 1200,
        tipo: "practicable",
        mano: "derecha",
        unidades: 2,
        precio: 180,
        hojas: 1
    },
    {
        referencia: "V002",
        ancho: 800,
        alto: 1000,
        tipo: "oscilobatiente",
        mano: "izquierda",
        unidades: 1,
        precio: 220,
        hojas: 1
    },
    {
        referencia: "V003",
        ancho: 1500,
        alto: 1000,
        tipo: "corredera",
        mano: "derecha",
        unidades: 3,
        precio: 200,
        hojas: 2
    }
];

// Precio base inicial
let precioBase = 875;

// Referencias a todos los selects y checkboxes
const selects = document.querySelectorAll("select");
const checkboxes = document.querySelectorAll("input[type='checkbox']");

// Referencia al elemento del precio total
const precioTotalElement = document.getElementById("precio-total");

// Referencia al contenedor del resumen
const listaResumen = document.getElementById("lista-resumen");

// Precios base por tipo de ventana
const PRECIOS_BASE = {
    'practicable': 150,
    'oscilobatiente': 200,
    'corredera': 180
};

// Medidas estándar y sus descuentos
const MEDIDAS_ESTANDAR = [
    { ancho: 600, alto: 600, descuento: 10 },
    { ancho: 800, alto: 800, descuento: 10 },
    { ancho: 1000, alto: 1000, descuento: 15 },
    { ancho: 1200, alto: 1200, descuento: 15 },
    { ancho: 1500, alto: 1500, descuento: 20 }
];

// Configuración de extras
const CONFIG = {
    extras: {
        'tratamiento-termico': {
            nombre: 'Tratamiento Térmico',
            descripcion: 'Mejora la eficiencia energética',
            tipo: 'm2',
            precio: 20  // 20€/m²
        },
        'tratamiento-acustico': {
            nombre: 'Tratamiento Acústico',
            descripcion: 'Reduce significativamente el ruido exterior',
            tipo: 'm2',
            precio: 25  // 25€/m²
        },
        'instalacion': {
            nombre: 'Instalación',
            descripcion: 'Servicio de instalación profesional',
            tipo: 'unidad',
            precio: 50  // 50€/unidad
        }
    }
};

function calcularPrecioVentana(ventana) {
    const { ancho, alto, tipo } = ventana;
    const area = (ancho * alto) / 1000000; // Convertir a metros cuadrados
    let precio = PRECIOS_BASE[tipo] * area;

    // Buscar si coincide con medidas estándar
    const medidaEstandar = MEDIDAS_ESTANDAR.find(
        medida => medida.ancho === ancho && medida.alto === alto
    );

    if (medidaEstandar) {
        const descuento = precio * (medidaEstandar.descuento / 100);
        precio -= descuento;
    }

    // Calcular precio por hojas (mínimo 0.5m² por hoja)
    const m2PorHoja = area / ventana.hojas;
    const m2AjustadoPorHoja = Math.max(0.5, m2PorHoja);
    const m2TotalAjustado = m2AjustadoPorHoja * ventana.hojas;
    precio = PRECIOS_BASE[tipo] * m2TotalAjustado;

    return precio;
}

function mostrarSugerencias() {
    const anchoActual = parseInt(document.getElementById('ancho').value) || 0;
    const altoActual = parseInt(document.getElementById('alto').value) || 0;
    const contenedorSugerencias = document.getElementById('sugerencias');

    if (!anchoActual || !altoActual) {
        contenedorSugerencias.innerHTML = '';
        return;
    }

    const sugerencias = MEDIDAS_ESTANDAR.filter(medida => {
        const diferenciaAncho = Math.abs(medida.ancho - anchoActual);
        const diferenciaAlto = Math.abs(medida.alto - altoActual);
        return diferenciaAncho <= 200 && diferenciaAlto <= 200;
    });

    if (sugerencias.length === 0) {
        contenedorSugerencias.innerHTML = '';
        return;
    }

    let html = '<div class="alert alert-info">';
    html += '<h6>Medidas estándar sugeridas:</h6>';
    html += '<ul class="list-unstyled mb-0">';
    
    sugerencias.forEach(sugerencia => {
        html += `
            <li>
                <button class="btn btn-link p-0" onclick="aplicarMedida(${sugerencia.ancho}, ${sugerencia.alto})">
                    ${sugerencia.ancho} x ${sugerencia.alto} mm 
                    (${sugerencia.descuento}% descuento)
                </button>
            </li>
        `;
    });
    
    html += '</ul></div>';
    contenedorSugerencias.innerHTML = html;
}

function aplicarMedida(ancho, alto) {
    const anchoInput = document.getElementById('ancho');
    const altoInput = document.getElementById('alto');
    
    anchoInput.value = ancho;
    altoInput.value = alto;
    
    // Crear y disparar eventos de input
    const event = new Event('input', {
        bubbles: true,
        cancelable: true,
    });
    
    anchoInput.dispatchEvent(event);
    altoInput.dispatchEvent(event);
    actualizarPrecio();
}

function actualizarPrecio() {
    const ventana = {
        ancho: parseInt(document.getElementById('ancho').value) || 0,
        alto: parseInt(document.getElementById('alto').value) || 0,
        tipo: document.getElementById('tipo-ventana').value,
        hojas: parseInt(document.getElementById('hojas').value) || 1
    };

    const precio = calcularPrecioVentana(ventana);
    document.getElementById('precio').textContent = `${precio.toFixed(2)} €`;
    mostrarSugerencias();
}

// Agregar esta función que falta
function agregarSugerencia(id, precio) {
    const listaSugerencias = document.getElementById("sugerencias");
    
    // Si es la primera sugerencia, crear el encabezado
    if (!listaSugerencias.querySelector('.alert-info')) {
        const encabezado = document.createElement("h5");
        encabezado.className = "mb-3";
        encabezado.textContent = "Mejoras disponibles";
        encabezado.id = "titulo-mejoras";
        listaSugerencias.appendChild(encabezado);
    }
    
    const sugerenciaDiv = document.createElement("div");
    sugerenciaDiv.className = "alert alert-info d-flex justify-content-between align-items-center";
    sugerenciaDiv.setAttribute("data-id", id);
    
    const nombreMejora = document.querySelector(`label[for="${id}"]`).textContent;
    
    sugerenciaDiv.innerHTML = `
        <div>
            <strong>${nombreMejora}</strong>
            <br>
            <small>Precio adicional: ${precio}€</small>
        </div>
        <button class="btn btn-primary btn-sm" onclick="document.getElementById('${id}').click()">
            Activar
        </button>
    `;
    
    listaSugerencias.appendChild(sugerenciaDiv);
}

function mostrarSugerenciasIniciales() {
    const listaSugerencias = document.getElementById("sugerencias");
    listaSugerencias.innerHTML = ''; // Limpiar sugerencias existentes
    
    const switches = document.querySelectorAll(".form-check-input");
    const switchesSinMarcar = Array.from(switches).filter(sw => !sw.checked);
    
    // Solo mostrar sugerencias si hay switches sin marcar
    if (switchesSinMarcar.length > 0) {
        switchesSinMarcar.forEach(switchElement => {
            agregarSugerencia(switchElement.id, parseInt(switchElement.dataset.precio, 10));
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const switches = document.querySelectorAll(".form-check-input");
    
    // Inicializar los switches con los precios correctos de CONFIG
    switches.forEach((switchElement) => {
        const tipoExtra = switchElement.id;
        const extra = CONFIG.extras[tipoExtra];
        
        // Calcular el precio total para todas las unidades
        const precioTotal = calcularPrecioExtra(tipoExtra, ventanasPrueba, CONFIG);
        
        // Actualizar el data-precio según CONFIG
        switchElement.dataset.precio = precioTotal;
        
        const label = switchElement.nextElementSibling;
        label.textContent = `Activar (+${precioTotal.toFixed(2)}€)`;

        // Agregar event listener para actualizar el texto cuando cambie
        switchElement.addEventListener("change", (event) => {
            if (event.target.checked) {
                label.textContent = `Activado (+${precioTotal.toFixed(2)}€)`;
            } else {
                label.textContent = "Activar";
            }
        });
    });

    // Inicializar el canvas
    const ventanaCanvas = new VentanaCanvas();
    
    // Función para actualizar el dibujo
    function actualizarDibujo() {
        // Solo intentamos dibujar si estamos en la página del configurador
        const configuradorForm = document.getElementById('configurador-form');
        if (!configuradorForm) {
            console.log('No estamos en la página del configurador');
            return;
        }

        const anchoInput = document.getElementById('ancho');
        const altoInput = document.getElementById('alto');
        const tipoSelect = document.getElementById('tipo-ventana');
        
        // Si no encontramos los elementos necesarios, no hacemos nada
        if (!anchoInput || !altoInput || !tipoSelect) {
            console.log('No se encontraron todos los elementos necesarios para el dibujo');
            return;
        }
        
        const ancho = parseInt(anchoInput.value) || 1000;
        const alto = parseInt(altoInput.value) || 1000;
        const tipo = tipoSelect.value || 'practicable';
        
        console.log('Actualizando dibujo:', { ancho, alto, tipo });
        ventanaCanvas.dibujar(ancho, alto, tipo);
    }
    
    // Dibujo inicial
    actualizarDibujo();
});

document.addEventListener('DOMContentLoaded', () => {
    const switches = document.querySelectorAll(".form-check-input");

    const anchoInput = document.getElementById('ancho');
    const altoInput = document.getElementById('alto');
    const tipoSelect = document.getElementById('tipo-ventana');

    if (anchoInput && altoInput && tipoSelect) {
        anchoInput.addEventListener('input', actualizarPrecio);
        altoInput.addEventListener('input', actualizarPrecio);
        tipoSelect.addEventListener('change', actualizarPrecio);
        
        // Inicialización
        actualizarPrecio();
    }

    // Inicializar los switches
    switches.forEach((switchElement) => {
        const label = switchElement.nextElementSibling;
        label.textContent = "Activar"; // Establecer texto inicial
    });

    // Solo una llamada a mostrarSugerenciasIniciales
    mostrarSugerenciasIniciales();

    // Mostrar las ventanas de prueba
    const ventanasGrid = document.getElementById('ventanas-grid');
    console.log('Contenedor de ventanas:', ventanasGrid);
    
    if (!ventanasGrid) {
        console.error('No se encontró el contenedor de ventanas');
        return;
    }

    console.log('Ventanas a mostrar:', ventanasPrueba);
    
    ventanasPrueba.forEach((ventana, index) => {
        // Calcular y almacenar los metros cuadrados
        ventana.metrosCuadrados = (ventana.ancho * ventana.alto / 1000000).toFixed(2); // Convertir mm² a m²
        
        const col = document.createElement('div');
        col.className = 'col';
        
        const card = document.createElement('div');
        card.className = 'card h-100';
        card.style.maxWidth = '150px';
        
        const miniatura = ventanaCanvas.crearMiniatura(
            ventana.ancho,
            ventana.alto,
            ventana.tipo,
            ventana.mano,
            ventana.referencia
        );
        miniatura.className = 'card-img-top';
        miniatura.style.height = '100px';
        miniatura.style.objectFit = 'contain';
        
        const precioTotal = ventana.precio * ventana.unidades;
        
        const cardBody = document.createElement('div');
        cardBody.className = 'card-body p-2';
        cardBody.innerHTML = `
            <p class="card-text small mb-1">Ref: ${ventana.referencia}</p>
            <p class="card-text small mb-1">${ventana.ancho}x${ventana.alto}</p>
            <p class="card-text small mb-1">${ventana.tipo}</p>
            <p class="card-text small mb-1">Unidades: ${ventana.unidades}</p>
            <p class="card-text small mb-1">m²: ${ventana.metrosCuadrados} m²</p>
            <p class="card-text small mb-1">Precio/u: ${ventana.precio.toFixed(2)} €</p>
            <p class="card-text small mb-1 text-primary fw-bold">Total: ${precioTotal.toFixed(2)} €</p>
        `;
        
        card.appendChild(miniatura);
        card.appendChild(cardBody);
        col.appendChild(card);
        ventanasGrid.appendChild(col);
    });
});

// Función para mostrar sugerencias de mejoras
/*function mostrarSugerencias() {
    const sugerenciasDiv = document.getElementById("sugerencias");
    sugerenciasDiv.innerHTML = "";
    
    const checkboxesSinMarcar = document.querySelectorAll('input[type="checkbox"]:not(:checked)');
    if (checkboxesSinMarcar.length > 0) {
        const sugerenciasAccordion = document.createElement("div");
        sugerenciasAccordion.className = "accordion mt-4";
        sugerenciasAccordion.id = "sugerenciasAccordion";

        const mainAccordionItem = document.createElement("div");
        mainAccordionItem.className = "accordion-item";

        mainAccordionItem.innerHTML = `
            <h2 class="accordion-header" id="headingSugerencias">
                <button class="accordion-button" type="button" data-bs-toggle="collapse" 
                        data-bs-target="#collapseSugerencias" aria-expanded="true" 
                        aria-controls="collapseSugerencias">
                    Mejoras disponibles (${checkboxesSinMarcar.length})
                </button>
            </h2>
            <div id="collapseSugerencias" class="accordion-collapse collapse show" 
                 aria-labelledby="headingSugerencias">
                <div class="accordion-body p-0">
                    <div class="accordion" id="sugerenciasInnerAccordion">
                    </div>
                    ${checkboxesSinMarcar.length > 1 ? `
                        <div class="p-3">
                            <button class="btn btn-primary w-100" onclick="activarTodasLasSugerencias()">
                                Activar todas las mejoras
                            </button>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;

        sugerenciasAccordion.appendChild(mainAccordionItem);
        
        const innerAccordion = mainAccordionItem.querySelector('#sugerenciasInnerAccordion');
        checkboxesSinMarcar.forEach((checkbox, index) => {
            innerAccordion.appendChild(crearElementoMejora(checkbox, index, false));
        });

        sugerenciasDiv.appendChild(sugerenciasAccordion);
    }
}*/

// Función para crear un elemento de mejora
function crearElementoMejora(checkbox, itemCount = 0, isActivated = false) {
    const precio = parseInt(checkbox.dataset.precio, 10);
    const accordionItem = document.createElement("div");
    accordionItem.className = "accordion-item";

    const itemId = `mejora-${checkbox.id}-${itemCount}`;
    const headerId = `heading-${itemId}`;
    const collapseId = `collapse-${itemId}`;

    accordionItem.innerHTML = `
        <h2 class="accordion-header" id="${headerId}">
            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" 
                    data-bs-target="#${collapseId}" aria-expanded="false" 
                    aria-controls="${collapseId}">
                <div class="d-flex justify-content-between align-items-center w-100">
                    <span>${checkbox.name}${isActivated ? ': Sí' : ''}</span>
                    <span class="badge bg-primary ms-2">+$${precio}</span>
                </div>
            </button>
        </h2>
        <div id="${collapseId}" class="accordion-collapse collapse" 
             aria-labelledby="${headerId}" data-bs-parent="#${isActivated ? 'resumenAccordion' : 'sugerenciasInnerAccordion'}">
            <div class="accordion-body">
                <p class="mb-3">${getDescripcionCheckbox(checkbox.name)}</p>
                ${!isActivated ? `
                    <button class="btn btn-outline-primary btn-sm" 
                            onclick="document.getElementById('${checkbox.id}').click()">
                        Activar esta mejora
                    </button>
                ` : ''}
            </div>
        </div>
    `;

    return accordionItem;
}

// Función para activar todas las sugerencias
function activarTodasLasSugerencias() {
    const checkboxesSinMarcar = document.querySelectorAll('input[type="checkbox"]:not(:checked)');
    checkboxesSinMarcar.forEach(checkbox => {
        checkbox.checked = true;
        checkbox.dispatchEvent(new Event('change'));
    });
}

// Función auxiliar para obtener descripciones de checkboxes
function getDescripcionCheckbox(nombre) {
    const descripciones = {
        "tratamiento-termico": "El tratamiento térmico mejora la eficiencia energética.",
        "tratamiento-acustico": "El tratamiento acústico reduce significativamente el ruido exterior.",
        "instalacion": "La instalación incluida garantiza un montaje profesional."
    };
    return descripciones[nombre] || "";
}

// Función para actualizar el precio total y el resumen
function actualizarPrecioTotalYResumen() {
    console.log('Iniciando actualización...');
    
    let precioTotal = precioBase;
    let precioExtras = 0;
    
    // Guardar el estado del acordeón de ventanas
    const ventanasGrid = document.getElementById('ventanas-grid');
    const ventanasGridHTML = ventanasGrid ? ventanasGrid.innerHTML : '';
    const ventanasAccordionButton = document.querySelector('[data-bs-target="#collapse-ventanas"]');
    const isVentanasExpanded = ventanasAccordionButton ? ventanasAccordionButton.getAttribute('aria-expanded') === 'true' : false;
    
    // Limpiamos el contenido
    listaResumen.innerHTML = "";
    
    const accordion = document.createElement("div");
    accordion.className = "accordion";
    accordion.id = "resumenAccordion";
    
    let itemCount = 0;

    // Procesar los selects
    selects.forEach((select) => {
        const selectedOption = select.options[select.selectedIndex];
        const precioAdicional = parseInt(selectedOption.dataset.precio, 10) || 0;
        
        const accordionItem = document.createElement("div");
        accordionItem.className = "accordion-item";

        const headerId = `heading${itemCount}`;
        const collapseId = `collapse${itemCount}`;

        // Contenido especial para la serie 70mm
        if (select.name === "serie" && selectedOption.value === "70mm") {
            accordionItem.innerHTML = `
                <h2 class="accordion-header" id="${headerId}">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" 
                            data-bs-target="#${collapseId}" aria-expanded="false" aria-controls="${collapseId}">
                        ${select.name}: ${selectedOption.text}${precioAdicional > 0 ? ` (+$${precioAdicional})` : ''}
                    </button>
                </h2>
                <div id="${collapseId}" class="accordion-collapse collapse" 
                     aria-labelledby="${headerId}" data-bs-parent="#resumenAccordion">
                    <div class="accordion-body">
                        <p class="mb-3">La serie 70 mm es ideal para proyectos estándar.</p>
                        <div class="row g-3">
                            <div class="col-md-4">
                                <div class="card h-100">
                                    <img src="./assets/images/ventana-practicable-70.jpg" 
                                         class="card-img-top" 
                                         alt="Ventana Practicable Serie 70"
                                         onerror="this.src='./assets/images/placeholder.jpg'">
                                    <div class="card-body">
                                        <h5 class="card-title">Ventana Practicable</h5>
                                        <p class="card-text">Sistema de apertura tradicional.</p>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="card h-100">
                                    <img src="./assets/images/veka_welcome_center___logo_veka_aktiengesellschaft_res_1_1_w400.jpg" 
                                         class="card-img-top" 
                                         alt="Ventana Oscilobatiente Serie 70"
                                         onerror="this.src='./assets/images/placeholder.jpg'">
                                    <div class="card-body">
                                        <h5 class="card-title">Ventana Oscilobatiente</h5>
                                        <p class="card-text">Doble sistema de apertura.</p>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="card h-100">
                                    <img src="./assets/images/ventana-corredera-70.jpg" 
                                         class="card-img-top" 
                                         alt="Ventana Corredera Serie 70"
                                         onerror="this.src='./assets/images/placeholder.jpg'">
                                    <div class="card-body">
                                        <h5 class="card-title">Corredera</h5>
                                        <p class="card-text">Sistema de apertura deslizante.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        } else {
            // Contenido normal para otros selects
            accordionItem.innerHTML = `
                <h2 class="accordion-header" id="${headerId}">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" 
                            data-bs-target="#${collapseId}" aria-expanded="false" aria-controls="${collapseId}">
                        ${select.name}: ${selectedOption.text}${precioAdicional > 0 ? ` (+$${precioAdicional})` : ''}
                    </button>
                </h2>
                <div id="${collapseId}" class="accordion-collapse collapse" 
                     aria-labelledby="${headerId}" data-bs-parent="#resumenAccordion">
                    <div class="accordion-body">
                        ${getDescripcionSelect(select.name, selectedOption.value)}
                    </div>
                </div>
            `;
        }

        accordion.appendChild(accordionItem);
        itemCount++;
        precioTotal += precioAdicional;
    });

    // Procesar los checkboxes activados
    checkboxes.forEach((checkbox) => {
        if (checkbox.checked) {
            accordion.appendChild(crearElementoMejora(checkbox, itemCount, true));
            precioTotal += parseInt(checkbox.dataset.precio, 10) || 0;
            itemCount++;
        }
    });

    // Añadir sección de ventanas de referencia
    const ventanasAccordionItem = document.createElement("div");
    ventanasAccordionItem.className = "accordion-item";
    ventanasAccordionItem.innerHTML = `
        <h2 class="accordion-header" id="heading-ventanas">
            <button class="accordion-button ${isVentanasExpanded ? '' : 'collapsed'}" type="button" 
                    data-bs-toggle="collapse" 
                    data-bs-target="#collapse-ventanas" 
                    aria-expanded="${isVentanasExpanded}" 
                    aria-controls="collapse-ventanas">
                Ventanas de Referencia
            </button>
        </h2>
        <div id="collapse-ventanas" 
             class="accordion-collapse collapse ${isVentanasExpanded ? 'show' : ''}" 
             aria-labelledby="heading-ventanas" 
             data-bs-parent="#resumenAccordion">
            <div class="accordion-body">
                <div class="row row-cols-2 row-cols-md-4 row-cols-lg-6 g-3" id="ventanas-grid">
                    ${ventanasGridHTML}
                </div>
            </div>
        </div>
    `;
    
    accordion.appendChild(ventanasAccordionItem);
    listaResumen.appendChild(accordion);

    // Actualizar precio total
    precioTotalElement.textContent = `Precio Total: $${precioTotal}`;
}

// Función auxiliar para obtener descripciones de selects
function getDescripcionSelect(tipo, valor) {
  const descripciones = {
    marca: {
      kommerling: "Kommerling garantiza calidad alemana y excelente aislamiento.",
      rehau: "Rehau ofrece una excelente relación calidad-precio.",
      veka: "Veka es conocida por su diseño elegante y durabilidad."
    },
    serie: {
      "70mm": "La serie 70 mm es ideal para proyectos estándar.",
      "80mm": "La serie 80 mm ofrece un mejor aislamiento térmico.",
      "90mm": "La serie 90 mm proporciona el mejor rendimiento en aislamiento."
    },
    vidrio: {
      "4/16/4": "El vidrio 4/16/4 es adecuado para un aislamiento básico.",
      "6/12/6": "El vidrio 6/12/6 mejora el aislamiento térmico y acústico.",
      "8/10/8": "El vidrio 8/10/8 ofrece máxima resistencia y aislamiento."
    }
  };
  return descripciones[tipo]?.[valor] || "";
}

// Escucha el evento de cambio en todos los selects
selects.forEach((select) => {
  select.addEventListener("change", () => actualizarPrecioTotalYResumen(selects, checkboxes, CONFIG));
});

// Función para calcular el precio de los extras
function calcularPrecioExtra(tipoExtra, ventanas, CONFIG) {
    const extra = CONFIG.extras[tipoExtra];
    
    return ventanas.reduce((total, ventana) => {
        const m2Total = (ventana.ancho * ventana.alto) / 1000000;
        const precioVentana = extra.tipo === "m2" 
            ? calcularPrecioExtraPorM2(ventana, m2Total, extra.precio)
            : extra.precio * ventana.unidades;
            
        return total + precioVentana;
    }, 0);
}

function calcularPrecioExtraPorM2(ventana, m2Total, precioBase) {
    const m2PorHoja = m2Total / ventana.hojas;
    const m2AjustadoPorHoja = Math.max(0.5, m2PorHoja);
    const m2TotalAjustado = m2AjustadoPorHoja * ventana.hojas;
    return m2TotalAjustado * precioBase * ventana.unidades;
}

// Asegurarnos de que el evento change está correctamente configurado
checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", (event) => {
        console.log('Checkbox cambiado:', event.target.id);
        const isChecked = event.target.checked;
        const tipoExtra = event.target.id;
        const precioExtra = calcularPrecioExtra(tipoExtra, ventanasPrueba, CONFIG);
        const label = event.target.nextElementSibling;
        
        console.log('Resultado del cálculo:', precioExtra);
        
        if (isChecked) {
            label.textContent = `Activado (+${precioExtra.toFixed(2)} €)`;
        } else {
            label.textContent = "Activar";
        }
        
        actualizarPrecioTotalYResumen(selects, checkboxes, CONFIG);
    });
});

// Llama a la función al cargar la página para mostrar el resumen inicial
actualizarPrecioTotalYResumen(selects, checkboxes, CONFIG);

function agregarVentana() {
    const referencia = referenciaInput.value.trim();
    const unidades = parseInt(document.getElementById('unidades').value) || 1;
    
    if (!referencia) {
        alert('Por favor, ingrese una referencia');
        return;
    }
    
    const ventana = {
        referencia: referencia,
        ancho: parseInt(anchoInput.value),
        alto: parseInt(altoInput.value),
        tipo: tipoSelect.value,
        mano: manoSelect.value,
        unidades: unidades
    };
    
    ventanas.push(ventana);
    actualizarListaVentanas();
    referenciaInput.value = ''; // Limpiar el campo de referencia
    document.getElementById('unidades').value = '1'; // Resetear unidades a 1
}

function actualizarListaVentanas() {
    const template = ventana => `
        <div class="col">
            <div class="card h-100" style="max-width: 150px">
                ${generarMiniatura(ventana)}
                ${generarCardBody(ventana)}
            </div>
        </div>
    `;
    
    listaVentanas.innerHTML = ventanasPrueba.map(template).join('');
}

// Función para editar unidades
function editarUnidades(index) {
    const ventana = ventanas[index];
    const nuevasUnidades = prompt(`Ingrese el número de unidades para la referencia ${ventana.referencia}:`, ventana.unidades);
    
    if (nuevasUnidades !== null) {
        const cantidad = parseInt(nuevasUnidades);
        if (!isNaN(cantidad) && cantidad > 0) {
            ventanas[index].unidades = cantidad;
            actualizarListaVentanas();
        } else {
            alert('Por favor, ingrese un número válido mayor que 0');
        }
    }
}

// Asegúrate de que la función esté disponible globalmente
window.editarUnidades = editarUnidades;

