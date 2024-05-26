export default class ZBuffer {
    viewPort = {};
    face;
    yMin = null;
    yMax = null;

    constructor(viewPortX, viewPortY, face) {
        this.viewPortX = viewPortX;
        this.viewPortY = viewPortY;
        this.face = face;

        this.findFaceYMinAndMax();
    }
    getFace() {
        return this.face;
    }

    render(ctx) {
        let intersections = new Map();
        for (let y = this.yMin; y < this.yMax; y++) {
            intersections.set(y, []);
        }

        this.face.listEdges.forEach(edge => {
            let [dX, dZ] = this.calcDAndT(edge);
            let [yMinEdge, yMaxEdge, xMinEdge, xMaxEdge] = this.findEdgeMinMax(edge);

            // let x = edge.vertexInit.x;
            // let z = edge.vertexInit.z;

            let initialY, endY, currentX, currentR, currentG, currentB, currentZ;
    
            if (edge.vertexInit.y > edge.vertexEnd.y) { //talvez mudar para <
                initialY = edge.vertexInit.y;
                endY = edge.vertexEnd.y;
                currentX = edge.vertexInit.x;
                currentZ = edge.vertexInit.z;
                // currentR = edge.vertexInit.extractRGB().r;
                // currentG = edge.vertexInit.extractRGB().g;
                // currentB = edge.vertexInit.extractRGB().b;
            } else {
                initialY = edge.vertexEnd.y;
                endY = edge.vertexInit.y;
                currentX = edge.vertexEnd.x;
                currentZ = edge.vertexEnd.z;
                // currentR = edge.vertexEnd.extractRGB().r;
                // currentG = edge.vertexEnd.extractRGB().g;
                // currentB = edge.vertexEnd.extractRGB().b;
            }
    
            for (let y = initialY; y < endY; y++) {
                intersections.get(y).push({ x: currentX, z: currentZ });
                currentX += dx;
                currentZ += dz;
                // currentR += edgeRGB[i].rateR;
                // currentG += edgeRGB[i].rateG;
                // currentB += edgeRGB[i].rateB;
            }
            
        
        });

        intersections.forEach((sortX) => {
            const sortedX = sortX.slice().sort((a, b) => a.x - b.x);
            sortX.splice(0, sortX.length, ...sortedX);
        });

        console.log("intersections: ", intersections);
        let zBuffer = Array(this.viewPortY).fill(null).map(() => Array(this.viewPortX).fill(Infinity));

        for (let currentY = this.yMin; currentY < this.yMax; currentY++) {
            let edge = intersections.get(currentY);
        
            for (let i = 0; i < edge.length; i += 2) {
                let initialX = Math.ceil(edge[i].x);
                let endX = Math.floor(edge[i + 1].x);
                let currentZ = edge[i].z;
                let dz = (edge[i + 1].z - edge[i].z) / (endX - initialX);

                for (let currentX = initialX; currentX < endX; currentX++) {
                    if (currentZ < zBuffer[currentY][currentX]) {
                        zBuffer[currentY][currentX] = currentZ;
                        ctx.fillStyle = `red`; // Pode ser alterado para manipular cores conforme necessário
                        ctx.fillRect(currentX, currentY, 1, 1);
                    }
                    currentZ += dz;
                }
            }
        }

        // for (let currentY = this.yMin; currentY < this.yMax; currentY++) {
        //     let edge = intersections.get(currentY);
        
        //     for (let i = 0; i < edge.length; i += 2) {
        //         let initialX = Math.ceil(edge[i].x);
        //         let endX = Math.floor(edge[i + 1].x);
        //         // let currentR = edge[i].r;
        //         // let currentG = edge[i].g;
        //         // let currentB = edge[i].b;
        
        //         // const variationR = (edge[i + 1].r - edge[i].r) / (endX - initialX);
        //         // const variationG = (edge[i + 1].g - edge[i].g) / (endX - initialX);
        //         // const variationB = (edge[i + 1].b - edge[i].b) / (endX - initialX);
        
        //         for (let currentX = initialX; currentX < endX; currentX++) {
        //             ctx.fillStyle = `red`;
        //             ctx.fillRect(currentX, currentY, 1, 1);
        //             // currentR += variationR;
        //             // currentG += variationG;
        //             // currentB += variationB;
        //         }
        //     }
        // }

    }

    calcDAndT(edge) {
        let dX = (edge.vertexEnd.x - edge.vertexInit.x) / (edge.vertexEnd.y - edge.vertexInit.y);
        let dZ = (edge.vertexEnd.z - edge.vertexInit.z) / (edge.vertexEnd.y - edge.vertexInit.y);
        return [dX, dZ];
    }

    findFaceYMinAndMax() {
        this.face.listEdges.forEach(edge => {
            if (this.yMin === null || edge.vertexInit.y < this.yMin) {
                this.yMin = edge.vertexInit.y;
            }
            if (this.yMax === null || edge.vertexInit.y > this.yMax) {
                this.yMax = edge.vertexInit.y;
            }
        });
    }

    findEdgeMinMax(edge) {
        let yMin, yMax, xMin, xMax;
        if(Math.min(edge.vertexInit.y, edge.vertexEnd.y) == edge.vertexInit.y) {
            let yMin = Math.min(edge.vertexInit.y, edge.vertexEnd.y);
            let xMin = edge.vertexInit.x;
            let yMax = edge.vertexEnd.y;
            let xMax = edge.vertexEnd.x;
        } else {
            let yMin = edge.vertexEnd.y;
            let xMin = edge.vertexEnd.x;
            let yMax = edge.vertexInit.y;
            let xMax = edge.vertexInit.x;
        }
        
        return [yMin, yMax, xMin, xMax];
    }

    findEdgeXMinMax(edge) {
        let xMin = Math.min(edge.vertexInit.x, edge.vertexEnd.x);
        let xMax = Math.max(edge.vertexInit.x, edge.vertexEnd.x);
        return [xMin, xMax];
    }
}



