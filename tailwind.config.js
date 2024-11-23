import formsPlugin from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            // Extend animations with your custom keyframes
            animation: {
                slide: 'slide 20s linear infinite',
                slideReverse: 'slide 20s linear infinite reverse',
                marquee: 'marquee 80s linear infinite',
                marquee2: 'marquee2 80s linear infinite',
                marqueeRaffle: 'marqueeRaffle 40s linear infinite',
                marquee2Raffle: 'marquee2Raffle 40s linear infinite'
            },
            backgroundImage: {
                'radial-gradient': 'radial-gradient(#6143FD 0%, #6143FD 0%, #6042FB 1%, #331F7E 100%)',
                'radial-gradient2': 'radial-gradient(#222569 0%, #0B0C27 100%)',
                "population-gradient": "linear-gradient(139deg, #9494ff 21%, #6e97ff 68%)",
                'twitter-gradient': 'linear-gradient(180deg, #dfdfdf, #9f9c9c)',
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
            },
            fontFamily: {
                monument: "Monument Extended",
                aeonikPro: "AeonikPro-Medium",
                parabole: "Parabole-TextRegular",
                talladegaKnight: "Talladega-Knight",
                gilroy:"GilRoyRegular",
                sourcecodepro: "SourceCodePro",
                sfpro: "SFPRODISPLAYREGULAR",
                roboto: "RobotoRegular",
                spaceGrotesk: "SpaceGrotesk"
            },
            keyframes: {
                marquee: {
                    '0%': { transform: 'translateX(0%)' },
                    '100%': { transform: 'translateX(-100%)' }
                },
                marquee2: {
                    '0%': { transform: 'translateX(100%)' },
                    '100%': { transform: 'translateX(0%)' }
                },
                marqueeRaffle: {
                    '0%': { transform: 'translateX(0%)' },
                    '100%': { transform: 'translateX(-100%)' }
                },
                marquee2Raffle: {
                    '0%': { transform: 'translateX(100%)' },
                    '100%': { transform: 'translateX(0%)' }
                },
            },
            utilities: {
                '.scrollbar-hide': {
                    /* IE and Edge */
                    '-ms-overflow-style': 'none',
                    /* Firefox */
                    'scrollbar-width': 'none',
                    /* Safari and Chrome */
                    '&::-webkit-scrollbar': {
                        display: 'none'
                    }
                }
            },
            borderWidth: {
                '0.6': '0.6px',
            },
            width: {
                '53': '53px',
                '369': '369px',
            },
            height: {
                '53': '53px',
            },
            borderRadius: {
                '16': '16px',
                '18': '18px',
            },
        },
    },
    plugins: [formsPlugin],
};
