import { Signal } from "../helpers/Signal";
import { TimerUtils } from "../utils/TimerUtils";
import { EnvUtils } from "../utils/EnvUtils";
import { ResponsiveManager } from "../helpers/ResponsiveManager";

export interface IStereoEffect {
  new (rendererer: THREE.Renderer);
  setEyeSeparation(eyeSep: number): void;
  setSize(width: number, height: number): void;
  render(scene: THREE.Scene, camera: THREE.Camera): void;
}

export let StereoEffect: IStereoEffect = (THREE as any).StereoEffect;

export interface IDeviceOrientationControls {
  new (object: THREE.Object3D);
  connect(): void;
  disconnect(): void;
  update(): void;
  updateAlphaOffsetAngle(pAngle: number): void;
  dispose(): void;
}

export let DeviceOrientationControls: IDeviceOrientationControls = (THREE as any)
  .DeviceOrientationControls;

export interface IViewportSize {
  width: number;
  height: number;
}

export interface IThreeObject {
  object3D: THREE.Object3D;
  build(): void;
  update(): void;
}

export enum ERenderMode {
  FALLBACK,
  WEBGL,
  WEBVR,
  STEREO
}

export interface IBackgroundConfig {
  color: number;
  alpha: number;
}
export interface ICameraConfig {
  near: number;
  far: number;
  fov: number;
}
export interface IFogConfig {
  near: number;
  far: number;
  color: number;
}

export class ThreeView {
  /**
   * Main 3D renderer
   */
  protected _renderer: THREE.Renderer;
  get renderer(): THREE.Renderer {
    return this._renderer;
  }

  /**
   * Stereo effect for VR rendering
   */
  protected _stereoEffect: IStereoEffect;
  get stereoEffect(): IStereoEffect {
    return this._stereoEffect;
  }

  /**
   * If WebGL not available and rendering is done with canvas 2DContext
   */
  protected _canvasMode: boolean;
  get canvasMode(): boolean {
    return this._canvasMode;
  }

  /**
   * Canvas dom element
   */
  get domElement(): HTMLCanvasElement {
    return this._renderer.domElement;
  }

  /**
   * Main 3D camera
   */
  protected _camera: THREE.Camera;
  get camera(): THREE.Camera {
    return this._camera;
  }

  /**
   * Main 3D scene
   */
  protected _scene: THREE.Scene;
  get scene(): THREE.Scene {
    return this._scene;
  }

  /**
   * Size of the viewport
   */
  get viewPortSize(): IViewportSize {
    return this._viewPortSize;
  }
  protected _viewPortSize: IViewportSize = {
    width: 0,
    height: 0
  };

  /**
   * Signal on each frame
   */
  protected _onEnterFramed: Signal = new Signal();
  get onEnterFramed(): Signal {
    return this._onEnterFramed;
  }

  /**
   * Scene clock. Started when rendering is not paused.
   */
  protected _clock: THREE.Clock;
  get clock(): THREE.Clock {
    return this._clock;
  }

  /**
   * Current frame number
   */
  protected _frame = 0;
  get frame(): number {
    return this._frame;
  }

  /**
   * Vr display on which show rendering.
   * RenderMode need to be WEBVR
   */
  protected _vrDisplay: VRDisplay;
  get vrDisplay(): VRDisplay {
    return this._vrDisplay;
  }
  set vrDisplay(pValue: VRDisplay) {
    this._vrDisplay = pValue;
  }

  /**
   * If the engine is paused, no frame are generated.
   */
  protected _paused: boolean = true;
  get paused(): boolean {
    return this._paused;
  }
  set paused(pValue: boolean) {
    // Only if value is different to avoid multiple frame handlers
    if (this._paused != pValue) {
      this._paused = pValue;

      if (this._vrDisplay == null) {
        // Update state
        this._paused
          ? TimerUtils.removeFrameHandler(this.internalEnterFrameHandler)
          : TimerUtils.addFrameHandler(this, this.internalEnterFrameHandler);
      } else if (!this._paused) {
        this._vrDisplay.requestAnimationFrame(
          this.internalEnterFrameHandler.bind(this)
        );
      }

      // Update clock stage
      // NOT SURE : Does stop reset time ?
      this._paused ? this._clock.stop() : this._clock.start();
    }
  }

  /**
   * If engine has been started with start() method.
   */
  protected _started: boolean = false;
  get started(): boolean {
    return this._started;
  }

  // ------------------------------------------------------------------------- INIT

  constructor() {
    this.afterConstructor();
  }

  // ------------------------------------------------------------------------- MIDDLE WARES

  /**
   * MIDDLE WARE
   * Right after construction.
   * Useful to prepare or load stuff before engine creation
   */
  protected afterConstructor() {}

  /**
   * MIDDLE WARE
   * After renderer is configured from parent component.
   * Useful to override renderer behavior such as shadowMap
   */
  protected afterRendererInit() {}

