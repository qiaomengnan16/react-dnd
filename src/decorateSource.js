import React, { Component, PropTypes } from 'react';
import shallowEqual from './utils/shallowEqual';
import shallowEqualScalar from './utils/shallowEqualScalar';
import invariant from 'invariant';
import isPlainObject from 'lodash/lang/isPlainObject';
import checkDecoratorArguments from './utils/checkDecoratorArguments';
import wrapComponent from './wrapComponent';
import registerSource from './registerSource';
import createSourceFactory from './createSourceFactory';
import createSourceMonitor from './createSourceMonitor';
import isValidType from './utils/isValidType';

export default function decorateSource(type, spec, collect, options = {}) {
  checkDecoratorArguments('DragSource', 'type, spec, collect[, options]', ...arguments);
  let getType = type;
  if (typeof type !== 'function') {
    invariant(
      isValidType(type),
      'Expected "type" provided as the first argument to DragSource to be ' +
      'a string, or a function that returns a string given the current props. ' +
      'Instead, received %s.',
      type
    );
    getType = () => type;
  }
  invariant(
    isPlainObject(spec),
    'Expected "spec" provided as the second argument to DragSource to be ' +
    'a plain object. Instead, received %s.',
    spec
  );
  const createSource = createSourceFactory(spec);
  invariant(
    typeof collect === 'function',
    'Expected "collect" provided as the third argument to DragSource to be ' +
    'a function that returns a plain object of props to inject. ' +
    'Instead, received %s.',
    collect
  );
  invariant(
    isPlainObject(options),
    'Expected "options" provided as the fourth argument to DragSource to be ' +
    'a plain object when specified. ' +
    'Instead, received %s.',
    collect
  );

  return function wrapSource(DecoratedComponent) {
    return wrapComponent({
      connectBackend: (backend, sourceId) => backend.connectDragSource(sourceId),
      containerDisplayName: 'DragSource',
      createHandler: createSource,
      registerHandler: registerSource,
      createMonitor: createSourceMonitor,
      DecoratedComponent,
      getType,
      collect,
      options
    });
  };
}