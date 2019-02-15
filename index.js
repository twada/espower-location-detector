/**
 * espower-location-detector:
 *   AST source location detection helper for power-assert
 *
 * https://github.com/twada/espower-location-detector
 *
 * Copyright (c) 2015-2019 Takuto Wada
 * Licensed under the MIT license.
 *   https://github.com/twada/espower-location-detector/blob/master/LICENSE
 */
'use strict';

const PositionDetector = require('./lib/position-detector');
const SourceAdjuster = require('./lib/source-adjuster');

class EspowerLocationDetector {
  constructor ({ sourceMap, path, sourceRoot }) {
    this.positionDetector = new PositionDetector(sourceMap);
    this.sourceAdjuster = new SourceAdjuster({ sourceMap, path, sourceRoot });
  }

  locationFor (currentNode) {
    const pos = this.positionDetector.positionFor(currentNode);
    return {
      source: this.sourceAdjuster.relativize(pos.source, pos.mapped),
      line: pos.line,
      column: pos.column
    };
  }
}

module.exports = EspowerLocationDetector;
