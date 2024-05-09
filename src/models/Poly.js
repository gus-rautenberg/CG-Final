export default class Poly {
    constructor(id, list) {

        this.id = id;  
        this.vertexList = list;
    }
    drawPolygon(ctx){
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.moveTo(this.vertexList[0].x, this.vertexList[0].y);
        for (let i = 1; i < this.vertexList.length; i++) {
            
            ctx.lineTo(this.vertexList[i].x, this.vertexList[i].y);
        }
        ctx.lineTo(this.vertexList[0].x, this.vertexList[0].y);
        ctx.closePath();
        ctx.stroke();
    }


}