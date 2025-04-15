import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Complex, MandelbrotParameters, RenderMode, RenderResult } from './mandelbrot';
import { MandelbrotWebGLRenderer } from './mandelbrot-webgl';
import { MandelbrotCPURenderer } from './mandelbrot-cpu';
import { MandelbrotCPUParallelRenderer } from './mandelbrot-cpu-parallel';
import { MouseButton } from './components';

const App: React.FC = () => {
  const [parameters, setParameters] = useState<MandelbrotParameters>(() => {
    return MandelbrotParameters.of(new URLSearchParams(window.location.search));
  });

  const [timeToRender, setTimeToRender] = useState<number>(0);

  const webGLCanvasRef = useRef<HTMLCanvasElement>(null);
  const cpuCanvasRef = useRef<HTMLCanvasElement>(null);
  const cpuParallelCanvasRef = useRef<HTMLCanvasElement>(null);

  const webGLRendererRef = useRef<MandelbrotWebGLRenderer | null>(null);
  const cpuRendererRef = useRef<MandelbrotCPURenderer | null>(null);
  const cpuParallelRendererRef = useRef<MandelbrotCPUParallelRenderer | null>(null);

  // Initialize renderers
  useEffect(() => {
    if (webGLCanvasRef.current) {
      webGLRendererRef.current = new MandelbrotWebGLRenderer(
        webGLCanvasRef.current,
        (result: RenderResult) => setTimeToRender(result.timeToRenderMs)
      );
    }

    if (cpuCanvasRef.current) {
      cpuRendererRef.current = new MandelbrotCPURenderer(
        cpuCanvasRef.current,
        (result: RenderResult) => setTimeToRender(result.timeToRenderMs)
      );
    }

    if (cpuParallelCanvasRef.current) {
      cpuParallelRendererRef.current = new MandelbrotCPUParallelRenderer(
        cpuParallelCanvasRef.current,
        (result: RenderResult) => setTimeToRender(result.timeToRenderMs)
      );
    }

    // Initial render
    drawMandelbrot();
  }, []);

  // Update URL and redraw when parameters change
  useEffect(() => {
    const url = new URL(window.location.href);

    url.searchParams.set("iterationDepth", parameters.iterationDepth.toString());
    url.searchParams.set("scale", parameters.scale.toString());
    url.searchParams.set("theta", parameters.theta.toString());
    url.searchParams.set("real", parameters.centre.re.toString());
    url.searchParams.set("imaginary", parameters.centre.im.toString());
    url.searchParams.set("renderMode", parameters.renderMode.toString());

    window.history.pushState({}, '', url);

    drawMandelbrot();
  }, [parameters]);

  // Use a ref to store the current parameters to avoid dependency issues
  const parametersRef = useRef(parameters);

  // Update the ref whenever parameters change
  useEffect(() => {
    parametersRef.current = parameters;
  }, [parameters]);

  const drawMandelbrot = useCallback(() => {
    window.requestAnimationFrame(() => {
      const currentParams = parametersRef.current;
      switch (currentParams.renderMode) {
        case RenderMode.WEB_GL:
          if (webGLRendererRef.current) {
            webGLRendererRef.current.draw(currentParams);
          }
          break;
        case RenderMode.CPU_PARALLEL:
          if (cpuParallelRendererRef.current) {
            cpuParallelRendererRef.current.draw(currentParams);
          }
          break;
        default:
          if (cpuRendererRef.current) {
            cpuRendererRef.current.draw(currentParams);
          }
          break;
      }
    });
  }, []);

  const handleMouseClick = useCallback((x: number, y: number, button: MouseButton) => {
    const newParameters = new MandelbrotParameters(
      parameters.iterationDepth,
      parameters.scale,
      parameters.theta,
      new Complex(parameters.centre.re, parameters.centre.im),
      parameters.canvasWidth,
      parameters.canvasHeight,
      parameters.renderMode
    );

    switch (button) {
      case MouseButton.LEFT:
        newParameters.zoomInTo(x, y);
        break;
      case MouseButton.RIGHT:
        newParameters.zoomOutTo(x, y);
        break;
    }

    setParameters(newParameters);
  }, [parameters]);

  const handleCanvasMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = e.currentTarget;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    let button: MouseButton;
    if (e.button === 0) {
      button = MouseButton.LEFT;
    } else if (e.button === 2) {
      button = MouseButton.RIGHT;
    } else {
      button = MouseButton.UNKNOWN;
    }

    handleMouseClick(x, y, button);
  }, [handleMouseClick]);

  const handleCanvasContextMenu = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const updateParameter = useCallback((updater: (params: MandelbrotParameters) => void) => {
    setParameters(prevParams => {
      const newParams = new MandelbrotParameters(
        prevParams.iterationDepth,
        prevParams.scale,
        prevParams.theta,
        new Complex(prevParams.centre.re, prevParams.centre.im),
        prevParams.canvasWidth,
        prevParams.canvasHeight,
        prevParams.renderMode
      );
      updater(newParams);
      return newParams;
    });
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>, setter: (value: number) => void) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      updateParameter(params => setter.call(params, value));
    }
  }, [updateParameter]);

  const handleRadioChange = useCallback((renderMode: RenderMode) => {
    updateParameter(params => { params.renderMode = renderMode; });
  }, [updateParameter]);

  const resetParameters = useCallback(() => {
    setParameters(new MandelbrotParameters(
      1000,
      4,
      0,
      new Complex(0, 0),
      640,
      480,
      RenderMode.CPU
    ));
  }, []);

  return (
    <div>
      <canvas 
        ref={webGLCanvasRef}
        width="640"
        height="480"
        style={{ 
          border: '1px solid #000000', 
          display: parameters.renderMode === RenderMode.WEB_GL ? 'block' : 'none' 
        }}
        onMouseDown={handleCanvasMouseDown}
        onContextMenu={handleCanvasContextMenu}
      />
      <canvas 
        ref={cpuCanvasRef}
        width="640"
        height="480"
        style={{ 
          border: '1px solid #000000', 
          display: parameters.renderMode === RenderMode.CPU ? 'block' : 'none' 
        }}
        onMouseDown={handleCanvasMouseDown}
        onContextMenu={handleCanvasContextMenu}
      />
      <canvas 
        ref={cpuParallelCanvasRef}
        width="640"
        height="480"
        style={{ 
          border: '1px solid #000000', 
          display: parameters.renderMode === RenderMode.CPU_PARALLEL ? 'block' : 'none' 
        }}
        onMouseDown={handleCanvasMouseDown}
        onContextMenu={handleCanvasContextMenu}
      />

      <table>
        <tbody>
          <tr>
            <td>
              <table>
                <tbody>
                  <tr>
                    <td>Render type:</td>
                    <td>
                      <input 
                        type="radio" 
                        id="renderType-cpuRadio" 
                        name="renderType" 
                        value="cpu" 
                        checked={parameters.renderMode === RenderMode.CPU}
                        onChange={() => handleRadioChange(RenderMode.CPU)}
                      />
                      <label htmlFor="renderType-cpuRadio">CPU</label>
                    </td>
                    <td>
                      <input 
                        type="radio" 
                        id="renderType-cpuParallelRadio" 
                        name="renderType" 
                        value="cpuParallel"
                        checked={parameters.renderMode === RenderMode.CPU_PARALLEL}
                        onChange={() => handleRadioChange(RenderMode.CPU_PARALLEL)}
                      />
                      <label htmlFor="renderType-cpuParallelRadio">CPU Parallel</label>
                    </td>
                    <td>
                      <input 
                        type="radio" 
                        id="renderType-webglRadio" 
                        name="renderType" 
                        value="webgl"
                        checked={parameters.renderMode === RenderMode.WEB_GL}
                        onChange={() => handleRadioChange(RenderMode.WEB_GL)}
                      />
                      <label htmlFor="renderType-webglRadio">WebGL</label>
                    </td>
                  </tr>
                  <tr>
                    <td>Iteration depth</td>
                    <td>
                      <input 
                        type="text" 
                        id="iterationDepth" 
                        name="Iteration depth"
                        value={parameters.iterationDepth}
                        onChange={(e) => handleInputChange(e, parameters.setIterationDepth)}
                      />
                    </td>
                    <td>
                      <button onClick={() => updateParameter(p => p.decreaseIterationDepth())}>-100</button>
                    </td>
                    <td>
                      <button onClick={() => updateParameter(p => p.increaseIterationDepth())}>+100</button>
                    </td>
                  </tr>
                  <tr>
                    <td>Scale</td>
                    <td>
                      <input 
                        type="text" 
                        id="scale" 
                        name="Scale"
                        value={parameters.scale}
                        onChange={(e) => handleInputChange(e, parameters.setScale)}
                      />
                    </td>
                    <td>
                      <button onClick={() => updateParameter(p => p.zoomIn())}>Zoom in</button>
                    </td>
                    <td>
                      <button onClick={() => updateParameter(p => p.zoomOut())}>Zoom out</button>
                    </td>
                  </tr>
                  <tr>
                    <td>Theta</td>
                    <td>
                      <input 
                        type="text" 
                        id="theta" 
                        name="Theta"
                        value={parameters.theta}
                        onChange={(e) => handleInputChange(e, parameters.setTheta)}
                      />
                    </td>
                    <td>
                      <button onClick={() => updateParameter(p => p.rotateLeft())}>⮪</button>
                    </td>
                    <td>
                      <button onClick={() => updateParameter(p => p.rotateRight())}>⮫</button>
                    </td>
                  </tr>
                  <tr>
                    <td>Real</td>
                    <td>
                      <input 
                        type="text" 
                        id="real" 
                        name="Real"
                        value={parameters.centre.re}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value);
                          if (!isNaN(value)) {
                            updateParameter(p => p.moveTo(new Complex(value, p.centre.im)));
                          }
                        }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Imaginary</td>
                    <td>
                      <input 
                        type="text" 
                        id="imaginary" 
                        name="Imaginary"
                        value={parameters.centre.im}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value);
                          if (!isNaN(value)) {
                            updateParameter(p => p.moveTo(new Complex(p.centre.re, value)));
                          }
                        }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Time to render:</td>
                    <td><span id="timeToRenderSpan">{timeToRender.toFixed(2)}ms</span></td>
                  </tr>
                </tbody>
              </table>
            </td>
            <td>
              <table>
                <tbody>
                  <tr>
                    <td></td>
                    <td>
                      <button onClick={() => updateParameter(p => p.scrollUp())}>⇧</button>
                    </td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>
                      <button onClick={() => updateParameter(p => p.scrollLeft())}>⇦</button>
                    </td>
                    <td></td>
                    <td>
                      <button onClick={() => updateParameter(p => p.scrollRight())}>⇨</button>
                    </td>
                  </tr>
                  <tr>
                    <td></td>
                    <td>
                      <button onClick={() => updateParameter(p => p.scrollDown())}>⇩</button>
                    </td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td>
              <button onClick={resetParameters}>Reset Parameters</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default App;
