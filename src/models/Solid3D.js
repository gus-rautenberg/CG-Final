import Poly  from "./Poly.js";
import Vertex from "./Vertex.js";
import { getMJP, getInvertedMJP } from "./Scene.js";
import { getParallelMatrix, getPerspectiveMatrix } from "./ProjectionMatrix.js";
import { multiplyMatrices, matrixMultiplicationPoints } from "./Matrix.js";
import Camera from "./Camera.js";
import Edge from "./Edge.js";
import Face from "./Face.js";

export default class Solid {
    facesList = [];
    constructor(id, list) {

        this.id = id;  
        this.sliceList = list;
    }

    calcWireframe(fatias, axis, ctx, sruWidth, sruHeight, canvasWidth, canvasHeight) {
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
        // let edgeSlice11 = new Edge(this.sliceList[0].vertexList[1], this.sliceList[0].vertexList[1+1], 'edgeSlice1 ' );
        // let edgeToSlice22 = new Edge(this.sliceList[0].vertexList[1+1], this.sliceList[0+1].vertexList[1+1], 'edgeToSlice2 ' );
        // let edgeSlice22 = new Edge(this.sliceList[0+1].vertexList[1+1], this.sliceList[0+1].vertexList[1], 'edgeSlice2 ' );
        // let edgeToSlice11 = new Edge(this.sliceList[0+1].vertexList[1], this.sliceList[0].vertexList[1], 'edgeToSlice1 ' );
        // console.log("edges: ", edgeSlice11, edgeToSlice22, edgeSlice22, edgeToSlice11);
        let teste1 = this.sliceList[0].vertexList[0+1];
        console.log("teste1: ", teste1);
        for (let i = 0; i < fatias; i++) {
            let index = i;
            this.sliceList[index].drawPolygon(ctx);
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
                    edgeSlice1 = new Edge(this.sliceList[i].vertexList[j], this.sliceList[i].vertexList[0], "edgeSlice1 " + i);
                    edgeToSlice2 = new Edge(this.sliceList[i].vertexList[0], this.sliceList[index].vertexList[0], 'edgeToSlice2 ' + i);
                    edgeSlice2 = new Edge(this.sliceList[index].vertexList[0], this.sliceList[index].vertexList[j], 'edgeSlice2 ' + i);
                    edgeToSlice1 = new Edge(this.sliceList[index].vertexList[j], this.sliceList[i].vertexList[j], 'edgeToSlice1 ' + i);

                } else {  
                    edgeSlice1 = new Edge(this.sliceList[i].vertexList[j], this.sliceList[i].vertexList[j+1], 'edgeSlice1 ' + i);
                    edgeToSlice2 = new Edge(this.sliceList[i].vertexList[j+1], this.sliceList[index].vertexList[j+1], 'edgeToSlice2 ' + i);
                    edgeSlice2 = new Edge(this.sliceList[index].vertexList[j+1], this.sliceList[index].vertexList[j], 'edgeSlice2 ' + i);
                    edgeToSlice1 = new Edge(this.sliceList[index].vertexList[j], this.sliceList[i].vertexList[j], 'edgeToSlice1 ' + i);
                }

                currentFaceEdges.push(edgeSlice1);
                currentFaceEdges.push(edgeToSlice2);
                currentFaceEdges.push(edgeSlice2);
                currentFaceEdges.push(edgeToSlice1);
                const face = new Face(currentFaceEdges);
                this.facesList.push(face);
                
            }

            console.log("drawWireframe: ", this.sliceList[0].vertexList[1].x, this.sliceList[0].vertexList[1].y, this.sliceList[1].vertexList[1].x, this.sliceList[1].vertexList[1].y);

            if (i < fatias - 1) {
                this.drawWireframe(ctx, this.sliceList[i], this.sliceList[i + 1], i); 
                
            } else {
                this.drawWireframe(ctx, this.sliceList[i], this.sliceList[0], 1); // Fecha o polígono
            }


        }



        // for (let i = 0; i < fatias; i++) {
        //     console.log("auxSliceList: ", this.sliceList[i].vertexList);
        //     this.sliceList[i].drawPolygon(ctx);
        //     const currentFaceEdges = [];
        //     if (i < fatias - 1) {
        //         this.drawWireframe(ctx, this.sliceList[i], this.sliceList[i + 1], i); 
                
        //     } else {
        //         this.drawWireframe(ctx, this.sliceList[i], this.sliceList[0], 1); // Fecha o polígono
        //     }
            
        //     const face = new Face();
        //     this.facesList.push(face);
        // }
        
        console.log(this.facesList);

        // for (let i = 0; i < faces; i++) {
        //     // this.drawWireframe(ctx, this.sliceList[i], this.sliceList[i + 1], canvasWidth, canvasHeight);]
        //     // console.log("teste: ", tempSliceList[i].vertexList);
        //     // console.log("teste: ", auxSliceList[i].vertexList);

        //     // this.projectAndDraw(ctx, tempSliceList[i], canvasWidth, canvasHeight);
        //     // tempSliceList[i].drawPolygon(ctx);
        //     // tempSliceList[]
        //     auxSliceList[i].drawPolygon(ctx);
        //     this.drawWireframe(ctx, auxSliceList[i], auxSliceList[i + 1]);  
        //     // tempSliceList[i].drawPolygon(ctx);           

        // }
        // ctx.strokeStyle = this.getRandomColor();
        // ctx.beginPath();
        // ctx.moveTo(auxSliceList.vertexList[auxSliceList.vertexList.length - 1].x, auxSliceList.vertexList[auxSliceList.vertexList.length - 1].y);
        // ctx.lineTo(auxSliceList.vertexList[0].x, auxSliceList.vertexList[0].y);
        // ctx.stroke();
        // ctx.closePath();
    
        // ctx.strokeStyle = this.getRandomColor();
        // ctx.beginPath();
        // ctx.moveTo(auxSliceList.vertexList[auxSliceList.vertexList.length - 1].x, auxSliceList.vertexList[auxSliceList.vertexList.length - 1].y);
        // ctx.lineTo(auxSliceList.vertexList[0].x, auxSliceList.vertexList[0].y);
        // ctx.stroke();
        // ctx.closePath();

        // this.sliceList = auxSliceList;
        // for(let i = 0; i < this.sliceList.length; i++){
        //     console.log(this.sliceList[i]);

        // }

    }

    
    drawWireframe(ctx, poly1, poly2, index){
        ctx.lineWidth = 2;
        
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