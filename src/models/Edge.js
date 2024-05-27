export default class Edge {
    vertexInit = [];
    vertexInitIllumination = [];
    vertexEnd = [];
    vertexEndIllumination = [];
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

}