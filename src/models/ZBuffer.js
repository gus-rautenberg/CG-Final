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

    render(ctx) {
        let intersections = new Map();
        for (let y = this.yMin; y < this.yMax; y++) {
            intersections.set(y, []);
        }

        this.face.listEdges.forEach(edge => {
            let [dX, dZ] = this.calcDAndT(edge);
            let [yMinEdge, yMaxEdge] = this.findEdgeYMinMax(edge);

            let x = edge.vertexInit.x;
            let z = edge.vertexInit.z;

            for (let y = yMinEdge; y < yMaxEdge; y++) {
                if (y >= this.yMin && y < this.yMax) {
                    intersections.set(y, []);
                    intersections.get(y).push([x, z]);
                    x += dX;
                    z += dZ;
                }
            }
        });

        let zBuffer = Array(this.viewPortY).fill(null).map(() => Array(this.viewPortX).fill(Infinity));

        for (let y = this.yMin; y < this.yMax; y++) {
            let scanline = intersections.get(y);
            if (scanline.length === 0) continue;

            scanline.sort((a, b) => a[0] - b[0]); // Sort by x-coordinate

            for (let i = 0; i < scanline.length; i += 2) {
                let [xStart, zStart] = scanline[i];
                let [xEnd, zEnd] = scanline[i + 1];

                xStart = Math.ceil(xStart);
                xEnd = Math.floor(xEnd);

                let z = zStart;
                let zIncrement = (zEnd - zStart) / (xEnd - xStart);

                for (let x = xStart; x <= xEnd; x++) {
                    if (x >= 0 && x < this.viewPortX && y >= 0 && y < this.viewPortY) {
                        if (z < zBuffer[y][x]) {
                            zBuffer[y][x] = z;
                            // Draw the pixel immediately
                            ctx.fillStyle = 'white'; // Example color (white)
                            ctx.fillRect(x, y, 1, 1);
                        }
                    }
                    z += zIncrement;
                }
            }
        }
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

    findEdgeYMinMax(edge) {
        let yMin = Math.min(edge.vertexInit.y, edge.vertexEnd.y);
        let yMax = Math.max(edge.vertexInit.y, edge.vertexEnd.y);
        return [yMin, yMax];
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