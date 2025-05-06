// Clase para manejar el dibujo de ventanas
export default class VentanaCanvas {
    constructor() {
        // Crear un nuevo canvas cada vez
        this.canvas = document.createElement('canvas');
        this.canvas.width = 200;
        this.canvas.height = 150;
        this.ctx = this.canvas.getContext('2d');
        this.color = '#666';
    }

    crearMiniatura(ancho, alto, tipo, mano, referencia) {
        const canvas = document.createElement('canvas');
        canvas.width = 200;
        canvas.height = 150;
        const ctx = canvas.getContext('2d');
        
        const escala = Math.min(
            (canvas.width - 40) / ancho,
            (canvas.height - 40) / alto
        ) * 0.8;
        
        const x = (canvas.width - ancho * escala) / 2;
        const y = (canvas.height - alto * escala) / 2;
        
        this.dibujarMarco(ctx, x, y, ancho * escala, alto * escala);
        
        if (tipo === 'corredera') {
            this.dibujarCorredera(ctx, x, y, ancho * escala, alto * escala);
        } else if (tipo === 'oscilobatiente') {
            this.dibujarOscilobatiente(ctx, x, y, ancho * escala, alto * escala, mano);
        } else {
            this.dibujarPracticable(ctx, x, y, ancho * escala, alto * escala, mano);
        }
        
        return canvas;
    }

    dibujarMarco(ctx, x, y, ancho, alto) {
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 4;
        ctx.strokeRect(x, y, ancho, alto);
        
        ctx.strokeStyle = '#999';
        ctx.lineWidth = 2;
        ctx.strokeRect(x + 10, y + 10, ancho - 20, alto - 20);
    }

    dibujarPracticable(ctx, x, y, ancho, alto, mano) {
        const xBisagra = mano === 'derecha' ? x + 15 : x + ancho - 15;
        
        ctx.beginPath();
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;
        ctx.moveTo(xBisagra, y + alto * 0.2);
        ctx.lineTo(xBisagra, y + alto * 0.3);
        ctx.moveTo(xBisagra, y + alto * 0.7);
        ctx.lineTo(xBisagra, y + alto * 0.8);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.strokeStyle = '#999';
        ctx.lineWidth = 1;
        
        if (mano === 'derecha') {
            ctx.moveTo(x + 15, y + 15);
            ctx.lineTo(x + ancho - 15, y + alto/2);
            ctx.moveTo(x + 15, y + alto - 15);
            ctx.lineTo(x + ancho - 15, y + alto/2);
        } else {
            ctx.moveTo(x + ancho - 15, y + 15);
            ctx.lineTo(x + 15, y + alto/2);
            ctx.moveTo(x + ancho - 15, y + alto - 15);
            ctx.lineTo(x + 15, y + alto/2);
        }
        ctx.stroke();
    }

    dibujarCorredera(ctx, x, y, ancho, alto) {
        ctx.beginPath();
        ctx.moveTo(x + ancho/2, y);
        ctx.lineTo(x + ancho/2, y + alto);
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 4;
        ctx.stroke();
        
        this.dibujarFlechas(ctx, x, y, ancho, alto);
    }

    dibujarFlechas(ctx, x, y, ancho, alto) {
        const flecha = 20;
        ctx.strokeStyle = '#999';
        ctx.lineWidth = 2;
        
        ctx.beginPath();
        ctx.moveTo(x + ancho/4 + flecha, y + alto/2);
        ctx.lineTo(x + ancho/4 - flecha, y + alto/2);
        ctx.lineTo(x + ancho/4 - flecha/2, y + alto/2 - flecha/2);
        ctx.moveTo(x + ancho/4 - flecha, y + alto/2);
        ctx.lineTo(x + ancho/4 - flecha/2, y + alto/2 + flecha/2);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(x + 3*ancho/4 - flecha, y + alto/2);
        ctx.lineTo(x + 3*ancho/4 + flecha, y + alto/2);
        ctx.lineTo(x + 3*ancho/4 + flecha/2, y + alto/2 - flecha/2);
        ctx.moveTo(x + 3*ancho/4 + flecha, y + alto/2);
        ctx.lineTo(x + 3*ancho/4 + flecha/2, y + alto/2 + flecha/2);
        ctx.stroke();
    }

    dibujarOscilobatiente(ctx, x, y, ancho, alto, mano) {
        const xBisagra = mano === 'derecha' ? x + 15 : x + ancho - 15;
        
        ctx.beginPath();
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;
        ctx.moveTo(xBisagra, y + alto * 0.2);
        ctx.lineTo(xBisagra, y + alto * 0.3);
        ctx.moveTo(xBisagra, y + alto * 0.7);
        ctx.lineTo(xBisagra, y + alto * 0.8);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.strokeStyle = '#999';
        ctx.lineWidth = 1;
        
        if (mano === 'derecha') {
            ctx.moveTo(x + 15, y + 15);
            ctx.lineTo(x + ancho - 15, y + alto/2);
            ctx.moveTo(x + 15, y + alto - 15);
            ctx.lineTo(x + ancho - 15, y + alto/2);
            
            ctx.moveTo(x + 15, y + alto - 15);
            ctx.lineTo(x + ancho/2, y + 15);
            ctx.moveTo(x + ancho - 15, y + alto - 15);
            ctx.lineTo(x + ancho/2, y + 15);
        } else {
            ctx.moveTo(x + ancho - 15, y + 15);
            ctx.lineTo(x + 15, y + alto/2);
            ctx.moveTo(x + ancho - 15, y + alto - 15);
            ctx.lineTo(x + 15, y + alto/2);
            
            ctx.moveTo(x + 15, y + alto - 15);
            ctx.lineTo(x + ancho/2, y + 15);
            ctx.moveTo(x + ancho - 15, y + alto - 15);
            ctx.lineTo(x + ancho/2, y + 15);
        }
        ctx.stroke();
    }
}
