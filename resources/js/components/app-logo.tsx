export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center p-1">
                <img src="/cartoonio192.png" alt="Logo" className="size-full object-contain" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold">
                    Laravel Starter Kit
                </span>
            </div>
        </>
    );
}
