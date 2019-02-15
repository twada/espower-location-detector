'use strict';

const { SourceMapConsumer } = require('source-map');
const positionProps = ['source', 'line', 'column', 'name'];
const isEmptyMapping = (pos) => {
  return positionProps.every((prop) => pos[prop] === null);
};

class PositionDetector {
  constructor (sourceMap) {
    if (sourceMap) {
      this.sourceMapConsumer = new SourceMapConsumer(sourceMap);
    }
  }

  positionFor (currentNode) {
    const currentPosition = {
      source: currentNode.loc.source,
      line: currentNode.loc.start.line,
      column: currentNode.loc.start.column
    };
    if (this.sourceMapConsumer) {
      const found = this.sourceMapConsumer.originalPositionFor(currentPosition);
      if (found && !isEmptyMapping(found)) {
        return Object.assign({ mapped: true }, found);
      }
    }
    return Object.assign({ mapped: false }, currentPosition);
  }
}

module.exports = PositionDetector;
