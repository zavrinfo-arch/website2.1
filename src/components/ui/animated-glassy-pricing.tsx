import React, { useRef, useEffect, useState } from 'react';
import { RippleButton } from '@/components/ui/multi-type-ripple-buttons';

const CheckIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

const ShaderCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const glProgramRef = useRef<WebGLProgram | null>(null);
  const glBgColorLocationRef = useRef<WebGLUniformLocation | null>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const [backgroundColor, setBackgroundColor] = useState([0, 0, 0]);

  useEffect(() => {
    const root = document.documentElement;
    const updateColor = () => {
      const isDark = root.classList.contains('dark');
      setBackgroundColor(isDark ? [0.05, 0.07, 0.12] : [1.0, 1.0, 1.0]);
    };
    updateColor();
    const observer = new MutationObserver(() => updateColor());
    observer.observe(root, { attributes: true });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const gl = glRef.current;
    const program = glProgramRef.current;
    const location = glBgColorLocationRef.current;
    if (gl && program && location) {
      gl.useProgram(program);
      gl.uniform3fv(location, new Float32Array(backgroundColor));
    }
  }, [backgroundColor]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl');
    if (!gl) return;
    glRef.current = gl;

    const vs = `attribute vec2 aPosition; void main() { gl_Position = vec4(aPosition, 0.0, 1.0); }`;
    const fs = `
      precision highp float;
      uniform float iTime;
      uniform vec2 iResolution;
      uniform vec3 uBackgroundColor;
      mat2 rotate2d(float angle){ float c=cos(angle),s=sin(angle); return mat2(c,-s,s,c); }
      float variation(vec2 v1,vec2 v2,float strength,float speed){ return sin(dot(normalize(v1),normalize(v2))*strength+iTime*speed)/100.0; }
      vec3 paintCircle(vec2 uv,vec2 center,float rad,float width){
        vec2 diff=center-uv; float len=length(diff);
        len+=variation(diff,vec2(0.,1.),5.,2.);
        len-=variation(diff,vec2(1.,0.),5.,2.);
        return vec3(smoothstep(rad-width,rad,len)-smoothstep(rad,rad+width,len));
      }
      void main(){
        vec2 uv=gl_FragCoord.xy/iResolution.xy;
        uv.x*=1.5; uv.x-=0.25;
        float mask=0.0; float radius=.35; vec2 center=vec2(.5);
        mask+=paintCircle(uv,center,radius,.035).r;
        mask+=paintCircle(uv,center,radius-.018,.01).r;
        mask+=paintCircle(uv,center,radius+.018,.005).r;
        vec2 v=rotate2d(iTime)*uv;
        vec3 fg=vec3(v.x,v.y,.7-v.y*v.x);
        vec3 color=mix(uBackgroundColor,fg,mask);
        color=mix(color,vec3(1.),paintCircle(uv,center,radius,.003).r);
        gl_FragColor=vec4(color,1.);
      }`;

    const compileShader = (type: number, source: string) => {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return shader;
    };

    const program = gl.createProgram()!;
    gl.attachShader(program, compileShader(gl.VERTEX_SHADER, vs));
    gl.attachShader(program, compileShader(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(program);
    gl.useProgram(program);
    glProgramRef.current = program;

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(program, 'aPosition');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const iTimeLoc = gl.getUniformLocation(program, 'iTime');
    const iResLoc = gl.getUniformLocation(program, 'iResolution');
    glBgColorLocationRef.current = gl.getUniformLocation(program, 'uBackgroundColor');
    gl.uniform3fv(glBgColorLocationRef.current, new Float32Array(backgroundColor));

    let afId: number;
    const render = (time: number) => {
      gl.uniform1f(iTimeLoc, time * 0.001);
      gl.uniform2f(iResLoc, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      afId = requestAnimationFrame(render);
    };
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    };
    resize();
    window.addEventListener('resize', resize);
    afId = requestAnimationFrame(render);
    return () => { window.removeEventListener('resize', resize); cancelAnimationFrame(afId); };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block z-0" />;
};

export interface PricingCardProps {
  planName: string;
  description: string;
  price: string;
  features: string[];
  buttonText: string;
  isPopular?: boolean;
  buttonVariant?: 'primary' | 'secondary';
}

export const PricingCard = ({ planName, description, price, features, buttonText, isPopular = false, buttonVariant = 'primary' }: PricingCardProps) => {
  const cardBase = `relative backdrop-blur-[14px] rounded-2xl shadow-xl flex-1 max-w-xs px-7 py-8 flex flex-col transition-all duration-300 border`;
  const cardLight = `bg-white/10 border-white/20`;
  const cardPopular = isPopular ? 'scale-105 ring-2 ring-[#4ECDC4]/50 shadow-2xl' : '';
  const btnClasses = buttonVariant === 'primary'
    ? 'mt-auto w-full py-2.5 rounded-xl font-semibold text-sm bg-[#4ECDC4] hover:bg-[#3dbdb5] text-gray-900'
    : 'mt-auto w-full py-2.5 rounded-xl font-semibold text-sm bg-white/10 hover:bg-white/20 text-white border border-white/20';

  return (
    <div className={[cardBase, cardLight, cardPopular].join(' ')}>
      {isPopular && (
        <div className="absolute -top-4 right-4 px-3 py-1 text-xs font-semibold rounded-full bg-[#FFD93D] text-gray-900">
          Most Popular
        </div>
      )}
      <div className="mb-3">
        <h2 className="text-4xl font-extralight tracking-tight text-white" style={{ fontFamily: 'Cormorant Garamond, serif' }}>{planName}</h2>
        <p className="text-sm text-white/70 mt-1">{description}</p>
      </div>
      <div className="my-6 flex items-baseline gap-2">
        <span className="text-3xl sm:text-4xl md:text-5xl font-extralight text-white" style={{ fontFamily: 'Cormorant Garamond, serif' }}>${price}</span>
        <span className="text-sm text-white/60">/mo</span>
      </div>
      <div className="w-full mb-5 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      <ul className="flex flex-col gap-2 text-sm text-white/90 mb-6">
        {features.map((f, i) => (
          <li key={i} className="flex items-center gap-2">
            <CheckIcon className="text-[#4ECDC4] w-4 h-4 flex-shrink-0" /> {f}
          </li>
        ))}
      </ul>
      <RippleButton className={btnClasses} rippleColor="rgba(255,255,255,0.3)">{buttonText}</RippleButton>
    </div>
  );
};

interface ModernPricingPageProps {
  title: React.ReactNode;
  subtitle: React.ReactNode;
  plans: PricingCardProps[];
  showAnimatedBackground?: boolean;
}

export const ModernPricingPage = ({ title, subtitle, plans, showAnimatedBackground = true }: ModernPricingPageProps) => {
  return (
    <div className="relative w-full overflow-hidden bg-[#050a14]" style={{ minHeight: '100vh' }}>
      {showAnimatedBackground && <ShaderCanvas />}
      <main className="relative z-10 w-full min-h-screen flex flex-col items-center justify-center px-4 py-20">
        <div className="w-full max-w-5xl mx-auto text-center mb-14">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-extralight leading-tight tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#FF6B6B] via-[#4ECDC4] to-[#FFD93D]" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            {title}
          </h1>
          <p className="mt-4 text-base md:text-xl text-white/70 max-w-2xl mx-auto">{subtitle}</p>
        </div>
        <div className="flex flex-col md:flex-row gap-8 md:gap-6 justify-center items-stretch w-full max-w-4xl">
          {plans.map((plan) => <PricingCard key={plan.planName} {...plan} />)}
        </div>
      </main>
    </div>
  );
};
