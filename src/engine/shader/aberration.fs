#version 300 es

precision mediump float;

out vec4 fsout_frag_color;
in vec2 fsin_texcoord;

uniform sampler2D un_texture;

void main()
{
    vec2 texcoord = fsin_texcoord;
         texcoord.y = 1.0 - texcoord.y;

    vec2 tsize = vec2(1.0) / vec2(textureSize(un_texture, 0));

    vec2[3] offsets = vec2[3](
        tsize * 4.0 * vec2(-1, -1),
        tsize * 4.0 * vec2(+1,  0),
        tsize * 4.0 * vec2(+1, +1)
    );

    vec3 color = texture(un_texture, texcoord).rgb;

    float r = 0.0;
    float g = 0.0;
    float b = 0.0;

    float m = 1.0;

    for (int i=0; i<4; i++)
    {
        r += texture(un_texture, texcoord + m*offsets[0]).r;
        g += texture(un_texture, texcoord + m*offsets[1]).g;
        b += texture(un_texture, texcoord + m*offsets[2]).b;

        m *= 0.5;
    }

    color = vec3(r, g, b) / 4.0;

    fsout_frag_color = vec4(color, 1.0);
}



