// Precio base inicial
let precioBase = 875;

// Referencias a todos los selects y checkboxes
const selects = document.querySelectorAll("select");
const checkboxes = document.querySelectorAll("input[type='checkbox']");

// Referencia al elemento del precio total
const precioTotalElement = document.getElementById("precio-total");

// Referencia al contenedor del resumen
const listaResumen = document.getElementById("lista-resumen");

// Función para actualizar el precio total y el resumen
function actualizarPrecioTotalYResumen() {
  let precioTotal = precioBase;
  listaResumen.innerHTML = ""; // Limpia el resumen actual
  const sugerenciasDiv = document.getElementById("sugerencias");
  sugerenciasDiv.innerHTML = ""; // Limpia las sugerencias actuales

  // Suma los precios adicionales de todos los selects y actualiza el resumen
  selects.forEach((select) => {
    const selectedOption = select.options[select.selectedIndex];
    const precioAdicional = parseInt(selectedOption.dataset.precio, 10) || 0;

    // Siempre añade la opción seleccionada al resumen
    const p = document.createElement("p");
    p.classList.add("mb-1"); // Clase de Bootstrap para reducir el margen inferior

    if (select.name === "marca") {
      // Crear enlace dinámico para la marca
      const url = selectedOption.getAttribute("data-url");
      const link = document.createElement("a");
      link.href = url;
      link.target = "_blank";
      link.textContent = selectedOption.text; // El texto de la marca será un enlace
      p.textContent = `${select.name}: `;
      p.appendChild(link); // Añade el enlace al texto
      if (precioAdicional > 0) {
        p.innerHTML += ` (+$${precioAdicional})`;
      }
      listaResumen.appendChild(p);

      // Añadir descripción de la marca
      const descripcion = document.createElement("p");
      descripcion.classList.add("text-muted", "mb-3", "ms-3"); // Estilo Bootstrap para descripción
      if (selectedOption.value === "kommerling") {
        descripcion.textContent =
          "Kommerling garantiza calidad alemana y excelente aislamiento.";
      } else if (selectedOption.value === "rehau") {
        descripcion.textContent =
          "Rehau ofrece una excelente relación calidad-precio.";
      } else if (selectedOption.value === "veka") {
        descripcion.textContent =
          "Veka es conocida por su diseño elegante y durabilidad.";
      }
      listaResumen.appendChild(descripcion);
    } else if (select.name === "serie") {
      // Crear enlace dinámico para la serie
      const serieUrl = {
        "70mm": "https://www.veka.com/70mm", // Enlace de ejemplo para la serie 70mm
        "80mm": "https://www.kommerling.com/80mm", // Enlace de ejemplo para la serie 80mm
        "90mm": "https://www.rehau.com/90mm", // Enlace de ejemplo para la serie 90mm
      };
      const url = serieUrl[selectedOption.value] || "#"; // Usa "#" si no hay enlace definido
      const link = document.createElement("a");
      link.href = url;
      link.target = "_blank";
      link.textContent = selectedOption.text; // El texto de la serie será un enlace
      p.textContent = `${select.name}: `;
      p.appendChild(link); // Añade el enlace al texto
      if (precioAdicional > 0) {
        p.innerHTML += ` (+$${precioAdicional})`;
      }
      listaResumen.appendChild(p);

      // Añadir descripción de la serie
      const descripcion = document.createElement("p");
      descripcion.classList.add("text-muted", "mb-3", "ms-3"); // Estilo Bootstrap para descripción
      if (selectedOption.value === "70mm") {
        descripcion.textContent =
          "La serie 70 mm es ideal para proyectos estándar.";
      } else if (selectedOption.value === "80mm") {
        descripcion.textContent =
          "La serie 80 mm ofrece un mejor aislamiento térmico.";
      } else if (selectedOption.value === "90mm") {
        descripcion.textContent =
          "La serie 90 mm proporciona el mejor rendimiento en aislamiento.";
      }
      listaResumen.appendChild(descripcion);
    } else if (select.name === "vidrio") {
      if (precioAdicional > 0) {
        p.textContent = `${select.name}: ${selectedOption.text} (+$${precioAdicional})`;
      } else {
        p.textContent = `${select.name}: ${selectedOption.text}`;
      }
      listaResumen.appendChild(p);

      // Añadir descripción del vidrio
      const descripcion = document.createElement("p");
      descripcion.classList.add("text-muted", "mb-3", "ms-3"); // Estilo Bootstrap para descripción
      if (selectedOption.value === "4/16/4") {
        descripcion.textContent =
          "El vidrio 4/16/4 es adecuado para un aislamiento básico.";
      } else if (selectedOption.value === "6/12/6") {
        descripcion.textContent =
          "El vidrio 6/12/6 mejora el aislamiento térmico y acústico.";
      } else if (selectedOption.value === "8/10/8") {
        descripcion.textContent =
          "El vidrio 8/10/8 ofrece máxima resistencia y aislamiento.";
      }
      listaResumen.appendChild(descripcion);
    }

    // Suma el precio adicional al total si es mayor a 0
    precioTotal += precioAdicional;
  });

  // Suma los precios adicionales de todos los checkboxes activados y actualiza el resumen
  checkboxes.forEach((checkbox) => {
    const precioAdicional = parseInt(checkbox.dataset.precio, 10) || 0;

    if (checkbox.checked) {
      // Añade la opción seleccionada al resumen
      const p = document.createElement("p");
      if (precioAdicional > 0) {
        p.textContent = `${checkbox.name}: Sí (+$${precioAdicional})`;
      } else {
        p.textContent = `${checkbox.name}: Sí`;
      }
      listaResumen.appendChild(p);

      // Añade una descripción adicional para ciertos checkboxes
      const descripcion = document.createElement("p");
      descripcion.classList.add("descripcion");
      if (checkbox.name === "tratamiento-termico") {
        descripcion.textContent =
          "El tratamiento térmico mejora la eficiencia energética.";
      } else if (checkbox.name === "tratamiento-acustico") {
        descripcion.textContent =
          "El tratamiento acústico reduce significativamente el ruido exterior.";
      } else if (checkbox.name === "instalacion") {
        descripcion.textContent =
          "La instalación incluida garantiza un montaje profesional.";
      }
      listaResumen.appendChild(descripcion);

      // Suma el precio adicional al total
      precioTotal += precioAdicional;
    }
  });

  // Genera sugerencias si ciertas opciones no están seleccionadas
  let haySugerencias = false;

  if (!document.getElementById("tratamiento-termico").checked) {
    const sugerenciaTermica = document.createElement("p");
    sugerenciaTermica.textContent =
      "Por $100, el aislamiento térmico mejoraría significativamente la eficiencia energética.";
    sugerenciasDiv.appendChild(sugerenciaTermica);
    haySugerencias = true;
  }

  if (!document.getElementById("tratamiento-acustico").checked) {
    const sugerenciaAcustica = document.createElement("p");
    sugerenciaAcustica.textContent =
      "Por $50, el aislamiento acústico reduciría significativamente el ruido exterior.";
    sugerenciasDiv.appendChild(sugerenciaAcustica);
    haySugerencias = true;
  }

  if (!document.getElementById("instalacion").checked) {
    const sugerenciaInstalacion = document.createElement("p");
    sugerenciaInstalacion.textContent =
      "Por $200, incluir la instalación garantizaría un montaje profesional.";
    sugerenciasDiv.appendChild(sugerenciaInstalacion);
    haySugerencias = true;
  }

  // Añade el título dinámicamente si hay sugerencias
  if (haySugerencias) {
    const tituloSugerencias = document.createElement("h2");
    tituloSugerencias.textContent = "Lo que podrías mejorar:";
    sugerenciasDiv.prepend(tituloSugerencias); // Añade el título al inicio del contenedor
    sugerenciasDiv.style.display = "block"; // Muestra el contenedor si hay sugerencias
  } else {
    sugerenciasDiv.style.display = "none"; // Oculta el contenedor si no hay sugerencias
  }

  // Actualiza el texto del precio total en la tabla
  precioTotalElement.textContent = `Precio Total: $${precioTotal}`;
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
