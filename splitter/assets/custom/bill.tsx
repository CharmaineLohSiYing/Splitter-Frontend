import React from 'react';
import Svg, { Path } from 'react-native-svg';

const BillIcon = (props) => {
    return (
    <Svg viewBox="0 0 512 512" width={props.size} height={props.size}>
        <Path
            d="M426.385 0H305.139a7.501 7.501 0 00-7.503 7.503 7.501 7.501 0 007.503 7.503h118.757v460.996l-36.352 20.628-37.679-21.381a12.585 12.585 0 00-12.356.001l-37.671 21.38-37.674-21.381a12.578 12.578 0 00-12.355.001l-37.671 21.379-37.668-21.378a12.58 12.58 0 00-12.359 0l-37.664 21.378-36.344-20.627v-32.798a7.502 7.502 0 00-7.503-7.503 7.502 7.502 0 00-7.503 7.503v34.246c0 4.495 2.429 8.667 6.339 10.887l38.833 22.039a12.579 12.579 0 0012.358 0l37.664-21.378 37.669 21.378c1.906 1.081 4.044 1.623 6.18 1.623s4.273-.541 6.178-1.623l37.671-21.379 37.675 21.381a12.577 12.577 0 0012.356-.001l37.671-21.38 37.679 21.381a12.581 12.581 0 0012.354 0l38.843-22.042a12.542 12.542 0 006.338-10.886V12.518C438.902 5.615 433.287 0 426.385 0zM259.008 0H85.613c-6.901 0-12.516 5.615-12.516 12.518v383.886c0 4.144 3.359 7.502 7.503 7.502s7.503-3.358 7.503-7.503V15.006h170.904a7.501 7.501 0 007.503-7.503A7.501 7.501 0 00259.008 0z"
            data-original="#000000"
            data-old_color="#000000"
            fill={props.color}
        />
        <Path
            d="M178.779 214.309h-24.737c-4.144 0-7.503 3.358-7.503 7.503s3.359 7.503 7.503 7.503h24.737c4.144 0 7.503-3.358 7.503-7.503s-3.359-7.503-7.503-7.503zM357.956 214.309H214.882c-4.144 0-7.503 3.358-7.503 7.503s3.359 7.503 7.503 7.503h143.074c4.145 0 7.503-3.358 7.503-7.503s-3.358-7.503-7.503-7.503zM178.779 256.581h-24.737a7.502 7.502 0 00-7.503 7.503 7.502 7.502 0 007.503 7.503h24.737a7.502 7.502 0 007.503-7.503 7.503 7.503 0 00-7.503-7.503zM357.956 256.581H214.882a7.502 7.502 0 00-7.503 7.503 7.502 7.502 0 007.503 7.503h143.074a7.501 7.501 0 007.503-7.503 7.502 7.502 0 00-7.503-7.503zM178.779 298.854h-24.737a7.502 7.502 0 00-7.503 7.503 7.502 7.502 0 007.503 7.503h24.737a7.502 7.502 0 007.503-7.503 7.502 7.502 0 00-7.503-7.503zM357.956 298.854H214.882a7.502 7.502 0 00-7.503 7.503 7.502 7.502 0 007.503 7.503h143.074a7.501 7.501 0 007.503-7.503 7.501 7.501 0 00-7.503-7.503zM178.779 341.127h-24.737a7.502 7.502 0 00-7.503 7.503 7.502 7.502 0 007.503 7.503h24.737a7.502 7.502 0 007.503-7.503 7.502 7.502 0 00-7.503-7.503zM357.956 341.127H214.882a7.502 7.502 0 00-7.503 7.503 7.502 7.502 0 007.503 7.503h143.074a7.501 7.501 0 007.503-7.503 7.501 7.501 0 00-7.503-7.503zM178.779 383.4h-24.737a7.502 7.502 0 00-7.503 7.503 7.502 7.502 0 007.503 7.503h24.737a7.502 7.502 0 007.503-7.503 7.503 7.503 0 00-7.503-7.503zM357.956 383.4H214.882a7.502 7.502 0 00-7.503 7.503 7.502 7.502 0 007.503 7.503h143.074a7.501 7.501 0 007.503-7.503 7.502 7.502 0 00-7.503-7.503zM348.012 102.258H246.555a7.502 7.502 0 00-7.503 7.503 7.502 7.502 0 007.503 7.503H348.01a7.501 7.501 0 007.503-7.503 7.5 7.5 0 00-7.501-7.503zM322.104 135.39h-75.549a7.502 7.502 0 00-7.503 7.503 7.502 7.502 0 007.503 7.503h75.549a7.501 7.501 0 007.503-7.503 7.501 7.501 0 00-7.503-7.503zM322.104 71.132h-75.549c-4.144 0-7.503 3.358-7.503 7.503s3.359 7.503 7.503 7.503h75.549c4.145 0 7.503-3.358 7.503-7.503s-3.358-7.503-7.503-7.503zM198.563 105.502V86.598c1.559.497 2.745 1.107 3.74 1.619 1.406.722 2.733 1.404 4.45 1.404 4.615 0 7.449-4.71 7.449-8.086 0-6.269-8.27-9.481-15.793-10.553-.689-3.103-3.604-5.513-6.975-5.513-3.584 0-6.568 2.504-7.138 5.777-12.011 2.239-19.034 10.292-19.034 22.202 0 15.24 10.177 20.193 18.936 23.27v24.351c-4.127-1.014-6.003-3.186-7.472-4.889-1.268-1.468-3.003-3.478-5.929-3.478-4.264 0-7.449 4.214-7.449 7.981 0 3.672 2.834 7.756 7.583 10.928 2.799 1.87 7.196 4.026 13.3 4.822.34 3.513 3.441 6.274 7.205 6.274 3.864.001 7.128-3.166 7.128-6.916v-.127c11.22-2.975 17.553-11.717 17.553-24.553 0-16.647-10.325-22.704-17.554-25.609zm-14.153-5.509c-2.931-1.699-4.039-3.663-4.039-7.076 0-1.605 0-4.518 4.039-6.149v13.225zm14.047 38.97v-15.307c1.625 1.86 2.443 4.291 2.443 7.878 0 3.397-.765 5.814-2.443 7.429z"
            data-original="#000000"
            data-old_color="#000000"
            fill={props.color}
        />
    </Svg>)
}
export default BillIcon;