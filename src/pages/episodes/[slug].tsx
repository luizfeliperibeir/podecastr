import { format, parseISO } from 'date-fns';
import { GetStaticPaths, GetStaticProps } from 'next';
import styles from './episode.module.scss'
import { Api } from '../../services/api';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';
import Image from 'next/image';

type Episode = {
        id: string;
        title: string;
        members: string; 
        publishedAt: string;
        thumbnail: string;
        description: string;
        duration: number;
        durationAsString: string;
        url: string;
}

type EpisodeProps = {
    episode: Episode;                         
}


export default function Episode({ episode }: EpisodeProps){
    return(
        <div className={styles.episode}>
            <div className={styles.thumbnailContainer}>
                <button type="button">
                    <img src="/arrow-left.svg" alt="voltar "/>
                </button>
                <Image 
                width={700} 
                height={160} 
                src={episode.thumbnail} 
                objectFit="cover" />
                <button type="button">
                    <img src="/play.svg" alt="tocar"/>
                </button>
            </div>

            <header>
                <h1>{episode.title}</h1>
                <span>{episode.members}</span>
                <span>{episode.publishedAt}</span>
                <span>{episode.durationAsString}</span>
            </header>


            <div className={styles.description}>
                {episode.description}
            </div>
        </div>
    )
}

export const getStaticPaths: GetStaticPaths = async () => {
    return{
        paths: [],
        fallback: 'blocking'
    }
}

export const getStaticProps: GetStaticProps = async(ctx) => {
    const { slug } = ctx.params;


    const { data } = await Api.get(`/episodes/${slug}`)

    const episodes = { 
        id: data.id,
        title: data.title,
        thumbnail: data.thumbnail,
        members: data.members,
        publishedAt: format(parseISO(data.published_at), 'd MMM yy'),
        duration: Number(data.file.duration),
        durationAsString: convertDurationToTimeString(Number(data.file.duration)),
        description: data.description,
        url: data.file.url,
      }


    return{ 
        props: {
            episodes,
        },
        revalidate: 60*60*24 , 
    }
}