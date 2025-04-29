// Inicializar Select2 para el select de marca
$(document).ready(function () {
  $("#marca").select2({
    theme: "bootstrap-5", // Usa el tema de Bootstrap
    minimumResultsForSearch: Infinity, // Oculta la barra de búsqueda
    templateResult: formatOption, // Personaliza las opciones en el menú desplegable
    templateSelection: formatOptionSelection, // Personaliza la opción seleccionada
    escapeMarkup: function (markup) {
      return markup; // Permite HTML en las opciones
    },
  });

  // Función para formatear las opciones en el menú desplegable
  function formatOption(option) {
    if (!option.id) {
      return option.text; // Devuelve el texto si no hay datos adicionales
    }
    const img = $(option.element).data("image"); // Obtiene la URL de la imagen
    const text = option.text; // Obtiene el texto de la opción

    // Verifica si la opción tiene un atributo data-image
    if (img) {
      return `<span style="display: flex; align-items: center;">
                <img src="${img}" style="width: 50px; height: 50px; object-fit: contain; margin-right: 10px;" />
                ${text}
              </span>`;
    } else {
      return `<span>${text}</span>`; // Si no hay imagen, solo muestra el texto
    }
  }

  // Función para formatear la opción seleccionada
  function formatOptionSelection(option) {
    if (!option.id) {
      return option.text; // Devuelve el texto si no hay datos adicionales
    }
    const img = $(option.element).data("image"); // Obtiene la URL de la imagen
    const text = option.text; // Obtiene el texto de la opción

    // Verifica si la opción tiene un atributo data-image
    if (img) {
      return `<span style="display: flex; align-items: center;">
                <img src="${img}" style="width: 50px; height: 50px; object-fit: contain; margin-right: 10px;" />
                ${text}
              </span>`;
    } else {
      return `<span>${text}</span>`; // Si no hay imagen, solo muestra el texto
    }
  }
});
