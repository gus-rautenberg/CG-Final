export default class PhongShade {
    ambientLight;
    camera;

    L = {
        vector : [0, 0, 0],
        Il : [0, 0, 0]};
    face;

    material;
    faceList;

    ambientLighting;
    totalIlumination = [];
    

    constructor(ambientLight, L, face, camera, material, faceList) {
        this.ambientLight = ambientLight;
        this.L = L;
        this.face = face;
        this.faceList = faceList;
        this.material = material;
        this.camera = camera;
    }

    setAmbientLighting(){
        console.log("this.ambientLight: ", this.ambientLight);
        console.log("material: ", this.material);
        let ambientLightingR = this.ambientLight[0] * this.material.ka[0];
        let ambientLightingG = this.ambientLight[1] * this.material.ka[1];
        let ambientLightingB = this.ambientLight[2] * this.material.ka[2];
        console.log("ambientLightingR: ", ambientLightingR, " ambientLightingG: ", ambientLightingG, "ambientLightingB: ", ambientLightingB);
        this.ambientLighting = [ambientLightingR, ambientLightingG, ambientLightingB];
        console.log("PHONG: ambientLightingFinal: ", this.ambientLighting);
    }
    
    checkVertexInSolidFaces(vertex, allFacesWithVertex = []) {
        this.faceList.forEach(face => {
            console.log("VertexAQUI: ", vertex);
            console.log("checkVertexAQUI: ", face.checkVertex(vertex));
            if (face.checkVertex(vertex)) {
                console.log("faceAQUI: ", face);
                allFacesWithVertex.push(face);
            }
        });

        return allFacesWithVertex;
    }

    getVerticesFromEdges() {
        let vertices = [];
        this.face.getListEdges().forEach(edge => {
            if (!vertices.some(v => this.vertexEqual(v, edge.vertexInit))) {
                vertices.push(edge.vertexInit);
            }
            if (!vertices.some(v => this.vertexEqual(v, edge.vertexEnd))) {
                vertices.push(edge.vertexEnd);
            }
        });
        return vertices;
    }
    sumVectors(vector1 = [], vector2 = []) {
        return [vector1[0] + vector2[0], vector1[1] + vector2[1], vector1[2] + vector2[2]];
    }
    
    getVertexNormalizedMedia(faces = []) {
        let normalizedSum = [0, 0, 0];
        console.log("facesAQUI1: ", faces);
        faces.forEach(face => {
            console.log("face.getNormal()AQUYU: ", face.getNormal());
            normalizedSum = this.sumVectors(normalizedSum, face.getNormal());
        });
        normalizedSum = this.normalizarVetor(normalizedSum);
        console.log("normalizedSum: ", normalizedSum);
        return normalizedSum;
    }
    vertexEqual(v1, v2) {
        return v1.x === v2.x && v1.y === v2.y && v1.z === v2.z;
    }



    phongRun(vertexNormalized, h, Lnormal) {
        this.setAmbientLighting();



        let totalIlumination = [];
        console.log("vertexNormalized: ", vertexNormalized);

        
            console.log("this.L.vecto1: ", this.L.vector);
            // console.log("verticesFromFace[i]: ", verticesFromFace[i]);
            let totalR, totalG, totalB;
            // console.log("vertexNormalized FINAL: ", vertexNormalized[i]);
            console.log("VERTEXNORMALIZED: ", vertexNormalized);
            const test = this.produtoEscalar(vertexNormalized, Lnormal);
            console.log("Lnormal FINAL: ", Lnormal);
            console.log("test FINAL: ", test);
            if (test > 0) {
                let LDr = this.L.Il[0] * this.material.kd[0] * test;
                let LDg = this.L.Il[1] * this.material.kd[1] * test;
                let LDb = this.L.Il[2] * this.material.kd[2] * test;
                let LD = [LDr, LDg, LDb];
                console.log("PHONG: LD FINAL: ", LD);


                // let r = this.multiplyScalarByVector((test * 2), this.subtractVectors(vertexNormalized[i], Lnormal));
                // console.log("r FINAL: ", r);


                let NH = this.produtoEscalar(vertexNormalized, h);
                console.log("NH FINAL: ", NH);
                if(NH){
                    let LSr = this.L.Il[0] * this.material.ks[0] * Math.pow(NH, this.material.n);
                    let LSg = this.L.Il[1] * this.material.ks[1] * Math.pow(NH, this.material.n);
                    let LSb = this.L.Il[2] * this.material.ks[2] * Math.pow(NH, this.material.n);
                    let LS = [LSr, LSg, LSb];

                    totalR = this.ambientLighting[0] + LD[0] + LS[0];
                    totalG = this.ambientLighting[1] + LD[1] + LS[1];
                    totalB = this.ambientLighting[2] + LD[2] + LS[2];
                    console.log("PHONG: final LS", LS);
                    
                } else {
                    totalR = this.ambientLighting[0] + LD[0];
                    totalG = this.ambientLighting[1] + LD[1];
                    totalB = this.ambientLighting[2] + LD[2];

                }
                totalIlumination = [totalR, totalG, totalB];
            } else {
                totalIlumination = this.ambientLighting;
            }
            console.log("")
            this.totalIlumination = totalIlumination;
            

        
        // this.face.setGouroudIllumination(totalIlumination, interpolationY, interpolationX);
            console.log("PHONG: totalIllumination Final: ", totalIlumination);
            return totalIlumination;


    }

    subtractVectors(vertexA, vertexB) {
        console.log("subtractVectors: ", vertexA, vertexB);
        const x = vertexA[0] - vertexB[0];
        const y = vertexA[1] - vertexB[1];
        const z = vertexA[2] - vertexB[2];

        let points = [x, y, z];

        return points;
    }
    subtractVectors2(vertexA, vertexB) {
        const x = vertexA[0] - vertexB.x;
        const y = vertexA[1] - vertexB.y;
        const z = vertexA[2] - vertexB.z;

        let points = [x, y, z];

        return points;
    }

    normalizarVetor(vetor = []) {
        const magnitude = this.calcularMagnitude(vetor);
        
        const vetorNormalizado = [];
        for (let i = 0; i < vetor.length; i++) {
            vetorNormalizado[i] = vetor[i] / magnitude;
        }
        
        return vetorNormalizado;
    }
    
    produtoEscalar(vetor1, vetor2) {
        // Verifica se os vetores têm o mesmo tamanho
        // Inicializa o resultado
        let resultado = 0;
      
        // Calcula o produto escalar
        for (let i = 0; i < vetor1.length; i++) {
          resultado += vetor1[i] * vetor2[i];
        }
      
        return resultado;
    }

    multiplyScalarByVector(scalar, vector) {
        // Multiplica cada componente do vetor pelo escalar
        return vector.map(component => component * scalar);
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

    calcularMagnitude(vetor = []) {	
        let somaDosQuadrados = 0;
        for (let i = 0; i < vetor.length; i++) {
          somaDosQuadrados += vetor[i] * vetor[i];
        }
        return Math.sqrt(somaDosQuadrados);
    }


}