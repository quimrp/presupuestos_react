class VentanaCanvas {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.tipo = 'practicable'; // Tipo por defecto
    this.mano = 'izquierda'; // Mano por defecto
    this.color = '#666'; // Color por defecto
    
    // Ajustar el tamaño del canvas al contenedor
    this.ajustarTamano();
    
    // Agregar listener para redimensionar
    window.addEventListener('resize', () => this.ajustarTamano());
  }

  ajustarTamano() {
    const contenedor = this.canvas.parentElement;
    this.canvas.width = contenedor.clientWidth;
    this.canvas.height = contenedor.clientWidth * 0.85; // Aumentado de 0.75 a 0.85 para dar más espacio
  }

  // Método principal para dibujar la ventana
  dibujar(ancho, alto, tipo = 'practicable', mano = 'izquierda') {
    this.tipo = tipo;
    this.mano = mano;
    this.limpiarCanvas();
    
    // Calcular escala para ajustar al canvas, dejando más margen para las cotas
    const escala = Math.min(
        (this.canvas.width - 60) / ancho,  // Aumentado el margen horizontal
        (this.canvas.height - 80) / alto   // Aumentado el margen vertical
    );
    
    // Posición centrada con más espacio para las cotas
    const x = (this.canvas.width - ancho * escala) / 2;
    const y = (this.canvas.height - alto * escala) / 2 - 10; // Subimos un poco la ventana
    
    // Dibujar según el tipo
    switch(this.tipo) {
        case 'corredera':
            this.dibujarCorredera(x, y, ancho * escala, alto * escala);
            break;
        case 'oscilobatiente':
            this.dibujarOscilobatiente(x, y, ancho * escala, alto * escala);
            break;
        default:
            this.dibujarPracticable(x, y, ancho * escala, alto * escala);
    }
    
    // Agregar medidas
    this.dibujarMedidas(x, y, ancho, alto, escala);
  }

  limpiarCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  dibujarMarco(x, y, ancho, alto) {
    // Marco exterior
    this.ctx.strokeStyle = this.color;
    this.ctx.lineWidth = 4;
    this.ctx.strokeRect(x, y, ancho, alto);
    
    // Marco interior
    this.ctx.strokeStyle = '#999';
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(x + 10, y + 10, ancho - 20, alto - 20);
  }

  dibujarPracticable(x, y, ancho, alto) {
    this.dibujarMarco(x, y, ancho, alto);
    
    // Dibujar bisagras según la mano (invertido)
    const xBisagra = this.mano === 'derecha' ? x + 15 : x + ancho - 15;
    
    this.ctx.beginPath();
    this.ctx.strokeStyle = this.color;
    this.ctx.lineWidth = 2;
    this.ctx.moveTo(xBisagra, y + alto * 0.2);
    this.ctx.lineTo(xBisagra, y + alto * 0.3);
    this.ctx.moveTo(xBisagra, y + alto * 0.7);
    this.ctx.lineTo(xBisagra, y + alto * 0.8);
    this.ctx.stroke();
    
    // Dibujar símbolo de apertura (invertido)
    this.ctx.beginPath();
    this.ctx.strokeStyle = '#999';
    this.ctx.lineWidth = 1;
    
    if (this.mano === 'derecha') {
        this.ctx.moveTo(x + 15, y + 15);
        this.ctx.lineTo(x + ancho - 15, y + alto/2);
        this.ctx.moveTo(x + 15, y + alto - 15);
        this.ctx.lineTo(x + ancho - 15, y + alto/2);
    } else {
        this.ctx.moveTo(x + ancho - 15, y + 15);
        this.ctx.lineTo(x + 15, y + alto/2);
        this.ctx.moveTo(x + ancho - 15, y + alto - 15);
        this.ctx.lineTo(x + 15, y + alto/2);
    }
    this.ctx.stroke();
  }

  dibujarCorredera(x, y, ancho, alto) {
    this.dibujarMarco(x, y, ancho, alto);
    
    // Dibujar división central
    this.ctx.beginPath();
    this.ctx.moveTo(x + ancho/2, y);
    this.ctx.lineTo(x + ancho/2, y + alto);
    this.ctx.strokeStyle = this.color;
    this.ctx.lineWidth = 4;
    this.ctx.stroke();
    
    // Dibujar flechas de dirección
    this.dibujarFlechas(x, y, ancho, alto);
  }

  dibujarOscilobatiente(x, y, ancho, alto) {
    this.dibujarMarco(x, y, ancho, alto);
    
    // Dibujar bisagras según la mano (invertido)
    const xBisagra = this.mano === 'derecha' ? x + 15 : x + ancho - 15;
    
    this.ctx.beginPath();
    this.ctx.strokeStyle = this.color;
    this.ctx.lineWidth = 2;
    this.ctx.moveTo(xBisagra, y + alto * 0.2);
    this.ctx.lineTo(xBisagra, y + alto * 0.3);
    this.ctx.moveTo(xBisagra, y + alto * 0.7);
    this.ctx.lineTo(xBisagra, y + alto * 0.8);
    this.ctx.stroke();
    
    // Dibujar símbolos de apertura (invertido)
    this.ctx.beginPath();
    this.ctx.strokeStyle = '#999';
    this.ctx.lineWidth = 1;
    
    if (this.mano === 'derecha') {
        // Símbolo practicable
        this.ctx.moveTo(x + 15, y + 15);
        this.ctx.lineTo(x + ancho - 15, y + alto/2);
        this.ctx.moveTo(x + 15, y + alto - 15);
        this.ctx.lineTo(x + ancho - 15, y + alto/2);
        
        // Símbolo abatible
        this.ctx.moveTo(x + 15, y + alto - 15);
        this.ctx.lineTo(x + ancho/2, y + 15);
        this.ctx.moveTo(x + ancho - 15, y + alto - 15);
        this.ctx.lineTo(x + ancho/2, y + 15);
    } else {
        // Símbolo practicable
        this.ctx.moveTo(x + ancho - 15, y + 15);
        this.ctx.lineTo(x + 15, y + alto/2);
        this.ctx.moveTo(x + ancho - 15, y + alto - 15);
        this.ctx.lineTo(x + 15, y + alto/2);
        
        // Símbolo abatible
        this.ctx.moveTo(x + 15, y + alto - 15);
        this.ctx.lineTo(x + ancho/2, y + 15);
        this.ctx.moveTo(x + ancho - 15, y + alto - 15);
        this.ctx.lineTo(x + ancho/2, y + 15);
    }
    this.ctx.stroke();
  }

  dibujarFlechas(x, y, ancho, alto) {
    const flecha = 20;
    this.ctx.strokeStyle = '#999';
    this.ctx.lineWidth = 2;
    
    // Flecha izquierda
    this.ctx.beginPath();
    this.ctx.moveTo(x + ancho/4 + flecha, y + alto/2);
    this.ctx.lineTo(x + ancho/4 - flecha, y + alto/2);
    this.ctx.lineTo(x + ancho/4 - flecha/2, y + alto/2 - flecha/2);
    this.ctx.moveTo(x + ancho/4 - flecha, y + alto/2);
    this.ctx.lineTo(x + ancho/4 - flecha/2, y + alto/2 + flecha/2);
    this.ctx.stroke();
    
    // Flecha derecha
    this.ctx.beginPath();
    this.ctx.moveTo(x + 3*ancho/4 - flecha, y + alto/2);
    this.ctx.lineTo(x + 3*ancho/4 + flecha, y + alto/2);
    this.ctx.lineTo(x + 3*ancho/4 + flecha/2, y + alto/2 - flecha/2);
    this.ctx.moveTo(x + 3*ancho/4 + flecha, y + alto/2);
    this.ctx.lineTo(x + 3*ancho/4 + flecha/2, y + alto/2 + flecha/2);
    this.ctx.stroke();
  }

  dibujarMedidas(x, y, ancho, alto, escala) {
    this.ctx.fillStyle = '#000';
    this.ctx.font = '14px Arial';
    this.ctx.textAlign = 'center';
    
    // Medida horizontal
    this.ctx.fillText(
      `${ancho} mm`,
      x + (ancho * escala) / 2,
      y + alto * escala + 25
    );
    
    // Medida vertical
    this.ctx.save();
    this.ctx.translate(x - 25, y + (alto * escala) / 2);
    this.ctx.rotate(-Math.PI / 2);
    this.ctx.fillText(`${alto} mm`, 0, 0);
    this.ctx.restore();
  }

  setColor(color) {
    this.color = color;
  }

  // Método para crear una miniatura
  crearMiniatura(ancho, alto, tipo, mano, referencia) {
    const miniCanvas = document.createElement('canvas');
    miniCanvas.width = 200;
    miniCanvas.height = 150;
    
    const ctx = miniCanvas.getContext('2d');
    const escala = Math.min(
        (miniCanvas.width - 40) / ancho,
        (miniCanvas.height - 40) / alto
    );
    
    const x = (miniCanvas.width - ancho * escala) / 2;
    const y = (miniCanvas.height - alto * escala) / 2;
    
    // Dibujar la ventana en miniatura usando los métodos existentes
    this.ctx = ctx; // Temporalmente cambiamos el contexto
    this.dibujarMarco(x, y, ancho * escala, alto * escala);
    if (tipo === 'corredera') {
        this.dibujarCorredera(x, y, ancho * escala, alto * escala);
    } else if (tipo === 'oscilobatiente') {
        this.dibujarOscilobatiente(x, y, ancho * escala, alto * escala);
    } else {
        this.dibujarPracticable(x, y, ancho * escala, alto * escala);
    }
    
    return miniCanvas;
  }
}

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    const ventanaCanvas = new VentanaCanvas('ventanaCanvas');
    const ventanas = []; // Array para almacenar las ventanas
    
    // Referencias a los elementos del DOM
    const anchoInput = document.getElementById('ancho');
    const altoInput = document.getElementById('alto');
    const tipoSelect = document.getElementById('tipo-ventana');
    const manoSelect = document.getElementById('mano-ventana');
    const referenciaInput = document.getElementById('referencia');
    const btnAgregar = document.getElementById('agregar-ventana');
    const listaVentanas = document.getElementById('lista-ventanas');
    
    // Función para agregar una ventana
    function agregarVentana() {
        const referencia = referenciaInput.value.trim();
        if (!referencia) {
            alert('Por favor, ingrese una referencia');
            return;
        }
        
        const ventana = {
            referencia: referencia,
            ancho: parseInt(anchoInput.value),
            alto: parseInt(altoInput.value),
            tipo: tipoSelect.value,
            mano: manoSelect.value
        };
        
        ventanas.push(ventana);
        actualizarListaVentanas();
        referenciaInput.value = ''; // Limpiar el campo de referencia
    }
    
    // Función para actualizar la lista de ventanas
    function actualizarListaVentanas() {
        listaVentanas.innerHTML = '';
        
        ventanas.forEach((ventana, index) => {
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
                <button class="btn btn-danger btn-sm w-100" onclick="eliminarVentana(${index})">
                    <i class="bi bi-trash"></i>
                </button>
            `;
            
            card.appendChild(miniatura);
            card.appendChild(cardBody);
            col.appendChild(card);
            listaVentanas.appendChild(col);
        });
    }
    
    // Función para eliminar una ventana
    window.eliminarVentana = function(index) {
        ventanas.splice(index, 1);
        actualizarListaVentanas();
    };
    
    // Event listeners
    btnAgregar.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        agregarVentana();
    });
    
    // Event listeners existentes
    if (anchoInput && altoInput) {
        anchoInput.addEventListener('input', () => ventanaCanvas.dibujar(
            parseInt(anchoInput.value),
            parseInt(altoInput.value),
            tipoSelect.value,
            manoSelect.value
        ));
        altoInput.addEventListener('input', () => ventanaCanvas.dibujar(
            parseInt(anchoInput.value),
            parseInt(altoInput.value),
            tipoSelect.value,
            manoSelect.value
        ));
    }
    
    if (tipoSelect) {
        tipoSelect.addEventListener('change', () => ventanaCanvas.dibujar(
            parseInt(anchoInput.value),
            parseInt(altoInput.value),
            tipoSelect.value,
            manoSelect.value
        ));
    }
    
    if (manoSelect) {
        manoSelect.addEventListener('change', () => ventanaCanvas.dibujar(
            parseInt(anchoInput.value),
            parseInt(altoInput.value),
            tipoSelect.value,
            manoSelect.value
        ));
    }
    
    // Dibujo inicial
    ventanaCanvas.dibujar(
        parseInt(anchoInput.value),
        parseInt(altoInput.value),
        tipoSelect.value,
        manoSelect.value
    );
});