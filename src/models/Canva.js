export default class Canvas {
    constructor(width, height, canvasID) {
        // Obter o elemento <canvas> com o ID 'myCanvas'
        this.canvas = document.getElementById(canvasID);

        // Verificar se o elemento <canvas> foi encontrado
        if (!this.canvas) {
            throw new Error('Elemento <canvas> com ID ' + canvasID + ' não encontrado.');
        }

        // Obter o contexto 2D do canvas
        this.context = this.canvas.getContext('2d');

        // Verificar se o contexto 2D foi obtido com sucesso
        if (!this.context) {
            throw new Error('Não foi possível obter o contexto 2D do canvas.');
        }

        // Definir largura e altura do canvas
        this.canvas.width = width;
        this.canvas.height = height;
    }

    getCanvas() {
        return this.canvas;
    }

    getContext() {
        return this.context;
    }
}

