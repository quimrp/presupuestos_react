// Clase para manejar el dibujo de ventanas
class VentanaCanvas {
    constructor() {
        // Crear un nuevo canvas cada vez
        this.canvas = document.createElement('canvas');
        this.canvas.width = 200;
        this.canvas.height = 150;
        this.ctx = this.canvas.getContext('2d');
        this.color = '#000';
    }

    crearMiniatura(ancho, alto, tipo, mano, referencia) {
        // Crear un nuevo canvas para cada miniatura
        const canvas = document.createElement('canvas');
        canvas.width = 200;
        canvas.height = 150;
        const ctx = canvas.getContext('2d');
        
        // Calcular escala para ajustar al tamaño de la miniatura
        const escala = Math.min(
            (canvas.width - 40) / ancho,
            (canvas.height - 40) / alto
        ) * 0.8;
        
        // Centrar el dibujo
        const x = (canvas.width - ancho * escala) / 2;
        const y = (canvas.height - alto * escala) / 2;
        
        // Dibujar marco
        ctx.beginPath();
        ctx.rect(x, y, ancho * escala, alto * escala);
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Dibujar según el tipo
        if (tipo === 'corredera') {
            this.dibujarCorredera(ctx, x, y, ancho * escala, alto * escala);
        } else if (tipo === 'oscilobatiente') {
            this.dibujarPracticable(ctx, x, y, ancho * escala, alto * escala, mano);
            this.dibujarSimboloOscilobatiente(ctx, x, y, ancho * escala, alto * escala, mano);
        } else {
            this.dibujarPracticable(ctx, x, y, ancho * escala, alto * escala, mano);
        }
        
        return canvas;
    }

    dibujarPracticable(ctx, x, y, ancho, alto, mano) {
        const xBisagra = mano === 'derecha' ? x + ancho - 10 : x + 10;
        ctx.beginPath();
        ctx.moveTo(xBisagra, y + alto * 0.2);
        ctx.lineTo(xBisagra, y + alto * 0.3);
        ctx.moveTo(xBisagra, y + alto * 0.7);
        ctx.lineTo(xBisagra, y + alto * 0.8);
        ctx.stroke();
    }

    dibujarCorredera(ctx, x, y, ancho, alto) {
        ctx.beginPath();
        ctx.moveTo(x + ancho/2, y);
        ctx.lineTo(x + ancho/2, y + alto);
        ctx.stroke();

        // Añadir flechas indicadoras de movimiento
        const flechaSize = 5;
        // Flecha superior
        ctx.beginPath();
        ctx.moveTo(x + ancho/2 - 10, y + alto/2);
        ctx.lineTo(x + ancho/2 - 5, y + alto/2 - flechaSize);
        ctx.lineTo(x + ancho/2 - 5, y + alto/2 + flechaSize);
        ctx.closePath();
        ctx.fill();
        // Flecha inferior
        ctx.beginPath();
        ctx.moveTo(x + ancho/2 + 10, y + alto/2);
        ctx.lineTo(x + ancho/2 + 5, y + alto/2 - flechaSize);
        ctx.lineTo(x + ancho/2 + 5, y + alto/2 + flechaSize);
        ctx.closePath();
        ctx.fill();
    }

    dibujarSimboloOscilobatiente(ctx, x, y, ancho, alto, mano) {
        const xCentro = mano === 'derecha' ? x + ancho - 20 : x + 20;
        const yCentro = y + alto / 2;
        
        // Línea vertical central
        ctx.beginPath();
        ctx.moveTo(xCentro, yCentro - 10);
        ctx.lineTo(xCentro, yCentro + 10);
        ctx.stroke();

        // Flecha superior (abatible)
        ctx.beginPath();
        ctx.moveTo(xCentro, yCentro - 10);
        ctx.lineTo(xCentro + (mano === 'derecha' ? -5 : 5), yCentro - 5);
        ctx.stroke();

        // Flecha central (practicable)
        ctx.beginPath();
        ctx.moveTo(xCentro, yCentro);
        ctx.lineTo(xCentro + (mano === 'derecha' ? -5 : 5), yCentro);
        ctx.stroke();
    }
}

// Crear instancia de VentanaCanvas
const ventanaCanvas = new VentanaCanvas();

