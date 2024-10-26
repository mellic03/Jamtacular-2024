
const KEY_UP     = 0;
const KEY_DOWN   = 1;
const KEY_TAPPED = 2;

const MOUSE_UP       = 0;
const MOUSE_DOWN     = 1;
const MOUSE_CLICKED  = 2;
const MOUSE_DRAGGED  = 3;
const CLICK_MS = 200;

class idk_IO
{
    keycodes = {
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

    private keystate: Array<number>;
    private mouse_curr: Array<boolean>;
    private mouse_prev: Array<boolean>;
    private mouse_time: number = 0.0;
    private clickflag: boolean = false;
    
    constructor()
    {
        this.mouse_curr = [ false, false, false, false, false ];
        this.mouse_prev = [ false, false, false, false, false ];
    }


    private _check_mouse_down()
    {
        return mouseIsPressed;
    }

    private _check_mouse_up()
    {
        if (mouseIsPressed == false)
        {
            this.clickflag = false;
            return true;
        }

        return false;
    }

    private _check_mouse_click()
    { 
        const c0 = this.mouse_prev[MOUSE_UP] == false;
        const c1 = this.mouse_curr[MOUSE_UP] == true;
        const c2 = this.mouse_time < CLICK_MS;

        if (c0 && c1 && c2)
        {
            return true;
        }

        else
        {
            return false;
        }
    }


    update()
    {
        this.mouse_prev[MOUSE_DOWN]    = this.mouse_curr[MOUSE_DOWN];
        this.mouse_prev[MOUSE_UP]      = this.mouse_curr[MOUSE_UP];
        this.mouse_prev[MOUSE_CLICKED] = this.mouse_curr[MOUSE_CLICKED];

        this.mouse_curr[MOUSE_DOWN]    = this._check_mouse_down();
        this.mouse_curr[MOUSE_UP]      = this._check_mouse_up();
        this.mouse_curr[MOUSE_CLICKED] = this._check_mouse_click();

        if (this.mouse_curr[MOUSE_DOWN])
        {
            this.mouse_time += deltaTime;
        }

        else
        {
            this.mouse_time = 0.0;
        }

        // for (let i=8; i<=222; i++)
        // {
        //     let state = KEY_UP;

        //     if (keyIsDown(i))
        //     {
        //         state = KEY_DOWN;
        //     }

        //     else if (this.keystate[i] == KEY_DOWN)
        //     {
        //         state = KEY_TAPPED;
        //     }

        //     else
        //     {
        //         state = KEY_UP;
        //     }

        //     this.keystate[i] = state;
        // }
    }

    keyTapped( keycode: number ): boolean
    {
        return false;
    }

    keyUp( keycode: number ): boolean
    {
        return !keyIsDown(keycode);
    }

    keyDown( keycode: number ): boolean
    {
        return keyIsDown(keycode);
    }

    mouseDown()
    {
        return this.mouse_curr[MOUSE_DOWN];
    }
    
    mouseClicked()
    {
        return this.mouse_curr[MOUSE_CLICKED];
    }
}


const IO = new idk_IO;
export { IO };

