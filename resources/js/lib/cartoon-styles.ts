export interface CartoonStyle {
    value: string;
    label: string;
    prompt: string;
}

export const CARTOON_STYLES: readonly CartoonStyle[] = [
    {
        value: 'pixar',
        label: 'Pixar',
        prompt: 'Transform this image into a Pixar-style 3D animated character with expressive features, soft lighting, vibrant colors, and polished CGI aesthetic',
    },
    {
        value: 'south-park',
        label: 'South Park',
        prompt: 'Convert this image into a South Park character with simple cutout animation style, flat colors, minimal shading, and characteristic blocky proportions',
    },
    {
        value: 'disney',
        label: 'Disney',
        prompt: 'Transform this image into a classic Disney animation style with smooth hand-drawn aesthetics, expressive eyes, elegant proportions, and warm color palette',
    },
    {
        value: 'anime',
        label: 'Anime/Manga',
        prompt: 'Convert this image into anime/manga style with large expressive eyes, detailed hair, cel-shaded coloring, and characteristic Japanese animation aesthetics',
    },
    {
        value: 'simpsons',
        label: 'Simpsons',
        prompt: 'Transform this image into The Simpsons art style with yellow skin tone, simplified features, thick outlines, and characteristic flat 2D animation look',
    },
    {
        value: 'family-guy',
        label: 'Family Guy',
        prompt: 'Convert this image into Family Guy animation style with simplified features, minimal detail, thick outlines, and characteristic flat cartoon aesthetic',
    },
    {
        value: 'looney-tunes',
        label: 'Looney Tunes',
        prompt: 'Transform this image into classic Looney Tunes style with exaggerated proportions, bold outlines, vibrant colors, and vintage cartoon aesthetics',
    },
    {
        value: 'tom-jerry',
        label: 'Tom & Jerry',
        prompt: 'Convert this image into Tom and Jerry classic animation style with expressive features, smooth curves, vintage cartoon aesthetic, and theatrical character design',
    },
    {
        value: 'classic-disney',
        label: 'Classic Disney',
        prompt: 'Transform this image into 1930s-1950s classic Disney animation style with hand-drawn vintage aesthetics, softer colors, and timeless character design',
    },
];
