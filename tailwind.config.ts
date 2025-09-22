import TypographyPlugin from "@tailwindcss/typography";
import FormPlugin from "@tailwindcss/forms";
import ContainerQueriesPlugin from "@tailwindcss/container-queries";
import { type Config } from "tailwindcss";

const config: Config = {
	content: ["./src/**/*.{ts,tsx}"],
	theme: {
		extend: {
			colors: {
				toyota: {
					red: "#EB0A1E",
					dark: "#1C1C1C",
					gray: {
						50: "#F5F5F5",
						100: "#EDEDED",
						200: "#D9D9D9",
						500: "#6B7280",
						700: "#3F3F46",
					},
				},
			},
			fontFamily: {
				helvetica: ['"Helvetica Neue"', "Helvetica", "Arial", "ui-sans-serif", "system-ui", "sans-serif"],
			},
		},
	},
	plugins: [TypographyPlugin, FormPlugin, ContainerQueriesPlugin],
};

export default config;
