#version 300 es

precision mediump float;

layout (location = 0) in vec3 aPosition;
layout (location = 1) in vec2 aTexCoord;

out vec3 fsin_fragpos;
out vec2 fsin_texcoord;

uniform vec3 un_corner;
uniform vec3 un_view;


void main()
{
    fsin_fragpos  = 64.0 * aPosition + un_corner;
    fsin_texcoord = aTexCoord;

    // vec3 pos     = (fsin_fragpos) / 64.0;
    //      pos.xy  = pos.xy * 2.0 - 1.0;
    // gl_Position = vec4(pos, 1.0);

    vec4 pos = vec4(aPosition.xy, 0.0, 1.0);
    pos.xy = pos.xy * 2.0 - 1.0;

    gl_Position = pos;
}


