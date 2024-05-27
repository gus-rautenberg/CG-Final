export default class ConstantShade {
    ambientLight;
    camera;

    L = {
        vector : [0, 0, 0],
        Il : [0, 0, 0],
    };

    material;

    ambientLighting;
    totalIlumination;

    constructor(ambientLight, L, face, camera, material) {
        this.ambientLight = ambientLight;
        this.L = L;
        this.face = face;
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
        console.log("ambientLighting: ", this.ambientLighting);
    }   

    constantRun() {
        this.setAmbientLighting();

        
        let totalIlumination;
        console.log("this.L.vector: ", this.L.vector);
        console.log("this.face.centroide: ", this.face.centroide);
        let Lnormal = this.subtractVectors(this.L.vector, this.face.centroide);
        console.log("Lnormal antes de normalizar: ", Lnormal);
        Lnormal = this.normalizarVetor(Lnormal);
        let totalR, totalG, totalB;
        console.log("this.getNormal: ", this.face.getNormal());
        console.log("Lnormal: ", Lnormal);

        const test = this.produtoEscalar(this.face.getNormal(), Lnormal);
        console.log("test: ", test);
        
        if (test > 0) {
            let LDr = this.L.Il[0] * this.material.kd[0] * test;
            let LDg = this.L.Il[1] * this.material.kd[1] * test;
            let LDb = this.L.Il[2] * this.material.kd[2] * test;
            let LD = [LDr, LDg, LDb];
            console.log("LD ES1: ", LD);
            console.log("this.face.getNormal ES1: ", this.face.getNormal());
            console.log("Lnormal ES1: ", Lnormal);


            let r = this.multiplyScalarByVector((test * 2), this.subtractVectors(this.face.getNormal(), Lnormal));
            let s = this.subtractVectors(this.camera.getVRP(),  this.face.centroide);
            console.log("s ES1: ", s);

            s = this.normalizarVetor(s);
            console.log("s normalizado ES1: ", s);

            let RS = this.produtoEscalar(r, s);
            console.log("RS ES1: ", RS);
            if(RS){
                let LSr = this.L.Il[0] * this.material.ks[0] * Math.pow(RS, this.material.n);
                let LSg = this.L.Il[1] * this.material.ks[1] * Math.pow(RS, this.material.n);
                let LSb = this.L.Il[2] * this.material.ks[2] * Math.pow(RS, this.material.n);
                let LS = [LSr, LSg, LSb];

                totalR = this.ambientLighting[0] + LD[0] + LS[0];
                totalG = this.ambientLighting[1] + LD[1] + LS[1];
                totalB = this.ambientLighting[2] + LD[2] + LS[2];
                console.log("Com Especular ", "totalR: ", totalR, "totalG: ", totalG, "totalB: ", totalB);
                
            } else {
                totalR = this.ambientLighting[0] + LD[0];
                totalG = this.ambientLighting[1] + LD[1];
                totalB = this.ambientLighting[2] + LD[2];
                console.log("Sem Especular ",  "totalR: ", totalR, "totalG: ", totalG, "totalB: ", totalB);

            }
            totalIlumination = [totalR, totalG, totalB];
        } else {
            console.log("SO AMBIENTE: ", this.ambientLighting);
            totalIlumination = this.ambientLighting;
        }
        this.totalIlumination = totalIlumination;
        console.log("totalIluminationOK: ", totalIlumination);
        this.face.setIlumination(totalIlumination);
        console.log("Iluminacao Face: ", this.face.getIluminationFaceConstant());
       


    }

    subtractVectors(vertexA, vertexB) {
        const x = vertexA[0] - vertexB[0];
        const y = vertexA[1] - vertexB[1];
        const z = vertexA[2] - vertexB[2];

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

    calcularMagnitude(vetor) {
        let somaDosQuadrados = 0;
        for (let i = 0; i < vetor.length; i++) {
          somaDosQuadrados += vetor[i] * vetor[i];
        }
        return Math.sqrt(somaDosQuadrados);
    }


}