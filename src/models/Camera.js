export default class Camera {

    constructor(vrp = [0, 0, 0], focalPoint = [1, 0, 0]) {
        let y = [0, 1, 0];
        this.vrp = vrp;
        
        this.focalPoint = focalPoint;
        console.log("focalPoint", this.focalPoint);
        console.log("vrp", this.vrp);

        this.n = subtrairVetores(vrp, focalPoint);
        this.nNormalized = normalizarVetor(this.n);

        let produtoEscalarV = produtoEscalar(y, this.nNormalized);
        console.log("produtosEscalarV: ", produtoEscalarV);

        this.v = subtrairVetores(y,  multiplicarValores(produtoEscalarV, this.nNormalized));
        this.vNormalized = normalizarVetor(this.v);

        this.u = produtoVetorial( this.v, this.n);
        this.uNormalized = normalizarVetor(this.u);

        console.log("n", this.n);
        console.log("normalized", this.nNormalized);
        console.log("v", this.v);
        console.log("vNormalized", this.vNormalized);
        console.log("u", this.u);
        console.log("uNormalized", this.uNormalized);

    }

    setCamera(vrp, focalPoint, u, v, n) {
        this.vrp = vrp;
        this.focalPoint = focalPoint;
        this.u = u;
        this.v = v;
        this.n = n;
    }
    getNNormalized() {
        return this.nNormalized;
    }
    getZVRP() { 
        return this.vrp[2];
    }

    getCamera() {
        return [this.vrp, this.focalPoint, this.u, this.v, this.n];
    }
    getFocalPoint() {
        return this.focalPoint;
    }
    getVRP() {
        return this.vrp;
    }

    getSRCMatrix() {
        return [[this.uNormalized[0], this.uNormalized[1], this.uNormalized[2], produtoEscalar(invertSignal(this.vrp), (this.uNormalized))],
                [this.vNormalized[0], this.vNormalized[1], this.vNormalized[2], produtoEscalar(invertSignal(this.vrp), (this.vNormalized))],
                [this.nNormalized[0], this.nNormalized[1], this.nNormalized[2], produtoEscalar(invertSignal(this.vrp), (this.nNormalized))],
                [0, 0, 0, 1]];
    }
}

function multiplicarValores(escalar, vetor) {
    return vetor.map((componente) => componente * escalar);
}

export function subtrairVetores(vetorA, vetorB) {
    if (vetorA.length !== vetorB.length) {
        throw new Error('Os vetores devem ter a mesma dimensão.');
    }

    const resultado = vetorA.map((componente, indice) => componente - vetorB[indice]);

    return resultado;
}

export function produtoEscalar(vetor1, vetor2) {
    // Verifica se os vetores têm o mesmo tamanho
    // Inicializa o resultado
    let resultado = 0;
  
    // Calcula o produto escalar
    for (let i = 0; i < vetor1.length; i++) {
      resultado += vetor1[i] * vetor2[i];
    }
  
    return resultado;
  }

function invertSignal(A) {
    return A.map((componente) => componente * -1);
}

  function produtoVetorial(vetorA, vetorB) {
    if (vetorA.length !== 3 || vetorB.length !== 3) {
        throw new Error('Os vetores devem ter exatamente 3 elementos.');
    }

    const [a1, a2, a3] = vetorA;
    const [b1, b2, b3] = vetorB;

    const produto = [
        a2 * b3 - a3 * b2, // Componente x
        a3 * b1 - a1 * b3, // Componente y
        a1 * b2 - a2 * b1  // Componente z
    ];

    return produto;
}

  function calcularMagnitude(vetor) {
    let somaDosQuadrados = 0;
    for (let i = 0; i < vetor.length; i++) {
      somaDosQuadrados += vetor[i] * vetor[i];
    }
    return Math.sqrt(somaDosQuadrados);
  }
  
 export function normalizarVetor(vetor) {
    const magnitude = calcularMagnitude(vetor);
    
    const vetorNormalizado = [];
    for (let i = 0; i < vetor.length; i++) {
      vetorNormalizado[i] = vetor[i] / magnitude;
    }
  
    return vetorNormalizado;
  }