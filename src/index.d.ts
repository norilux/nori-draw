declare module "nori-draw"
{
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

    export default class Draw
    {
        constructor (wrapper: HTMLDivElement, options: Options)
        public wrapper: HTMLDivElement;
        public canvas: HTMLCanvasElement | undefined;
        public width: number;
        public height: number;
        public sizeValue: 'px' | '%';
        public bg: string;
        public ctx: CanvasRenderingContext2D | undefined;
        public lineWidth: number;
        public lineColor: string;
        public drawCallback?: (object: this) => void;
        public border: {
            size: number;
            color: string;
            style: string;
        };
        public mouse: {
            x: number;
            y: number;
            mousedown: boolean;
            cursor: 'default' | 'crosshair' | 'pointer';
        };
        private _start () :void
        private _createCanvas () :void
        private _addListeners () :void
        private _createContext () :void
        private _drawLine () :void

        /**
         * Clear all canvas
         */
        public clearAll () :void

        /**
         * Get image string (base64) in PNG or JPEG
         *
         * @return {string | undefined} BASE64
         * @param format
         */
        public getImageB64 (format: any | 'any'): string | undefined

        /**
         * Get element which contains canvas
         *
         * @return {HTMLDivElement | undefined}
         */
        public getWrapper () :HTMLDivElement | undefined

        /**
         * Get canvas element
         *
         * @return {HTMLCanvasElement | undefined}
         */
        public getCanvas () :HTMLCanvasElement | undefined

        /**
         * Get canvas background color
         *
         * @return {string}
         */
        public getBackground () :string

        /**
         * Get canvas border data (size {number}, color {HEX}, style {string})
         *
         * @param {string} value    size, color, style
         *
         * @return {number | string | undefined}
         */
        public getBorder (value: 'size' | 'color' | 'style') :number | string | undefined


        /**
         * Get current drawing line color
         *
         * @return {string} HEX color
         */
        public getLineColor () :string

        /**
         * Get current line width
         *
         * @return {number}
         */
        public getLineWidth () :number

        /**
         * Set cursor icon 'default' | 'crosshair' | 'pointer'. Default - crosshair.
         *
         * @param {'default' | 'crosshair' | 'pointer'} value  -|The text name of cursor.
         * @param {function} callback                          -|Callback function. argument - current cursor name.
         *                                                      |Must return boolean. If function return false
         *                                                      |method "SetWidth" won't work
         *
         */
        public setMouseCursor (
            value: 'default' | 'crosshair' | 'pointer',
            callback: (cursor?: string) => (boolean)
        ) :void

        /**
         * Set width for canvas
         * @param {number} value       -|Width of canvas
         * @param {function} callback  -|Callback function. argument - current width. Must return boolean.
         *                              |If function return false method "SetWidth" won't work
         * @return {void}
         */
        public setWidth (value: number, callback: (width?: number) => (boolean)) :void

        /**
         * Set height for canvas
         * @param {number} value       -|Width of canvas
         * @param {function} callback  -|Callback function. argument - current height. Must return boolean.
         *                              |If function return false method "SetHeight" won't work
         * @return {void}
         */
        public setHeight (value: number, callback: (height?: number) => (boolean)) :void

        /**
         * Set background for canvas
         * @param {string} value       -|Width of canvas
         * @param {function} callback  -|Callback function. argument - current background. Must return boolean.
         *                              |If function return false method "setBg" won't work
         * @return {void}
         */
        public setBg (value: any, callback: (background?: string) => (boolean)) :void

        /**
         * Set mouse coords
         * @param event                -|Mouse event
         * @param {function} callback  -|Callback function. argument - current cords object {x: number, y: number}.
         *                              |Must return boolean. If function return false method "_setCords" won't work
         * @return {void}
         */
        private _setCords (
            event: MouseEvent | TouchEvent,
            callback: (cords?: {x: number, y: number}) => (boolean)
        ) :void

        /**
         * Set canvas border size
         * @param {number} value       -|Border size value in "px"
         * @param {function} callback  -|Callback function. argument - current border size object.
         *                              |Must return boolean. If function return false method "setBorderSize" won't work
         * @return {void}
         */
        public setBorderSize (value: any, callback: (border?: number) => (boolean)) :void

        /**
         * Set color for canvas border
         * @param {string} value       -|Border color value in "HEX"
         * @param {function} callback  -|Callback function. argument - current border color.
         *                              |Must return boolean. If function return false method "setBorderColor" won't work
         * @return {void}
         */
        public setBorderColor (value: any, callback: (color?: string) => (boolean)) :void

        /**
         * Set style for canvas border
         * @param {string} value       -|Border style value: 'solid', 'dashed' etc.
         * @param {function} callback  -|Callback function. argument - current border style.
         *                              |Must return boolean. If function return false method "setBorderStyle" won't work
         * @return {void}
         */
        public setBorderStyle (value: any, callback: (style?: string) => (boolean)) :void

        /**
         * Set value for click 'mousedown'/'mouseup' in boolean
         * @param {boolean} value      -|Set boolean value what mean 'click'
         * @param {function} callback  -|Callback function. argument - current border style.
         *                              |Must return boolean. If function return false method "setMouseDown" won't work
         * @return {void}
         */
        public setMouseDown (value: boolean | undefined, callback: (clicked?: boolean) => (boolean)) :void

        /**
         * Set line width
         * @param {number} value       -|Line width
         * @param {function} callback  -|Callback function. argument {number} - current line width.
         *                              |Must return boolean. If function return false method "setLineWidth" won't work
         * @return {void}
         */
        public setLineWidth (value: any, callback: (clicked?: number) => (boolean)) :void

        /**
         * Set line color
         * @param {string} value       -|Line color "HEX"
         * @param {function} callback  -|Callback function. argument {string(HEX)} - current line width.
         *                              |Must return boolean. If function return false method "setLineColor" won't work
         * @return {void}
         */
        public setLineColor (value: any, callback: (clicked?: string) => (boolean)) :void

        public addCallbackToDraw (callback: (object: this) => void) : void
    }
}