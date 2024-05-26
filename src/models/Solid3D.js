import Poly  from "./Poly.js";
import Vertex from "./Vertex.js";
import { getMJP, getInvertedMJP } from "./Scene.js";
import { getParallelMatrix, getPerspectiveMatrix } from "./ProjectionMatrix.js";
import { multiplyMatrices, matrixMultiplicationPoints } from "./Matrix.js";
import Camera, { normalizarVetor, produtoEscalar } from "./Camera.js";
import Edge from "./Edge.js";
import Face from "./Face.js";
import Pintor from "./Pintor.js";
import ZBuffer from "./ZBuffer.js";

export default class Solid {
    facesList = [];
    visibleFaceList = [];
    constructor(id, list) {

        this.id = id;  
        this.sliceList = list;
    }

    calcWireframe(fatias, axis, ctx, sruWidth, sruHeight, canvasWidth, canvasHeight) {
        let tempFacesList = [];
        let degree = 360/fatias;
        let rad = degree*(Math.PI/180);
        // console.log("rad: ", rad);
        let incrementRad = rad;
        let radX, radY, radZ;
        // this.sliceList[0].invertVertex(canvasHeight);
        
        let tempSliceList = this.sliceList;
        for (let i = 1; i < fatias; i++) {
            if (axis === 'x') {
                radX = rad;
                radY = 0;
                radZ = 0;
            } else if (axis === 'y') {
                radX = 0;
                radY = rad;
                radZ = 0;
            } else if (axis === 'z') {
                radX = 0;
                radY = 0;
                radZ = rad;
            }
            tempSliceList.push(new Poly(this.sliceList[0].id, this.sliceList[0].vertexList.map(v => new Vertex(v.x, v.y, 0))));
            tempSliceList[i].rotatePolygon(radX, radY, radZ, axis);
            rad += incrementRad;
            
        }
        for (let i = 0; i < fatias; i++) {
            let index = i;
            if(i == fatias-1) {
                index = 0;
            } 
            for(let j = 0; j < tempSliceList[index].vertexList.length; j++){
                const currentFaceEdges = [];
                let edgeSlice1;
                let edgeToSlice2;
                let edgeSlice2;
                let edgeToSlice1;
                if(j == tempSliceList[index].vertexList.length - 1){
                    if(i == fatias-1) {
                        edgeSlice1 = new Edge(tempSliceList[i].vertexList[j], tempSliceList[i].vertexList[0], "edgeSlice1 " + i);
                        edgeToSlice2 = new Edge(tempSliceList[i].vertexList[0], tempSliceList[index].vertexList[0], 'edgeToSlice2 ' + i);
                        edgeSlice2 = new Edge(tempSliceList[index].vertexList[0], tempSliceList[index].vertexList[j], 'edgeSlice2 ' + i);
                        edgeToSlice1 = new Edge(tempSliceList[index].vertexList[j], tempSliceList[i].vertexList[j], 'edgeToSlice1 ' + i);
                    } else {
                        edgeSlice1 = new Edge(tempSliceList[i].vertexList[j], tempSliceList[i].vertexList[0], "edgeSlice1 " + i);
                        edgeToSlice2 = new Edge(tempSliceList[i].vertexList[0], tempSliceList[i+1].vertexList[0], 'edgeToSlice2 ' + i);
                        edgeSlice2 = new Edge(tempSliceList[i+1].vertexList[0], tempSliceList[i+1].vertexList[j], 'edgeSlice2 ' + i);
                        edgeToSlice1 = new Edge(tempSliceList[i+1].vertexList[j], tempSliceList[i].vertexList[j], 'edgeToSlice1 ' + i);
                    }


                } else {  

                    if(i == fatias-1) {
                        edgeSlice1 = new Edge(tempSliceList[i].vertexList[j], tempSliceList[i].vertexList[j+1], 'edgeSlice1 ' + i);
                        edgeToSlice2 = new Edge(tempSliceList[i].vertexList[j+1], tempSliceList[index].vertexList[j+1], 'edgeToSlice2 ' + i);
                        edgeSlice2 = new Edge(tempSliceList[index].vertexList[j+1], tempSliceList[index].vertexList[j], 'edgeSlice2 ' + i);
                        edgeToSlice1 = new Edge(tempSliceList[index].vertexList[j], tempSliceList[i].vertexList[j], 'edgeToSlice1 ' + i);
                    } else {
                        edgeSlice1 = new Edge(tempSliceList[i].vertexList[j], tempSliceList[i].vertexList[j+1], 'edgeSlice1 ' + i);
                        edgeToSlice2 = new Edge(tempSliceList[i].vertexList[j+1], tempSliceList[i+1].vertexList[j+1], 'edgeToSlice2 ' + i);
                        edgeSlice2 = new Edge(tempSliceList[i+1].vertexList[j+1], tempSliceList[i+1].vertexList[j], 'edgeSlice2 ' + i);
                        edgeToSlice1 = new Edge(tempSliceList[i+1].vertexList[j], tempSliceList[i].vertexList[j], 'edgeToSlice1 ' + i);
                    }

                }

                currentFaceEdges.push(edgeSlice1);
                currentFaceEdges.push(edgeToSlice2);
                currentFaceEdges.push(edgeSlice2);
                currentFaceEdges.push(edgeToSlice1);
                const face = new Face(currentFaceEdges);
                tempFacesList.push(face);
                
            }


        }

        let sruX = {
            min: -sruWidth,
            max: sruWidth
        }
        let sruY = {
            min: -sruHeight,
            max: sruHeight
        }

        let windowX = {
            min: 0,
            max: canvasWidth
        }
        let windowY = {
            min: 0,
            max: canvasHeight
        }
        // let camera = new Camera([120, 120, 120], [1, 100, 5]);  // paralelo frontal
        let camera = new Camera([25, 15, 80], [20, 10, 25]);
        
        // let mjpMatrix = getMJP(sruX, sruY, windowX, windowY);
        let mjpMatrix = getInvertedMJP(sruX, sruY, windowX, windowY);

        console.log("mjpMatrix: ", mjpMatrix);

        let projectionMatrix = getPerspectiveMatrix(camera, 80);
        // let projectionMatrix = getParallelMatrix();
        console.log("projectionMatrix: ", projectionMatrix);

        let srcMatrix = camera.getSRCMatrix();
        console.log("srcMatrix: ", srcMatrix);

        let auxMatrix = multiplyMatrices(mjpMatrix, projectionMatrix);
        // console.log("auxMatrix: ", auxMatrix);

        let matrixSRU_SRT = multiplyMatrices(auxMatrix, srcMatrix);
        console.log("matrixSRU_SRT: ", matrixSRU_SRT);

        let auxSliceList = tempSliceList;
        // console.log("size: ", tempSliceList[0].vertexList.length)
        // console.log("size templist: ", auxSliceList.length)

        // console.log("temp[4]: ", tempSliceList[4].vertexList)
        
        for(let i = 0; i < tempSliceList.length; i++){
            for(let j = 0; j < tempSliceList[i].vertexList.length; j++){
                tempSliceList[i].vertexList[j].x = tempSliceList[i].vertexList[j].x.toFixed(3);
                tempSliceList[i].vertexList[j].y = tempSliceList[i].vertexList[j].y.toFixed(3);
                tempSliceList[i].vertexList[j].z = tempSliceList[i].vertexList[j].z.toFixed(3);
                let x = tempSliceList[i].vertexList[j].x;
                let y = tempSliceList[i].vertexList[j].y;
                let z = tempSliceList[i].vertexList[j].z;

                let auxPoints = [[x], 
                                 [y], 
                                 [z], 
                                 [1]];
                // console.log("matrixSRU_SRT: ", matrixSRU_SRT);
                // console.log("auxPoints: ", auxPoints);
                
                let resultMatrix = multiplyMatrices(matrixSRU_SRT, auxPoints);
                // console.log("resultMatrix: ", resultMatrix);

                auxSliceList[i].vertexList[j].x = resultMatrix[0]/resultMatrix[3];
                auxSliceList[i].vertexList[j].y = resultMatrix[1]/resultMatrix[3];
                auxSliceList[i].vertexList[j].z = resultMatrix[2][0];
                
            }
        }
        this.sliceList = auxSliceList;
        console.log("sliceList: ", this.sliceList);

        let teste1 = this.sliceList[0].vertexList[0+1];
        console.log("teste1: ", teste1);
        for (let i = 0; i < fatias; i++) {
            let index = i;
            // this.sliceList[index].drawPolygon(ctx);
            if(i == fatias-1) {
                index = 0;
            } 
            for(let j = 0; j < this.sliceList[index].vertexList.length; j++){
                const currentFaceEdges = [];
                let edgeSlice1;
                let edgeToSlice2;
                let edgeSlice2;
                let edgeToSlice1;
                if(j == this.sliceList[index].vertexList.length - 1){
                    if(i == fatias-1) {
                        edgeSlice1 = new Edge(this.sliceList[i].vertexList[j], this.sliceList[i].vertexList[0], "edgeSlice1 " + i);
                        edgeToSlice2 = new Edge(this.sliceList[i].vertexList[0], this.sliceList[index].vertexList[0], 'edgeToSlice2 ' + i);
                        edgeSlice2 = new Edge(this.sliceList[index].vertexList[0], this.sliceList[index].vertexList[j], 'edgeSlice2 ' + i);
                        edgeToSlice1 = new Edge(this.sliceList[index].vertexList[j], this.sliceList[i].vertexList[j], 'edgeToSlice1 ' + i);
                    } else {
                        edgeSlice1 = new Edge(this.sliceList[i].vertexList[j], this.sliceList[i].vertexList[0], "edgeSlice1 " + i);
                        edgeToSlice2 = new Edge(this.sliceList[i].vertexList[0], this.sliceList[i+1].vertexList[0], 'edgeToSlice2 ' + i);
                        edgeSlice2 = new Edge(this.sliceList[i+1].vertexList[0], this.sliceList[i+1].vertexList[j], 'edgeSlice2 ' + i);
                        edgeToSlice1 = new Edge(this.sliceList[i+1].vertexList[j], this.sliceList[i].vertexList[j], 'edgeToSlice1 ' + i);
                    }


                } else {  

                    if(i == fatias-1) {
                        edgeSlice1 = new Edge(this.sliceList[i].vertexList[j], this.sliceList[i].vertexList[j+1], 'edgeSlice1 ' + i);
                        edgeToSlice2 = new Edge(this.sliceList[i].vertexList[j+1], this.sliceList[index].vertexList[j+1], 'edgeToSlice2 ' + i);
                        edgeSlice2 = new Edge(this.sliceList[index].vertexList[j+1], this.sliceList[index].vertexList[j], 'edgeSlice2 ' + i);
                        edgeToSlice1 = new Edge(this.sliceList[index].vertexList[j], this.sliceList[i].vertexList[j], 'edgeToSlice1 ' + i);
                    } else {
                        edgeSlice1 = new Edge(this.sliceList[i].vertexList[j], this.sliceList[i].vertexList[j+1], 'edgeSlice1 ' + i);
                        edgeToSlice2 = new Edge(this.sliceList[i].vertexList[j+1], this.sliceList[i+1].vertexList[j+1], 'edgeToSlice2 ' + i);
                        edgeSlice2 = new Edge(this.sliceList[i+1].vertexList[j+1], this.sliceList[i+1].vertexList[j], 'edgeSlice2 ' + i);
                        edgeToSlice1 = new Edge(this.sliceList[i+1].vertexList[j], this.sliceList[i].vertexList[j], 'edgeToSlice1 ' + i);
                    }

                }

                currentFaceEdges.push(edgeSlice1);
                currentFaceEdges.push(edgeToSlice2);
                currentFaceEdges.push(edgeSlice2);
                currentFaceEdges.push(edgeToSlice1);
                const face = new Face(currentFaceEdges);
                this.facesList.push(face);
                
            }

            console.log("drawWireframe: ", this.sliceList[0].vertexList[1].x, this.sliceList[0].vertexList[1].y, this.sliceList[1].vertexList[1].x, this.sliceList[1].vertexList[1].y);
            // if(this.testeVisibilidade(tempFacesList[i], camera.getVRP()) > 0){
                
                //     if (i < fatias - 1) {
                    //         this.drawWireframe2(ctx, this.sliceList[i], this.sliceList[i + 1], i); 
                    
                    //     } else {
                        //         this.drawWireframe2(ctx, this.sliceList[i], this.sliceList[0], 1); // Fecha o polígono
                        //     }
                        // }
                        
        }
        let count = 0;

            // let result = this.testeVisibilidade(tempFacesList[i], camera.getVRP(), ctx, i);
        this.drawVisibleFaces(ctx, camera, count);
        for(let i = 0; i < this.visibleFaceList.length; i++){
            let zBuffer = new ZBuffer(windowX, windowY, this.visibleFaceList[i]);
            zBuffer.render(ctx);

            console.log("zbuffer " + i + ": ", zBuffer.getFace());
        }

        
        // console.log(this.facesList);
        let pintor = new Pintor();
        for(let i = 0; i < this.facesList.length; i++){
            // console.log("Centroiude: ", this.facesList[i].centroide);
            pintor.getDistance(this.facesList[i], camera.getVRP());
            // console.log("Dist: ", pintor.distance);
        }
        for(let i = 0; i < tempFacesList.length; i++){
            // console.log(i + " Visibilidade: ", this.testeVisibilidade(tempFacesList[i], camera.getVRP()));
        }
    }

