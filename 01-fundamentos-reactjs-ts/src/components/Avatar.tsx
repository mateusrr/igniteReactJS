//contém todas as propriedades que um IMG pode receber.
//não sendo necessário a sua constante repetição de cada elemento.
import { ImgHTMLAttributes } from 'react';

import styles from './Avatar.module.css';

//TS
//ponto de interrogação para declarar que é algo opcional.
interface AvatarProps extends ImgHTMLAttributes<HTMLImageElement> {
    hasBorder?: boolean;
}

export function Avatar({hasBorder = true, ...props}: AvatarProps) {
    return (
        <img
            className={hasBorder ? styles.avatarWithBorder : styles.avatar}
            {...props}
            //src={src}
            //alt={alt}
            //title={title}
        />
    )
}