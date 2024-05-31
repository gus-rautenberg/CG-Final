import ZBuffer from "./ZBuffer.js";

export default class ZBufferPhong extends ZBuffer{


    render(ctx, zBuffer, phong, facesList, L, camera) {
        this.faceList = facesList;
        let verticesFromFace = this.getVerticesFromEdges();
        let facesA, facesB, facesC, facesD = [];
        // console.log("verticesFromFace: ", verticesFromFace);
        facesA = this.checkVertexInSolidFaces(verticesFromFace[0], facesA);
        facesB = this.checkVertexInSolidFaces(verticesFromFace[1], facesB);
        facesC = this.checkVertexInSolidFaces(verticesFromFace[2], facesC);
        facesD = this.checkVertexInSolidFaces(verticesFromFace[3], facesD);
        // console.log("facesA: ", facesA);
        let vertexANormalizedMedia = this.getVertexNormalizedMedia(facesA);
        let vertexBNormalizedMedia = this.getVertexNormalizedMedia(facesB);
        let vertexCNormalizedMedia = this.getVertexNormalizedMedia(facesC);
        let vertexDNormalizedMedia = this.getVertexNormalizedMedia(facesD);
        let vertexNormalized = [vertexANormalizedMedia, vertexBNormalizedMedia, vertexCNormalizedMedia, vertexDNormalizedMedia];	
        // console.log("TestePhongVertices da Face: ", verticesFromFace);
        // console.log("TestePhongvertexNormalized: ", vertexNormalized);
        // console.log("AQUI: L.vector: ", L.vector, " face.centroide: ", this.face.centroide);
        let Lnormal = this.subtractVectors(L.vector, this.face.centroide);
        // console.log("Lnormal TP TO AQI: ", Lnormal);
        Lnormal = this.normalizarVetor(Lnormal);
        // console.log("Lnormal Normalizado: ", Lnormal);
        
        let s = this.subtractVectors(camera.getVRP(),  this.face.centroide);
        
        s = this.normalizarVetor(s);
        let h = this.getH(s, Lnormal);
        // console.log("SolidColor: ", solidColor, " iluConstant: ", this.face.getIluminationFaceConstant());

        let colorRGB;

        // let colorRGB = `rgb(${colorR}, ${colorG}, ${colorB})`;
        
        let intersections = new Map();
        // console.log("face: ", this.face);
        // console.log("viewPort: ", this.viewPortY.min, this.viewPortY.max);
        
        for (let y = this.viewPortY.min; y < this.viewPortY.max; y++) {
            intersections.set(y, []);
        }
        
        this.face.listEdges.forEach(edge => {
            // console.log("edge: ", edge);
            let [yMinEdge, yMaxEdge, xMinEdge, xMaxEdge] = this.findEdgeMinMax(edge);


            let initialY, endY, currentX, currentR, currentG, currentB, currentZ;
            let currentI, currentJ, currentK;

            // console.log("RGB", edge.vertexInitIllumination[0], edge.vertexInitIllumination[1], edge.vertexInitIllumination[2]);
            if (edge.vertexInit.y < edge.vertexEnd.y) { //talvez mudar para <
                initialY = Math.ceil(edge.vertexInit.y);
                endY = Math.floor(edge.vertexEnd.y);
                currentX = edge.vertexInit.x;
                currentZ = edge.vertexInit.z;

                let edgeInitNormalizedVector, edgeEndNormalizedVector;
                for(let i = 0; i < 4; i++){
                    // console.log("TestePhong ", " verticesFromFace[i]: ", verticesFromFace[i] , "vertexInit: ", edge.vertexInit);
                    if(this.vertexEqual(edge.vertexInit, verticesFromFace[i])){
                        edgeInitNormalizedVector = vertexNormalized[i];
                    }
                    // console.log("TestePhong", "  verticesFromFace[i]: ", verticesFromFace[i] , "vertexEnd: ", edge.vertexEnd);

                    if(this.vertexEqual(edge.vertexEnd, verticesFromFace[i])){
                        edgeEndNormalizedVector = vertexNormalized[i];
                    }
                }
                // console.log("TestePhong edgeInitNormalizedVectorTeste: ", edgeInitNormalizedVector, "edgeEndNormalizedVector: ", edgeEndNormalizedVector);

                edge.setNormalizedVertexVector(edgeInitNormalizedVector, edgeEndNormalizedVector);

            } else {
                initialY = Math.ceil(edge.vertexEnd.y);
                endY = Math.floor(edge.vertexInit.y);
                currentX = edge.vertexEnd.x;
                currentZ = edge.vertexEnd.z;

                let edgeInitNormalizedVector, edgeEndNormalizedVector;
                for(let i = 0; i < 4; i++){
                    // console.log("TestePhong -Y ", "verticesFromFace[i]: ", verticesFromFace[i] , "vertexInit: ", edge.vertexInit);

                    if(this.vertexEqual(edge.vertexInit, verticesFromFace[i])){
                        edgeInitNormalizedVector = vertexNormalized[i];
                        // console.log("TestePhong achou: ", edgeInitNormalizedVector);
                    }
                    // console.log("TestePhong -Y", "verticesFromFace[i]: ", verticesFromFace[i] , "vertexEnd: ", edge.vertexEnd);

                    if(this.vertexEqual(edge.vertexEnd, verticesFromFace[i])){
                        edgeEndNormalizedVector = vertexNormalized[i];
                    }
                }
                // console.log("TestePhong -Y edgeInitNormalizedVectorTeste: ", edgeInitNormalizedVector, "edgeEndNormalizedVector: ", edgeEndNormalizedVector);
                edge.setNormalizedVertexVector(edgeEndNormalizedVector, edgeInitNormalizedVector);
            }
            
            let [dX, dZ] = this.calcDAndT(edge);
            // let [rateR, rateG, rateB] = this.calcIlluminationRateRGB(edge);
            let [rateI, rateJ, rateK] = this.calcNRate(edge);
            currentI = edge.edgeInitNormalizedVector[0];
            currentJ = edge.edgeInitNormalizedVector[1];
            currentK = edge.edgeInitNormalizedVector[2];
            // console.log("initialY: ", initialY, "endY: ", endY);
            for (let y = initialY; y <= endY; y++) {
                // console.log("y: ", y);
                // intersections.get(y).push({ x: currentX, z: currentZ, rateIlluminationR: currentIlluminationR, rateIlluminationG: currentIlluminationG, rateIlluminationB: currentIlluminationB, rateI: currentI, rateJ: currentJ, rateK: currentK });
                if(intersections.get(y) == undefined) {
                    intersections.set(y, []);
                }
                intersections.get(y).push({ x: currentX, z: currentZ, rateI: currentI, rateJ: currentJ, rateK: currentK });

                currentX += dX;
                currentZ += dZ;

                currentI += rateI;
                currentJ += rateJ;
                currentK += rateK;
            }
            // console.log("intersections(162): ", intersections.get(162));
            
        
        });

        // console.log("intersectionsAntes: ", intersections);
        intersections.forEach((sortX) => {
            const sortedX = sortX.slice().sort((a, b) => a.x - b.x);
            sortX.splice(0, sortX.length, ...sortedX);
        });

        // console.log("intersectionsTUDO: ", intersections);

        for (let currentY = this.viewPortY.min; currentY < this.viewPortY.max; currentY++) {
            let edge = intersections.get(currentY);
            // console.log("edge: ", edge, "currentY: ", currentY);
            for (let i = 0; i < edge.length-1; i+=2) {
                let initialX = Math.ceil(edge[i].x);
                let endX = Math.floor(edge[i + 1].x);

                let currentZ = edge[i].z;
                let tZX = (edge[i + 1].z - edge[i].z) / (edge[i + 1].x - edge[i].x);

                let currentI = edge[i].rateI;
                let currentJ = edge[i].rateJ;
                let currentK = edge[i].rateK;

                let rateIX = (edge[i+1].rateI - edge[i].rateI) / (edge[i + 1].x - edge[i].x);
                let rateJX = (edge[i+1].rateJ - edge[i].rateJ) / (edge[i + 1].x - edge[i].x);
                let rateKX = (edge[i+1].rateK - edge[i].rateK) / (edge[i + 1].x - edge[i].x);

                // console.log("currentZ: ", currentZ);
                for (let currentX = initialX; currentX <= endX; currentX++) {
                    // console.log("currentX: ", currentX, "currentZ: ", currentZ);    
                    // console.log("zBuffer[currentY][currentX]: ", zBuffer[currentY][currentX]);
                    if(zBuffer[currentY][currentX] == null) {
                        if (currentZ < zBuffer[currentY][currentX]) {
                            // let auxColorR = currentIlluminationR;
                            // let auxColorG = currentIlluminationG;
                            // let auxColorB; = currentIlluminationB 
                            let vertex = [currentI, currentJ, currentK];
                            
                            let color = phong.phongRun(vertex, h, Lnormal);
                            let colorRGB = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;

                            zBuffer[currentY][currentX] = {currentZ : currentZ, color: colorRGB};
                            
                            // console.log("zBuffer[currentY][currentX]: ", zBuffer[currentY][currentX]);
                        }
                        // let auxColorR = colorR * currentIlluminationR;
                        // let auxColorG = colorG * currentIlluminationG;
                        // let auxColorB = colorB * currentIlluminationB;
                        // let colorRGB = `rgb(${auxColorR}, ${auxColorG}, ${auxColorB})`;
                        // zBuffer[currentY][currentX] = {currentZ : currentZ, color: colorRGB};
                    } else {
                        if (currentZ < zBuffer[currentY][currentX].currentZ) {
                            // let auxColorR = currentIlluminationR;
                            // let auxColorG = currentIlluminationG;
                            // let auxColorB = currentIlluminationB;
                            // let colorRGB = `rgb(${auxColorR}, ${auxColorG}, ${auxColorB})`;
                            let vertex = [currentI, currentJ, currentK];

                            let color = phong.phongRun(vertex, h, Lnormal);
                            let colorRGB = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;


                            zBuffer[currentY][currentX] = {currentZ : currentZ, color: colorRGB};
                            // console.log("zBuffer[currentY][currentX]: ", zBuffer[currentY][currentX]);
                        }
                    }
                    // console.log("currentIlluminationR: ", currentIlluminationR, "currentIlluminationG: ", currentIlluminationG, "currentIlluminationB: ", currentIlluminationB);
                   
                    currentZ += tZX;
                    currentI += rateIX;
                    currentJ += rateJX;
                    currentK += rateKX;
                    // currentIlluminationR += rateR;
                    // currentIlluminationG += rateG;
                    // currentIlluminationB += rateB;

                }
            }
        }

        // console.log("zBuffer: ", zBuffer);
    }

