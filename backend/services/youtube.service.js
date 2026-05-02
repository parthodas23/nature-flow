import yts from "yt-search";

export const searchYouTubeVideo = async (query) => {
  const result = await yts(query);
  const video  = result.videos[0];

  if (!video) return null;

  return {
    videoId:  video.videoId,
    title:    video.title,
    channel:  video.author?.name,
    thumbnail: video.thumbnail,
    embedUrl: `https://www.youtube-nocookie.com/embed/${video.videoId}`,
  };
};