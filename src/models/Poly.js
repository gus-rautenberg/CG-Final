export default class Poly {
    constructor(id, list) {

        this.id = id;  
        this.vertexList = list;
    }
    drawPolygon(ctx){
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.moveTo(this.vertexList[0].x, this.vertexList[0].y);
        ctx.arc(this.vertexList[0].x, this.vertexList[0].y, 2, 0, 2 * Math.PI);

        for (let i = 1; i < this.vertexList.length; i++) {
            // ctx.arc(this.vertexList[i].x, this.vertexList[i].y, 2, 0, 2 * Math.PI);
            console.log(this.vertexList[i].x, this.vertexList[i].y);
            ctx.lineTo(this.vertexList[i].x, this.vertexList[i].y);
            ctx.arc(this.vertexList[i].x, this.vertexList[i].y, 2, 0, 2 * Math.PI);

        }
        ctx.lineTo(this.vertexList[0].x, this.vertexList[0].y);
        ctx.closePath();
        ctx.stroke();
    }

    rotatePolygon (x, y, z, axis){	
        for(let i = 0; i < this.vertexList.length; i++){
            this.vertexList[i].rotateVertex(x, y, z, axis);

        }
    }

    // invertVertex(yMax){

    //     for(let i = 0; i < this.vertexList.length; i++){
    //         this.vertexList[i].invertVertexY(yMax);
    //     }
    // }   


}