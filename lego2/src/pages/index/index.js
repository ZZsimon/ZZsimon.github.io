import 'core-js'; // included < Stage 4 proposals
import 'regenerator-runtime/runtime';

import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import React, { useState, useEffect } from 'react';

import Container from './Container';

export default function App(props) {
  return (
    <DndProvider backend={HTML5Backend}>
      <Container {...props} />
    </DndProvider>
  );
}
