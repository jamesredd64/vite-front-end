import React from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  @keyframes l3 {to{transform: rotate(1turn)}}
  // 0% {
  //   transform: rotate(0deg);
  // }
  // 100% {
  //   transform: rotate(360deg);
  // }
`;

const Spinner = () => {
  return (
    
    <div style={{
      position: 'absolute',
      top: '60%',
      left: '50%',
      transform: 'translate(-60%, -50%)',
      textAlign: 'center'
    }}>
      <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}> 
      <Loader />
      <span style={{ color: '#3498db', fontSize: '16px', marginTop: '10px' }}>
        Loading...
      </span>
    </div>
    </div>
  );
};

const Loader = styled.div`
  position: relative;
  top: 60%;
  left: 50%;
  transform: translate(-60%, -50%);
  .loader {
  width: 50px;
  padding: 8px;
  aspect-ratio: 1;
  border-radius: 50%;
  background: #25b09b;
  --_m: 
    conic-gradient(#0000 10%,#000),
    linear-gradient(#000 0 0) content-box;
  -webkit-mask: var(--_m);
          mask: var(--_m);
  -webkit-mask-composite: source-out;
          mask-composite: subtract;
  animation: l3 1s infinite linear;

`;

// const Spinner = () => {
//   return (
//     <div style={{
//       position: 'absolute',
//       top: '50%',
//       left: '50%',
//       transform: 'translate(-50%, -50%)',
//       textAlign: 'center'
//     }}>
//       <Loader />
//       <span style={{ color: '#3498db', fontSize: '16px', marginTop: '10px' }}>
//         Loading...
//       </span>
//     </div>
//   );
// };

export default Spinner;

// import React from 'react';

// function Loader() {
//   return (
//     <div className="loader-container">
//       <div className="animate-spin 
//             rounded-full 
//             border-4 
//             border-brand-400 
//             border-t-transparent 
//             border-b-transparent 
//             shadow-lg " />
//       <span className="text-brand-500 dark:text-brand-400 font-semibold ">
//         Loading...
//       </span>
//       <style>
//         {`
//           .loader {
//             border: 10px solid #f3f3f3;
//             border-top: 10px solid #3498db;
//             border-radius: 50%;
//             width: 80px;
//             height: 80px;
//             animation: spin 1s linear infinite;
// }
//           }
//         `}
//       </style>
//     </div>
//   );
// }

// export default Loader;

// import React, { useState, useEffect } from 'react';

// const lerp = (x: number, x0: number, x1: number, y0: number, y1: number) => {
//   const t = (x - x0) / (x1 - x0);
//   return y0 + t * (y1 - y0);
// };

// const lerpColor = (x: number, x0: number, x1: number, y0: number, y1: number) => {
//   const b0 = y0 & 0xff;
//   const g0 = (y0 & 0xff00) >> 8;
//   const r0 = (y0 & 0xff0000) >> 16;

//   const b1 = y1 & 0xff;
//   const g1 = (y1 & 0xff00) >> 8;
//   const r1 = (y1 & 0xff0000) >> 16;

//   const r = Math.floor(lerp(x, x0, x1, r0, r1));
//   const g = Math.floor(lerp(x, x0, x1, g0, g1));
//   const b = Math.floor(lerp(x, x0, x1, b0, b1));

//   return "#" + ("00000" + ((r << 16) | (g << 8) | b).toString(16)).slice(-6);
// };

// const lerpTable = (vIndex: number, tValue: number, table: any[], canExtrapolate: boolean, lerpFunc = lerp) => {
//   const rowCount = table.length;

//   for (let i = 0; i < rowCount; ++i) {
//     let a = table[i][0];

//     if (i === 0 && tValue < a) {
//       if (canExtrapolate) {
//         return lerpFunc(
//           tValue,
//           a,
//           table[i + 1][0],
//           table[i][vIndex],
//           table[i + 1][vIndex]
//         );
//       }
//       return table[i][vIndex];
//     }

//     if (i === rowCount - 1 && tValue >= a) {
//       if (canExtrapolate) {
//         return lerpFunc(
//           tValue,
//           table[i - 1][0],
//           a,
//           table[i - 1][vIndex],
//           table[i][vIndex]
//         );
//       }
//       return table[i][vIndex];
//     }

//     if (tValue >= a && tValue <= table[i + 1][0]) {
//       return lerpFunc(
//         tValue,
//         a,
//         table[i + 1][0],
//         table[i][vIndex],
//         table[i + 1][vIndex]
//       );
//     }
//   }

//   return 0;
// };

// const lerpColorTable = (tValue: number, table: [number, number][], canExtrapolate: boolean): string => {
//   const rowCount = table.length;

//   if (rowCount === 0) {
//     return "#000000"; // Default color for empty table
//   }

//   // Handle cases before the first entry
//   if (tValue < table[0][0]) {
//     if (canExtrapolate && rowCount > 1) {
//       return lerpColor(tValue, table[0][0], table[1][0], table[0][1], table[1][1]);
//     }
//     return lerpColor(tValue, table[0][0], table[0][0], table[0][1], table[0][1]); // Return color of first entry
//   }

//   // Handle cases after the last entry
//   if (tValue >= table[rowCount - 1][0]) {
//     if (canExtrapolate && rowCount > 1) {
//       return lerpColor(tValue, table[rowCount - 2][0], table[rowCount - 1][0], table[rowCount - 2][1], table[rowCount - 1][1]);
//     }
//     return lerpColor(tValue, table[rowCount - 1][0], table[rowCount - 1][0], table[rowCount - 1][1], table[rowCount - 1][1]); // Return color of last entry
//   }

//   // Handle cases within the table
//   for (let i = 0; i < rowCount - 1; ++i) {
//     if (tValue >= table[i][0] && tValue <= table[i + 1][0]) {
//       return lerpColor(tValue, table[i][0], table[i + 1][0], table[i][1], table[i + 1][1]);
//     }
//   }

//   // Should not reach here if logic is correct, but as a fallback:
//   return "#000000";
// };
// const Spinner = () => {
//   const [offset, setOffset] = useState(445);
//   const [stroke, setStroke] = useState("#ededed");
//   const pathWidth = 372;
//   const speed = 1;
//   const colorTable: [number, number][] = [
//     [0.0, 0xf15a31],
//     [0.2, 0xffd31b],
//     [0.33, 0xa6ce42],
//     [0.4, 0x007ac1],
//     [0.45, 0x007ac1],
//     [0.55, 0x007ac1],
//     [0.6, 0x007ac1],
//     [0.67, 0xa6ce42],
//     [0.8, 0xffd31b],
//     [1.0, 0xf15a31]
//   ];
//   const startTime = React.useRef(Date.now());

//   useEffect(() => {
//     const animate = () => {
//       const currentTime = Date.now();
//       const t = ((currentTime - startTime.current) % 6000) / 6000;
//       const colorValue = lerpColorTable(t, colorTable, false);
//       const newOffset = offset - speed;
//       setStroke(colorValue);
//       setOffset(newOffset < 0 ? pathWidth : newOffset);
//       requestAnimationFrame(animate);
//     };
//     animate();
//   }, [offset]);

//   const pathStyle = {
//     stroke: stroke,
//     strokeDashoffset: offset
//   };

//   return (
//     <div style={{
//       position: 'absolute',
//       top: '60%',
//       left: '50%',
//       transform: 'translate(-50%, -50%)'
//     }}>
//       <svg
//         height="200"
//         viewBox="0 0 115 115"
//         preserveAspectRatio="xMidYMid meet"
//       >
//         <path
//           opacity="0.05"
//           fill="none"
//           stroke="#000000"
//           strokeWidth="3"
//           d="M 85 85 C -5 16 -39 127 78 30 C 126 -9 57 -16 85 85 C 94 123 124 111 85 85 Z"
//         />
//         <path
//           style={pathStyle}
//           className="progressPath"
//           fill="none"
//           strokeWidth="3"
//           strokeLinecap="round"
//           d="M 85 85 C -5 16 -39 127 78 30 C 126 -9 57 -16 85 85 C 94 123 124 111 85 85 Z"
//         />
//       </svg>
//     </div>
//   );
// };

// export default Spinner;

