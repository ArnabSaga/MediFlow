import { isValid, parse } from "date-fns";

export const convertToDateTime = (dataString: string | undefined) => {
  if (!dataString) return undefined;

  const date = parse(dataString, "yyyy-MM-dd", new Date());

  if (!isValid(date)) return undefined;

  return date;
};