    testeVisibilidade(face, vrp, ctx, index) {
        const x = vrp[0] - face.centroide[0] / Math.pow(vrp[0] - face.centroide[0], 2);
        const y = vrp[1] - face.centroide[1] / Math.pow(vrp[1] - face.centroide[1], 2);
        const z = vrp[2] - face.centroide[2] / Math.pow(vrp[2] - face.centroide[2], 2);
        const O = [x, y, z];
        const oNormalized = normalizarVetor(O)
        // console.log("o: ", O);
        // console.log("normal: ", face.getNormal());

        const result = produtoEscalar(oNormalized, face.getNormal());
        if(result > 0){
            this.drawFaces(ctx, index);
        }
        return result;
    }
        
    drawFaces(ctx) {
        if (!ctx) {
            console.error("Canvas context (ctx) is undefined");
            return;
        }
    
        if (this.facesList.length === 0) {
            console.warn("No faces to draw");
            return;
        }
    
        this.facesList.forEach(face => {
            if (face.listEdges.length < 3) {
                console.warn("Face has less than 3 edges");
                return;
            }
    
            ctx.beginPath();
            ctx.strokeStyle = this.getRandomColor();
            ctx.moveTo(face.listEdges[0].vertexInit.x, face.listEdges[0].vertexInit.y);
            face.listEdges.forEach(edge => {
                ctx.lineTo(edge.vertexEnd.x, edge.vertexEnd.y);
            });
            ctx.closePath();
            ctx.stroke();
        });
    }



