import { PencilLine } from 'phosphor-react';
import { Avatar } from './Avatar';
import styles from './Sidebar.module.css';

export function Sidebar() {
    return (
        <aside className={styles.sidebar}>
            <img className={styles.cover} src="https://images.unsplash.com/photo-1566837945700-30057527ade0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTZ8fGRldmVsb3BlcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60" />
        
            <div className={styles.profile}>
                <Avatar src="https://github.com/mateusrr.png" />
                <strong>Mateus Rocha</strong>
                <span>Web Developer</span>
            </div>
        
            <footer>
                <a href="#">
                <PencilLine size={20} />
                Editar seu perfil</a>
            </footer>
        </aside>

    )
}