// Datos de prueba para las ventanas
const ventanasPrueba = [
    {
        referencia: "V001",
        ancho: 1000,
        alto: 1200,
        tipo: "practicable",
        mano: "derecha"
    },
    {
        referencia: "V002",
        ancho: 800,
        alto: 1000,
        tipo: "oscilobatiente",
        mano: "izquierda"
    },
    {
        referencia: "V003",
        ancho: 1500,
        alto: 1000,
        tipo: "corredera",
        mano: "derecha"
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
        tipo: document.getElementById('tipo-ventana').value
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
    
    // Inicializar los switches
    switches.forEach((switchElement) => {
        const label = switchElement.nextElementSibling;
        label.textContent = "Activar"; // Establecer texto inicial
    });

    // Agregar los event listeners para los cambios
    switches.forEach((switchElement) => {
        switchElement.addEventListener("change", (event) => {
            const isChecked = event.target.checked;
            const precio = parseInt(event.target.dataset.precio, 10);
            const label = event.target.nextElementSibling;

            if (isChecked) {
                label.textContent = `Activado (+$${precio})`;
                const sugerencia = document.querySelector(`[data-id="${event.target.id}"]`);
                if (sugerencia) {
                    sugerencia.remove();
                    // Verificar si quedan sugerencias
                    const sugerenciasRestantes = document.querySelectorAll('.alert-info');
                    if (sugerenciasRestantes.length === 0) {
                        const titulo = document.getElementById('titulo-mejoras');
                        if (titulo) titulo.remove();
                    }
                }
            } else {
                label.textContent = "Activar";
                agregarSugerencia(event.target.id, precio);
            }
        });
    });

    // Inicializar el canvas
    const ventanaCanvas = new VentanaCanvas();
    
    // Función para actualizar el dibujo
    function actualizarDibujo() {
        const anchoInput = document.getElementById('ancho');
        const altoInput = document.getElementById('alto');
        const tipoSelect = document.getElementById('tipo-ventana');
        
        const ancho = parseInt(anchoInput.value) || 1000;
        const alto = parseInt(altoInput.value) || 1000;
        const tipo = tipoSelect ? tipoSelect.value : 'practicable';
        
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
            <button class="accordion-button collapsed" type="button" 
                    data-bs-toggle="collapse" 
                    data-bs-target="#collapse-ventanas" 
                    aria-expanded="false" 
                    aria-controls="collapse-ventanas">
                Ventanas de Referencia
            </button>
        </h2>
        <div id="collapse-ventanas" 
             class="accordion-collapse collapse" 
             aria-labelledby="heading-ventanas" 
             data-bs-parent="#resumenAccordion">
            <div class="accordion-body">
                <div class="row row-cols-2 row-cols-md-4 row-cols-lg-6 g-3" id="ventanas-grid">
                </div>
            </div>
        </div>
    `;
    
    accordion.appendChild(ventanasAccordionItem);
    listaResumen.appendChild(accordion);

    // Mostrar las ventanas de prueba
    const ventanasGrid = document.getElementById('ventanas-grid');
    console.log('Contenedor de ventanas:', ventanasGrid);
    
    if (!ventanasGrid) {
        console.error('No se encontró el contenedor de ventanas');
        return;
    }

    console.log('Ventanas a mostrar:', ventanasPrueba);
    
    ventanasPrueba.forEach((ventana, index) => {
        console.log(`Procesando ventana ${index}:`, ventana);
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
        
        const cardBody = document.createElement('div');
        cardBody.className = 'card-body p-2';
        cardBody.innerHTML = `
            <p class="card-text small mb-1">Ref: ${ventana.referencia}</p>
            <p class="card-text small mb-1">${ventana.ancho}x${ventana.alto}</p>
            <p class="card-text small mb-1">${ventana.tipo}</p>
        `;
        
        card.appendChild(miniatura);
        card.appendChild(cardBody);
        col.appendChild(card);
        ventanasGrid.appendChild(col);
    });

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
  select.addEventListener("change", actualizarPrecioTotalYResumen);
});

// Escucha el evento de cambio en todos los checkboxes
checkboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", (event) => {
    const label = event.target.nextElementSibling;
    const precio = parseInt(event.target.dataset.precio, 10);
    
    if (event.target.checked) {
      label.textContent = `Activado (+$${precio})`;
    } else {
      label.textContent = "Activar";
    }
    
    actualizarPrecioTotalYResumen();
  });
});

// Llama a la función al cargar la página para mostrar el resumen inicial
actualizarPrecioTotalYResumen();