  /**
   * MIDDLE WARE
   * After camera is configured from parent component.
   * Useful to override camera behavior.
   */
  protected afterCameraInit() {}

  /**
   * MIDDLE WARE
   * After controls are configured from parent component.
   * Useful to override controls behavior.
   */
  protected afterControlsInit() {}

  /**
   * MIDDLE WARE
   * After scene is configured from parent component.
   * This is where you init the 3D scene
   */
  protected afterSceneInit() {}

  /**
   * MIDDLE WARE
   * After start is called from parent component.
   * Useful to start animation / timers after everything is loaded and ready.
   */
  protected afterStart() {}

  /**
   * MIDDLE WARE
   */
  protected enterFrameHandler() {}

  // ------------------------------------------------------------------------- HELPERS

  /**
   * Get abstract renderer. Will return IStereoEffect if Vr Mode enabled.
   * @returns {IStereoEffect|THREE.Renderer}
   */
  protected getAbstractRenderer(): IStereoEffect | THREE.Renderer {
    return this._stereoEffect != null ? this._stereoEffect : this._renderer;
  }

  // ------------------------------------------------------------------------- ENGINE INIT

  /**
   *
   * @param pRenderMode Render mode to init. @see ERenderMode. Default is WebGL with canvas fallback mode.
   * @param pBackground Configure 2D background.
   * @param pAutoSize
   * @param pAntialias
   * @param pPixelRatio
   * @param pRendererParams
   */
  initRenderer(
    pRenderMode: ERenderMode = ERenderMode.FALLBACK,

    pBackground: IBackgroundConfig = { color: 0xffffff, alpha: 1 },

    pAutoSize: boolean = true,

    pAntialias: boolean | null = null,

    pPixelRatio: number | null = window.devicePixelRatio,

    pRendererParams: any = {}
  ) {
    // Check if we are not already initialised
    if (this._renderer != null)
      throw new Error(`ThreeView.initRenderer // Already initialised.`);

    // If WebGL context is available
    let hasWebGL = EnvUtils.getCapabilities().webGL;

    // If WebGL is not available and canvas fallback mode is not allowed
    if (pRenderMode != ERenderMode.FALLBACK && !hasWebGL) {
      throw new Error(
        `ThreeView.initRenderer // WebGL rendering not available.`
      );
    }

    // Auto-set antialias if parameter is null
    if (pAntialias == null) {
      // We enable antialias if pixel ratio is pretty small
      pAntialias = pPixelRatio < 1.5;
    }

    // Set renderer params
    pRendererParams.antialias = pAntialias;
    pRendererParams.devicePixelRatio = pPixelRatio;

    // Take from background
    pRendererParams.clearAlpha = pBackground.alpha;
    pRendererParams.clearColor = pBackground.color;

    // Create WebGL renderer if available otherwise create CanvasRenderer
    this._renderer = (hasWebGL
      ? new THREE.WebGLRenderer(pRendererParams)
      : new THREE.CanvasRenderer(pRendererParams)) as THREE.Renderer;

    // Register if we are in canvas mode
    this._canvasMode = !hasWebGL;

    // Stereo rendering mode
    if (pRenderMode == ERenderMode.STEREO) {
      // Create stereo effect
      this._stereoEffect = new StereoEffect(this._renderer);
    }

    // Real WebVR API
    else if (pRenderMode == ERenderMode.WEBVR) {
      let webGLRenderer = this._renderer as THREE.WebGLRenderer;
      let vr = webGLRenderer["vr"];

      vr.enabled = true;
      vr.standing = true;

      vr.setDevice(this._vrDisplay);

      TimerUtils.fps = 90;

      (this._vrDisplay as VRDisplay).requestPresent([
        {
          source: webGLRenderer.domElement
        }
      ]);
    }

    // Create 3D clock and do not start it
    this._clock = new THREE.Clock(false);

    // Enable auto-size
    if (pAutoSize) {
      ResponsiveManager.instance.onWindowSizeChanged.add(
        this.windowSizeChangedHandler,
        this
      );
    }

    // Call middleWare
    this.afterRendererInit();
  }

  /**
   * Init perspective camera
   * @param pCameraConfig
   */
  initCamera(pCameraConfig: ICameraConfig = { near: 1, far: 10000, fov: 85 }) {
    // Check if init order is ok
    if (this._renderer == null)
      throw new Error(
        `ThreeView.initCamera // Please init renderer before camera`
      );
    if (this._scene != null)
      throw new Error(
        `ThreeView.initCamera // Please init camera before scene`
      );

    // Init camera
    this._camera = new THREE.PerspectiveCamera(
      pCameraConfig.fov,
      1,
      pCameraConfig.near,
      pCameraConfig.far
    );

    // BETTER : CombinedCamera ? CinematicCamera ?

    // Call middle ware
    this.afterCameraInit();
  }

