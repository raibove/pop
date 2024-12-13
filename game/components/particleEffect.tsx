import React, { Component } from "react";
import anime from "animejs";
import raf from "raf";
const noop = () => {};

// @ts-expect-error
import '../index.css';

// Define an interface for the animatable target
interface AnimationTarget extends HTMLElement {
  value: number;
}

type ParticleType = 'circle' | 'rectangle' | 'triangle';
type StyleType = 'fill' | 'stroke';
type DirectionType = 'left' | 'right' | 'top' | 'bottom';

interface ParticleEffectButtonProps {
  hidden?: boolean;
  children?: React.ReactNode;
  className?: string;
  duration: number;
  easing: string;
  type?: ParticleType;
  style?: StyleType;
  direction?: DirectionType;
  canvasPadding: number;
  size?: number | (() => number);
  speed?: number | (() => number);
  color: string;
  particlesAmountCoefficient: number;
  oscillationCoefficient: number;
  onBegin?: () => void;
  onComplete?: () => void;
  onBtnClick: ()=> void;
}

interface ParticleEffectButtonState {
  status: 'normal' | 'hidden' | 'hiding' | 'showing';
  progress: number;
  isAnimating: boolean;
}

interface Particle {
  startX: number;
  startY: number;
  x: number;
  y: number;
  angle: number;
  counter: number;
  increase: number;
  life: number;
  death: number;
  speed: number;
  size: number;
}

class ParticleEffectButton extends Component<ParticleEffectButtonProps, ParticleEffectButtonState> {
  static defaultProps: ParticleEffectButtonProps = {
    hidden: false,
    duration: 1000,
    easing: "easeInOutCubic",
    type: "circle",
    style: "fill",
    direction: "left",
    canvasPadding: 150,
    size: () => Math.floor(Math.random() * 3 + 1),
    speed: () => rand(-4, 4),
    color: "#000",
    particlesAmountCoefficient: 3,
    oscillationCoefficient: 20,
    onBegin: noop,
    onComplete: noop,
    onBtnClick: noop,
  };

  private _canvas: HTMLCanvasElement | null = null;
  private _ctx: CanvasRenderingContext2D | null = null;
  private _particles: Particle[] = [];
  private _raf: number | null = null;
  private _rect: { width: number; height: number } = { width: 0, height: 0 };
  private _progress: number = 0;
  private _wrapper: HTMLDivElement | null = null;

  constructor(props: ParticleEffectButtonProps) {
    super(props);
    this.state = {
      status: props.hidden ? "hidden" : "normal",
      progress: 0,
      isAnimating: false,
    };
  }

  componentDidMount() {
    this._init();
  }

  componentWillUnmount() {
    if (this._raf) {
      raf.cancel(this._raf);
    }
  }

  componentDidUpdate(prevProps: ParticleEffectButtonProps) {
    if (prevProps.hidden !== this.props.hidden) {
      const { status } = this.state;

      if (status === "normal" && this.props.hidden) {
        this.setState(
          {
            status: "hiding",
            isAnimating: true,
          },
          this._startAnimation
        );
      } else if (status === "hidden" && !this.props.hidden) {
        this.setState(
          {
            status: "showing",
            isAnimating: true,
          },
          this._startAnimation
        );
      }
    }
  }

  _init() {
    if (!this._canvas || !this._wrapper) return;
    this._rect = this._wrapper.getBoundingClientRect();
  }

  
  _startAnimation = () => {
    if (!this._canvas || !this._wrapper) return;

    const { duration, easing, canvasPadding, onBegin } = this.props;

    const { status } = this.state;

    this._progress = status === "hiding" ? 0 : 1;
    this._particles = [];
    this._rect = this._wrapper.getBoundingClientRect();
    this._canvas.width = this._rect.width + canvasPadding * 2;
    this._canvas.height = this._rect.height + canvasPadding * 2;
    this._ctx = this._canvas.getContext("2d");

    anime({
      targets: { value: status === "hiding" ? 0 : 100 },
      value: status === "hiding" ? 100 : 0,
      duration: duration,
      easing: easing,
      begin: onBegin,
      update: (anim) => {
        const value = (anim.animatables[0].target as AnimationTarget).value
        this.setState({ progress: value });

        if (duration) {
          this._addParticles(value / 100);
        }
      },
    });
  };

  
  _addParticles(progress: number) {
    const { canvasPadding, direction, particlesAmountCoefficient } = this.props;

    const { status } = this.state;
    const { width, height } = this._rect;

    const delta =
      status === "hiding"
        ? progress - this._progress
        : this._progress - progress;
    const isHorizontal = this._isHorizontal();
    const progressValue =
      (isHorizontal ? width : height) * progress +
      delta * (status === "hiding" ? 100 : 220);

    this._progress = progress;

    let x = canvasPadding;
    let y = canvasPadding;

    if (isHorizontal) {
      x += direction === "left" ? progressValue : width - progressValue;
    } else {
      y += direction === "top" ? progressValue : height - progressValue;
    }

    let i = Math.floor(particlesAmountCoefficient * (delta * 100 + 1));
    if (i > 0) {
      while (i--) {
        this._addParticle({
          x: x + (isHorizontal ? 0 : width * Math.random()),
          y: y + (isHorizontal ? height * Math.random() : 0),
        });
      }
    }

    if (!this._raf) {
      this._raf = raf(this._loop);
    }
  }

