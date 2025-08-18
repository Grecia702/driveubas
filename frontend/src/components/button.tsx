import React from 'react'
import styles from './button.module.css'

interface ButtonProps {
    text: string;
    onClick: () => void;
    variant?: "cancel" | "confirm";
}

function Button({ text, onClick, variant }: ButtonProps) {
    const className = [styles.button, variant ? styles[variant] : ""].join(" ");

    return (
        <button className={className} onClick={onClick}>
            {text}
        </button>
    );
}
export default Button