    drawVisibleFaces(ctx, camera, count) {
        if (!ctx) {
            console.error("Canvas context (ctx) is undefined");
            return;
        }
    
        if (this.facesList.length === 0) {
            console.warn("No faces to draw");
            return;
        }
        
        for(let i = 0; i < this.facesList.length; i++){
            const visibility = this.testeVisibilidade(this.facesList[i], camera.getVRP());
            if (visibility > 0) {
                this.visibleFaceList.push(this.facesList[i]);
                count++;
                console.log("count: ", count, "face: ", this.facesList[i].centroide);
                // Desenha a face apenas se for visível
                ctx.beginPath();
                ctx.strokeStyle = this.getRandomColor();

                ctx.moveTo(this.facesList[i].listEdges[0].vertexInit.x, this.facesList[i].listEdges[0].vertexInit.y);
                this.facesList[i].listEdges.forEach(edge => {
                    ctx.lineTo(edge.vertexEnd.x, edge.vertexEnd.y);
                });
                ctx.closePath();
                ctx.stroke();
            }
        }
    }


    // drawWireframe2(ctx, poly1, poly2, index){

    //     ctx.lineWidth = 2;
    //     ctx.beginPath();
    //     edgeSlice1 = new Edge(this.sliceList[i].vertexList[j], this.sliceList[i].vertexList[j+1], 'edgeSlice1 ' + i);
    //     edgeToSlice2 = new Edge(this.sliceList[i].vertexList[j+1], this.sliceList[index].vertexList[j+1], 'edgeToSlice2 ' + i);
    //     edgeSlice2 = new Edge(this.sliceList[index].vertexList[j+1], this.sliceList[index].vertexList[j], 'edgeSlice2 ' + i);
    //     edgeToSlice1 = new Edge(this.sliceList[index].vertexList[j], this.sliceList[i].vertexList[j], 'edgeToSlice1 ' + i);
    //     for(let i = 0; i < poly1.vertexList.length; i++){
    //         ctx.strokeStyle = this.getRandomColor();
    //         if(i == poly1.vertexList.length - 1){
    //             ctx.moveTo(poly1.vertexList[i].x, poly1.vertexList[i].y);
    //             ctx.lineTo(poly1.vertexList[0].x, poly2.vertexList[0].y);
    //             ctx.lineTo(poly2.vertexList[0].x, poly1.vertexList[0].y);
    //             ctx.lineTo(poly2.vertexList[i].x, poly2.vertexList[i].y);
    //             ctx.lineTo(poly1.vertexList[i].x, poly1.vertexList[i].y);
    //         } else {
    //             ctx.moveTo(poly1.vertexList[i].x, poly1.vertexList[i].y);
    //             ctx.lineTo(poly1.vertexList[i+1].x, poly2.vertexList[i+1].y);
    //             ctx.lineTo(poly2.vertexList[i+1].x, poly1.vertexList[i+1].y);
    //             ctx.lineTo(poly2.vertexList[i].x, poly2.vertexList[i].y);
    //             ctx.lineTo(poly1.vertexList[i].x, poly1.vertexList[i].y);
    //         }
    //         ctx.stroke();
    //         ctx.closePath();

            
    //     }    
    // }

