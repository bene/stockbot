export function delay(milliseconds: number) {
  return new Promise<any>((resolve) => setTimeout(resolve, milliseconds));
}
