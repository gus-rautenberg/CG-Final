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

    // Inicializa a matriz de resultado com zeros
    const result = [];
    for (let i = 0; i < A.length; i++) {
        let sum = 0;
        for (let j = 0; j < B.length; j++) {
            sum += A[i][j] * B[j];
        }
        result.push(sum);
    }
    return result;
}