import React from "react";
import { GetStaticProps } from 'next';
import Image from 'next/image'; 
import Link from 'next/link';
import { format, parseISO } from 'date-fns';
import { Api } from "../services/api"
import { convertDurationToTimeString } from "../utils/convertDurationToTimeString";
import styles from '../pages/home.module.scss'
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

type HomeProps = {
  latestEpisodes: Episode[];
  allEpisodes: Episode[];
}



export default function Home({ latestEpisodes, allEpisodes}: HomeProps) {
  
  return (
    <div className={styles.homePage}>
     <section className={styles.latestEpisodes}>
       <h2>Últimos lançamentos</h2>

       <ul>
          {latestEpisodes.map(episode=>{
            return(
                <li key={episode.id}>
                  <Image 
                  width={192} 
                  height={192} 
                  src={episode.thumbnail} 
                  alt={episode.thumbnail} 
                  objectFit="cover"/>

                  <div className={styles.episodeDetails}>
                    <Link href={`/episodes/${episode.id}`} >
                    <a>{episode.title}</a>
                    </Link>
                    <p>{episode.members}</p>
                    <span>{episode.publishedAt}</span>
                    <span>{episode.durationAsString}</span>
                  </div>

                  <button type="button">
                    <img src="./play-green.svg" alt="play"/>
                  </button>
                </li>
            )
          })}
       </ul>
       </section>
       <section className={styles.allEpisodes}>
          <h2>All episodes</h2>

          <table cellSpacing={0}>
            <thead>
              <th>Podcast</th>
              <th>Integrantes</th>
              <th>Data</th>
              <th>Duração</th>
              <th></th>
            </thead>
            <tbody>
              {allEpisodes.map(episode =>{
                return(
                  <tr key={episode.id}>
                    <td>
                      <Image
                        width={120}
                        height={120}
                        src={episode.thumbnail}
                        alt={episode.title}
                        objectFit="cover"
                      />
                    </td>
                    <td>
                      <Link href={`/episodes/${episode.id}`}>
                      <a>{episode.title}</a>
                      </Link>
                    </td>
                    <td>
                      {episode.members}
                    </td>
                    <td>
                      {episode.publishedAt}
                    </td>
                    <td>
                      {episode.durationAsString}
                    </td>
                    <td>
                      <button type="button">
                        <img src="./play-green.svg" alt="tocar"/>
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
       </section>
    </div>
    )
}

export const getStaticProps: GetStaticProps = async ({}) => {
  const { data } = await  Api.get('episodes', {
    params: {
        _limit: 12,
        _sort: 'published_at',
        _order: 'desc'
    }
  })

  const episodes = data.map(episode =>{
    return { 
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at), 'd MMM yy'),
      duration: Number(episode.file.duration),
      durationAsString: convertDurationToTimeString(Number(episode.file.duration)),
      description: episode.description,
      url: episode.file.url,
      
    }
  })

  const latestEpisodes = episodes.slice(0,2);
  const allEpisodes = episodes.slice(0, episodes.length);

  return{ 
    props:{
      latestEpisodes,
      allEpisodes
    },
    revalidate: 60 * 60 * 8,
  }
}