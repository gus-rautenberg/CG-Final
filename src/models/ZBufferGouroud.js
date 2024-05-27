import ZBuffer from "./ZBuffer.js";

export default class ZBufferGouraud extends ZBuffer{


    render(ctx, zBuffer, solidColor) {
        console.log("SolidColor: ", solidColor, " iluConstant: ", this.face.getIluminationFaceConstant());
        let colorR = solidColor[0];
        let colorG = solidColor[1];
        let colorB = solidColor[2];
        let colorRGB;

        // let colorRGB = `rgb(${colorR}, ${colorG}, ${colorB})`;
        
        let intersections = new Map();
        console.log("face: ", this.face);
        console.log("viewPort: ", this.viewPortY.min, this.viewPortY.max);
        
        for (let y = this.viewPortY.min; y < this.viewPortY.max; y++) {
            intersections.set(y, []);
        }
        
        this.face.listEdges.forEach(edge => {
            console.log("edge: ", edge);
            let [dX, dZ] = this.calcDAndT(edge);
            let [yMinEdge, yMaxEdge, xMinEdge, xMaxEdge] = this.findEdgeMinMax(edge);

            // let x = edge.vertexInit.x;
            // let z = edge.vertexInit.z;
            let currentIlluminationR, currentIlluminationG, currentIlluminationB;
            let lastIlluminationR, lastIlluminationG, lastIlluminationB;
            let initialY, endY, currentX, currentR, currentG, currentB, currentZ;
            console.log("RGB", edge.vertexInitIllumination[0], edge.vertexInitIllumination[1], edge.vertexInitIllumination[2]);
            if (edge.vertexInit.y < edge.vertexEnd.y) { //talvez mudar para <
                initialY = Math.ceil(edge.vertexInit.y);
                endY = Math.floor(edge.vertexEnd.y);
                currentX = edge.vertexInit.x;
                currentZ = edge.vertexInit.z;
                currentIlluminationR = edge.vertexInitIllumination[0];
                currentIlluminationG = edge.vertexInitIllumination[1];
                currentIlluminationB = edge.vertexInitIllumination[2];
                lastIlluminationR = edge.vertexEndIllumination[0];
                lastIlluminationG = edge.vertexEndIllumination[1];
                lastIlluminationB = edge.vertexEndIllumination[2];

            } else {
                initialY = Math.ceil(edge.vertexEnd.y);
                endY = Math.floor(edge.vertexInit.y);
                currentX = edge.vertexEnd.x;
                currentZ = edge.vertexEnd.z;
                currentIlluminationR = edge.vertexEndIllumination[0];
                currentIlluminationG = edge.vertexEndIllumination[1];
                currentIlluminationB = edge.vertexEndIllumination[2];
                lastIlluminationR = edge.vertexInitIllumination[0];
                lastIlluminationG = edge.vertexInitIllumination[1];
                lastIlluminationB = edge.vertexInitIllumination[2];
            }
            let [rateR, rateG, rateB] = this.calcIlluminationRateRGB(edge);

            console.log("initialY: ", initialY, "endY: ", endY);
            for (let y = initialY; y <= endY; y++) {
                // console.log("y: ", y);
                intersections.get(y).push({ x: currentX, z: currentZ, rateIlluminationR: currentIlluminationR, rateIlluminationG: currentIlluminationG, rateIlluminationB: currentIlluminationB });
                // console.log("x: ", currentX, "z: ", currentZ);
                // console.log("intersections.get", intersections.get(y));
                currentX += dX;
                currentZ += dZ;
                currentIlluminationR += rateR;
                currentIlluminationG += rateG;
                currentIlluminationB += rateB;
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
            // console.log("edge: ", edge, "currentY: ", currentY);
            for (let i = 0; i < edge.length; i+=2) {
                let initialX = Math.ceil(edge[i].x);
                let endX = Math.floor(edge[i + 1].x);
                let currentZ = edge[i].z;
                let tZX = (edge[i + 1].z - edge[i].z) / (edge[i + 1].x - edge[i].x);
                console.log("currentIllumination: ", edge[i].rateIlluminationR, edge[i].rateIlluminationG, edge[i].rateIlluminationB);
                let currentIlluminationR = edge[i].rateIlluminationR;
                let currentIlluminationG = edge[i].rateIlluminationG;
                let currentIlluminationB = edge[i].rateIlluminationB;

                let rateR = (edge[i + 1].rateIlluminationR - edge[i].rateIlluminationR) / (edge[i + 1].x - edge[i].x);
                let rateG = (edge[i + 1].rateIlluminationG - edge[i].rateIlluminationG) / (edge[i + 1].x - edge[i].x);
                let rateB = (edge[i + 1].rateIlluminationB - edge[i].rateIlluminationB) / (edge[i + 1].x - edge[i].x);

                console.log("currentZ: ", currentZ);
                for (let currentX = initialX; currentX < endX; currentX++) {
                    // console.log("currentX: ", currentX, "currentZ: ", currentZ);    
                    // console.log("zBuffer[currentY][currentX]: ", zBuffer[currentY][currentX]);
                    if(zBuffer[currentY][currentX] == null) {
                        if (currentZ < zBuffer[currentY][currentX]) {
                            let auxColorR = colorR * currentIlluminationR;
                            let auxColorG = colorG * currentIlluminationG;
                            let auxColorB = colorB * currentIlluminationB;
                            let colorRGB = `rgb(${auxColorR}, ${auxColorG}, ${auxColorB})`;
                            zBuffer[currentY][currentX] = {currentZ : currentZ, color: colorRGB};
                            
                            // console.log("zBuffer[currentY][currentX]: ", zBuffer[currentY][currentX]);
                        }
                        let auxColorR = colorR * currentIlluminationR;
                        let auxColorG = colorG * currentIlluminationG;
                        let auxColorB = colorB * currentIlluminationB;
                        let colorRGB = `rgb(${auxColorR}, ${auxColorG}, ${auxColorB})`;
                        zBuffer[currentY][currentX] = {currentZ : currentZ, color: colorRGB};
                    } else {
                        if (currentZ < zBuffer[currentY][currentX].currentZ) {
                            let auxColorR = colorR * currentIlluminationR;
                            let auxColorG = colorG * currentIlluminationG;
                            let auxColorB = colorB * currentIlluminationB;
                            let colorRGB = `rgb(${auxColorR}, ${auxColorG}, ${auxColorB})`;
                            zBuffer[currentY][currentX] = {currentZ : currentZ, color: colorRGB};
                            // console.log("zBuffer[currentY][currentX]: ", zBuffer[currentY][currentX]);
                        }
                    }
                    console.log("currentIlluminationR: ", currentIlluminationR, "currentIlluminationG: ", currentIlluminationG, "currentIlluminationB: ", currentIlluminationB);
                   
                    currentZ += tZX;
                    currentIlluminationR += rateR;
                    currentIlluminationG += rateG;
                    currentIlluminationB += rateB;

                }
            }
        }

        console.log("zBuffer: ", zBuffer);
    }
    calcIlluminationRateRGB(edge) {
        let rateR = (edge.vertexEndIllumination[0] - edge.vertexInitIllumination[0])/(edge.vertexInit.y-edge.vertexEnd.y);
        let rateG = (edge.vertexEndIllumination[1] - edge.vertexInitIllumination[1])/(edge.vertexInit.y-edge.vertexEnd.y);
        let rateB = (edge.vertexEndIllumination[2] - edge.vertexInitIllumination[2])/(edge.vertexInit.y-edge.vertexEnd.y);
        return [rateR, rateB, rateG];
    }
}