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

        this._start();
    }

    _start () :void
    {
        this._createCanvas();
        this.setWidth(this.width);
        this.setHeight(this.height);

        this.setBg(this.bg);

        this.setBorderColor(this.border.color);
        this.setBorderSize(this.border.size);
        this.setBorderStyle(this.border.style);

        this.setMouseCursor(this.mouse.cursor);

        this.setLineColor(this.lineColor);
        this.setLineWidth(this.lineWidth);

        this._addListeners();
        this._createContext();
    }

    _createCanvas () :void
    {
        if (!this.wrapper) return console.warn("Wrapper element is not defined");

        this.wrapper.style.boxSizing = 'border-box';
        this.wrapper.style.display = 'flex';
        this.wrapper.style.alignItems = 'center';
        this.wrapper.style.justifyContent = 'center';

        this.canvas = document.createElement('canvas');
        this.wrapper.append(this.canvas);
    }

    _addListeners () :void
    {
        if (!this.canvas) return;

        this.canvas.addEventListener('mousedown', event => {
            this._setCords(event);
            this.setMouseDown(true);
        });

        this.canvas.addEventListener('mouseup', event => {
            this._setCords(event);
            this.setMouseDown(false);
            if (this.ctx) this.ctx.beginPath();
        });

        this.canvas.addEventListener('mousemove', event => {
            this._setCords(event);
            this._drawLine();
        });

        this.canvas.addEventListener('mouseleave', event => {
            this._setCords(event);
            this.setMouseDown(false);

            if (this.ctx)
                this.ctx.beginPath();
        });
    }

    _createContext () :void
    {
        if (!this.canvas) return console.warn('Canvas element os not defined');

        const context = this.canvas.getContext("2d");
        if (!context) return console.warn('Fail to get context of canvas');

        this.ctx = context;
    }

    _drawLine () :void
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

    /**
     * Clear all canvas
     */
    clearAll () :void
    {
        if (!this.ctx) return;

        this.ctx.clearRect(0, 0, this.width, this.height);
    }

    /**
     * Get image string (base64) in PNG or JPEG
     *
     * @return {string} BASE64
     * @param format
     */
    getImageB64 (format: any = "png") : string | undefined
    {
        if (!this.canvas || !this.ctx || typeof format !== "string") return;

        let imageFormat = ['png', 'jpeg'].includes(format) ? format : 'png';

        const imageString = this.canvas.toDataURL('image/' + imageFormat, 0.5);

        if (imageString && imageString.length)
            return imageString;
    }

    /**
     * Get element which contains canvas
     *
     * @return {HTMLDivElement | undefined}
     */
    getWrapper () :HTMLDivElement | undefined
    {
        return this.wrapper;
    }

    /**
     * Get canvas element
     *
     * @return {HTMLCanvasElement | undefined}
     */
    getCanvas () :HTMLCanvasElement | undefined
    {
        return this.canvas;
    }

    /**
     * Get canvas background color
     *
     * @return {string}
     */
    getBackground () :string
    {
        return this.bg;
    }

    getBorder (value: 'size' | 'color' | 'style') :number | string | undefined
    /**
     * Get canvas border data (size {number}, color {HEX}, style {string})
     *
     * @param {string} value    size, color, style
     *
     * @return {number | string | undefined}
     */
    {
        if (!this.border.hasOwnProperty(value)) return;

        return this.border[value];
    }

    /**
     * Get current drawing line color
     *
     * @return {string} HEX color
     */
    getLineColor () :string
    {
        return this.lineColor;
    }

    /**
     * Get current line width
     *
     * @return {number}
     */
    getLineWidth () :number
    {
        return this.lineWidth;
    }

    /**
     * Set cursor icon 'default' | 'crosshair' | 'pointer'. Default - crosshair.
     *
     * @param {'default' | 'crosshair' | 'pointer'} value  -|The text name of cursor.
     * @param {function} callback                          -|Callback function. argument - current cursor name.
     *                                                      |Must return boolean. If function return false
     *                                                      |method "SetWidth" won't work
     *
     */
    setMouseCursor (value: 'default' | 'crosshair' | 'pointer', callback: (cursor?: string) => (boolean) = () => true) :void
    {
        if (callback)
            if (!callback(this.mouse.cursor)) return;
        const setCursorToCanvas = (cursor: 'default' | 'crosshair' | 'pointer') => {
            if (!this.canvas) return;

            this.mouse.cursor = this.canvas.style.cursor = cursor;
        };

        if (!['default', 'crosshair', 'pointer'].includes(value)) return setCursorToCanvas('crosshair');

        setCursorToCanvas(value);
    }

    /**
     * Set width for canvas
     * @param {number} value       -|Width of canvas
     * @param {function} callback  -|Callback function. argument - current width. Must return boolean.
     *                              |If function return false method "SetWidth" won't work
     * @return {void}
     */
    setWidth (value: number, callback: (width?: number) => (boolean) = () => true) :void
    {
        if (callback)
            if (!callback(this.width)) return;

        if (this.canvas)
            this.canvas.width = value - this.border.size * 2;
        this.wrapper.style.width = value + this.sizeValue;
    }

    /**
     * Set height for canvas
     * @param {number} value       -|Width of canvas
     * @param {function} callback  -|Callback function. argument - current height. Must return boolean.
     *                              |If function return false method "SetHeight" won't work
     * @return {void}
     */
    setHeight (value: number, callback: (height?: number) => (boolean) = () => true) :void
    {
        if (callback)
            if (!callback(this.height)) return;

        if (this.canvas)
            this.canvas.height = value  - this.border.size * 2;
        this.wrapper.style.height = value + this.sizeValue;
    }

    /**
     * Set background for canvas
     * @param {string} value       -|Width of canvas
     * @param {function} callback  -|Callback function. argument - current background. Must return boolean.
     *                              |If function return false method "setBg" won't work
     * @return {void}
     */
    setBg (value: any, callback: (background?: string) => (boolean) = () => true) :void
    {
        if (callback)
            if (!callback(this.bg)) return;

        if (typeof value !== "string") return;
        if (!regexHEX.test(value)) return;

        if (this.canvas)
            this.canvas.style.backgroundColor = value;
    }

    /**
     * Set mouse coords
     * @param event                -|Mouse event
     * @param {function} callback  -|Callback function. argument - current cords object {x: number, y: number}.
     *                              |Must return boolean. If function return false method "_setCords" won't work
     * @return {void}
     */
    private _setCords (event: MouseEvent, callback: (cords?: {x: number, y: number}) => (boolean) = () => true) :void
    {
        if (callback)
            if (!callback({x: this.mouse.x, y: this.mouse.y})) return;

        const cords = getCords(event);

        this.mouse.x = cords.x;
        this.mouse.y = cords.y;
    }

    /**
     * Set canvas border size
     * @param {number} value       -|Border size value in "px"
     * @param {function} callback  -|Callback function. argument - current border size object.
     *                              |Must return boolean. If function return false method "setBorderSize" won't work
     * @return {void}
     */
    setBorderSize (value: any, callback: (border?: number) => (boolean) = () => true) :void
    {
        if (callback)
            if (!callback(this.border.size)) return;

        if (typeof value !== "number") return;

        if (value !== this.border.size)
            this.border.size = value;

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

    /**
     * Set color for canvas border
     * @param {string} value       -|Border color value in "HEX"
     * @param {function} callback  -|Callback function. argument - current border color.
     *                              |Must return boolean. If function return false method "setBorderColor" won't work
     * @return {void}
     */
    setBorderColor (value: any, callback: (color?: string) => (boolean) = () => true) :void
    {
        if (callback)
            if (!callback(this.border.color)) return;

        if (typeof value !== "string") return;
        if (!regexHEX.test(value)) return;

        if (value !== this.border.color)
            this.border.color = value;

        if (this.border.style === 'none')
            this.border.style = 'solid';

        if (this.wrapper)
            this.wrapper.style.borderColor = this.border.color;
    }

    /**
     * Set style for canvas border
     * @param {string} value       -|Border style value: 'solid', 'dashed' etc.
     * @param {function} callback  -|Callback function. argument - current border style.
     *                              |Must return boolean. If function return false method "setBorderStyle" won't work
     * @return {void}
     */
    setBorderStyle (value: any, callback: (style?: string) => (boolean) = () => true) :void
    {
        if (callback)
            if (!callback(this.border.style)) return;

        if (typeof value !== "string") return;

        if (value !== this.border.style)
            this.border.style = value;

        if (this.wrapper)
            this.wrapper.style.borderStyle = this.border.style;
    }

    /**
     * Set value for click 'mousedown'/'mouseup' in boolean
     * @param {boolean} value      -|Set boolean value what mean 'click'
     * @param {function} callback  -|Callback function. argument - current border style.
     *                              |Must return boolean. If function return false method "setMouseDown" won't work
     * @return {void}
     */
    setMouseDown (value: boolean | undefined = undefined, callback: (clicked?: boolean) => (boolean) = () => true) :void
    {
        if (callback)
            if (!callback(this.mouse.mousedown)) return;

        if (value === undefined) this.mouse.mousedown = !this.mouse.mousedown;

        if (typeof value === "boolean")
            this.mouse.mousedown = value;
    }

    /**
     * Set line width
     * @param {number} value       -|Line width
     * @param {function} callback  -|Callback function. argument {number} - current line width.
     *                              |Must return boolean. If function return false method "setLineWidth" won't work
     * @return {void}
     */
    setLineWidth (value: any, callback: (clicked?: number) => (boolean) = () => true) :void
    {
        if (callback)
            if (!callback(this.lineWidth)) return;

        if (typeof value !== 'number') return;

        this.lineWidth = value <= 0 ? 1 : value > 10 ? 10 : value;
    }

    /**
     * Set line color
     * @param {string} value       -|Line color "HEX"
     * @param {function} callback  -|Callback function. argument {string(HEX)} - current line width.
     *                              |Must return boolean. If function return false method "setLineColor" won't work
     * @return {void}
     */
    setLineColor (value: any, callback: (clicked?: string) => (boolean) = () => true) :void
    {
        if (callback)
            if (!callback(this.lineColor)) return;

        if (typeof value !== "string") return;

        if (!regexHEX.test(value)) return;

        this.lineColor = value;

        if (this.ctx)
            this.ctx.beginPath();
    }
}
