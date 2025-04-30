// Precio base inicial
let precioBase = 875;

// Referencias a todos los selects y checkboxes
const selects = document.querySelectorAll("select");
const checkboxes = document.querySelectorAll("input[type='checkbox']");

// Referencia al elemento del precio total
const precioTotalElement = document.getElementById("precio-total");

// Referencia al contenedor del resumen
const listaResumen = document.getElementById("lista-resumen");

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

// Función para actualizar el precio total y el resumen
function actualizarPrecioTotalYResumen() {
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

  listaResumen.appendChild(accordion);
  mostrarSugerencias();
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

// Función auxiliar para obtener descripciones de checkboxes
function getDescripcionCheckbox(nombre) {
  const descripciones = {
    "tratamiento-termico": "El tratamiento térmico mejora la eficiencia energética.",
    "tratamiento-acustico": "El tratamiento acústico reduce significativamente el ruido exterior.",
    "instalacion": "La instalación incluida garantiza un montaje profesional."
  };
  return descripciones[nombre] || "";
}

// Función para mostrar sugerencias
function mostrarSugerencias() {
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
}

// Escucha el evento de cambio en todos los selects
selects.forEach((select) => {
  select.addEventListener("change", actualizarPrecioTotalYResumen);
});

// Escucha el evento de cambio en todos los checkboxes
checkboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", actualizarPrecioTotalYResumen);
});

// Llama a la función al cargar la página para mostrar el resumen inicial
actualizarPrecioTotalYResumen();

document.addEventListener("DOMContentLoaded", () => {
  // Seleccionar todos los switches
  const switches = document.querySelectorAll(".form-check-input");

  // Iterar sobre cada switch y agregar un evento de cambio
  switches.forEach((switchElement) => {
    switchElement.addEventListener("change", (event) => {
      const isChecked = event.target.checked; // Verificar si el switch está activado
      const precio = parseInt(event.target.dataset.precio, 10); // Obtener el precio asociado
      const label = event.target.nextElementSibling; // Obtener el label asociado

      // Mostrar sugerencias o realizar acciones según el estado del switch
      if (isChecked) {
        label.textContent = `Activado (+$${precio})`; // Cambiar el texto del label
        agregarSugerencia(event.target.id, precio); // Agregar sugerencia
      } else {
        label.textContent = "Activar"; // Restaurar el texto original
        eliminarSugerencia(event.target.id); // Eliminar sugerencia
      }
    });
  });

  // Función para agregar sugerencias
  function agregarSugerencia(id, precio) {
    const listaSugerencias = document.getElementById("sugerencias");
    let sugerencia = document.getElementById(`sugerencia-${id}`);

    // Si la sugerencia ya existe, no la agregues de nuevo
    if (!sugerencia) {
      sugerencia = document.createElement("div");
      sugerencia.className =
        "list-group-item d-flex justify-content-between align-items-center";
      sugerencia.id = `sugerencia-${id}`;
      sugerencia.innerHTML = `
            Mejora disponible: +$${precio}
            <button class="btn btn-sm btn-primary activar-mejora" data-id="${id}">Activar</button>
        `;
      listaSugerencias.appendChild(sugerencia);

      // Agregar evento al botón de activar
      sugerencia
        .querySelector(".activar-mejora")
        .addEventListener("click", () => {
          const switchElement = document.getElementById(id);
          if (switchElement) {
            switchElement.checked = true; // Activar el switch
            switchElement.dispatchEvent(new Event("change")); // Disparar el evento de cambio
          }
        });
    }
  }

  // Función para eliminar sugerencias
  function eliminarSugerencia(id) {
    const sugerencia = document.getElementById(`sugerencia-${id}`);
    if (sugerencia) {
      sugerencia.remove();
    }
  }

  // Agregar canvas al DOM
  const contenedorCanvas = document.createElement('div');
  contenedorCanvas.className = 'mt-4';
  contenedorCanvas.innerHTML = `
    <h4>Vista previa de la ventana</h4>
    <div class="border rounded p-3 bg-light">
      <canvas id="ventanaCanvas" width="400" height="400" 
              style="width: 100%; max-width: 400px;"></canvas>
    </div>
  `;
  
  // Insertar después del resumen
  const resumen = document.getElementById('lista-resumen');
  resumen.parentNode.insertBefore(contenedorCanvas, resumen.nextSibling);
  
  // Inicializar el canvas
  const ventanaCanvas = new VentanaCanvas('ventanaCanvas');
  
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
  
  // Agregar listeners
  const anchoInput = document.getElementById('ancho');
  const altoInput = document.getElementById('alto');
  const tipoSelect = document.getElementById('tipo-ventana');
  
  if (anchoInput && altoInput) {
    anchoInput.addEventListener('input', actualizarDibujo);
    altoInput.addEventListener('input', actualizarDibujo);
  }
  
  if (tipoSelect) {
    tipoSelect.addEventListener('change', actualizarDibujo);
  }
  
  // Dibujo inicial
  actualizarDibujo();
});

function activarTodasLasSugerencias() {
  // Obtener todos los checkboxes que no están marcados
  const checkboxesSinMarcar = document.querySelectorAll('input[type="checkbox"]:not(:checked)');
  
  // Activar cada checkbox
  checkboxesSinMarcar.forEach(checkbox => {
    checkbox.checked = true;
    checkbox.dispatchEvent(new Event('change')); // Disparar el evento change
  });

  // Actualizar el precio total y el resumen
  actualizarPrecioTotalYResumen();
}

// Asegurarse de que los checkboxes tienen los event listeners correctos
document.addEventListener('DOMContentLoaded', () => {
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  
  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', (event) => {
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

});
