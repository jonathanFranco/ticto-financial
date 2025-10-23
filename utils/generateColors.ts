const tinycolor = require("tinycolor2");

function generateColorPalette(hex: string) {
  return {
    50: tinycolor(hex).lighten(65).toString(),
    100: tinycolor(hex).lighten(55).toString(),
    200: tinycolor(hex).lighten(35).toString(),
    300: tinycolor(hex).lighten(15).toString(),
    400: tinycolor(hex).lighten(5).toString(),
    500: tinycolor(hex).toString(),
    600: tinycolor(hex).darken(5).toString(),
    700: tinycolor(hex).darken(15).toString(),
    800: tinycolor(hex).darken(35).toString(),
    900: tinycolor(hex).darken(55).toString(),
  };
}

module.exports = generateColorPalette;
