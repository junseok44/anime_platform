import * as DataLoader from 'dataloader';
import { AnimeService } from 'src/anime/anime.service';
export function createEpisodeLoader(animeService: AnimeService) {
  return new DataLoader<string, any[]>(async (animeIds: readonly string[]) => {
    const episodes = await animeService.findEpisodesByAnimeIds(
      animeIds as string[],
    );
    const grouped = animeIds.map((id) =>
      episodes.filter((e) => e.animeId === id),
    );
    return grouped;
  });
}
