export default {
  setOutputDir(dir) {
    this.dir = dir;
  },
  getOutputDir () {
    return this.dir || null;
  },
  setTargetMpType(type) {
    this.mpType = type;
  },
  getTargetMpType() {
    return this.mpType || null;
  },
  setOriginMptype (type) {
    this.originType = type;
  },
  getOriginMptype () {
    return this.originType || null;
  }
}