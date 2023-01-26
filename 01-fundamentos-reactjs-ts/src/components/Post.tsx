import { format, formatDistanceToNow } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { FormEvent, useState, ChangeEvent, InvalidEvent } from 'react';

import { Avatar } from './Avatar'
import { Comment } from './Comment'

import styles from './Post.module.css'

interface Author {
    name: string;
    role: string;
    avatarUrl: string;
}

interface Content {
    type: 'paragraph' | 'link';
    content: string;
}

interface PostProps {
    author: Author;
    publishedAt: Date;
    content: Content[];
}

//dentro de objeto não é possível dizer a propriedade.
//ex: author: Author
export function Post({ author, publishedAt, content }: PostProps) {
    const [comments, setComments] = useState([
        'post bacana'
    ])

    //armazena tudo que é digitado no textarea.
    const [newCommentText, setNewCommentText] = useState ('')

    const publishedAtFormatted = format(publishedAt, "d 'de' LLLL 'às' HH:mm'h'", {
        locale: ptBR,
    })

    const publishedDateRelativeToNow = formatDistanceToNow(publishedAt, {
        locale: ptBR,
        addSuffix: true,
    })

    //para o TS ele não entende o que se refere o event.
    //não conseguindo determinar o tipo do event.
    function handleCreateNewComment (event: FormEvent) {
        event.preventDefault()

       //const newCommentText = event.target.comment.value

        setComments([...comments, newCommentText]);
        setNewCommentText('');
    }

    //função para não deixar que um comentário vazio seja feito.
    //Generics no TS são parametros do javascript. Ex: ChangeEvent<HTMLTextAreaElement>
    function handleNewCommentChange(event: ChangeEvent<HTMLTextAreaElement>) {
        event.target.setCustomValidity(''); 
        setNewCommentText(event.target.value);
    }

    function handleNewCommentInvalid(event: InvalidEvent<HTMLTextAreaElement>) {
        //setCustomValidity - método utilizado para passar msg de identificação no textarea
        event.target.setCustomValidity('Campo obrigatório!');
    }

    //deletar comentários feitos.
    function deleteComment(commentToDelete: string) {
        const commentsWithoutDeletedOne = comments.filter(comment => {
            return comment != commentToDelete;
        })
        
        setComments(commentsWithoutDeletedOne);
    }

    //variável utilizada no button do disabled.
    const isNewCommentEmpty = newCommentText.trim().length === 0;;

    return (
        <article className={styles.post}>
            <header>
                <div className={styles.author}>
                    <Avatar src={author.avatarUrl} />
                    <div className={styles.authorInfo}>
                        <strong>{author.name}</strong>
                        <span>{author.role}</span>
                    </div>
                </div>
                
                {/*formatação de data*/}
                <time title={publishedAtFormatted} dateTime={publishedAt.toISOString()}>
                    {publishedDateRelativeToNow}
                </time>
                
            </header>

            <div className={styles.content}>
                {content.map(line => {
                    if(line.type === 'paragraph') {
                        return <p key={line.content}>{line.content}</p>
                    } else if (line.type === 'link') {
                        return <p key={line.content}><a href=''>{line.content}</a></p>
                    }
                })}
            </div>

            <form onSubmit={handleCreateNewComment} className={styles.commentForm}>
                <strong>Deixe seu feedback</strong>

                <textarea
                    name='comment'
                    placeholder='Deixe um comentário'
                    onChange={handleNewCommentChange}
                    value={newCommentText}
                    onInvalid={handleNewCommentInvalid} //chamada sempre que o html identificar que foi feito um submit do form.
                    required
                />
                <footer>
                    {/* disabled - utilizado para bloquear o clique no botão sem antes fazer comentário. */}
                    <button type='submit' disabled={isNewCommentEmpty}>Comentar</button>
                </footer>
            </form>

            <div className={styles.commentList}>
                {comments.map(comment => {
                    return (
                        <Comment 
                        key={comment} 
                        content={comment} 
                        onDeleteComment={deleteComment}
                        />
                    )
                })}
            </div>
        </article>
    )
}