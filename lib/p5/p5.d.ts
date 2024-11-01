declare global
{
    interface Window
    {
        preload: () => void;
        setup: () => void;
        draw: () => void;
    }
}

export {};
