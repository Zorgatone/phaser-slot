import { ImageKeys } from "../enums/imageKeys";
import { Symbols } from "../enums/symbols";

export const symbolMap: { [key in Symbols]: ImageKeys } = {
  [Symbols.A]: ImageKeys.AConnect,
  [Symbols.H1]: ImageKeys.H1Connect,
  [Symbols.H2]: ImageKeys.H2Connect,
  [Symbols.H3]: ImageKeys.H3Connect,
  [Symbols.H4]: ImageKeys.H4Connect,
  [Symbols.H5]: ImageKeys.H5Connect,
  [Symbols.H6]: ImageKeys.H6Connect,
  [Symbols.J]: ImageKeys.JConnect,
  [Symbols.K]: ImageKeys.KConnect,
  [Symbols.M1]: ImageKeys.M1Connect,
  [Symbols.M2]: ImageKeys.M2Connect,
  [Symbols.M3]: ImageKeys.M3Connect,
  [Symbols.M4]: ImageKeys.M4Connect,
  [Symbols.M5]: ImageKeys.M5Connect,
  [Symbols.M6]: ImageKeys.M6Connect,
  [Symbols.Nine]: ImageKeys.NineConnect,
  [Symbols.Q]: ImageKeys.QConnect,
  [Symbols.Ten]: ImageKeys.TenConnect,
};
