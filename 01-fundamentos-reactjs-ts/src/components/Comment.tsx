import { ThumbsUp, Trash } from 'phosphor-react';
import { useState } from 'react';
import { Avatar } from './Avatar';
import styles from './Comment.module.css';

//TS
interface CommentProps {
    content: string;
    //se a função houver um parametro é preciso ser colocado.
    onDeleteComment: (comment: string) => void;
}

export function Comment({ content, onDeleteComment }: CommentProps) {
    function handleDeleteComment() {
        onDeleteComment(content)
    }

    //criando função para ativar modo de aplaudir nos comentários.
    const [likeCount, setLikeCount] = useState(0);
    function handleLikeComment() {
        setLikeCount(likeCount + 1);
    }

    return (
        <div className={styles.comment}>
        {/*hasBorder é uma propriedade para tirar a borda na foto dos coments
            definido no Avatar.module.css*/}
            <Avatar hasBorder={false} src="https://github.com/mateusrr.png" alt=''/>

            <div className={styles.commentBox}>
                <div className={styles.commentContent}>
                    <header>
                        <div className={styles.authorAndTime}>
                        <strong>Mateus Rocha</strong>
                        <time title='11 de Novembro às 8:13' dateTime='2022-11-11 08:13:30'>Cerca de 1h atrás</time>
                        </div>

                        <button onClick={handleDeleteComment} title='Deletar comentário'>
                           <Trash  size={24}/>
                        </button>
                    </header>

                    <p>{content}</p>
                </div>

                <footer>
                    {/*função aqui inserida*/}
                    <button onClick={handleLikeComment}>
                        <ThumbsUp />
                        {/*variável likeCount para se fazer as contagens.*/}
                        Aplaudir <span>{likeCount}</span>
                    </button>
                </footer>
            </div>
        </div>
    )
}