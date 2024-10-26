declare global
{
    interface Window
    {
        preload: () => void;
        setup: () => void;
        draw: () => void;
        mousePressed: () => void;
    }
}

export {};
