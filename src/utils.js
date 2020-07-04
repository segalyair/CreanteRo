import page from "page.js";
export class Utils {
  static create_UUID() {
    var dt = new Date().getTime();
    var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
      var r = (dt + Math.random() * 16) % 16 | 0;
      dt = Math.floor(dt / 16);
      return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
    });
    return uuid;
  }
  static afterDOMRender(callback) {
    setTimeout(callback, 0);
  }
  static async checkPerformance(callback, name) {
    const t0 = performance.now();
    await callback();
    const t1 = performance.now();
    const totalMs = (t1 - t0).toFixed(4)
    console.log(`Call to '${name}' took ${totalMs}ms`);
  }
  static redirect(route) {
    page.redirect(route);
  }
}