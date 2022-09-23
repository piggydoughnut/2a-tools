import path from "path";
import { readFileSync } from "fs";

export const PageParams = {
  MARGIN: 40,
  A4_WIDTH: 595.28,
  A4_HEIGHT: 841.89,
  LINE_HEIGHT: 20,
  FOOTER_HEIGHT: 680,
};

export const Colors = {
  BLACK: "#000000",
  GRAY: "#6F6E70",
};

export const FontSize = {
  P: 10,
  H1: 40,
  H2: 18,
  H3: 16,
  H4: 12,
};

const mainPath = path.join(process.cwd(), "public");
const fontsPath = path.join(mainPath, "fonts");

export const Fonts = {
  inriaBold: readFileSync(path.join(fontsPath, "InriaSans-Bold.ttf")),
  robotoMono: readFileSync(
    path.join(fontsPath, "RobotoMono-VariableFont_wght.ttf")
  ),
  inriaRegular: readFileSync(path.join(fontsPath, "InriaSans-Regular.ttf")),
};

export const LOGO_IMAGE = path.join(mainPath, "logo.png");

export const Labels = {
  SUBTOTAL: "Subtotal",
  GST: "GST(15%)",
  TOTAL: "Total",
  DISCOUNT: "Discount",
  AMOUNT_DUE: "Amount due",
};

export const DATE_FORMAT = "do MMM yyyy";
