import React from 'react';

export default function Icon({ name, style = {}, className = "" }) {
    // Convert width/height style props to fontSize to prevent icon misalignment
    const computedStyle = { ...style };
    if (computedStyle.width && !computedStyle.fontSize) {
        computedStyle.fontSize = computedStyle.width;
    }
    // ensure line-height doesn't shift the icon
    if (!computedStyle.lineHeight) {
        computedStyle.lineHeight = 1;
    }

    return (
        <span className={`material-symbols-outlined ${className}`} style={computedStyle}>
            {name}
        </span>
    );
}
