'use strict';

const { relative, sep, basename } = require('path');
const isAbsolute = require('path-is-absolute');
const isUrl = require('is-url');
const fallbackOnBasename = (filepath) => {
  if (filepath) {
    if (filepath.split(sep).indexOf('..') !== -1) {
      return basename(filepath);
    } else if (isUrl(filepath)) {
      return basename(filepath);
    } else if (isAbsolute(filepath)) {
      return basename(filepath);
    }
  }
  return filepath;
};

class SourceAdjuster {
  constructor ({ sourceMap, path, sourceRoot }) {
    this.path = path;
    this.sourceRoot = sourceRoot;
    if (typeof sourceMap === 'string') {
      this.sourceMap = JSON.parse(sourceMap.replace(/^\)\]\}'/, ''));
    } else {
      this.sourceMap = sourceMap;
    }
  }

  relativize (filepathOrUrl, mappedWithSourceMap) {
    let filepath;
    if (mappedWithSourceMap && filepathOrUrl && this.sourceMap) {
      filepath = this.relativizeWithSourceMap(filepathOrUrl);
    } else {
      filepath = this.relativizeWithoutSourceMap(filepathOrUrl);
    }
    return fallbackOnBasename(filepath);
  }

  relativizeWithSourceMap (filepathOrUrl) {
    const sourceMapRoot = this.sourceMap.sourceRoot;
    if (sourceMapRoot && isUrl(sourceMapRoot)) {
      return relative(sourceMapRoot, filepathOrUrl);
    }
    if (this.sourceRoot && isAbsolute(this.sourceRoot) && isAbsolute(filepathOrUrl)) {
      return relative(this.sourceRoot, filepathOrUrl);
    }
    if (sourceMapRoot && isAbsolute(sourceMapRoot) && isAbsolute(filepathOrUrl)) {
      return relative(sourceMapRoot, filepathOrUrl);
    }
    if (isUrl(filepathOrUrl)) {
      return basename(filepathOrUrl);
    }
    return filepathOrUrl;
  }

  relativizeWithoutSourceMap (filepathOrUrl) {
    const tmpPath = this.path || filepathOrUrl;
    if (this.sourceRoot && isAbsolute(this.sourceRoot) && isAbsolute(tmpPath)) {
      return relative(this.sourceRoot, tmpPath);
    } else {
      return this.path;
    }
  }
}

module.exports = SourceAdjuster;
