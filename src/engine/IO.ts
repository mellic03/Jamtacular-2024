import { EventEmitter } from "./sys-event.js";

const KEY_UP     = 0;
const KEY_DOWN   = 1;
const KEY_TAPPED = 2;

const MOUSE_UP       = 0;
const MOUSE_DOWN     = 1;
const MOUSE_CLICKED  = 2;
const MOUSE_DRAGGED  = 3;
const CLICK_MS = 200;



const KeyPressEvents     = new EventEmitter<number>();
const KeyReleaseEvents   = new EventEmitter<number>();
const KeyTypeEvents      = new EventEmitter<number>();

const MousePressEvents   = new EventEmitter<number>();
const MouseReleaseEvents = new EventEmitter<number>();
const MouseClickEvents   = new EventEmitter<number>();



export const KEYCODE = {
    LEFT: 37, RIGHT: 39,
    UP: 38, DOWN: 40,
    SPACE: 32,
    ESC: 27, TAB: 9,
    
    A: 65, B: 66, C: 67, D: 68,
    E: 69, F: 70, G: 71, H: 72,
    I: 73, J: 74, K: 75, L: 76,
    M: 77, N: 78, O: 79, P: 80,
    Q: 81, R: 82, S: 83, T: 84,
    U: 85, V: 86, W: 87, X: 88,
    Y: 89, Z: 90,
};


export const MOUSE = {
    LEFT: 0, RIGHT: 1, MID: 2
};


export class IO
{
    private static keystate:   Array<number>;
    private static mouse_curr: Array<boolean>;
    private static mouse_prev: Array<boolean>;
    private static mouse_time: number = 0.0;
    public  static mousewheel_delta: number = 0.0;

    // private static key_events   = new EventEmitter<number>();
    // private static mouse_events = new EventEmitter<number>();

    public static preload() {  }
    public static draw() {  }

    public static setup(): void
    {
        IO.keystate   = new Array<number>(222);
        IO.mouse_curr = [ false, false, false, false, false ];
        IO.mouse_prev = [ false, false, false, false, false ];
    }


    private static _check_mouse_down()
    {
        return mouseIsPressed;
    }

    private static _check_mouse_up()
    {
        if (mouseIsPressed == false)
        {
            return true;
        }

        return false;
    }

    private static _check_mouse_click()
    { 
        const c0 = IO.mouse_prev[MOUSE_UP] == false;
        const c1 = IO.mouse_curr[MOUSE_UP] == true;
        const c2 = IO.mouse_time < CLICK_MS;

        if (c0 && c1 && c2)
        {
            return true;
        }

        else
        {
            return false;
        }
    }


    static update()
    {
        IO.mouse_prev[MOUSE_DOWN]    = IO.mouse_curr[MOUSE_DOWN];
        IO.mouse_prev[MOUSE_UP]      = IO.mouse_curr[MOUSE_UP];
        IO.mouse_prev[MOUSE_CLICKED] = IO.mouse_curr[MOUSE_CLICKED];

        IO.mouse_curr[MOUSE_DOWN]    = IO._check_mouse_down();
        IO.mouse_curr[MOUSE_UP]      = IO._check_mouse_up();
        IO.mouse_curr[MOUSE_CLICKED] = IO._check_mouse_click();

        if (IO.mouse_curr[MOUSE_DOWN])
        {
            IO.mouse_time += deltaTime;
        }

        else
        {
            IO.mouse_time = 0.0;
        }

        IO.mousewheel_delta = 0.0;


        for (let i=8; i<=222; i++)
        {
            let state = KEY_UP;

            if (keyIsDown(i))
            {
                state = KEY_DOWN;
            }

            else if (IO.keystate[i] == KEY_DOWN)
            {
                state = KEY_TAPPED;
            }

            else
            {
                state = KEY_UP;
            }

            IO.keystate[i] = state;
        }
    }

    static keyTapped( keycode: number ): boolean
    {
        return (IO.keystate[keycode] == KEY_TAPPED);
    }

    static keyUp( keycode: number ): boolean
    {
        return !keyIsDown(keycode);
    }

    static keyDown( keycode: number ): boolean
    {
        return keyIsDown(keycode);
    }

    static mouseDown()
    {
        return IO.mouse_curr[MOUSE_DOWN];
    }
    
    static mouseClicked()
    {
        return IO.mouse_curr[MOUSE_CLICKED];
    }

    static mouseWheel()
    {
        return IO.mousewheel_delta;
    }


    static onKeyPress   (k: number, callback: Function) { KeyPressEvents  .on(k, callback) }
    static onKeyRelease (k: number, callback: Function) { KeyReleaseEvents.on(k, callback) }
    static onKeyType    (k: number, callback: Function) { KeyTypeEvents   .on(k, callback) }

    static onMousePress   (callback: Function) { MousePressEvents  .on(0, callback) }
    static onMouseRelease (callback: Function) { MouseReleaseEvents.on(0, callback) }
    static onMouseClick   (callback: Function) { MouseClickEvents  .on(0, callback) }
}



window.keyPressed    = (e?: KeyboardEvent) => { KeyPressEvents  .emit(e.keyCode, e) }
window.keyReleased   = (e?: KeyboardEvent) => { KeyReleaseEvents.emit(e.keyCode, e) }
window.keyTyped      = (e?: KeyboardEvent) => { KeyTypeEvents   .emit(e.keyCode, e) }


window.mousePressed  = (e?: MouseEvent) => { MousePressEvents  .emit(0, e)  }
window.mouseReleased = (e?: MouseEvent) => { MouseReleaseEvents.emit(0, e)  }
window.mouseClicked  = (e?: MouseEvent) => { MouseClickEvents  .emit(0, e)  }
window.mouseWheel    = (e?: WheelEvent) => { IO.mousewheel_delta = e.deltaY }

