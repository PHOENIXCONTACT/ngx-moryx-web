interface String {
  isNullOrWhiteSpaces(): boolean;
}

String.prototype.isNullOrWhiteSpaces = function (this: string): boolean {
  return this === null || this.trim() === '';
};
