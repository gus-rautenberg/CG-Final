export function xRotationMatrix3D(angle) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return [
        [1, 0, 0, 0],
        [0, cos, -sin, 0],
        [0, sin, cos, 0],
        [0, 0, 0, 1]
    ];
}

export function yRotationMatrix3D(angle) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return [
        [cos, 0, sin, 0],
        [0, 1, 0, 0],
        [-sin, 0, cos, 0],
        [0, 0, 0, 1]
    ];
}

export function zRotationMatrix3D(angle) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return [
        [cos, -sin, 0, 0],
        [sin, cos, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1]
    ];
}

export function multiplyMatrices(A, B) {
    const result = [];
    if (A[0].length !== B.length) {
        // Verifica se o número de colunas da primeira matriz é igual ao número de linhas da segunda matriz
        console.log("Não é possível multiplicar as matrizes: número de colunas da primeira matriz não é igual ao número de linhas da segunda matriz.");
        return result;
    }
    // Inicializa a matriz de resultado com zeros
    for (var i = 0; i < A.length; i++) {
        result[i] = [];
        for (var j = 0; j < B[0].length; j++) {
            var sum = 0;
            for (var k = 0; k < A[0].length; k++) {
                sum += A[i][k] * B[k][j];
            }
            result[i][j] = sum;
        }
    }
    return result;
}

export function matrixMultiplicationPoints(A, B) {
    const result = [];
    if (A[0].length !== B.length) {
        // Verifica se o número de colunas da primeira matriz é igual ao número de linhas da segunda matriz
        console.log("Não é possível multiplicar as matrizes: número de colunas da primeira matriz não é igual ao número de linhas da segunda matriz.");
        return result;
    }
    // console.log("B", B);
    // console.log("BLenght", B.length);
    // console.log("to aqui");
    // Inicializa a matriz de resultado com zeros
    for (let i = 0; i < A.length; i++) {
        let sum = 0;
        for (let j = 0; j < B.length; j++) {
            sum += A[i][j] * B[j];
        }
        // console.log("sum", sum);
        result.push(sum);
    }
    return result;
}