    getH(v1, v2) {
        let h = [];
        h = this.sumVectors(v1, v2);
        // let x = h[0]/Math.sqrt(Math.pow(h[0],2) + Math.pow(h[1],2) + Math.pow(h[2],2));
        // let y = h[1]/Math.sqrt(Math.pow(h[0],2) + Math.pow(h[1],2) + Math.pow(h[2],2));
        // let z = h[2]/Math.sqrt(Math.pow(h[0],2) + Math.pow(h[1],2) + Math.pow(h[2],2));
        h = this.normalizarVetor(h)
        // h = [x, y, z];

        return h;
    }

    normalizarVetor(vetor = []) {
        const magnitude = this.calcularMagnitude(vetor);
        
        const vetorNormalizado = [];
        for (let i = 0; i < vetor.length; i++) {
            vetorNormalizado[i] = vetor[i] / magnitude;
        }
        
        return vetorNormalizado;
    }
    calcularMagnitude(vetor = []) {	
        let somaDosQuadrados = 0;
        for (let i = 0; i < vetor.length; i++) {
          somaDosQuadrados += vetor[i] * vetor[i];
        }
        return Math.sqrt(somaDosQuadrados);
    }
    
    getVertexNormalizedMedia(faces = []) {
        let normalizedSum = [0, 0, 0];
        // console.log("facesAQUI1: ", faces);
        faces.forEach(face => {
            // console.log("face.getNormal()AQUYU: ", face.getNormal());
            normalizedSum = this.sumVectors(normalizedSum, face.getNormal());
        });
        normalizedSum = this.normalizarVetor(normalizedSum);
        // console.log("normalizedSum: ", normalizedSum);
        return normalizedSum;
    }