// export default class ZBuffer {
//     viewPort = {}
//     face;
//     yMin = null;
//     yMax = null;
//     constructor(viewPortX, viewPortY, face){
//         this.viewPortX = viewPortX;
//         this.viewPortY = viewPortY;
//         this.face = face;

//         this.findFaceYMinAndMax();
//     }

//     render(ctx) {
//         let intersections = new Map();
//         for (let y = this.yMin; y < this.yMax; y++) {
//             intersections.set(y, []);
//         }

//         this.face.listEdges.forEach(edge => {
//             let taxas = this.calcDAndT(edge);
//             let [yMinEdge, yMaxEdge] = this.findEdgeYMinMax(edge);

//             let x = edge.vertexInit.x;
//             let z = edge.vertexInit.z;

//             for(let y = yMinEdge; y < yMaxEdge; y++) {
//                 if(y >= this.yMin && y <= this.yMax) {
//                     intersections.get(y).push([x, z]);
//                     x += taxas[0];
//                     z += taxas[1];
//                 }
//             }
//         })

//         let zBuffer = Array(this.viewPortY).fill(null).map(() => Array(this.viewPortX).fill(Infinity));

//         QUAL O PROXIMO PASSO?

//     }   

//     calcDAndT(edge) {
//         let dX = edge.vertexInit.x - edge.vertexEnd.x;
//         let dY = edge.vertexInit.y - edge.vertexEnd.y;
//         let dZ = edge.vertexInit.z - edge.vertexEnd.z;

//         let tX = dX/dY;
//         let tZ = dZ/dY;
//         return [tX, tZ];
//     }

//     findFaceYMinAndMax() {
//         this.face.listEdges.forEach(edge => {
//             if(edge.vertexInit.y < yMin) {
//                 this.yMin = edge.vertexInit.y;
//             }
//             if(edge.vertexInit.y > yMax) {
//                 this.yMax = edge.vertexInit.y;
//             }
//         })
//     }

//     findEdgeYMinMax(edge) {
//         let yMin, yMax;
//         if(edge.vertexInit.y < yMin) {
//             this.yMin = edge.vertexInit.y;
//         }
//         if(edge.vertexInit.y > yMax) {
//             this.yMax = edge.vertexInit.y;
//         }
//         return [yMin, yMax];
//     }
 
//  }