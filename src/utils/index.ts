export class Utils {}

export function wait(time: number) {
  return new Promise((resolve) => setTimeout(resolve, Math.max(0, time)));
}
