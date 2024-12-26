/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = "#0a7ea4";
const tintColorDark = "#fff";

export const CommonColors = {
	pink: "#FFC4D6",
	purple: "#C0BFFF",
	green: "#B9FBC0",
	blue: "#c6def1",
	yellow: "#FFF2CC",
	palegreen: "#A8FFCF",
	palepurple: "#FEC0E1",
	palered: "#FFE1AC",
	paleyellow: "#B9FBC0",
	yellowaccent: "#fff3cc",
	blueaccent: "#d9e5ff",
	greenaccent: "#C9e4d3",
	redaccent: "#F9D6D2",
};

export const Colors = {
	light: {
		text: "#11181C",
		background: "#fff",
		tint: tintColorLight,
		icon: "#687076",
		tabIconDefault: "#687076",
		tabIconSelected: tintColorLight,
	},
	dark: {
		text: "#ECEDEE",
		background: "#151718",
		tint: tintColorDark,
		icon: "#9BA1A6",
		tabIconDefault: "#9BA1A6",
		tabIconSelected: tintColorDark,
	},
};
