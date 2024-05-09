import Poly from "./Poly.js";
export default class Solid {
    constructor(id, list) {

        this.id = id;  
        this.polysList = list;
    }

    calcWireframe(faces, axis, ctx){
        let degree = 360/faces;
        let rad = degree*Math.PI/180;
        let incrementRad = rad;
        let radX, radY, radZ;
        let tempPolysList = [this.polysList[0]];
        for (let i = 1; i < faces; i++) {
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
            tempPolysList.push(new Poly(this.vertexList, radX, radY, radZ));
            // if (axis === 'x') {
            //     let newPoly = new Poly(this.id, this.polysList[i].vertexList.slice());
            //     newPoly.vertexList.forEach(element => {
            //         element.rotateX(radX);
            //     });  
                    
            // } else if (axis === 'y') {
            //     tempPolysList[i].rotateY(radY);
            // } else if (axis === 'z') {
            //     tempPolysList[i].rotateZ(radZ);
            // }
            // rad += incrementRad;
            
        }
        for (let i = 0; i < faces - 1; i++) {
            drawWireframe(ctx,tempPolysList[i], tempPolysList[i+1]);

        }
        this.polysList = tempPolysList;
    }

    drawWireframe(ctx, poly1, poly2){
        ctx.beginPath();
        ctx.lineWidth = 2;
        
        
        for (let i = 0; i < poly1.vertexList.length; i++) {
            
            this.drawWireframeX(ctx, poly1.vertexList[i], poly2.vertexList[i]);
        }
        ctx.closePath();
        ctx.stroke();
    }

}