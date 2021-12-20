import invariant from 'tiny-invariant'
import { useLoaderData } from 'remix'
import type { MetaFunction, LoaderFunction } from 'remix'

import { getCredentials, getAccessToken, client } from '~/lib/spotify.server'
import { getDominantColor } from '~/lib/dominantColor.server'

export const loader: LoaderFunction = async ({ params: { albumId } }) => {
  invariant(typeof albumId === 'string', 'invalid album id')

  const [clientId, clientSecret] = getCredentials()
  const accessToken = await getAccessToken(clientId, clientSecret)
  const spotifyClient = client(accessToken)

  const album = await spotifyClient.getAlbum(albumId)
  const artist = await spotifyClient.getArtist(album.artists[0].id)
  const dominantColor = await getDominantColor(album.images[0].url)

  return { album, artist, dominantColor }
}

export const meta: MetaFunction = ({ data }) => {
  const { artist, album } = data

  return {
    title: `${album.name} by ${artist.name}`,
    description: `Get to know ${album.name} a little bit better`,
    'twitter:image': album.images[0].url,
    'twitter:card': 'summary_large_image'
  }
}

const formatLength = (ms: number) => {
  const date = new Date(ms)

  const hours = parseInt(`0${date.getUTCHours()}`.slice(-2))
  const minutes = parseInt(`0${date.getMinutes()}`.slice(-2))
  const seconds = parseInt(`0${date.getSeconds()}`.slice(-2))

  if (hours > 0) return `${hours} hr ${minutes} min`

  return `${minutes} min ${seconds} sec`
}

export default function Index() {
  const data = useLoaderData()

  const {
    album,
    artist,
    dominantColor: { r, g, b }
  } = data

  const cover = album.images[0]
  const tracks = album.tracks.items

  const totalTime = tracks.reduce((sum, track) => {
    sum += track.duration_ms
    return sum
  }, 0)

  const releasedAt = new Date(Date.parse(album.release_date))

  const Bullet = () => <span>•</span>

  return (
    <>
      <main className="container mx-auto p-4 my-16 flex justify-center">
        <div className="flex gap-6">
          <img
            src={cover.url}
            width={232}
            height={232}
            className="mb-4 rounded shadow-lg"
          />
          <div className="self-end pb-4">
            <p className="uppercase text-xs font-bold">{album.album_type}</p>
            <h2 className="text-8xl font-extrabold py-2">{album.name}</h2>
            <div className="flex items-center gap-1 text-sm">
              <img
                src={artist.images[0].url}
                className="rounded-full w-6 h-6"
              />
              <span className="font-bold">{artist.name}</span>
              <Bullet />
              <span>{releasedAt.getFullYear()}</span>
              <Bullet />
              <span>
                {tracks.length} songs, {formatLength(totalTime)}
              </span>
            </div>
          </div>
        </div>
        <div>
          <div>#</div>
          <div>Title</div>
          <div>Duration</div>
        </div>
      </main>
    </>
  )
}