    drawWireframe(ctx, poly1, poly2, index){
        ctx.lineWidth = 2;
        // poly1.drawPolygon(ctx);
        for (let i = 0; i < poly1.vertexList.length; i++) {
            // Gera uma cor aleatória para cada linha
            ctx.strokeStyle = this.getRandomColor();
            
            ctx.beginPath();    
            ctx.moveTo(poly1.vertexList[i].x, poly1.vertexList[i].y);
            ctx.lineTo(poly2.vertexList[i].x, poly2.vertexList[i].y);
            // console.log("drawWireframe: ", poly1.vertexList[i].x, poly1.vertexList[i].y, poly2.vertexList[i].x, poly2.vertexList[i].y);
            ctx.stroke();
            ctx.closePath();
        }
        
    }

    getRandomColor() {
        // Gera uma cor aleatória no formato hexadecimal
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    
}

    // projectAndDraw(ctx, poly, canvasWidth, canvasHeight) {
    //     let width = canvasWidth;
    //     let height = canvasHeight;
    //     console.log("width, height: ", width, height);
    //     let PERSPECTIVE = width * 1000; // The field of view of our 3D scene
    //     let PROJECTION_CENTER_X = width / 2; // x center of the canvas
    //     let PROJECTION_CENTER_Y = height / 2;
    //     for(let i = 0; i < poly.vertexList.length; i++) {
    //         ctx.globalAlpha = Math.abs(1 - poly.vertexList[i].z / width);

    //         // The scaleProjected will store the scale of the element based on its distance from the 'camera'
    //         let scaleProjected = PERSPECTIVE / (PERSPECTIVE + poly.vertexList[i].z);
    //         console.log("scaleProjected: ", scaleProjected);
    //         // The xProjected is the x position on the 2D world
    //         let xProjected = (poly.vertexList[i].x * scaleProjected); 
    //         console.log("xProjected: ", xProjected);
    //         // The yProjected is the y position on the 2D world
    //         let yProjected = (poly.vertexList[i].y * scaleProjected);
    //         console.log("yProjected: ", yProjected);
    //         ctx.fillRect(xProjected - 3, yProjected - 3, 3 * 2 * scaleProjected, 3 * 2 * scaleProjected);
    //     }
    //   }