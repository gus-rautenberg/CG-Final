export default class ZBuffer {
    viewPortX = {};
    viewPortY = {};
    face;
    yMin = null;
    yMax = null;
    xMin = null;
    xMax = null;

    constructor(viewPortX, viewPortY, face) {
        this.viewPortX = viewPortX;
        this.viewPortY = viewPortY;
        this.face = face;

        this.findFaceYMinAndMax();
        this.findFaceXMinMax();
    }
    getFace() {
        return this.face;
    }
    getRandomColor() {
        // Gera um componente RGB aleatório entre 0 e 255
        const getRandomComponent = () => Math.floor(Math.random() * 256);
    
        // Gera os três componentes RGB
        const r = getRandomComponent();
        const g = getRandomComponent();
        const b = getRandomComponent();
    
        // Retorna a cor no formato RGB
        return `rgb(${r}, ${g}, ${b})`;
    }

    render(ctx, zBuffer, solidColor) {
        console.log("SolidColor: ", solidColor, " iluConstant: ", this.face.getIluminationFaceConstant());
        let colorR = this.face.getIluminationFaceConstant()[0];
        let colorG = this.face.getIluminationFaceConstant()[1];
        let colorB = this.face.getIluminationFaceConstant()[2];
        let colorRGB = `rgb(${colorR}, ${colorG}, ${colorB})`;
        
        let intersections = new Map();
        console.log("face: ", this.face);
        console.log("viewPort: ", this.viewPortY.min, this.viewPortY.max);
        
        for (let y = this.viewPortY.min; y < this.viewPortY.max; y++) {
            intersections.set(y, []);
        }
        
        this.face.listEdges.forEach(edge => {
            let [yMinEdge, yMaxEdge, xMinEdge, xMaxEdge] = this.findEdgeMinMax(edge);
            
            // let x = edge.vertexInit.x;
            // let z = edge.vertexInit.z;
            
            let initialY, endY, currentX, currentR, currentG, currentB, currentZ;
            
            if (edge.vertexInit.y < edge.vertexEnd.y) { //talvez mudar para <
                initialY = Math.ceil(edge.vertexInit.y);
                endY = Math.floor(edge.vertexEnd.y);
                currentX = edge.vertexInit.x;
                currentZ = edge.vertexInit.z;
                // currentR = edge.vertexInit.extractRGB().r;
                // currentG = edge.vertexInit.extractRGB().g;
                // currentB = edge.vertexInit.extractRGB().b;
            } else {
                initialY = Math.ceil(edge.vertexEnd.y);
                endY = Math.floor(edge.vertexInit.y);
                currentX = edge.vertexEnd.x;
                currentZ = edge.vertexEnd.z;
                // currentR = edge.vertexEnd.extractRGB().r;
                // currentG = edge.vertexEnd.extractRGB().g;
                // currentB = edge.vertexEnd.extractRGB().b;
            }
            console.log("initialY: ", initialY, "endY: ", endY);
            let [dX, dZ] = this.calcDAndT(edge);

            for (let y = initialY; y <= endY; y++) {
                // console.log("y: ", y);
                if(intersections.get(y) == undefined) {
                    intersections.set(y, []);
                }
                intersections.get(y).push({ x: currentX, z: currentZ });
                // console.log("x: ", currentX, "z: ", currentZ);
                // console.log("intersections.get", intersections.get(y));
                
                currentX += dX;
                currentZ += dZ;
                // currentR += edgeRGB[i].rateR;
                // currentG += edgeRGB[i].rateG;
                // currentB += edgeRGB[i].rateB;
            }
            console.log("intersections(162): ", intersections.get(162));
            
        
        });

        console.log("intersectionsAntes: ", intersections);
        intersections.forEach((sortX) => {
            const sortedX = sortX.slice().sort((a, b) => a.x - b.x);
            sortX.splice(0, sortX.length, ...sortedX);
        });

        console.log("intersectionsTUDO: ", intersections);


        // let zBuffer;
        // for(let y = Math.ceil(this.viewPortY.min); y < Math.floor(this.viewPortY.max); y++) {
        //     for(let currentX = Math.ceil(this.viewPortY.min); currentX < Math.floor(this.viewPortY.max); currentX++) {
        //         zBuffer[y][currentX] = null;
        //     }
        // }
        // let zBuffer = Array.from({ length: this.viewPortY.max }, () => Array.from({ length: this.viewPortX.max }, () => null));

        // console.log("zBuffer: ", zBuffer);


        for (let currentY = this.viewPortY.min; currentY < this.viewPortY.max; currentY++) {
            let edge = intersections.get(currentY);
            console.log("edgeTesteFinal: ", edge, "currentY: ", currentY);
            for (let i = 0; i < edge.length-1; i+=2) {
                let initialX = Math.ceil(edge[i].x);
                let endX = Math.floor(edge[i + 1].x);
                let currentZ = edge[i].z;

                let tZX = (edge[i + 1].z - edge[i].z) / (edge[i + 1].x - edge[i].x);
                
                console.log("currentZ: ", currentZ);
                for (let currentX = initialX; currentX <= endX; currentX++) {
                    // console.log("currentX: ", currentX, "currentZ: ", currentZ);    
                    // console.log("zBuffer[currentY][currentX]: ", zBuffer[currentY][currentX]);
                    if(zBuffer[currentY][currentX] == null) {
                        if (currentZ < zBuffer[currentY][currentX]) {
                            zBuffer[currentY][currentX] = {currentZ : currentZ, color: colorRGB};
                            // console.log("zBuffer[currentY][currentX]: ", zBuffer[currentY][currentX]);
                        }
                        zBuffer[currentY][currentX] = {currentZ : currentZ, color: colorRGB};
                    } else {
                        if (currentZ < zBuffer[currentY][currentX].currentZ) {
                            zBuffer[currentY][currentX] = {currentZ : currentZ, color: colorRGB};
                            // console.log("zBuffer[currentY][currentX]: ", zBuffer[currentY][currentX]);
                        }
                    }
                   
                    currentZ += tZX;
                }
            }
        }

        console.log("zBuffer: ", zBuffer);




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

    findFaceXMinMax() {
        this.face.listEdges.forEach(edge => {
            if (this.xMin === null || edge.vertexInit.x < this.xMin) {
                this.xMin = edge.vertexInit.x;
            }
            if (this.xMax === null || edge.vertexInit.x > this.xMax) {
                this.xMax = edge.vertexInit.x;
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