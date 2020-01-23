import {type} from "os";

interface Options {
    width?: number;
    height?: number;
    sizeValue?: 'px' | '%';
    bg?: string;
    lineColor?: string;
    lineWidth?: number;
    cursor?: 'default' | 'crosshair' | 'pointer';
    borderWidth?: number;
    borderColor?: string;
    borderStyle?: string;
}

const getCords = (event: MouseEvent) => ({ x: event.offsetX, y: event.offsetY });
const regexHEX = /^#[abcdef0-9]{1,6}$/i;

export class Artist {
    wrapper: HTMLDivElement;
    canvas: HTMLCanvasElement | undefined;
    width: number;
    height: number;
    sizeValue: 'px' | '%';
    bg: string;
    ctx: CanvasRenderingContext2D | undefined;
    lineWidth: number;
    lineColor: string;
    border: {
        size: number;
        color: string;
        style: string;
    };
    mouse: {
        x: number;
        y: number;
        mousedown: boolean;
        cursor: 'default' | 'crosshair' | 'pointer';
    };

    constructor (wrapper: HTMLDivElement, options: Options) {
        this.wrapper = wrapper;
        this.width = options.width || 500;
        this.height = options.height || 500;
        this.bg = options.bg || '#cccccc';
        this.sizeValue = options.sizeValue || 'px';
        this.border = {
            size: options.borderWidth || 0,
            color: options.borderColor || 'none',
            style: options.borderStyle || 'none'
        };

        this.lineWidth = options.lineWidth || 1;
        this.lineColor = options.lineColor || '#000000';

        this.mouse = {
            x: 0,
            y: 0,
            mousedown: false,
            cursor: options.cursor || 'crosshair'
        };

        this.start();
    }

    start () :void
    {
        this.createCanvas();
        this.setWidth(this.width);
        this.setHeight(this.height);

        this.setBg(this.bg);

        this.setBorderColor(this.border.color);
        this.setBorderSize(this.border.size);
        this.setBorderStyle(this.border.style);

        this.setMouseCursor(this.mouse.cursor);

        this.setLineColor(this.lineColor);
        this.setLineWidth(this.lineWidth);

        this.addListeners();
        this.createContext();
    }

    createCanvas () :void
    {
        if (!this.wrapper) return console.warn("Wrapper element is not defined");

        this.wrapper.style.boxSizing = 'border-box';
        this.wrapper.style.display = 'flex';
        this.wrapper.style.alignItems = 'center';
        this.wrapper.style.justifyContent = 'center';

        this.canvas = document.createElement('canvas');
        this.wrapper.append(this.canvas);
    }

    addListeners () :void
    {
        if (!this.canvas) return;

        this.canvas.addEventListener('mousedown', event => {
            this.setCords(event);
            this.setMouseDown(true);
        });

        this.canvas.addEventListener('mouseup', event => {
            this.setCords(event);
            this.setMouseDown(false);
            if (this.ctx) this.ctx.beginPath();
        });

        this.canvas.addEventListener('mousemove', event => {
            this.setCords(event);
            this.drawLine();
        });

        this.canvas.addEventListener('mouseleave', event => {
            this.setCords(event);
            this.setMouseDown(false);

            if (this.ctx)
                this.ctx.beginPath();
        });
    }

    createContext () :void
    {
        if (!this.canvas) return console.warn('Canvas element os not defined');

        const context = this.canvas.getContext("2d");
        if (!context) return console.warn('Fail to get context of canvas');

        this.ctx = context;
    }

    drawLine () :void
    {
        if (!this.ctx || !this.mouse.mousedown) return;

        this.ctx.lineTo(this.mouse.x, this.mouse.y);
        this.ctx.stroke();

        this.ctx.strokeStyle = this.lineColor;
        this.ctx.lineWidth = this.lineWidth;

        if (this.lineWidth > 1)
        {
            const radius = this.lineWidth / 2;
            this.ctx.beginPath();
            this.ctx.fillStyle = this.lineColor;
            this.ctx.arc(this.mouse.x, this.mouse.y, radius , 0, 100);
            this.ctx.fill();
        }

        this.ctx.beginPath();
        this.ctx.moveTo(this.mouse.x, this.mouse.y)
    }

