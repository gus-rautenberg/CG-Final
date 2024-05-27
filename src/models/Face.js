import Vertex from "./Vertex.js";
export default class Face {
    listEdges = [];
    centroide;
    vetNormal;
    iluminationFaceConstant;
    vetNormalized;

    verticesGouroud = {

    }

    constructor(listEdges) {
        this.listEdges = listEdges;
        this.centroide = this.calcCentroide();
        this.vetNormal = this.calcNormal();
        this.vetNormalized = this.normalizarVetor(this.vetNormal);
        // console.log("calcNormal: ", this.calcNormal);
    }

    calcNormal() {
        let p3 = this.listEdges[1].vertexEnd;
        // console.log("p3: ", p3);
        let p2 = this.listEdges[1].vertexInit;
        let p1 = this.listEdges[0].vertexInit;
        let A = this.subtractVectors(p1, p2);
        let B = this.subtractVectors(p3, p2);
        let C = this.crossProduct(B, A);
        // console.log("C: ", C);
        return C;
    }

    getNormal() {
        return this.vetNormalized;
    }

    setGouroudIllumination(totalIlumination = []) {
        let vertices = this.getVerticesFromEdges();
        this.vertexIlluminationGouroud = {};
        for(let і = 0; і < vertices.length; і++) {
            for(let j = 0; j < this.listEdges.length; j++) {
                if(this.listEdges[j].vertexInit === vertices[і] ) {
                    this.listEdges[j].setInitIlumination(totalIlumination[і]);
                } if(this.listEdges[j].vertexEnd === vertices[і] ) {
                    this.listEdges[j].setEndIlumination(totalIlumination[і]);
                }

            }
        }
    }

    vertexEqual(v1, v2) {
        return v1.x === v2.x && v1.y === v2.y && v1.z === v2.z;
    }


    checkVertex(vertex) {
        let vertices = this.getVerticesFromEdges();
        return vertices.some(v => this.vertexEqual(v, vertex));
    }

    getVerticesFromEdges() {
        let vertices = [];
        this.listEdges.forEach(edge => {
            if (!vertices.some(v => this.vertexEqual(v, edge.vertexInit))) {
                vertices.push(edge.vertexInit);
            }
            if (!vertices.some(v => this.vertexEqual(v, edge.vertexEnd))) {
                vertices.push(edge.vertexEnd);
            }
        });
        return vertices;
    }

    getIluminationFaceConstant(){
        return this.iluminationFaceConstant;
    }

    calcCentroide() {
        let vertices = this.getVerticesFromEdges();

        let sumX = 0, sumY = 0, sumZ = 0;
        vertices.forEach(vertex => {
            sumX += vertex.x;
            sumY += vertex.y;
            sumZ += vertex.z;
        });

        let numVertices = vertices.length;
        let centroideX = sumX / numVertices;
        let centroideY = sumY / numVertices;
        let centroideZ = sumZ / numVertices;

        return [centroideX, centroideY, centroideZ];
    }
    setIlumination(totalIlumination){
        this.iluminationFaceConstant = totalIlumination;
    }

    getVerticesFromEdges() {
        let vertices = [];
        this.listEdges.forEach(edge => {
            if (!vertices.some(v => this.vertexEqual(v, edge.vertexInit))) {
                vertices.push(edge.vertexInit);
            }
            if (!vertices.some(v => this.vertexEqual(v, edge.vertexEnd))) {
                vertices.push(edge.vertexEnd);
            }
        });
        return vertices;
    }

    vertexEqual(v1, v2) {
        return v1.x === v2.x && v1.y === v2.y && v1.z === v2.z;
    }
    getListEdges() {
        return this.listEdges;
    }

    crossProduct(vectorA, vectorB) {
        if (vectorA.length !== 3 || vectorB.length !== 3) {
            throw new Error("Ambos os vetores devem ter 3 componentes.");
        }
    
        const [ax, ay, az] = vectorA;
        const [bx, by, bz] = vectorB;
    
        const cx = ay * bz - az * by;
        const cy = az * bx - ax * bz;
        const cz = ax * by - ay * bx;
    
        return [cx, cy, cz];
    }

    subtractVectors(vertexA, vertexB) {
        const x = vertexA.x - vertexB.x;
        const y = vertexA.y - vertexB.y;
        const z = vertexA.z - vertexB.z;

        let points = [x, y, z];

        return points;
    }

    normalizarVetor(vetor) {
        const magnitude = this.calcularMagnitude(vetor);
        
        const vetorNormalizado = [];
        for (let i = 0; i < vetor.length; i++) {
            vetorNormalizado[i] = vetor[i] / magnitude;
        }
        
        return vetorNormalizado;
    }

    calcularMagnitude(vetor) {
        let somaDosQuadrados = 0;
        for (let i = 0; i < vetor.length; i++) {
          somaDosQuadrados += vetor[i] * vetor[i];
        }
        return Math.sqrt(somaDosQuadrados);
    }
    

}