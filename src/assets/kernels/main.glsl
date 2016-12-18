void main() {
  vec3 clr = vec3(0,0,0);

  for (int sample_step = 0; sample_step < 4; sample_step++) {
    Ray ray = CreateRay(gl_FragCoord.xy, sample_step);
    clr += PathTrace(ray);
  }
  clr /= 4.0;

  vec3 texture = texture(u_buffer_texture, uv.xy / 512.0).rgb;

  vec3 new_clr = texture + clr; //mix(color, texture, samples / (samples + 1.0));
  color = vec4(new_clr, 1.0);
}
