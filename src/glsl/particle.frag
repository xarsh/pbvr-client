varying vec3 vColor;

void main() {
  vec3 n;
  n.xy = gl_PointCoord * 2.0 - 1.0;
  n.z = 1.0 - dot( n.xy, n.xy );
  if ( n.z < 0.0 ) discard;

  vec4 color = vec4(1.0, 1.0, 1.0, 1.0);
  color.rgb *= vColor;
  gl_FragColor = color;
}