    subtractVectors2(vertexA, vertexB) {
        const x = vertexA[0] - vertexB.x;
        const y = vertexA[1] - vertexB.y;
        const z = vertexA[2] - vertexB.z;

        let points = [x, y, z];

        return points;
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


    calcIlluminationRateRGB(edge) {
        let rateR = (edge.vertexEndIllumination[0] - edge.vertexInitIllumination[0])/(edge.vertexEnd.y-edge.vertexInit.y); // talvez mude a ordem dos Y, slide ta diferente
        let rateG = (edge.vertexEndIllumination[1] - edge.vertexInitIllumination[1])/(edge.vertexEnd.y-edge.vertexInit.y);
        let rateB = (edge.vertexEndIllumination[2] - edge.vertexInitIllumination[2])/(edge.vertexEnd.y-edge.vertexInit.y);
        return [rateR, rateB, rateG];
    }

    calcNRate(edge){

        let rateI =  (edge.edgeEndNormalizedVector[0]-edge.edgeInitNormalizedVector[0])/(edge.vertexEnd.y-edge.vertexInit.y); 
        let rateJ =  (edge.edgeEndNormalizedVector[1]-edge.edgeInitNormalizedVector[1])/(edge.vertexEnd.y-edge.vertexInit.y);
        let rateK =  (edge.edgeEndNormalizedVector[2]-edge.edgeInitNormalizedVector[2])/(edge.vertexEnd.y-edge.vertexInit.y);
        return [rateI, rateJ, rateK];
    }

    subtractVectors(vertexA, vertexB) {
        // console.log("subtractVectors: ", vertexA, vertexB);
        const x = vertexA[2] - vertexB[0];
        const y = vertexA[1] - vertexB[1];
        const z = vertexA[2] - vertexB[2];

        let points = [x, y, z];

        return points;
    }

    vertexEqual(v1, v2) {
        return v1.x === v2.x && v1.y === v2.y && v1.z === v2.z;
    }

    checkVertexInSolidFaces(vertex, allFacesWithVertex = []) {
        this.faceList.forEach(face => {
            // console.log("VertexAQUI: ", vertex);
            // console.log("checkVertexAQUI: ", face.checkVertex(vertex));
            if (face.checkVertex(vertex)) {
                // console.log("faceAQUI: ", face);
                allFacesWithVertex.push(face);
            }
        });

        return allFacesWithVertex;
    }
}