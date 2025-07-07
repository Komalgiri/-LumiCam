
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				'nunito': ['Nunito', 'sans-serif'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				// New pastel kawaii colors - no pink!
				kawaii: {
					blue: '#AEE2FF',
					'blue-light': '#E0F4FF',
					mint: '#C9F8DC',
					'mint-light': '#E8FCF0',
					lavender: '#D6C8FF',
					'lavender-light': '#EDE8FF',
					yellow: '#FFF6A2',
					'yellow-light': '#FFFCE5',
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
				'3xl': '1.5rem',
				'4xl': '2rem',
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'shutter-open': {
					'0%': {
						transform: 'translateY(0%)'
					},
					'100%': {
						transform: 'translateY(-100%)'
					}
				},
				'shutter-close': {
					'0%': {
						transform: 'translateY(100%)'
					},
					'100%': {
						transform: 'translateY(0%)'
					}
				},
				'float': {
					'0%, 100%': {
						transform: 'translateY(0px)'
					},
					'50%': {
						transform: 'translateY(-20px)'
					}
				},
				'twinkle': {
					'0%, 100%': {
						opacity: '0.3',
						transform: 'scale(0.8)'
					},
					'50%': {
						opacity: '1',
						transform: 'scale(1.2)'
					}
				},
				'sparkle': {
					'0%': {
						transform: 'scale(0) rotate(0deg)',
						opacity: '0'
					},
					'50%': {
						transform: 'scale(1) rotate(180deg)',
						opacity: '1'
					},
					'100%': {
						transform: 'scale(0) rotate(360deg)',
						opacity: '0'
					}
				},
				'sparkle-glow': {
					'0%, 100%': {
						boxShadow: '0 0 20px rgba(174, 226, 255, 0.5)'
					},
					'50%': {
						boxShadow: '0 0 40px rgba(174, 226, 255, 0.8)'
					}
				},
				'bounce-bubble': {
					'0%, 100%': {
						transform: 'scale(1)',
						opacity: '1'
					},
					'50%': {
						transform: 'scale(1.2)',
						opacity: '0.8'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'shutter-open': 'shutter-open 1s ease-in-out forwards',
				'shutter-close': 'shutter-close 1s ease-in-out forwards',
				'float': 'float 3s ease-in-out infinite',
				'twinkle': 'twinkle 2s ease-in-out infinite',
				'sparkle': 'sparkle 1s ease-in-out infinite',
				'sparkle-glow': 'sparkle-glow 2s ease-in-out infinite',
				'bounce-bubble': 'bounce-bubble 0.8s ease-in-out infinite',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
