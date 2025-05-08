import React from 'react';
import styled, { keyframes } from 'styled-components';

const l3 = keyframes`
  to {
    transform: rotate(1turn);
  }
`;

const LoaderComponent = styled.div`
  width: 50px;
  padding: 6px;
  aspect-ratio: 1;
  border-radius: 50%;
  background: #262fd4;
  --_m: 
    conic-gradient(#0000 10%,#000),
    linear-gradient(#000 0 0) content-box;
  -webkit-mask: var(--_m);
          mask: var(--_m);
  -webkit-mask-composite: source-out;
          mask-composite: subtract;
  animation: ${l3} 1s infinite linear;
`;

const LoaderContainer = styled.div`
  position: absolute;
  top: 65%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Loader = () => {
  return (
    <LoaderContainer>
      <LoaderComponent />
      <span style={{ color: '#60a5fa', fontSize: '16px', marginTop: '10px' }}>
        Loading...
      </span>
    </LoaderContainer>
  );
};

export default Loader;