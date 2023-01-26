import Logo from '../assets/Logo.svg';
import styles from './Header.module.css';
import {AiOutlinePlusCircle} from 'react-icons/ai';
import {FormEvent, useState, ChangeEvent } from 'react';

/* Criando a Interface e recebendo o parâmetro de newTask */
interface Props {
    onNewTask: (taskTitle: string) => void;
}

export function Header({onNewTask} : Props) {
    const [title, setTitle] = useState("");

    function handleSubmit(event: FormEvent) {
        event.preventDefault();

        onNewTask(title);
        setTitle("");
    }

    function onChangeTitle(event: ChangeEvent<HTMLInputElement>) {
        setTitle(event.target.value);
    }
    
    return (
        <header className={styles.header}>
            {/*Logo Todo*/}
            <img src={Logo} />

            {/* Input - digitar tarefa / Button - Criar tarefa */}
            <form className={styles.taskForm} onSubmit={handleSubmit}>
                <input placeholder='Nova tarefa' onChange={onChangeTitle} value={title}/>
                <button>
                    Criar
                    {/* Ícone sinal de (+) importado do React icons */}
                    <AiOutlinePlusCircle size={20} />
                    </button>
            </form>
        </header>
    )
}