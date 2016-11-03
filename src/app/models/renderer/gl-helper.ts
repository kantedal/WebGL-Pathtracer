/**
 * Created by fille on 02/11/16.
 */


export function createShader(gl, src, type) {
  let shader = gl.createShader( type );

  gl.shaderSource( shader, src );
  gl.compileShader( shader );

  if (!gl.getShaderParameter( shader, gl.COMPILE_STATUS)) {
    return null;
  }
  return shader;
}

export function createProgram(gl, vertex, fragment) {
  let program = gl.createProgram();

  let vs = createShader( gl, vertex, gl.VERTEX_SHADER );
  let fs = createShader( gl, fragment, gl.FRAGMENT_SHADER );

  gl.attachShader( program, vs );
  gl.attachShader( program, fs );

  gl.deleteShader( vs );
  gl.deleteShader( fs );

  gl.linkProgram( program );

  if ( !gl.getProgramParameter( program, gl.LINK_STATUS ) ) {
    return null;
  }

  return program;
}
