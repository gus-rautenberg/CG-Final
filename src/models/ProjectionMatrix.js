import { normalizarVetor, subtrairVetores, produtoEscalar } from "./Camera.js";

export function getParallelMatrix() {
    return [[1, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 1]];

}

export function getPerspectiveMatrix(camera)
{
    let matrix = [[]];
    // Zprp = VRP | Zvp = Focal Point
    let zprp = 0.0;
    let zvp = distanceBetweenVectors( camera.getVRP(), camera.getFocalPoint());
    console.log("zprp: ", zprp, "zvp: ", zvp);

    let dp_distance = zprp-zvp;
    console.log("dp_distance: ", dp_distance);

    let value1 = (-zvp / dp_distance);
    console.log("value1: ", value1);

    let value2 = zvp * (zprp / dp_distance);
    console.log("value2: ", value2);

    let value3 = -1/dp_distance;
    console.log("value3: ", value3);

    let value4 = zprp / dp_distance;
    console.log("value4: ", value4);

    matrix =[ [1, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, value1, value2],
        [0, 0, value3, value4]
    ]
    return matrix;
}




function distanceBetweenVectors(vectorA, vectorB) {
    if (vectorA.length !== vectorB.length) {
        throw new Error('Os vetores devem ter o mesmo tamanho.');
    }

    let sumOfSquares = 0;
    for (let i = 0; i < vectorA.length; i++) {
        sumOfSquares += Math.pow(vectorA[i] - vectorB[i], 2);
    }

    return Math.sqrt(sumOfSquares);
}

function vectorDistance(vetorA, vetorB) {
    console.log("vectorDistance: ", vetorA, vetorB);
    let value1 = Math.pow(vetorA[0] - vetorB[0], 2);
    console.log("value1: ", value1);
    let value2 = Math.pow(vetorA[1] - vetorB[1], 2);
    console.log("value2: ", value2);
    let value3 = Math.pow(vetorA[2] - vetorB[2], 2);
    console.log("value3: ", value3);
    let  result = Math.sqrt(value1 + value2 + value3);
    console.log("result: ", result);
    return Math.sqrt(value1 + value2 + value3);
}
function subtrairVetorPorValor(vetor, valor) {
    return vetor.map((componente) => componente - valor);
}
function invertSignal(vetor) {
    return vetor.map((componente) => componente * -1);
}
function dividirVetores(vetorA, vetorB) {
    if (vetorA.length !== vetorB.length) {
        throw new Error('Os vetores devem ter a mesma dimensão.');
    }

    const resultado = vetorA.map((componente, indice) => {
        if (vetorB[indice] === 0) {
            throw new Error('Divisão por zero detectada.');
        }
        return componente / vetorB[indice];
    });

    return resultado;
}
function dividirVetorPorValor(vetor, valor) {
    return vetor.map((componente) => componente / valor);
}

function dividirValorPorVetor(valor, vetor) {
    return vetor.map((componente) => valor / componente);
}