  /**
   * Init orthographic camera
   * @param pNear
   * @param pFar
   */
  initOrthographicCamera(pNear: number = 1, pFar: number = 10000) {
    // Check if init order is ok
    if (this._renderer == null)
      throw new Error(
        `ThreeView.initCamera // Please init renderer before camera`
      );
    if (this._scene != null)
      throw new Error(
        `ThreeView.initCamera // Please init camera before scene`
      );

    // Init camera
    this._camera = new THREE.OrthographicCamera(-50, 50, -50, 50, pNear, pFar);

    // Call middle ware
    this.afterCameraInit();
  }

  /**
   * Init controls.
   * BETTER : Default VR controls here ?
   * BETTER : Any default controls here ? Maybe too specific to go in this class.
   */
  initControls() {
    // Check if init order is ok
    if (this._renderer == null)
      throw new Error(
        `ThreeView.initControls // Please init renderer before controls`
      );
    if (this._scene != null)
      throw new Error(
        `ThreeView.initControls // Please init controls before scene`
      );

    // Call middle ware
    this.afterControlsInit();
  }

  /**
   * Init scene.
   * BETTER : Parameters to set XYZ order ?
   * @param pFog
   */
  initScene(pFog: IFogConfig = { near: 1, far: 4000, color: 0xffffff }) {
    // Check if init order is ok
    if (this._renderer == null)
      throw new Error(
        `ThreeView.initScene // Please init renderer before scene`
      );
    if (this._scene != null)
      throw new Error(`ThreeView.initScene // Scene already init.`);

    // Init scene
    this._scene = new THREE.Scene();

    // FIXME : LOG FOG SUPPORT

    // Apply fog if needed
    if (pFog != null) {
      // Set scene background and fog
      this._scene.background = new THREE.Color(pFog.color);
      this._scene.fog = new THREE.Fog(pFog.color, pFog.near, pFog.far);
    }

    // Call middleWare
    this.afterSceneInit();
  }

  // ------------------------------------------------------------------------- START

  /**
   * Start scene and rendering.
   * @param pParentDomElement DOM element containing canvas.
   */
  start(pParentDomElement: HTMLElement) {
    // Check if renderer is init
    if (this._renderer == null)
      throw new Error(
        `ThreeView.initScene // Please init renderer before starting 3D view.`
      );

    // BETTER : Check parent dom element not null

    // Append to parent
    pParentDomElement.appendChild(this.domElement);

    // Updates sizes if parent is available
    this.updateRenderingSizeFromParent();

    // Call middleWare now we have correct sizes
    this.afterStart();

    // Start loop
    this.paused = false;

    // Remember we started the game
    this._started = true;
  }

  // ------------------------------------------------------------------------- SIZE

  /**
   * App is resized.
   */
  protected windowSizeChangedHandler() {
    // Get dimensions from node
    this.updateRenderingSizeFromParent();
  }

  /**
   * Set rendering size from domElement size.
   * NOT SURE : VR Compatible ?
   * BETTER : Détecter ou informer si parent non disponible
   */
  updateRenderingSizeFromParent() {
    // Target parent dom node
    let parent = this._renderer.domElement.parentElement;

    // Get size from parent
    if (parent != null) {
      this._viewPortSize.width = parent.clientWidth;
      this._viewPortSize.height = parent.clientHeight;
    }

    // Or fallback to 0
    // BETTER : Dispatch error ? (Be careful with autoSize)
    else {
      this._viewPortSize.width = 0;
      this._viewPortSize.height = 0;
    }

    // Update camera aspect ratio
    if ("aspect" in this._camera) {
      (this._camera as THREE.PerspectiveCamera).aspect =
        this._viewPortSize.width / this._viewPortSize.height;
    } else if ("left" in this._camera) {
      // BETTER : Test this
      let orthographicCamera = this._camera as THREE.OrthographicCamera;
      orthographicCamera.left = -this._viewPortSize.width / 2;
      orthographicCamera.right = +this._viewPortSize.width / 2;
      orthographicCamera.top = +this._viewPortSize.height / 2;
      orthographicCamera.bottom = -this._viewPortSize.height / 2;
    }

    // Update camera projection
    if ("updateProjectionMatrix" in this._camera) {
      (this._camera as THREE.PerspectiveCamera).updateProjectionMatrix();
    }

    // Update renderer size
    this.getAbstractRenderer().setSize(
      this._viewPortSize.width,
      this._viewPortSize.height
    );
  }

  // ------------------------------------------------------------------------- LOOP

  protected internalEnterFrameHandler() {
    this.enterFrameHandler();
    this._frame++;
    this.render();

    if (this._vrDisplay != null && !this._paused) {
      this._vrDisplay.requestAnimationFrame(
        this.internalEnterFrameHandler.bind(this)
      );
    }
  }

  render() {
    this.getAbstractRenderer().render(this._scene, this._camera);
  }
}
