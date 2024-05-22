export default class Camera {

    constructor() {
        this.vrp = vrp;
        this.focalPoint = focalPoint;
        this.u = u;
        this.v = v;
        this.n = n;

    }

    setCamera(vrp, focalPoint, u, v, n) {
        this.vrp = vrp;
        this.focalPoint = focalPoint;
        this.u = u;
        this.v = v;
        this.n = n;
    }

    getCamera() {
        return [this.vrp, this.focalPoint, this.u, this.v, this.n];
    }

    get srcMatrix() {
        return [[this.u.x, this.u.y, this.u.z, produtoEscalar((-this.vrp), (this.u))],
                [this.v.x, this.v.y, this.v.z, produtoEscalar((-this.vrp), (this.v))],
                [this.n.x, this.n.y, this.n.z, produtoEscalar((-this.vrp), (this.n))],
                [0, 0, 0, 1]];
    }
}

function produtoEscalar(vetor1, vetor2) {
    // Verifica se os vetores têm o mesmo tamanho
    // Inicializa o resultado
    let resultado = 0;
  
    // Calcula o produto escalar
    for (let i = 0; i < vetor1.length; i++) {
      resultado += vetor1[i] * vetor2[i];
    }
  
    return resultado;
  }