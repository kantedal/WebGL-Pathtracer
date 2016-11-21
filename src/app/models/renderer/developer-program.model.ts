import { createProgram } from "./gl-helper";
import {BVH} from "../bvh/bvh.model";
import {BVHNode} from "../bvh/bvh-node.model";
import {Scene} from "../scene.model";

export class DeveloperProgram {
  private _gl: WebGLRenderingContext;
  private _program: any;
  private _verticeCount: number;
  private _mvLocation: WebGLUniformLocation;
  private _mvMatrix: any;

  constructor(gl: WebGLRenderingContext) {
    this._gl = gl;

    var vertices = [
      -0.7,-0.5,0,
      -0.7,0.5,0,
      -0.3,-0.3,0,
      0.2,0.6,0,
      0.3,-0.3,0,
      0.7,0.6,0
    ];
    this._verticeCount = 6;

    // Create an empty buffer object
    var vertex_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    /*=================== Shaders ====================*/
    var vertCode =
      'attribute vec3 coordinates;' +
      'uniform mat4 uMVMatrix;' +
      'void main(void) {' +
      ' gl_Position = uMVMatrix * vec4(coordinates, 1.0);' +
      '}';

    // Create a vertex shader object
    var vertShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertShader, vertCode);
    gl.compileShader(vertShader);

    // Fragment shader source code
    var fragCode =
      'void main(void) {' +
      'gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);' +
      '}';

