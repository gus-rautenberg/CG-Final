import ZBuffer from "./ZBuffer.js";

export default class ZBufferGouraud extends ZBuffer{


    render(ctx, zBuffer) {

        let colorRGB;

        
        let intersections = new Map();
        // console.log("face: ", this.face);
        // console.log("viewPort: ", this.viewPortY.min, this.viewPortY.max);
        
        for (let y = this.viewPortY.min; y < this.viewPortY.max; y++) {
            intersections.set(y, []);
        }
        
        this.face.listEdges.forEach(edge => {
            // console.log("edgeGouraud: ", edge);
            let [yMinEdge, yMaxEdge, xMinEdge, xMaxEdge] = this.findEdgeMinMax(edge);

            // let x = edge.vertexInit.x;
            // let z = edge.vertexInit.z;
            let currentIlluminationR, currentIlluminationG, currentIlluminationB;
            let lastIlluminationR, lastIlluminationG, lastIlluminationB;
            let initialY, endY, currentX, currentR, currentG, currentB, currentZ;
            // console.log("RGBColor", edge.vertexInitIllumination[0], edge.vertexInitIllumination[1], edge.vertexInitIllumination[2]);
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

            let [dX, dZ] = this.calcDAndT(edge);

            let [rateR, rateG, rateB] = this.calcIlluminationRateRGB(edge);

            // console.log("initialY: ", initialY, "endY: ", endY);
            for (let y = initialY; y <= endY; y++) {
                // console.log("y: ", y);
                if(intersections.get(y) == undefined) {
                    intersections.set(y, []);
                }
                intersections.get(y).push({ x: currentX, z: currentZ, rateIlluminationR: currentIlluminationR, rateIlluminationG: currentIlluminationG, rateIlluminationB: currentIlluminationB });
                // console.log("x: ", currentX, "z: ", currentZ);
                // console.log("intersections.get", intersections.get(y));
                currentX += dX;
                currentZ += dZ;
                currentIlluminationR += rateR;
                currentIlluminationG += rateG;
                currentIlluminationB += rateB;
            }
            // console.log("intersections(162): ", intersections.get(162));
            
        
        });

        // console.log("intersectionsAntes: ", intersections);
        intersections.forEach((sortX) => {
            const sortedX = sortX.slice().sort((a, b) => a.x - b.x);
            sortX.splice(0, sortX.length, ...sortedX);
        });


        for (let currentY = this.viewPortY.min; currentY < this.viewPortY.max; currentY++) {
            let edge = intersections.get(currentY);
            // console.log("edge: ", edge, "currentY: ", currentY);
            for (let i = 0; i < edge.length-1; i+=2) {
                let initialX = Math.ceil(edge[i].x);
                let endX = Math.floor(edge[i + 1].x);
                console.log("initialX: ", initialX, "endX: ", endX);
                let currentZ = edge[i].z;
                let tZX = (edge[i + 1].z - edge[i].z) / (edge[i + 1].x - edge[i].x);
                // console.log("currentIllumination: ", edge[i].rateIlluminationR, edge[i].rateIlluminationG, edge[i].rateIlluminationB);
                let currentIlluminationR = edge[i].rateIlluminationR;
                let currentIlluminationG = edge[i].rateIlluminationG;
                let currentIlluminationB = edge[i].rateIlluminationB;

                let rateR = (edge[i + 1].rateIlluminationR - edge[i].rateIlluminationR) / (edge[i + 1].x - edge[i].x);
                let rateG = (edge[i + 1].rateIlluminationG - edge[i].rateIlluminationG) / (edge[i + 1].x - edge[i].x);
                let rateB = (edge[i + 1].rateIlluminationB - edge[i].rateIlluminationB) / (edge[i + 1].x - edge[i].x);

                // console.log("currentZ: ", currentZ);
                for (let currentX = initialX; currentX <= endX; currentX++) {
                    // console.log("currentX: ", currentX, "currentZ: ", currentZ);    
                    // console.log("zBuffer[currentY][currentX]: ", zBuffer[currentY][currentX]);
                    if(zBuffer[currentY][currentX] == null) {
                        if (currentZ < zBuffer[currentY][currentX]) {
                            let auxColorR = currentIlluminationR;
                            let auxColorG = currentIlluminationG;
                            let auxColorB = currentIlluminationB;
                            let colorRGB = `rgb(${auxColorR}, ${auxColorG}, ${auxColorB})`;
                            zBuffer[currentY][currentX] = {currentZ : currentZ, color: colorRGB};
                            
                            // console.log("zBuffer[currentY][currentX]: ", zBuffer[currentY][currentX]);
                        }

                    } else {
                        if (currentZ < zBuffer[currentY][currentX].currentZ) {
                            let auxColorR = currentIlluminationR;
                            let auxColorG = currentIlluminationG;
                            let auxColorB = currentIlluminationB;
                            let colorRGB = `rgb(${auxColorR}, ${auxColorG}, ${auxColorB})`;
                            zBuffer[currentY][currentX] = {currentZ : currentZ, color: colorRGB};
                            // console.log("zBuffer[currentY][currentX]: ", zBuffer[currentY][currentX]);
                        }
                    }
                    // console.log("currentIlluminationR: ", currentIlluminationR, "currentIlluminationG: ", currentIlluminationG, "currentIlluminationB: ", currentIlluminationB);
                   
                    currentZ += tZX;
                    currentIlluminationR += rateR;
                    currentIlluminationG += rateG;
                    currentIlluminationB += rateB;

                }
            }
        }

        // console.log("zBuffer: ", zBuffer);
    }
    calcIlluminationRateRGB(edge) {
        let rateR = (edge.vertexEndIllumination[0] - edge.vertexInitIllumination[0])/(edge.vertexEnd.y-edge.vertexInit.y); // talvez mude a ordem dos Y, slide ta diferente
        let rateG = (edge.vertexEndIllumination[1] - edge.vertexInitIllumination[1])/(edge.vertexEnd.y-edge.vertexInit.y);
        let rateB = (edge.vertexEndIllumination[2] - edge.vertexInitIllumination[2])/(edge.vertexEnd.y-edge.vertexInit.y);
        return [rateR, rateB, rateG];
    }
}