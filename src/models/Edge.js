export default class Edge {
    vertexInit = [];
    vertexInitIllumination = [];
    vertexEnd = [];
    vertexEndIllumination = [];
    edgeInitNormalizedVector = [];
    edgeEndNormalizedVector = [];
    edgeID = null;
    constructor(vertexInit, vertexEnd, edgeID) {
        this.vertexInit = vertexInit;
        this.vertexEnd = vertexEnd;
        this.edgeID = edgeID;
    }

    setInitIlumination(initialIlumination) {
        this.vertexInitIllumination = initialIlumination;
    }
    setEndIlumination(endIlumination) {
        this.vertexEndIllumination = endIlumination;
    }  
    setNormalizedVertexVector(vector1, vector2) {
        this.edgeInitNormalizedVector = vector1;
        this.edgeEndNormalizedVector = vector2;  
    }

}