    // Create fragment shader object
    var fragShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragShader, fragCode);
    gl.compileShader(fragShader);

    this._program = gl.createProgram();

    gl.attachShader(this._program, vertShader);
    gl.attachShader(this._program, fragShader);
    gl.linkProgram(this._program);
    gl.useProgram(this._program);

    /*======= Associating shaders to buffer objects ======*/

    // Bind vertex buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);

    this._mvMatrix = [];
    mat4.identity(this._mvMatrix);
    mat4.perspective(this._mvMatrix, 45, 1.0, 0.1, 100);
    mat4.translate(this._mvMatrix, this._mvMatrix, [0, 0, -1.5]);
    mat4.rotate(this._mvMatrix, this._mvMatrix, 0.3, [1,0,0]);

    this._mvLocation = this._gl.getUniformLocation(this._program, 'uMVMatrix');

    // Get the attribute location
    var coord = gl.getAttribLocation(this._program, "coordinates");
    gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(coord);
  }

  public setBVH(bvh: BVH) {
    let vertices = [];
    this._verticeCount = 0;

    this.recurseBBoxes(bvh.root, vertices);

    this._gl.useProgram(this._program);

    var vertex_buffer = this._gl.createBuffer();
    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, vertex_buffer);
    this._gl.bufferData(this._gl.ARRAY_BUFFER, new Float32Array(vertices), this._gl.STATIC_DRAW);
    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, vertex_buffer);

    var coord = this._gl.getAttribLocation(this._program, "coordinates");
    this._gl.vertexAttribPointer(coord, 3, this._gl.FLOAT, false, 0, 0);
    this._gl.enableVertexAttribArray(coord);
  }

  public addBoundingBox(bottom: GLM.IArray, top: GLM.IArray, vertices: Array<number>) {
    let factor = 10;
    vertices.push(bottom[0] / factor);
    vertices.push(bottom[1] / factor);
    vertices.push(bottom[2] / factor);
    vertices.push(top[0] / factor);
    vertices.push(bottom[1] / factor);
    vertices.push(bottom[2] / factor);

    // Line 2
    vertices.push(bottom[0] / factor);
    vertices.push(bottom[1] / factor);
    vertices.push(bottom[2] / factor);
    vertices.push(bottom[0] / factor);
    vertices.push(top[1] / factor);
    vertices.push(bottom[2] / factor);

    // Line 3
    vertices.push(bottom[0] / factor);
    vertices.push(bottom[1] / factor);
    vertices.push(bottom[2] / factor);
    vertices.push(bottom[0] / factor);
    vertices.push(bottom[1] / factor);
    vertices.push(top[2] / factor);

    // Line 4
    vertices.push(top[0] / factor);
    vertices.push(top[1] / factor);
    vertices.push(top[2] / factor);
    vertices.push(bottom[0] / factor);
    vertices.push(top[1] / factor);
    vertices.push(top[2] / factor);

    // Line 5
    vertices.push(top[0] / factor);
    vertices.push(top[1] / factor);
    vertices.push(top[2] / factor);
    vertices.push(top[0] / factor);
    vertices.push(bottom[1] / factor);
    vertices.push(top[2] / factor);

    // Line 6
    vertices.push(top[0] / factor);
    vertices.push(top[1] / factor);
    vertices.push(top[2] / factor);
    vertices.push(top[0] / factor);
    vertices.push(top[1] / factor);
    vertices.push(bottom[2] / factor);

    // Line 7
    vertices.push(bottom[0] / factor);
    vertices.push(bottom[1] / factor);
    vertices.push(top[2] / factor);
    vertices.push(top[0] / factor);
    vertices.push(bottom[1] / factor);
    vertices.push(top[2] / factor);

    // Line 8
    vertices.push(bottom[0] / factor);
    vertices.push(bottom[1] / factor);
    vertices.push(top[2] / factor);
    vertices.push(bottom[0] / factor);
    vertices.push(top[1] / factor);
    vertices.push(top[2] / factor);

    // Line 9
    vertices.push(bottom[0] / factor);
    vertices.push(top[1] / factor);
    vertices.push(bottom[2] / factor);
    vertices.push(top[0] / factor);
    vertices.push(top[1] / factor);
    vertices.push(bottom[2] / factor);

    // Line 10
    vertices.push(bottom[0] / factor);
    vertices.push(top[1] / factor);
    vertices.push(bottom[2] / factor);
    vertices.push(bottom[0] / factor);
    vertices.push(top[1] / factor);
    vertices.push(top[2] / factor);

    // Line 11
    vertices.push(top[0] / factor);
    vertices.push(bottom[1] / factor);
    vertices.push(bottom[2] / factor);
    vertices.push(top[0] / factor);
    vertices.push(bottom[1] / factor);
    vertices.push(top[2] / factor);

    // Line 12
    vertices.push(top[0] / factor);
    vertices.push(bottom[1] / factor);
    vertices.push(bottom[2] / factor);
    vertices.push(top[0] / factor);
    vertices.push(top[1] / factor);
    vertices.push(bottom[2] / factor);

    this._verticeCount += 24;
  }

  private recurseBBoxes(node: any, vertices: Array<number>) {
    this.addBoundingBox(node.bottom, node.top, vertices);
    if(!node.isLeaf()) {
      this.recurseBBoxes(node.left, vertices);
      this.recurseBBoxes(node.right, vertices);
    }
  }

  public buildBVHLines(scene: Scene) {
    this._verticeCount = 0;
    let vertices = [];

    for (let object of scene.objects) {
      this.addBoundingBox(object.boundingBox.bottom, object.boundingBox.top, vertices);
      this.recurseBBoxes(object.bvh.root, vertices);
    }

    this._gl.useProgram(this._program);

    var vertex_buffer = this._gl.createBuffer();
    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, vertex_buffer);
    this._gl.bufferData(this._gl.ARRAY_BUFFER, new Float32Array(vertices), this._gl.STATIC_DRAW);
    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, vertex_buffer);

    var coord = this._gl.getAttribLocation(this._program, "coordinates");
    this._gl.vertexAttribPointer(coord, 3, this._gl.FLOAT, false, 0, 0);
    this._gl.enableVertexAttribArray(coord);
  }

  public setBVHData(bvh_texture: Float32Array) {
    this._verticeCount = 0;

    let factor = 20;
    let vertices = [];
    for (let idx = 0; idx < 50000; idx += 9) {
      let bottom = [bvh_texture[idx], bvh_texture[idx + 1], bvh_texture[idx + 2]];
      let top = [bvh_texture[idx + 3], bvh_texture[idx + 4], bvh_texture[idx + 5]];
      if (!(bottom[0] == 0 && bottom[1] == 0 && bottom[2] == 0 && top[0] == 0 && top[1] == 0 && top[2] == 0)) {
        this.addBoundingBox(bottom, top, vertices);
        this._verticeCount += 24;
      }
      else break;
    }

    this._gl.useProgram(this._program);

    var vertex_buffer = this._gl.createBuffer();
    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, vertex_buffer);
    this._gl.bufferData(this._gl.ARRAY_BUFFER, new Float32Array(vertices), this._gl.STATIC_DRAW);
    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, vertex_buffer);

    var coord = this._gl.getAttribLocation(this._program, "coordinates");
    this._gl.vertexAttribPointer(coord, 3, this._gl.FLOAT, false, 0, 0);
    this._gl.enableVertexAttribArray(coord);
  }

  public update() {
    this._gl.useProgram(this._program);

    mat4.rotate(this._mvMatrix, this._mvMatrix, 0.01, [0,1,0]);
    this._gl.uniformMatrix4fv(this._mvLocation, false, new Float32Array(this._mvMatrix));

    this._gl.clearColor(1, 0, 0, 0);
    this._gl.enable(this._gl.DEPTH_TEST);
    this._gl.clear(this._gl.COLOR_BUFFER_BIT | this._gl.DEPTH_BUFFER_BIT);
    this._gl.drawArrays(this._gl.LINES, 0, this._verticeCount);
  }
}
