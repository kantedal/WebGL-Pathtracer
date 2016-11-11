void main( void ) {
    vec3 color = vec3(0,0,0);
    for (int sample_step = 0; sample_step < 4; sample_step++) {
      Ray ray = CreateRay(gl_FragCoord.xy, sample_step);
      color += PathTrace(ray);
    }
    color /= 4.0;

    vec3 texture = texture2D(u_buffer_texture, gl_FragCoord.xy / 512.0).rgb;

    vec3 new_clr = texture + color; //mix(color, texture, samples / (samples + 1.0));
    gl_FragColor = vec4(new_clr, 1.0);
}
