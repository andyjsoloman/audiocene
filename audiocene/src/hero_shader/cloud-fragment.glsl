precision mediump float;

uniform float u_time;
uniform sampler2D u_perlinTexture;
varying vec2 vUv;

// varying float vZPosition;

void main() {

    vec2 center = vec2(0.5); // Center of the circle
    float radius = 0.5; // Adjust radius for visibility

    // Calculate distance from center
    float dist = distance(vUv, center);

    // Discard fragments outside the circle
    if (dist > radius) {
        discard;
    }

//Scale and animate
vec2 cloudsUv = vUv;
cloudsUv.x *= 0.5;
cloudsUv.y *= 0.5;
cloudsUv.x += u_time * 0.01;


//Clouds
float clouds = texture(u_perlinTexture, cloudsUv).r;

//Remap
clouds = smoothstep(0.4,1.0, clouds);

  gl_FragColor = vec4(1.0,1.0,1.0, clouds);

  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
