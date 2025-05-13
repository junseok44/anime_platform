import { DataSource } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Anime } from '../../anime/entities/anime.entity';
import { Category } from '../../anime/entities/category.entity';
import { AnimeEpisode } from '../../anime-episode/entities/anime-episode.entity';
import { AnimeType } from '../../anime/entities/anime.entity';
import { Comment, CommentType } from '../../comments/entities/comment.entity';
import { AnimeRating } from '../../anime/entities/anime-rating.entity';
import * as bcryptjs from 'bcryptjs';
import dataSource from '../data-source';

async function seed() {
  const connection = await dataSource.initialize();

  try {
    // 기존 데이터 삭제
    console.log('🗑️  Deleting existing data...');
    await connection.query('TRUNCATE TABLE "anime_rating" CASCADE');
    await connection.query('TRUNCATE TABLE "comment" CASCADE');
    await connection.query('TRUNCATE TABLE "anime_episode" CASCADE');
    await connection.query(
      'TRUNCATE TABLE "anime_categories_category" CASCADE',
    );
    await connection.query('TRUNCATE TABLE "anime" CASCADE');
    await connection.query('TRUNCATE TABLE "category" CASCADE');
    await connection.query('TRUNCATE TABLE "user" CASCADE');
    console.log('✅ Existing data deleted');

    // 1. 카테고리 생성
    const categories = await createCategories(connection);
    console.log('✅ Categories created');

    // 2. 사용자 생성
    const users = await createUsers(connection);
    console.log('✅ Users created');

    // 3. 애니메이션 생성
    const animes = await createAnimes(connection, categories);
    console.log('✅ Animes created');

    // 4. 에피소드 생성
    const episodes = await createEpisodes(connection, animes);
    console.log('✅ Episodes created');

    // 5. 댓글 생성
    await createComments(connection, users, animes, episodes);
    console.log('✅ Comments created');

    // 6. 평점 생성
    await createRatings(connection, users, animes);
    console.log('✅ Ratings created');

    console.log('🎉 All seed data created successfully!');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await connection.destroy();
  }
}

async function createCategories(connection: DataSource): Promise<Category[]> {
  const categoryRepository = connection.getRepository(Category);
  const categories = [
    { name: '액션', description: '액션 장르의 애니메이션' },
    { name: '판타지', description: '판타지 장르의 애니메이션' },
    { name: '로맨스', description: '로맨스 장르의 애니메이션' },
    { name: '코미디', description: '코미디 장르의 애니메이션' },
    { name: '드라마', description: '드라마 장르의 애니메이션' },
  ];

  const createdCategories = await Promise.all(
    categories.map(async (category) => {
      const newCategory = categoryRepository.create(category);
      return await categoryRepository.save(newCategory);
    }),
  );

  return createdCategories;
}

async function createUsers(connection: DataSource): Promise<User[]> {
  const userRepository = connection.getRepository(User);
  const users = [
    {
      email: 'junseok@naver.com',
      password: await bcryptjs.hash('qwer1234@!', 10),
      nickname: 'user1',
    },
    {
      email: 'user2@example.com',
      password: await bcryptjs.hash('password123', 10),
      nickname: 'user2',
    },
  ];

  const createdUsers = await Promise.all(
    users.map(async (user) => {
      const newUser = userRepository.create(user);
      return await userRepository.save(newUser);
    }),
  );

  return createdUsers;
}

async function createAnimes(
  connection: DataSource,
  categories: Category[],
): Promise<Anime[]> {
  const animeRepository = connection.getRepository(Anime);
  const animes = [
    {
      title: '진격의 거인',
      type: AnimeType.TVA,
      categories: [categories[0], categories[1]], // 액션, 판타지
    },
    {
      title: '귀멸의 칼날',
      type: AnimeType.TVA,
      categories: [categories[0], categories[1]], // 액션, 판타지
    },
    {
      title: '너의 이름은',
      type: AnimeType.MOVIE,
      categories: [categories[2], categories[4]], // 로맨스, 드라마
    },
  ];

  const createdAnimes = await Promise.all(
    animes.map(async (anime) => {
      const newAnime = animeRepository.create(anime);
      return await animeRepository.save(newAnime);
    }),
  );

  return createdAnimes;
}

async function createEpisodes(
  connection: DataSource,
  animes: Anime[],
): Promise<AnimeEpisode[]> {
  const episodeRepository = connection.getRepository(AnimeEpisode);
  const episodes = [];

  for (const anime of animes) {
    if (anime.type === AnimeType.TVA) {
      for (let i = 1; i <= 3; i++) {
        episodes.push({
          title: `${anime.title} ${i}화`,
          synopsis: `${anime.title}의 ${i}번째 에피소드입니다.`,
          uploadDate: new Date(),
          runningTime: 24,
          anime,
        });
      }
    }
  }

  const createdEpisodes = (
    await Promise.all(
      episodes.map(async (episode) => {
        const newEpisode = episodeRepository.create(episode);
        return await episodeRepository.save(newEpisode);
      }),
    )
  ).flat();

  return createdEpisodes;
}

async function createComments(
  connection: DataSource,
  users: User[],
  animes: Anime[],
  episodes: AnimeEpisode[],
) {
  const commentRepository = connection.getRepository(Comment);
  const comments = [];

  // 애니메이션 리뷰
  for (const anime of animes) {
    for (const user of users) {
      comments.push({
        type: CommentType.REVIEW,
        content: `${anime.title}에 대한 ${user.nickname}의 리뷰입니다.`,
        author: user,
        anime,
      });
    }
  }

  // 에피소드 댓글
  for (const episode of episodes) {
    for (const user of users) {
      comments.push({
        type: CommentType.EPISODE_COMMENT,
        content: `${episode.title}에 대한 ${user.nickname}의 댓글입니다.`,
        author: user,
        episode,
      });
    }
  }

  await Promise.all(
    comments.map(async (comment) => {
      const newComment = commentRepository.create(comment);
      return await commentRepository.save(newComment);
    }),
  );
}

async function createRatings(
  connection: DataSource,
  users: User[],
  animes: Anime[],
) {
  const ratingRepository = connection.getRepository(AnimeRating);
  const ratings = [];

  for (const anime of animes) {
    for (const user of users) {
      ratings.push({
        rating: Math.floor(Math.random() * 5) + 1, // 1-5 사이의 랜덤 평점
        anime,
        user,
      });
    }
  }

  await Promise.all(
    ratings.map(async (rating) => {
      const newRating = ratingRepository.create(rating);
      return await ratingRepository.save(newRating);
    }),
  );
}

seed();