    setMouseCursor (value: 'default' | 'crosshair' | 'pointer') :void
    {
        const setCursorToCanvas = (cursor: 'default' | 'crosshair' | 'pointer') => {
            if (!this.canvas) return;

            this.mouse.cursor = this.canvas.style.cursor = cursor;
        };

        if (!['default', 'crosshair', 'pointer'].includes(value)) return setCursorToCanvas('crosshair');

        setCursorToCanvas(value);
    }

    clearAll () :void
    {
        if (!this.ctx) return;

        this.ctx.clearRect(0, 0, this.width, this.height);
    }

    getImage ()
    {
        if (!this.canvas || !this.ctx) return;

        const imageString = this.canvas.toDataURL('image/png', 0.5);

        if (imageString && imageString.length)
            return imageString;
    }

    getWrapper () :HTMLDivElement | undefined
    {
        return this.wrapper;
    }

    getCanvas () :HTMLCanvasElement | undefined
    {
        return this.canvas;
    }

    getBackground () :string
    {
        return this.bg;
    }

    getBorder (value: 'size' | 'color' | 'style') :number | string | undefined
    {
        if (!this.border.hasOwnProperty(value)) return;

        return this.border[value];
    }

    getLineColor () :string
    {
        return this.lineColor;
    }

    getLineWidth () :number
    {
        return this.lineWidth;
    }

    setWidth (value: number) :void
    {
        if (this.canvas)
        this.canvas.width = value - this.border.size * 2;
        this.wrapper.style.width = value + this.sizeValue;
    }
    setHeight (value: number) :void
    {
        if (this.canvas)
        this.canvas.height = value  - this.border.size * 2;
        this.wrapper.style.height = value + this.sizeValue;
    }

    setBg (value: any) :void
    {
        if (typeof value !== "string") return;
        if (!regexHEX.test(value)) return;

        if (this.canvas)
            this.canvas.style.backgroundColor = value;
    }

    setCords (event: MouseEvent) :void
    {
        const cords = getCords(event);

        this.mouse.x = cords.x;
        this.mouse.y = cords.y;
    }

    setBorderSize (val: any) :void
    {
        if (typeof val !== "number") return;

        if (val !== this.border.size)
            this.border.size = val;

        if (this.border.style === 'none')
            this.border.style = 'solid';

        if (this.wrapper)
        {
            this.wrapper.style.borderWidth = this.border.size + 'px';

            if (!this.canvas) return;

            this.canvas.width = this.wrapper.clientWidth;
            this.canvas.height = this.wrapper.clientHeight;
        }
    }

    setBorderColor (val: any) :void
    {
        if (typeof val !== "string") return;
        if (!regexHEX.test(val)) return;

        if (val !== this.border.color)
            this.border.color = val;

        if (this.border.style === 'none')
            this.border.style = 'solid';

        if (this.wrapper)
            this.wrapper.style.borderColor = this.border.color;
    }

    setBorderStyle (val: any) :void
    {
        if (typeof val !== "string") return;

        if (val !== this.border.style)
            this.border.style = val;

        if (this.wrapper)
            this.wrapper.style.borderStyle = this.border.style;
    }

    setMouseDown (value: boolean | undefined = undefined) :void
    {
        if (value === undefined) this.mouse.mousedown = !this.mouse.mousedown;

        if (typeof value === "boolean")
            this.mouse.mousedown = value;
    }

    setLineWidth (value: any) :void
    {
        if (typeof value !== 'number') return;

        this.lineWidth = value <= 0 ? 1 : value > 10 ? 10 : value;
    }

    setLineColor (value: any) :void
    {
        if (typeof value !== "string") return;

        if (!regexHEX.test(value)) return;

        this.lineColor = value;

        if (this.ctx)
            this.ctx.beginPath();
    }
}
