import Poly  from "./Poly.js";
import Vertex from "./Vertex.js";
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
        let tempPolysList = this.polysList;
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

            tempPolysList.push(new Poly(this.polysList[0].id, this.polysList[0].vertexList.map(v => new Vertex(v.x, v.y, 0))));
            tempPolysList[i].rotatePolygon(radX, radY, radZ, axis);
            rad += incrementRad;
            
        }
        for (let i = 0; i < faces - 1; i++) {
            drawWireframe(ctx, tempPolysList[i], tempPolysList[i+1]);

        }
        this.polysList = tempPolysList;
        for(let i = 0; i < this.polysList.length; i++){
            console.log(this.polysList[i]);

        }

    }

    drawWireframe(ctx, poly1, poly2){
        ctx.beginPath();
        ctx.lineWidth = 2;
         
        for (let i = 0; i < poly1.vertexList.length; i++) {
            
            poly1.drawWireframeX(ctx, poly1.vertexList[i], poly2.vertexList[i]);
        }
        ctx.closePath();
        ctx.stroke();
    }

}