export function toHex(s: string) {
  // utf8 to latin1
  var s = unescape(encodeURIComponent(s));
  var h = "";
  for (var i = 0; i < s.length; i++) {
    h += s.charCodeAt(i).toString(16);
  }
  return h;
}

export function isEmpty(obj: Record<string, any>): boolean {
  return Object.keys(obj).length === 0;
}
