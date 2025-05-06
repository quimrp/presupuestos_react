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
    
    // Calcular precio por hojas (mínimo 0.5m² por hoja)
    const m2PorHoja = area / ventana.hojas;
    const m2AjustadoPorHoja = Math.max(0.5, m2PorHoja);
    const m2TotalAjustado = m2AjustadoPorHoja * ventana.hojas;
    let precio = PRECIOS_BASE[tipo] * m2TotalAjustado;

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

function calcularPrecioTotal(ventanas, extras, CONFIG) {
    // Calcular precio base de las ventanas
    const precioVentanas = ventanas.reduce((total, ventana) => {
        return total + (calcularPrecioVentana(ventana) * ventana.unidades);
    }, 0);

    // Calcular precio de los extras
    const precioExtras = extras.reduce((total, extra) => {
        return total + calcularPrecioExtra(extra, ventanas, CONFIG);
    }, 0);

    return {
        precioVentanas,
        precioExtras,
        total: precioVentanas + precioExtras
    };
}

export {
    calcularPrecioVentana,
    calcularPrecioExtra,
    calcularPrecioTotal,
    PRECIOS_BASE,
    MEDIDAS_ESTANDAR
}; 