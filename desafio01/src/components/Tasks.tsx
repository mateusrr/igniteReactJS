import styles from './Tasks.module.css';
import { Task } from './Task';
import { ITask } from '../../src/App';
import { TbClipboardText } from 'react-icons/tb';

interface Props {
    tasks: ITask[];
    onDelete: (taskId: string) => void;
    onComplete: (taskId: string) => void;
}

export function Tasks({tasks, onDelete, onComplete} : Props) {
    const tasksQtd = tasks.length; /* Retornar quantidade de tasks */
    const tasksCompleted = tasks.filter((task) => task.isCompleted).length; /* Filtrar quantas tasks foi concluídas. */

    return (
        <section className={styles.tasks}>
            {/* Header compoe os títulos Tarefas criadas e Concluídas */}
            <header className={styles.header}>
                <div>
                    <p>Tarefas criadas</p>
                    <span>{tasksQtd}</span>
                </div>

                <div>
                    <p className={styles.textPurple}>Concluídas</p>
                    <span>{tasksCompleted} de {tasksQtd}</span>
                </div>
            </header>

            <div className={styles.list}>
                {/* Renderizando as tasks */}
                {tasks.map((task) => (
                    <Task
                        key={task.id}
                        task={task}
                        onDelete={onDelete}
                        onComplete={onComplete}
                    />
                ))}

                {tasks.length <= 0 && (
                    <section className={styles.empty}>
                        <TbClipboardText size={50} />
                        <div>
                            <p>Você ainda não tem tarefas cadastradas</p>
                            <span>Crie tarefas e organize seus itens a fazer</span>
                        </div>
                    </section>
                )}
            </div>
        </section>
    )
}