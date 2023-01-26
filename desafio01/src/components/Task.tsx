import styles from './Task.module.css';
import {TbTrash} from 'react-icons/tb';
import { ITask } from '../App';
import {BsFillCheckCircleFill} from 'react-icons/bs';

interface Props {
    task: ITask;
    onDelete: (taskId: string) => void;
    onComplete: (taskId: string) => void;
}

export function Task({task, onDelete, onComplete} : Props) {

    return (
        <div className={styles.task}>
            <button className={styles.check} onClick={() => onComplete(task.id)}>
                {task.isCompleted ? <BsFillCheckCircleFill/> : <div />}
            </button>

            {/* O que fará com que as tarefas criadas apareçam em tela. */}
            <p className={task.isCompleted ? styles.textCompleted : ""}>{task.title}</p>

            <button 
                className={styles.buttonDelete}
                onClick={() => onDelete(task.id)}>
                <TbTrash size={20} />
            </button>
        </div>
    )
}