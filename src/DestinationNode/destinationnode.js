import { createShaderProgram } from "../utils.js";
import { SOURCENODESTATE } from "../SourceNodes/sourcenode";
//import GraphNode from "../graphnode";
import ProcessingNode from "../ProcessingNodes/processingnode";

class DestinationNode extends ProcessingNode {
    constructor(gl, renderGraph){        
  
        let vertexShader = "\
            attribute vec2 a_position;\
            attribute vec2 a_texCoord;\
            varying vec2 v_texCoord;\
            void main() {\
                gl_Position = vec4(vec2(2.0,2.0)*a_position-vec2(1.0, 1.0), 0.0, 1.0);\
                v_texCoord = a_texCoord;\
            }";

        let fragmentShader = "\
            precision mediump float;\
            uniform sampler2D u_image;\
            varying vec2 v_texCoord;\
            varying float v_progress;\
            void main(){\
                gl_FragColor = texture2D(u_image, v_texCoord);\
            }";

        super(gl, renderGraph, {fragmentShader:fragmentShader, vertexShader:vertexShader, properties:{}, inputs:["u_image"]});

    }

    _render(){
        let gl = this._gl;        
        let _this = this;

        this.inputs.forEach(function(node){
            if (node.state !== SOURCENODESTATE.playing && node.state !== SOURCENODESTATE.paused) return;
            super._render();

            //map the input textures input the node
            var texture = node._texture;
            for(let mapping of _this._inputTextureUnitMapping ){
                gl.activeTexture(mapping.textureUnit);
                let textureLocation = gl.getUniformLocation(_this._program, mapping.name);
                gl.uniform1i(textureLocation, 0);
                gl.bindTexture(gl.TEXTURE_2D, texture);
            }

            gl.drawArrays(gl.TRIANGLES, 0, 6);
        });
    }
}

export default DestinationNode;