  // ... rest of the methods remain mostly the same, just add type annotations

  private _addParticle(opts: { x: number; y: number }): void {
    const { duration, size, speed } = this.props;
    const { status } = this.state;

    const frames = ((duration || 1000) * 60) / 1000;
    const _speed = typeof speed === "function" ? speed() : speed || 0;
    const _size = typeof size === "function" ? size() : size || 0;

    this._particles.push({
      startX: opts.x,
      startY: opts.y,
      x: status === "hiding" ? 0 : _speed * -frames,
      y: 0,
      angle: rand(360),
      counter: status === "hiding" ? 0 : frames,
      increase: (Math.PI * 2) / 100,
      life: 0,
      death: status === "hiding" ? frames - 20 + Math.random() * 40 : frames,
      speed: _speed,
      size: _size,
    });
  }

  
  _loop = () => {
    this._updateParticles();
    this._renderParticles();

    if (this._particles.length) {
      this._raf = raf(this._loop);
    } else {
      this._raf = null;
      this._cycleStatus();
    }
  };

  
  _updateParticles() {
    const { oscillationCoefficient } = this.props;
    const { status } = this.state;

    for (let i = 0; i < this._particles.length; i++) {
      const p = this._particles[i];

      if (p.life > p.death) {
        this._particles.splice(i, 1);
      } else {
        p.x += p.speed;
        p.y = oscillationCoefficient * Math.sin(p.counter * p.increase);
        p.life++;
        p.counter += status === "hiding" ? 1 : -1;
      }
    }
  }


  _renderParticles() {
    const { color, type, style } = this.props;
    const { status } = this.state;

    if(!this._ctx || !this._canvas) return;

    this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
    this._ctx.fillStyle = this._ctx.strokeStyle = color;

    this._particles.forEach((p) => {
      if (p.life < p.death) {
        this._ctx!.translate(p.startX, p.startY);
        this._ctx!.rotate((p.angle * Math.PI) / 180);
        this._ctx!.globalAlpha =
          status === "hiding" ? 1 - p.life / p.death : p.life / p.death;
        this._ctx!.beginPath();

        if (type === "circle") {
          this._ctx!.arc(p.x, p.y, p.size, 0, 2 * Math.PI);
        } else if (type === "triangle") {
          this._ctx!.moveTo(p.x, p.y);
          this._ctx!.lineTo(p.x + p.size, p.y + p.size);
          this._ctx!.lineTo(p.x + p.size, p.y - p.size);
        } else if (type === "rectangle") {
          this._ctx!.rect(p.x, p.y, p.size, p.size);
        }

        if (style === "fill") {
          this._ctx!.fill();
        } else if (style === "stroke") {
          this._ctx!.closePath();
          this._ctx!.stroke();
        }

        this._ctx!.globalAlpha = 1;
        this._ctx!.rotate((-p.angle * Math.PI) / 180);
        this._ctx!.translate(-p.startX, -p.startY);
      }
    });
  }

  _cycleStatus() {
    const { status } = this.state;
    const { onComplete } = this.props;

    if (status === "hiding") {
      this.setState(
        {
          status: "hidden",
          isAnimating: false,
        },
        () => {
          onComplete && onComplete();
        }
      );
    } else if (status === "showing") {
      this.setState(
        {
          status: "normal",
          isAnimating: false,
        },
        onComplete
      );
    }
  }

  _isHorizontal() {
    return this.props.direction === "left" || this.props.direction === "right";
  }

  render() {
    const { children, className, direction, onBtnClick } = this.props;
    const { status, progress } = this.state;

    const containerStyles: React.CSSProperties = {
      position: "relative",
      display: "inline-block",
    };

    const wrapperStyles: React.CSSProperties = {
      position: "relative",
      display: "inline-block",
    };

    const contentStyles: React.CSSProperties = {
      opacity: status === "hiding" ? 1 - progress / 100 : 1,
    };

    const canvasStyles: React.CSSProperties = {
      position: "absolute",
      top: -( 0),
      left: -( 0),
      pointerEvents: "none",
      zIndex: 1,
    };

    if (status === "hiding" || status === "showing") {
      const prop = this._isHorizontal() ? "translateX" : "translateY";
      const size = this._isHorizontal() ? this._rect.width : this._rect.height;
      const value =
        direction === "left" || direction === "top" ? progress : -progress;
      const px = Math.ceil((size * value) / 100);

      wrapperStyles.transform = `${prop}(${px}px)`;
      contentStyles.transform = `${prop}(${-px}px)`;
    }

    if (status === "hidden") {
      wrapperStyles.visibility = "hidden";
      canvasStyles.visibility = "hidden";
    }

    return (
      <div className="particle-btn" style={containerStyles} onClick={onBtnClick}>
        <div
          className="wrapper"
          style={wrapperStyles}
          ref={(ref) => (this._wrapper = ref)}
        >
          <div className="content" style={contentStyles}>
            {children}
          </div>
        </div>

        <canvas
          className="canvas"
          ref={(ref) => (this._canvas = ref)}
          style={canvasStyles}
        />
      </div>
    );
  }
}

function rand(min: number, max?: number): number {
  if (max === undefined) {
    max = min;
    min = 0;
  }
  return Math.random() * (max - min) + min;
}

export default ParticleEffectButton;
